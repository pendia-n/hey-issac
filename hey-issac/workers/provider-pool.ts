type Provider = "exa" | "tavily" | "firecrawl";
type Usage = {
  remaining: number;
  resetAt: string | null;
  kind: "credits" | "usd_estimate";
  periodStart?: string;
  includedCredits?: number;
  providerUsed?: number;
};
type KeyCandidate = {
  provider: Provider;
  label: string;
  value: string;
  paid: boolean;
  usage: Usage;
};

const FREE_KEY_COUNT = 10;
const EXA_MONTHLY_BUDGET_USD = 10;
const EXA_SEARCH_RESERVE_USD = 0.02;

function labels(provider: Provider) {
  return [
    ...Array.from(
      { length: FREE_KEY_COUNT },
      (_, index) =>
        `${provider.toUpperCase()}_FREE_${String(index + 1).padStart(2, "0")}`,
    ),
    `${provider.toUpperCase()}_PAID`,
  ];
}

async function getJson(response: Response) {
  if (!response.ok) throw new Error(`usage_http_${response.status}`);
  return (await response.json()) as Record<string, any>;
}

async function cycleEnd(
  env: Record<string, unknown>,
  label: string,
  now: Date,
) {
  const configured = env[`${label}_RESET_AT`];
  if (typeof configured !== "string") return null;
  let end = new Date(configured);
  if (!Number.isFinite(end.getTime())) return null;
  while (end.getTime() <= now.getTime()) {
    const day = end.getUTCDate();
    const next = new Date(
      Date.UTC(
        end.getUTCFullYear(),
        end.getUTCMonth() + 1,
        1,
        end.getUTCHours(),
        end.getUTCMinutes(),
        end.getUTCSeconds(),
      ),
    );
    const lastDay = new Date(
      Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0),
    ).getUTCDate();
    next.setUTCDate(Math.min(day, lastDay));
    end = next;
  }
  return end.toISOString();
}

async function readExaAllowance(
  db: D1Database,
  env: Record<string, unknown>,
  label: string,
  now: Date,
): Promise<Usage | null> {
  const resetAt = await cycleEnd(env, label, now);
  if (!resetAt) return null;
  await db
    .prepare(
      `INSERT OR IGNORE INTO provider_key_ledger (key_label, provider, cycle_end, estimated_used_usd, updated_at) VALUES (?, 'exa', ?, 0, ?)`,
    )
    .bind(label, resetAt, now.toISOString())
    .run();
  const row = await db
    .prepare(
      "SELECT cycle_end, estimated_used_usd FROM provider_key_ledger WHERE key_label = ?",
    )
    .bind(label)
    .first<{ cycle_end: string; estimated_used_usd: number }>();
  if (!row) return null;
  if (new Date(row.cycle_end).getTime() <= now.getTime()) {
    await db
      .prepare(
        "UPDATE provider_key_ledger SET cycle_end = ?, estimated_used_usd = 0, updated_at = ? WHERE key_label = ?",
      )
      .bind(resetAt, now.toISOString(), label)
      .run();
    return { remaining: EXA_MONTHLY_BUDGET_USD, resetAt, kind: "usd_estimate" };
  }
  return {
    remaining: Math.max(
      0,
      EXA_MONTHLY_BUDGET_USD - Number(row.estimated_used_usd),
    ),
    resetAt: row.cycle_end,
    kind: "usd_estimate",
  };
}

async function readAllowance(
  provider: Provider,
  label: string,
  key: string,
  db: D1Database,
  env: Record<string, unknown>,
  now: Date,
): Promise<Usage | null> {
  if (provider === "exa") return readExaAllowance(db, env, label, now);
  if (provider === "firecrawl") {
    const body = await getJson(
      await fetch("https://api.firecrawl.dev/v2/team/credit-usage", {
        headers: { Authorization: `Bearer ${key}` },
      }),
    );
    const data = body.data && typeof body.data === "object" ? body.data : {};
    let remaining = Number(data.remainingCredits);
    let includedUsage: Partial<Usage> = {};
    if (label.endsWith("_PAID")) {
      const planCredits = Number(data.planCredits);
      const periodStart = data.billingPeriodStart;
      const periodEnd = data.billingPeriodEnd;
      if (
        !Number.isFinite(planCredits) ||
        planCredits <= 0 ||
        typeof periodStart !== "string" ||
        typeof periodEnd !== "string"
      )
        return null;
      const history = await getJson(
        await fetch(
          "https://api.firecrawl.dev/v2/team/credit-usage/historical?byApiKey=true",
          { headers: { Authorization: `Bearer ${key}` } },
        ),
      );
      if (history.success !== true || !Array.isArray(history.periods))
        return null;
      const usedThisPeriod = history.periods
        .filter(
          (period: any) =>
            period.startDate === periodStart && period.endDate === periodEnd,
        )
        .reduce(
          (total: number, period: any) =>
            total + Math.max(0, Number(period.totalCredits) || 0),
          0,
        );
      await db
        .prepare(
          `INSERT INTO provider_credit_ledger (key_label, period_start, used_credits, updated_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(key_label, period_start) DO UPDATE SET
             used_credits = MAX(provider_credit_ledger.used_credits, excluded.used_credits),
             updated_at = excluded.updated_at`,
        )
        .bind(label, periodStart, usedThisPeriod, now.toISOString())
        .run();
      const locallyUsed = await db
        .prepare(
          "SELECT used_credits FROM provider_credit_ledger WHERE key_label = ? AND period_start = ?",
        )
        .bind(label, periodStart)
        .first<{ used_credits: number }>();
      const used = Math.max(usedThisPeriod, Number(locallyUsed?.used_credits ?? 0));
      remaining = Math.min(remaining, Math.max(0, planCredits - used));
      includedUsage = {
        periodStart,
        includedCredits: planCredits,
        providerUsed: usedThisPeriod,
      };
    }
    return Number.isFinite(remaining) && remaining > 0
      ? {
          remaining,
          resetAt:
            typeof data.billingPeriodEnd === "string"
              ? data.billingPeriodEnd
              : null,
          kind: "credits",
          ...includedUsage,
        }
      : null;
  }
  const body = await getJson(
    await fetch("https://api.tavily.com/usage", {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    }),
  );
  const keyUsage = body.key && typeof body.key === "object" ? body.key : {};
  const account =
    body.account && typeof body.account === "object" ? body.account : {};
  const keyRemaining = Number(keyUsage.limit) - Number(keyUsage.usage);
  const accountRemaining =
    Number(account.plan_limit) - Number(account.plan_usage);
  const remaining = Math.min(keyRemaining, accountRemaining);
  return Number.isFinite(remaining) && remaining > 0
    ? { remaining, resetAt: null, kind: "credits" }
    : null;
}

async function reservePaidFirecrawlCredit(
  db: D1Database,
  label: string,
  usage: Usage,
  amount: number,
): Promise<boolean> {
  if (
    !usage.periodStart ||
    !usage.includedCredits ||
    usage.kind !== "credits"
  )
    return false;
  await db
    .prepare(
      `INSERT INTO provider_credit_ledger (key_label, period_start, used_credits, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key_label, period_start) DO UPDATE SET
         used_credits = MAX(provider_credit_ledger.used_credits, excluded.used_credits),
         updated_at = excluded.updated_at`,
    )
    .bind(
      label,
      usage.periodStart,
      Math.max(0, Number(usage.providerUsed ?? 0)),
      new Date().toISOString(),
    )
    .run();
  const result = await db
    .prepare(
      "UPDATE provider_credit_ledger SET used_credits = used_credits + ?, updated_at = ? WHERE key_label = ? AND period_start = ? AND used_credits + ? <= ?",
    )
    .bind(
      amount,
      new Date().toISOString(),
      label,
      usage.periodStart,
      amount,
      usage.includedCredits,
    )
    .run();
  return result.meta.changes === 1;
}

async function releasePaidFirecrawlCredit(
  db: D1Database,
  label: string,
  usage: Usage,
  amount: number,
) {
  if (!usage.periodStart) return;
  await db
    .prepare(
      "UPDATE provider_credit_ledger SET used_credits = MAX(?, used_credits - ?), updated_at = ? WHERE key_label = ? AND period_start = ?",
    )
    .bind(
      Math.max(0, Number(usage.providerUsed ?? 0)),
      amount,
      new Date().toISOString(),
      label,
      usage.periodStart,
    )
    .run();
}

async function candidatesFor(
  provider: Provider,
  db: D1Database,
  env: Record<string, unknown>,
  now: Date,
  tier: "free" | "paid" | "all" = "all",
): Promise<KeyCandidate[]> {
  const named = labels(provider).map((label, index) => ({
    label,
    value: env[label],
    paid: index === FREE_KEY_COUNT,
  })).filter(({ paid }) => tier === "all" || paid === (tier === "paid"));
  const checks = await Promise.all(
    named.map(async ({ label, value, paid }) => {
      if (typeof value !== "string" || !value) return null;
      try {
        const usage = await readAllowance(provider, label, value, db, env, now);
        return usage ? { provider, label, value, paid, usage } : null;
      } catch {
        return null;
      }
    }),
  );
  return checks
    .filter((item): item is KeyCandidate => item !== null)
    .sort((a, b) => {
      if (a.paid !== b.paid) return Number(a.paid) - Number(b.paid);
      if (a.usage.resetAt && b.usage.resetAt)
        return a.usage.resetAt.localeCompare(b.usage.resetAt);
      if (a.usage.resetAt) return -1;
      if (b.usage.resetAt) return 1;
      return b.usage.remaining - a.usage.remaining;
    });
}

export type SearchHit = {
  title: string;
  url: string;
  excerpt: string;
  position: number;
};
export type SearchResult = {
  provider: Provider;
  keyLabel: string;
  hits: SearchHit[];
};

export async function searchWithPool(
  db: D1Database,
  env: Record<string, unknown>,
  query: string,
  preferred: Provider[] = ["exa", "tavily", "firecrawl"],
): Promise<SearchResult> {
  const now = new Date();
  for (const tier of ["free", "paid"] as const) {
    for (const provider of preferred) {
      const candidates = await candidatesFor(provider, db, env, now, tier);
      for (const candidate of candidates) {
        let reserved = false;
        if (provider === "exa") {
          const result = await db
            .prepare(
              "UPDATE provider_key_ledger SET estimated_used_usd = estimated_used_usd + ?, updated_at = ? WHERE key_label = ? AND estimated_used_usd + ? <= ?",
            )
            .bind(
              EXA_SEARCH_RESERVE_USD,
              now.toISOString(),
              candidate.label,
              EXA_SEARCH_RESERVE_USD,
              EXA_MONTHLY_BUDGET_USD,
            )
            .run();
          if (result.meta.changes !== 1) continue;
          reserved = true;
        }
        if (provider === "firecrawl" && candidate.paid) {
          reserved = await reservePaidFirecrawlCredit(
            db,
            candidate.label,
            candidate.usage,
            1,
          );
          if (!reserved) continue;
        }
        try {
          const hits = await runSearch(candidate, query);
          if (hits.length) return { provider, keyLabel: candidate.label, hits };
        } catch {
          if (reserved && provider === "exa")
            await db
              .prepare(
                "UPDATE provider_key_ledger SET estimated_used_usd = MAX(0, estimated_used_usd - ?), updated_at = ? WHERE key_label = ?",
              )
              .bind(
                EXA_SEARCH_RESERVE_USD,
                new Date().toISOString(),
                candidate.label,
              )
              .run();
          if (reserved && provider === "firecrawl")
            await releasePaidFirecrawlCredit(
              db,
              candidate.label,
              candidate.usage,
              1,
            );
        }
      }
    }
  }
  throw new Error("web_search_not_configured_or_quota_unavailable");
}

async function runSearch(
  candidate: KeyCandidate,
  query: string,
): Promise<SearchHit[]> {
  if (candidate.provider === "exa") {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": candidate.value,
      },
      body: JSON.stringify({
        query,
        type: "fast",
        numResults: 5,
        contents: { text: { maxCharacters: 1200 } },
      }),
    });
    const body = await getJson(response);
    return (Array.isArray(body.results) ? body.results : [])
      .map((item: any, index: number) => ({
        title: String(item.title ?? "").slice(0, 240),
        url: String(item.url ?? ""),
        excerpt: String(item.text ?? item.highlights?.join(" ") ?? "").slice(
          0,
          1200,
        ),
        position: index + 1,
      }))
      .filter((hit) => isHttpUrl(hit.url));
  }
  if (candidate.provider === "tavily") {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: candidate.value,
        query,
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
      }),
    });
    const body = await getJson(response);
    return (Array.isArray(body.results) ? body.results : [])
      .map((item: any, index: number) => ({
        title: String(item.title ?? "").slice(0, 240),
        url: String(item.url ?? ""),
        excerpt: String(item.content ?? "").slice(0, 1200),
        position: index + 1,
      }))
      .filter((hit) => isHttpUrl(hit.url));
  }
  const response = await fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${candidate.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit: 5,
      sources: ["web"],
      scrapeOptions: { onlyMainContent: true, formats: ["markdown"] },
    }),
  });
  const body = await getJson(response);
  return (Array.isArray(body.data) ? body.data : [])
    .map((item: any, index: number) => ({
      title: String(item.title ?? "").slice(0, 240),
      url: String(item.url ?? ""),
      excerpt: String(item.description ?? item.markdown ?? "").slice(0, 1200),
      position: index + 1,
    }))
    .filter((hit) => isHttpUrl(hit.url));
}

export async function scrapeWithPool(
  db: D1Database,
  env: Record<string, unknown>,
  url: string,
) {
  const candidates = await candidatesFor("firecrawl", db, env, new Date());
  for (const candidate of candidates) {
    const reserved = candidate.paid
      ? await reservePaidFirecrawlCredit(db, candidate.label, candidate.usage, 1)
      : false;
    if (candidate.paid && !reserved) continue;
    try {
      const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${candidate.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          onlyMainContent: true,
          formats: ["markdown"],
          maxAge: 0,
        }),
      });
      const body = await getJson(response);
      const data =
        body.data && typeof body.data === "object" ? body.data : body;
      const markdown = String(data.markdown ?? "").slice(0, 18000);
      if (!markdown.trim()) throw new Error("empty_scrape_result");
      return {
        keyLabel: candidate.label,
        title: String(data.metadata?.title ?? "").slice(0, 240),
        markdown,
        creditsUsed: Number(data.metadata?.creditsUsed ?? 1),
      };
    } catch {
      if (reserved)
        await releasePaidFirecrawlCredit(db, candidate.label, candidate.usage, 1);
      continue;
    }
  }
  throw new Error("firecrawl_not_configured_or_quota_unavailable");
}

export async function providerPoolStatus(
  db: D1Database,
  env: Record<string, unknown>,
) {
  const states = await Promise.all(
    (["firecrawl", "exa", "tavily"] as Provider[]).map(async (provider) => {
      const items = await candidatesFor(provider, db, env, new Date());
      return {
        provider,
        configured: labels(provider).filter(
          (label) => typeof env[label] === "string" && env[label],
        ).length,
        usable: items.length,
        nextKey: items[0]?.label ?? null,
        unit: provider === "exa" ? "estimated USD" : "provider credits",
      };
    }),
  );
  return {
    providers: states,
    openrouterConfigured:
      typeof env.OPENROUTER_API_KEY === "string" &&
      Boolean(env.OPENROUTER_API_KEY),
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
