import { currentUser } from "./auth";
import { searchConfigured } from "./search";
import type { AppEnv, Plan, SubscriptionRow } from "./types";
import { bodyObject, error, isPlan, json } from "./types";

interface StripeSubscription {
  id: string;
  customer: string | { id: string };
  status: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  metadata?: { user_id?: string; plan?: string };
  items?: { data?: Array<{ current_period_end?: number; price?: { id?: string } }> };
}

interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

function stripeReady(env: AppEnv): boolean {
  return !!(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET && env.STRIPE_PRICE_SOLO && env.STRIPE_PRICE_STUDIO && env.STRIPE_PRICE_PARTNER && searchConfigured(env));
}

async function stripe(env: AppEnv, path: string, method = "GET", form?: URLSearchParams, idempotencyKey?: string): Promise<Record<string, unknown>> {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, ...(form ? { "content-type": "application/x-www-form-urlencoded" } : {}), ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}) },
    body: form?.toString(),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Stripe HTTP ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

function customerId(customer: StripeSubscription["customer"]): string {
  return typeof customer === "string" ? customer : customer.id;
}

function planForPrice(env: AppEnv, id: string | undefined): Plan | null {
  if (id && id === env.STRIPE_PRICE_SOLO) return "solo";
  if (id && id === env.STRIPE_PRICE_STUDIO) return "studio";
  if (id && id === env.STRIPE_PRICE_PARTNER) return "partner";
  return null;
}

export async function subscriptionFor(userId: string, env: AppEnv): Promise<SubscriptionRow | null> {
  return env.DB.prepare("SELECT * FROM subscriptions WHERE user_id=?").bind(userId).first<SubscriptionRow>();
}

export function hasPaidAccess(subscription: SubscriptionRow | null): boolean {
  return !!subscription && (subscription.status === "active" || subscription.status === "trialing") && subscription.current_period_end > Math.floor(Date.now() / 1000);
}

async function syncSubscription(env: AppEnv, record: StripeSubscription, hintedUserId?: string): Promise<void> {
  const existing = await env.DB.prepare("SELECT user_id,plan FROM subscriptions WHERE stripe_subscription_id=? OR stripe_customer_id=? LIMIT 1")
    .bind(record.id, customerId(record.customer)).first<{ user_id: string; plan: Plan }>();
  const userId = record.metadata?.user_id || hintedUserId || existing?.user_id;
  const priceId = record.items?.data?.[0]?.price?.id;
  const plan = isPlan(record.metadata?.plan) ? record.metadata.plan : planForPrice(env, priceId) || existing?.plan;
  if (!userId || !plan) throw new Error("Subscription has no Meida user/plan mapping");
  const periodEnd = record.current_period_end || record.items?.data?.[0]?.current_period_end || 0;
  await env.DB.prepare("INSERT INTO subscriptions (user_id,stripe_customer_id,stripe_subscription_id,plan,status,current_period_end,cancel_at_period_end) VALUES (?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET stripe_customer_id=excluded.stripe_customer_id,stripe_subscription_id=excluded.stripe_subscription_id,plan=excluded.plan,status=excluded.status,current_period_end=excluded.current_period_end,cancel_at_period_end=excluded.cancel_at_period_end")
    .bind(userId, customerId(record.customer), record.id, plan, record.status, periodEnd, record.cancel_at_period_end ? 1 : 0).run();
}

async function getSubscription(env: AppEnv, id: string): Promise<StripeSubscription> {
  return await stripe(env, `/subscriptions/${encodeURIComponent(id)}`) as unknown as StripeSubscription;
}

function firstPayment(invoice: Record<string, unknown>): { id: string | null; amount: number | null; currency: string | null } {
  const payments = invoice.payments as { data?: Array<{ payment?: { payment_intent?: string | { id?: string } } }> } | undefined;
  const raw = invoice.payment_intent || payments?.data?.[0]?.payment?.payment_intent;
  const id = typeof raw === "string" ? raw : raw && typeof raw === "object" && "id" in raw ? String(raw.id) : null;
  return { id, amount: typeof invoice.amount_paid === "number" ? invoice.amount_paid : null, currency: typeof invoice.currency === "string" ? invoice.currency : null };
}

export async function handleBilling(request: Request, path: string, env: AppEnv): Promise<Response> {
  const user = await currentUser(request, env);
  if (!user) return error("Sign in required.", 401);
  const current = await subscriptionFor(user.id, env);

  if (path === "/api/billing/status" && request.method === "GET") {
    return json({ ready: stripeReady(env), subscription: current ? { plan: current.plan, status: current.status, currentPeriodEnd: current.current_period_end, cancelAtPeriodEnd: !!current.cancel_at_period_end, firstPaidAt: current.first_paid_at, firstRefunded: !!current.first_refund_id && current.first_refund_id !== "pending", firstRefundPending: current.first_refund_id === "pending", active: hasPaidAccess(current) } : null });
  }

  if (path === "/api/billing/checkout" && request.method === "POST") {
    if (!stripeReady(env)) return error("Subscriptions are not available yet. Please return when setup is complete.", 503);
    if (hasPaidAccess(current)) return error("Your current plan must end before you can choose another.", 409);
    const body = await bodyObject(request);
    if (!isPlan(body?.plan)) return error("Choose a valid plan.");
    const price = body.plan === "solo" ? env.STRIPE_PRICE_SOLO : body.plan === "studio" ? env.STRIPE_PRICE_STUDIO : env.STRIPE_PRICE_PARTNER;
    const origin = new URL(request.url).origin;
    const form = new URLSearchParams({ mode: "subscription", "line_items[0][price]": price!, "line_items[0][quantity]": "1", success_url: `${origin}/billing?checkout=complete`, cancel_url: `${origin}/pricing?checkout=cancelled`, client_reference_id: user.id, "subscription_data[metadata][user_id]": user.id, "subscription_data[metadata][plan]": body.plan });
    if (current?.stripe_customer_id) form.set("customer", current.stripe_customer_id);
    try {
      const session = await stripe(env, "/checkout/sessions", "POST", form);
      if (typeof session.url !== "string") throw new Error("Missing checkout URL");
      return json({ url: session.url });
    } catch { return error("Checkout is temporarily unavailable.", 503); }
  }

  if (path === "/api/billing/cancel" && request.method === "POST") {
    if (!current?.stripe_subscription_id || !hasPaidAccess(current)) return error("No active plan to cancel.", 409);
    const body = await bodyObject(request);
    const immediately = body?.immediately === true;
    try {
      const result = immediately
        ? await stripe(env, `/subscriptions/${encodeURIComponent(current.stripe_subscription_id)}`, "DELETE")
        : await stripe(env, `/subscriptions/${encodeURIComponent(current.stripe_subscription_id)}`, "POST", new URLSearchParams({ cancel_at_period_end: "true" }));
      await syncSubscription(env, result as unknown as StripeSubscription, user.id);
      return json({ ok: true, immediately });
    } catch { return error("Cancellation is temporarily unavailable.", 503); }
  }

  if (path === "/api/billing/refund" && request.method === "POST") {
    if (!current?.first_paid_at || !current.stripe_subscription_id || (current.first_refund_id && current.first_refund_id !== "pending")) return error("No eligible first payment found.", 409);
    const age = Math.floor(Date.now() / 1000) - current.first_paid_at;
    if (age < 0 || age > 47 * 60 * 60) return error("The 47-hour first-payment window has closed.", 409);
    try {
      let intent = current.first_payment_intent;
      let amount = current.first_payment_amount;
      if (!intent || !amount) {
        const invoices = await stripe(env, `/invoices?subscription=${encodeURIComponent(current.stripe_subscription_id)}&limit=100`);
        const rows = (invoices.data as Array<Record<string, unknown>> | undefined) || [];
        const first = rows.filter(item => item.status === "paid" && item.billing_reason === "subscription_create").sort((a, b) => Number(a.created) - Number(b.created))[0];
        if (first) {
          const details = await stripe(env, `/invoices/${encodeURIComponent(String(first.id))}`);
          const payment = firstPayment(details);
          intent = payment.id;
          amount = payment.amount;
        }
      }
      if (!intent || !amount || amount < 2) return error("We could not verify the first payment. Contact support for a manual review.", 409);
      const reserved = await env.DB.prepare("UPDATE subscriptions SET first_refund_id='pending' WHERE user_id=? AND first_paid_at=? AND (first_refund_id IS NULL OR first_refund_id='pending')")
        .bind(user.id, current.first_paid_at).run();
      if (!reserved.meta.changes) return error("A refund request is already being processed.", 409);
      const refundAmount = Math.floor(amount / 2);
      const refund = await stripe(env, "/refunds", "POST", new URLSearchParams({ payment_intent: intent, amount: String(refundAmount), reason: "requested_by_customer" }), `meida-first-refund-${user.id}-${intent}`);
      await env.DB.prepare("UPDATE subscriptions SET first_refund_id=? WHERE user_id=? AND first_refund_id='pending'").bind(String(refund.id), user.id).run();
      try { await stripe(env, `/subscriptions/${encodeURIComponent(current.stripe_subscription_id)}`, "DELETE"); }
      catch { return error("The 50% refund was submitted, but plan cancellation needs support follow-up.", 503); }
      await env.DB.prepare("UPDATE subscriptions SET status='canceled',current_period_end=0,cancel_at_period_end=0 WHERE user_id=?").bind(user.id).run();
      return json({ ok: true, amount: refundAmount, currency: current.first_payment_currency || "usd" });
    } catch { return error("Refund could not be completed automatically. Contact support for review.", 503); }
  }

  return error("Not found.", 404);
}

function signatureBytes(hex: string): Uint8Array {
  if (!/^[a-f0-9]{64}$/i.test(hex)) return new Uint8Array();
  return Uint8Array.from(hex.match(/.{2}/g)!, part => parseInt(part, 16));
}

async function verifiedStripeEvent(request: Request, secret: string): Promise<StripeEvent | null> {
  const header = request.headers.get("stripe-signature") || "";
  const timestamp = Number(header.match(/(?:^|,)t=(\d+)/)?.[1]);
  const signatures = Array.from(header.matchAll(/(?:^|,)v1=([a-f0-9]{64})/gi), match => match[1]);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300 || !signatures.length) return null;
  const raw = await request.text();
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const actual = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${raw}`)));
  const valid = signatures.some(hex => {
    const expected = signatureBytes(hex);
    if (expected.length !== actual.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index++) difference |= actual[index] ^ expected[index];
    return difference === 0;
  });
  if (!valid) return null;
  try {
    const event = JSON.parse(raw) as StripeEvent;
    return event?.id && event?.type && event?.data?.object ? event : null;
  } catch { return null; }
}

export async function handleStripeWebhook(request: Request, env: AppEnv): Promise<Response> {
  if (!env.STRIPE_WEBHOOK_SECRET) return error("Webhook not configured.", 503);
  const event = await verifiedStripeEvent(request, env.STRIPE_WEBHOOK_SECRET);
  if (!event) return error("Invalid signature.", 400);
  const seen = await env.DB.prepare("SELECT 1 FROM stripe_events WHERE id=?").bind(event.id).first();
  if (seen) return json({ received: true });
  const object = event.data.object;
  try {
    if (event.type === "checkout.session.completed" && object.payment_status === "paid" && typeof object.subscription === "string") {
      await syncSubscription(env, await getSubscription(env, object.subscription), typeof object.client_reference_id === "string" ? object.client_reference_id : undefined);
    }
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      await syncSubscription(env, object as unknown as StripeSubscription);
    }
    if (event.type === "invoice.paid") {
      const parent = object.parent as { subscription_details?: { subscription?: string } } | undefined;
      const subscriptionId = typeof object.subscription === "string" ? object.subscription : parent?.subscription_details?.subscription;
      if (subscriptionId) {
        await syncSubscription(env, await getSubscription(env, subscriptionId));
        const user = await env.DB.prepare("SELECT user_id FROM subscriptions WHERE stripe_subscription_id=?").bind(subscriptionId).first<{ user_id: string }>();
        if (user && object.billing_reason === "subscription_create") {
          const payment = firstPayment(object);
          const paidAt = (object.status_transitions as { paid_at?: number } | undefined)?.paid_at || Number(object.created) || Math.floor(Date.now() / 1000);
          await env.DB.prepare("UPDATE subscriptions SET first_paid_at=COALESCE(first_paid_at,?),first_payment_intent=COALESCE(first_payment_intent,?),first_payment_amount=COALESCE(first_payment_amount,?),first_payment_currency=COALESCE(first_payment_currency,?) WHERE user_id=?")
            .bind(paidAt, payment.id, payment.amount, payment.currency, user.user_id).run();
        }
      }
    }
    if (event.type === "invoice.payment_failed") {
      const customer = typeof object.customer === "string" ? object.customer : null;
      if (customer) await env.DB.prepare("UPDATE subscriptions SET status='past_due' WHERE stripe_customer_id=?").bind(customer).run();
    }
    await env.DB.prepare("INSERT OR IGNORE INTO stripe_events(id,created_at) VALUES (?,?)").bind(event.id, Date.now()).run();
    return json({ received: true });
  } catch {
    return error("Webhook processing failed.", 503);
  }
}
