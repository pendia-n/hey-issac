import type { AppEnv } from "./types";
import { preferredProviderSlots } from "./new-york";

export type Provider = "tavily" | "exa" | "firecrawl";
type KeyName = keyof Pick<AppEnv, `TAVILY_API_KEY_${1 | 2 | 3}` | `EXA_API_KEY_${1 | 2 | 3}` | `FIRECRAWL_API_KEY_${1 | 2 | 3}`>;

const keyNames: Record<Provider, readonly KeyName[]> = {
  tavily: ["TAVILY_API_KEY_1", "TAVILY_API_KEY_2", "TAVILY_API_KEY_3"],
  exa: ["EXA_API_KEY_1", "EXA_API_KEY_2", "EXA_API_KEY_3"],
  firecrawl: ["FIRECRAWL_API_KEY_1", "FIRECRAWL_API_KEY_2", "FIRECRAWL_API_KEY_3"],
};

interface KeyState { blocked_until: number; remaining: number | null; remaining_checked_at: number | null; consumed_estimate: number; period: string }

export class ProviderHttpError extends Error {
  constructor(readonly status: number) { super(`Provider HTTP ${status}`); }
}

export function hasProvider(env: AppEnv, provider: Provider): boolean {
  return keyNames[provider].some(name => !!env[name]);
}

async function state(env: AppEnv, provider: Provider, slot: number): Promise<KeyState> {
  const row = await env.DB.prepare("SELECT blocked_until,remaining,remaining_checked_at,consumed_estimate,period FROM provider_key_state WHERE provider=? AND slot=?").bind(provider, slot).first<KeyState>();
  return row || { blocked_until: 0, remaining: null, remaining_checked_at: null, consumed_estimate: 0, period: "" };
}

async function patchState(env: AppEnv, provider: Provider, slot: number, data: Partial<KeyState>): Promise<void> {
  const prior = await state(env, provider, slot);
  const next = { ...prior, ...data };
  await env.DB.prepare("INSERT INTO provider_key_state(provider,slot,blocked_until,remaining,remaining_checked_at,consumed_estimate,period) VALUES (?,?,?,?,?,?,?) ON CONFLICT(provider,slot) DO UPDATE SET blocked_until=excluded.blocked_until,remaining=excluded.remaining,remaining_checked_at=excluded.remaining_checked_at,consumed_estimate=excluded.consumed_estimate,period=excluded.period")
    .bind(provider, slot, next.blocked_until, next.remaining, next.remaining_checked_at, next.consumed_estimate, next.period).run();
}

async function firecrawlRemaining(key: string): Promise<{ remaining: number; period: string } | null> {
  const response = await fetch("https://api.firecrawl.dev/v2/team/credit-usage", { headers: { authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(6000) });
  if (!response.ok) return null;
  const data = await response.json() as { data?: { remainingCredits?: unknown; billingPeriodStart?: unknown; billingPeriodEnd?: unknown } };
  if (typeof data.data?.remainingCredits !== "number") return null;
  const period = `${String(data.data.billingPeriodStart || "")}/${String(data.data.billingPeriodEnd || "")}`;
  return { remaining: data.data.remainingCredits, period };
}

function numeric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function tavilyRemaining(key: string): Promise<{ remaining: number; period: string } | null> {
  const response = await fetch("https://api.tavily.com/usage", { headers: { authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(6000) });
  if (!response.ok) return null;
  const data = await response.json() as Record<string, unknown>;
  const keyUsage = (data.key && typeof data.key === "object" ? data.key : {}) as Record<string, unknown>;
  const account = (data.account && typeof data.account === "object" ? data.account : {}) as Record<string, unknown>;
  const direct = numeric(keyUsage.remaining) ?? numeric(keyUsage.remaining_credits) ?? numeric(account.remaining) ?? numeric(account.remaining_credits);
  const used = numeric(keyUsage.plan_usage) ?? numeric(keyUsage.usage) ?? numeric(keyUsage.credits_used) ?? numeric(account.plan_usage) ?? numeric(account.usage);
  const limit = numeric(keyUsage.plan_limit) ?? numeric(keyUsage.limit) ?? numeric(keyUsage.credits_limit) ?? numeric(account.plan_limit) ?? numeric(account.limit);
  const remaining = direct ?? (used !== null && limit !== null ? Math.max(0, limit - used) : null);
  if (remaining === null) return null;
  const period = String(keyUsage.period_start || keyUsage.billing_period_start || account.period_start || account.billing_period_start || "");
  return { remaining, period };
}

export async function withProviderKey<T>(
  env: AppEnv,
  provider: Provider,
  run: (key: string) => Promise<{ value: T; cost?: number }>,
  preferredSlots = preferredProviderSlots(provider),
): Promise<T> {
  const now = Date.now();
  let configured = false;
  const orderedSlots = [...preferredSlots, 1, 2, 3].filter((slot, index, all) => all.indexOf(slot) === index);
  for (const slot of orderedSlots) {
    const name = keyNames[provider][slot - 1];
    if (!name) continue;
    const key = env[name];
    if (!key) continue;
    configured = true;
    let current = await state(env, provider, slot);
    if ((provider === "firecrawl" || provider === "tavily") && (!current.remaining_checked_at || now - current.remaining_checked_at > 15 * 60_000)) {
      try {
        const usage = provider === "firecrawl" ? await firecrawlRemaining(key) : await tavilyRemaining(key);
        if (usage) {
          const periodChanged = !!usage.period && usage.period !== current.period;
          current = {
            ...current,
            period: usage.period || current.period,
            remaining: usage.remaining,
            remaining_checked_at: now,
            consumed_estimate: periodChanged ? 0 : current.consumed_estimate,
            blocked_until: usage.remaining > 0 || periodChanged ? 0 : current.blocked_until,
          };
          await patchState(env, provider, slot, current);
        }
      } catch { /* A balance-check outage should not prevent a normal request. */ }
    }
    if (current.blocked_until > now) continue;
    if ((provider === "firecrawl" || provider === "tavily") && current.remaining !== null && current.remaining < 1) continue;
    try {
      const result = await run(key);
      const charge = result.cost ?? 1;
      const exaResetObserved = provider === "exa" && current.remaining === 0 && current.blocked_until > 0 && current.blocked_until <= now;
      const baseline = provider === "exa" ? (exaResetObserved ? 10 : current.remaining ?? 10) : current.remaining;
      await patchState(env, provider, slot, {
        consumed_estimate: current.consumed_estimate + charge,
        remaining: baseline !== null ? Math.max(0, baseline - charge) : null,
        blocked_until: 0,
      });
      return result.value;
    } catch (cause) {
      if (cause instanceof ProviderHttpError) {
        if (cause.status === 402) {
          const until = now + (provider === "firecrawl" ? 15 * 60_000 : 24 * 60 * 60_000);
          await patchState(env, provider, slot, { blocked_until: until, remaining: 0 });
        }
        if (cause.status === 429) await patchState(env, provider, slot, { blocked_until: now + 60_000 });
        if (cause.status === 401 || cause.status === 403) await patchState(env, provider, slot, { blocked_until: now + 24 * 60 * 60_000 });
      }
      // No provider response bodies or credentials leave this function.
    }
  }
  throw new Error(configured ? `${provider} is temporarily unavailable.` : `${provider} is not configured.`);
}

export async function providerPost(url: string, headers: HeadersInit, body: unknown): Promise<unknown> {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(18_000) });
  if (!response.ok) throw new ProviderHttpError(response.status);
  return response.json();
}
