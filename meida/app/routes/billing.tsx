import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../ui/api";
import { useSession } from "../ui/session";
import { useBilling } from "../ui/billing";

const plans = { solo: "Solo", studio: "Studio", partner: "Partner" } as const;
export default function Billing() {
  const { user, loading: sessionLoading } = useSession();
  const { status, loading, refresh } = useBilling();
  const [query] = useSearchParams();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function cancel(immediately: boolean) {
    if (!window.confirm(immediately ? "Cancel the subscription now? Access ends immediately." : "Cancel at the end of this billing period?")) return;
    setBusy(true); setMessage("");
    try { await api("/api/billing/cancel", "POST", { immediately }); await refresh(); setMessage(immediately ? "Subscription canceled." : "Cancellation scheduled for the end of this period."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Cancellation could not be completed."); }
    finally { setBusy(false); }
  }
  async function refund() {
    if (!window.confirm("Request a 50% refund of the first payment and cancel the subscription now?")) return;
    setBusy(true); setMessage("");
    try { await api("/api/billing/refund", "POST"); await refresh(); setMessage("The first payment refund was submitted and the plan was canceled."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Refund could not be completed."); }
    finally { setBusy(false); }
  }
  if (sessionLoading || loading) return <main className="container"><p className="loading">Loading billing…</p></main>;
  if (!user) return <main className="container narrow"><h1>Sign in to view billing.</h1><Link className="button button-primary" to="/signin">Sign in</Link></main>;
  const subscription = status?.subscription;
  const canRefund = !!subscription?.firstPaidAt && !subscription.firstRefunded && Date.now() / 1000 - subscription.firstPaidAt <= 47 * 3600;
  const canCancel = !!subscription && !["canceled", "incomplete_expired"].includes(subscription.status);
  return <main className="container narrow"><span className="eyebrow">Your subscription</span><h1>Billing</h1>
    {query.get("checkout") === "complete" && <p className="message">Checkout complete. Your subscription will appear here after Stripe confirms it.</p>}
    {!subscription ? <section className="panel"><h2>No active plan yet</h2><p>Choose a plan before adding a website.</p><Link className="button button-primary" to="/pricing">Compare plans</Link></section> : <section className="panel"><span className="tag">{plans[subscription.plan]}</span><h2>{subscription.status === "active" ? "Your plan is active" : "Plan status: " + subscription.status}</h2><p className="muted">{subscription.cancelAtPeriodEnd ? "Your plan is set to end " : "Renews or ends "} {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}.</p>
      {subscription.active && !subscription.cancelAtPeriodEnd && <button className="button button-outline" onClick={() => void cancel(false)} disabled={busy}>Cancel at period end</button>}
      {canCancel && <button className="button button-outline" onClick={() => void cancel(true)} disabled={busy}>Cancel now</button>}
      {subscription.cancelAtPeriodEnd && <p className="message warn">Your plan will end at the date above. You can still use it until then.</p>}
      {subscription.firstRefundPending && <p className="message warn">Your refund request needs a retry. The same first payment will not be refunded twice.</p>}
      {canRefund && <div className="refund-box"><p className="fine-print">Within the first 47 hours after the first successful payment, you may request a refund of 50% of that first payment. Requesting it cancels the subscription immediately.</p><button className="button button-outline" onClick={() => void refund()} disabled={busy}>{subscription.firstRefundPending ? "Retry refund request" : "Request 50% first-payment refund"}</button></div>}
      {message && <p className="message" role="status">{message}</p>}
    </section>}
    <p className="fine-print">To move to another plan, cancel this subscription and wait until it is no longer active. Then choose the new plan from pricing.</p>
  </main>;
}
