import type { AppEnv } from "./types";

export type Provider = "tavily" | "exa" | "firecrawl";
export const EXA_COSTS = { answer: 0.005, auto: 0.007, deep: 0.012, agent: 0.025 } as const;
const names = {
  tavily: ["TAVILY_API_KEY_1", "TAVILY_API_KEY_2", "TAVILY_API_KEY_3"],
  exa: ["EXA_API_KEY_1", "EXA_API_KEY_2", "EXA_API_KEY_3"],
  firecrawl: ["FIRECRAWL_API_KEY_1", "FIRECRAWL_API_KEY_2", "FIRECRAWL_API_KEY_3"],
} as const;
interface KeyState { slot: number; remaining: number | null; remaining_checked_at: number | null; reset_at: number | null; period: string; blocked_until: number; consumed_estimate: number }
interface Options { purpose: string; estimate: number; leaseMs?: number }
export class ProviderHttpError extends Error {
  constructor(readonly status: number) { super("Provider HTTP " + status); }
}
export function hasProvider(env: AppEnv, provider: Provider): boolean {
  return names[provider].some(name => !!env[name]);
}
function numeric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
function timestamp(value: unknown): number | null {
  const number = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(number) ? number : null;
}
async function balance(provider: Provider, key: string): Promise<{ remaining: number; period: string; reset: number | null } | null> {
  if (provider === "exa") return null;
  const endpoint = provider === "tavily" ? "https://api.tavily.com/usage" : "https://api.firecrawl.dev/v2/team/credit-usage";
  const response = await fetch(endpoint, { headers: { authorization: "Bearer " + key }, signal: AbortSignal.timeout(6000) });
  if (!response.ok) return null;
  const result = await response.json() as Record<string, any>;
  if (provider === "firecrawl") {
    const data = result.data || {};
    const remaining = numeric(data.remainingCredits);
    return remaining === null ? null : { remaining, period: String(data.billingPeriodStart || ""), reset: timestamp(data.billingPeriodEnd) };
  }
  const account = result.account || {};
  const keyData = result.key || {};
  const keyLimit = numeric(keyData.limit);
  const keyUsage = numeric(keyData.usage);
  const planLimit = numeric(account.plan_limit);
  const planUsage = numeric(account.plan_usage);
  const accountRemaining = planLimit !== null && planUsage !== null
    ? Math.max(0, planLimit - planUsage) + Math.max(0, (numeric(account.paygo_limit) ?? 0) - (numeric(account.paygo_usage) ?? 0)) : null;
  const keyRemaining = keyLimit !== null && keyLimit > 0 && keyUsage !== null ? Math.max(0, keyLimit - keyUsage) : null;
  const remaining = accountRemaining !== null && keyRemaining !== null ? Math.min(accountRemaining, keyRemaining) : accountRemaining ?? keyRemaining;
  return remaining === null ? null : { remaining, period: String(account.billing_period_start || account.period_start || ""), reset: timestamp(account.billing_period_end || account.period_end) };
}

// Hold a per-key lease while reconciling balances and reserving request cost.
export async function withProviderKey<T>(env: AppEnv, provider: Provider, run: (key: string, slot: number) => Promise<{ value: T; cost?: number }>, options: Options): Promise<T> {
  const now = Date.now();
  const configured = names[provider].flatMap((name, index) => env[name] ? [index + 1] : []);
  for (const slot of configured) await env.DB.prepare("INSERT OR IGNORE INTO provider_key_state(provider,slot) VALUES (?,?)").bind(provider, slot).run();
  const rows = await env.DB.prepare("SELECT * FROM provider_key_state WHERE provider=?").bind(provider).all<KeyState>();
  const ordered = rows.results.filter(row => configured.includes(row.slot)).sort((a, b) => {
    const aExpiry = a.reset_at && a.reset_at > now ? a.reset_at : Infinity;
    const bExpiry = b.reset_at && b.reset_at > now ? b.reset_at : Infinity;
    if (aExpiry !== bExpiry) return aExpiry - bExpiry;
    return (b.remaining ?? Infinity) - (a.remaining ?? Infinity) || a.consumed_estimate - b.consumed_estimate || a.slot - b.slot;
  });
  for (const row of ordered) {
    const key = env[names[provider][row.slot - 1]];
    if (!key) continue;
    const leaseStart = Date.now();
    const leaseUntil = leaseStart + (options.leaseMs ?? 100_000);
    const lease = await env.DB.prepare("UPDATE provider_key_state SET lease_until=? WHERE provider=? AND slot=? AND lease_until<=?")
      .bind(leaseUntil, provider, row.slot, leaseStart).run();
    if (!lease.meta.changes) continue;
    let reserved = false;
    try {
      if (provider === "exa" && env.EXA_CREDIT_WINDOWS) {
        try {
          const window = JSON.parse(env.EXA_CREDIT_WINDOWS)[String(row.slot)];
          const start = timestamp(window?.startsAt);
          const end = timestamp(window?.endsAt);
          const allowance = numeric(window?.allowance);
          const period = "configured:" + String(window?.startsAt || "");
          if (start !== null && end !== null && allowance !== null && start <= now && end > now && row.period !== period) {
            row.remaining = allowance;
            row.reset_at = end;
            row.blocked_until = 0;
            await env.DB.prepare("UPDATE provider_key_state SET remaining=?,reset_at=?,period=?,blocked_until=0,consumed_estimate=0 WHERE provider=? AND slot=?")
              .bind(allowance, end, period, provider, row.slot).run();
          }
        } catch { /* Invalid optional configuration never grants extra credit. */ }
      }
      if (provider !== "exa" && (!row.remaining_checked_at || now - row.remaining_checked_at > 15 * 60_000)) {
        try {
          const usage = await balance(provider, key);
          if (usage) {
            const renewed = usage.remaining > (row.remaining ?? -1) || (!!usage.period && usage.period !== row.period);
            row.remaining = usage.remaining;
            row.reset_at = usage.reset;
            if (renewed) row.blocked_until = 0;
            await env.DB.prepare("UPDATE provider_key_state SET remaining=?,remaining_checked_at=?,reset_at=?,period=?,blocked_until=? WHERE provider=? AND slot=?")
              .bind(row.remaining, now, usage.reset, usage.period, row.blocked_until, provider, row.slot).run();
          }
        } catch { /* Keep the last observation during a usage endpoint outage. */ }
      }
      if (row.blocked_until > now || (row.remaining !== null && row.remaining < options.estimate)) continue;
      if (provider === "exa" && row.remaining === null) {
        row.remaining = Math.max(0, 10 - row.consumed_estimate);
        await env.DB.prepare("UPDATE provider_key_state SET remaining=? WHERE provider=? AND slot=?").bind(row.remaining, provider, row.slot).run();
        if (row.remaining < options.estimate) continue;
      }
      const reservation = await env.DB.prepare("UPDATE provider_key_state SET remaining=CASE WHEN remaining IS NULL THEN NULL ELSE remaining-? END WHERE provider=? AND slot=? AND (remaining IS NULL OR remaining>=?)")
        .bind(options.estimate, provider, row.slot, options.estimate).run();
      if (!reservation.meta.changes) continue;
      reserved = true;
      const result = await run(key, row.slot);
      const charge = numeric(result.cost) ?? options.estimate;
      await env.DB.batch([
        env.DB.prepare("UPDATE provider_key_state SET remaining=CASE WHEN remaining IS NULL THEN NULL ELSE MAX(0,remaining+?-?) END,consumed_estimate=consumed_estimate+? WHERE provider=? AND slot=?")
          .bind(options.estimate, charge, charge, provider, row.slot),
        env.DB.prepare("INSERT INTO provider_costs(id,provider,slot,purpose,cost,estimated,created_at) VALUES (?,?,?,?,?,?,?)")
          .bind(crypto.randomUUID(), provider, row.slot, options.purpose, charge, result.cost === undefined ? 1 : 0, Date.now()),
      ]);
      return result.value;
    } catch (cause) {
      const status = cause instanceof ProviderHttpError ? cause.status : 0;
      const quota = status === 402 || status === 432 || status === 433;
      const rejected = status >= 400 && status < 500;
      if (reserved && rejected) await env.DB.prepare("UPDATE provider_key_state SET remaining=CASE WHEN remaining IS NULL THEN NULL ELSE remaining+? END WHERE provider=? AND slot=?")
        .bind(options.estimate, provider, row.slot).run();
      if (reserved && !rejected) await env.DB.batch([
        env.DB.prepare("UPDATE provider_key_state SET consumed_estimate=consumed_estimate+? WHERE provider=? AND slot=?").bind(options.estimate, provider, row.slot),
        env.DB.prepare("INSERT INTO provider_costs(id,provider,slot,purpose,cost,estimated,created_at) VALUES (?,?,?,?,?,1,?)").bind(crypto.randomUUID(), provider, row.slot, options.purpose, options.estimate, Date.now()),
      ]);
      if (quota || status === 429 || status === 401 || status === 403) {
        const until = quota ? (row.reset_at && row.reset_at > now ? row.reset_at : now + 15 * 60_000) : now + (status === 429 ? 60_000 : 24 * 60 * 60_000);
        await env.DB.prepare("UPDATE provider_key_state SET blocked_until=?,remaining=CASE WHEN ? THEN 0 ELSE remaining END WHERE provider=? AND slot=?")
          .bind(until, quota ? 1 : 0, provider, row.slot).run();
        continue;
      }
      // A timeout may already be billed. Do not repeat it against every key.
      throw new Error(provider + " request did not complete.");
    } finally {
      await env.DB.prepare("UPDATE provider_key_state SET lease_until=0 WHERE provider=? AND slot=? AND lease_until=?").bind(provider, row.slot, leaseUntil).run();
    }
  }
  throw new Error(provider + " has no available request budget.");
}

export async function providerPost(url: string, headers: HeadersInit, body: unknown, timeoutMs = 30_000): Promise<unknown> {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new ProviderHttpError(response.status);
  return response.json();
}
