import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { build } from "../node_modules/.pnpm/node_modules/esbuild/lib/main.js";

// Offline contract fixtures only: all outbound fetches are intercepted.
const { outputFiles } = await build({ stdin: { contents: 'export * from "./workers/search"; export * from "./workers/research"; export * from "./workers/provider-pool"; export { marketSearchSlot, competitorDay } from "./workers/schedule";', resolveDir: new URL("..", import.meta.url).pathname, loader: "ts" }, bundle: true, write: false, format: "esm", platform: "neutral" });
const api = await import("data:text/javascript;base64," + Buffer.from(outputFiles[0].text).toString("base64"));
function environment(keys = {}) {
  const sqlite = new DatabaseSync(":memory:");
  for (const name of readdirSync(new URL("../migrations/", import.meta.url)).filter(name => name.endsWith(".sql")).sort()) sqlite.exec(readFileSync(new URL("../migrations/" + name, import.meta.url), "utf8"));
  const prepare = sql => ({ bind: (...args) => statement(sql, args), ...statement(sql, []) });
  const statement = (sql, args) => ({
    async first() { return sqlite.prepare(sql).get(...args) || null; },
    async all() { return { results: sqlite.prepare(sql).all(...args) }; },
    async run() { return { meta: { changes: sqlite.prepare(sql).run(...args).changes } }; },
  });
  return { ...keys, DB: { prepare, async batch(items) { const results = []; sqlite.exec("BEGIN"); try { for (const item of items) results.push(await item.run()); sqlite.exec("COMMIT"); return results; } catch (error) { sqlite.exec("ROLLBACK"); throw error; } } }, sqlite };
}
const json = body => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
async function withFetch(handler, run) {
  const original = globalThis.fetch;
  globalThis.fetch = handler;
  try { await run(); } finally { globalThis.fetch = original; }
}

test("basic news uses one credit, preserves undated findings and accepts empty results without fallback", async () => {
  const env = environment({ TAVILY_API_KEY_1: "offline" });
  let calls = 0;
  await withFetch(async (url, options) => {
    if (url.endsWith("/usage")) return json({ key: { usage: 10, limit: 1000 }, account: { plan_usage: 10, plan_limit: 1000 } });
    calls++;
    const body = JSON.parse(options.body);
    assert.equal(body.search_depth, "basic"); assert.equal(body.topic, "news"); assert.equal(body.include_usage, true);
    return json({ results: calls === 1 ? [{ title: "Product launch", url: "https://example.org/news", content: "Product evidence" }] : [], usage: { credits: 1 } });
  }, async () => {
    const hits = await api.searchWeb("Example news", env, "solo");
    assert.equal(hits[0].publishedAt, null);
    assert.equal(hits[0].provider, "tavily");
    assert.deepEqual(await api.searchWeb("No updates", env, "solo"), []);
    assert.equal(calls, 2);
    assert.equal(env.sqlite.prepare("SELECT remaining FROM provider_key_state").get().remaining, 988);
  });
});

test("Firecrawl news parses the news group without scraping every result", async () => {
  const env = environment({ FIRECRAWL_API_KEY_1: "offline" });
  await withFetch(async (url, options) => {
    if (url.includes("credit-usage")) return json({ data: { remainingCredits: 1000, billingPeriodEnd: "2026-12-01T00:00:00Z" } });
    const body = JSON.parse(options.body);
    assert.deepEqual(body.sources, ["news"]); assert.equal(body.scrapeOptions, undefined); assert.equal(body.limit, 10);
    return json({ data: { news: [{ title: "News", url: "https://example.org/news", snippet: "Actual excerpt", date: "2 days ago" }] }, creditsUsed: 2 });
  }, async () => {
    const hits = await api.searchWeb("News", env, "solo"); assert.equal(hits[0].excerpt, "Actual excerpt"); assert.equal(hits[0].publishedAt, null);
    assert.equal(env.sqlite.prepare("SELECT remaining FROM provider_key_state").get().remaining, 998);
  });
});

test("structured Exa competitors preserve summaries and reject publishers and self", async () => {
  const env = environment({ EXA_API_KEY_1: "offline" });
  await withFetch(async (_url, options) => {
    const body = JSON.parse(options.body); assert.equal(body.type, "deep"); assert.ok(body.outputSchema.properties.competitors);
    const item = { name: "Alternative", officialUrl: "https://alternative.example/", summary: "A competing product", overlap: "Same customers", sourceUrl: "https://alternative.example/about", confidence: "medium" };
    return json({ output: { content: { competitors: [item, { ...item, officialUrl: "https://reddit.com" }, { ...item, officialUrl: "https://example.com" }] } }, costDollars: { total: 0.012 } });
  }, async () => {
    const candidates = await api.findCompetitors({ submitted_url: "https://example.com", root_domain: "example.com", display_name: "Example", category: "commercial" }, env, "solo", 3);
    assert.equal(candidates.length, 1); assert.equal(candidates[0].summary, "A competing product");
    assert.ok(Math.abs(env.sqlite.prepare("SELECT remaining FROM provider_key_state").get().remaining - 9.988) < 1e-8);
  });
});

test("Tavily account cap is respected even with a higher key cap", async () => {
  const env = environment({ TAVILY_API_KEY_1: "offline" }); let searchCalls = 0;
  await withFetch(async url => {
    if (url.endsWith("/usage")) return json({ key: { usage: 0, limit: 1000 }, account: { plan_usage: 1000, plan_limit: 1000, paygo_limit: 0 } });
    searchCalls++; throw new Error("Must not spend");
  }, async () => { await assert.rejects(api.searchWeb("News", env, "solo")); assert.equal(searchCalls, 0); });
});

test("credit exhaustion falls through keys while ambiguous failures are not repeated", async () => {
  const env = environment({ EXA_API_KEY_1: "offline-one", EXA_API_KEY_2: "offline-two" }); let count = 0;
  const result = await api.withProviderKey(env, "exa", async () => { if (++count === 1) throw new api.ProviderHttpError(402); return { value: "done", cost: 0.005 }; }, { purpose: "chat", estimate: 0.005 });
  assert.equal(result, "done"); assert.equal(count, 2);
  count = 0;
  await assert.rejects(api.withProviderKey(env, "exa", async () => { count++; throw new Error("timeout"); }, { purpose: "chat", estimate: 0.005 }));
  assert.equal(count, 1);
});

test("key leases stop concurrent requests from spending the same balance", async () => {
  const env = environment({ EXA_API_KEY_1: "offline" }); let release;
  const pending = new Promise(resolve => { release = resolve; });
  const first = api.withProviderKey(env, "exa", async () => { await pending; return { value: true, cost: 0.005 }; }, { purpose: "chat", estimate: 0.005 });
  await new Promise(resolve => setTimeout(resolve, 10));
  await assert.rejects(api.withProviderKey(env, "exa", async () => { throw new Error("Must not run"); }, { purpose: "chat", estimate: 0.005 }));
  release(); await first;
});

test("plan slots retain the agreed schedule and URL deduplication removes tracking", () => {
  assert.equal(api.marketSearchSlot("solo", 0, 13), true);
  assert.equal(api.marketSearchSlot("solo", 6, 13), false);
  assert.equal(api.marketSearchSlot("studio", 5, 9), true);
  assert.equal(api.marketSearchSlot("partner", 5, 21), false);
  assert.equal(api.marketSearchSlot("partner", 5, 15), true);
  assert.equal(api.normalizeSource("https://www.example.org/news?utm_source=test&gclid=x#top"), api.normalizeSource("https://example.org/news"));
  assert.ok(api.competitorDay("example.org") >= 0 && api.competitorDay("example.org") < 6);
});

test("business profiles use structured answers and require an official domain", async () => {
  const env = environment({ EXA_API_KEY_1: "offline" });
  await withFetch(async (_url, options) => {
    const body = JSON.parse(options.body); assert.ok(body.outputSchema.properties.category);
    return json({ answer: { name: "Example", summary: "An original music product", category: "musician", audience: "Creators", businessModel: "Subscription", sourceUrl: "https://example.com/about" }, costDollars: { total: 0.005 } });
  }, async () => {
    const result = await api.businessProfile("https://example.com", env, "solo");
    assert.equal(result.category, "musician"); assert.equal(result.businessModel, "Subscription");
  });
});

test("explicit Agent investigation fixes effort to low and reads output.structured", async () => {
  const env = environment({ EXA_API_KEY_1: "offline" });
  await withFetch(async (url, options) => {
    assert.equal(url, "https://api.exa.ai/agent/runs");
    const body = JSON.parse(options.body); assert.equal(body.effort, "low"); assert.equal(body.dataSources, undefined);
    return json({ id: "offline-run", status: "completed", output: { structured: { answer: "A sourced investigation" }, grounding: [{ field: "answer", citations: [{ title: "Source", url: "https://example.org/report" }] }] }, costDollars: { total: 0.025 } });
  }, async () => {
    const result = await api.investigate(env, "A bounded market question");
    assert.equal(result.answer, "A sourced investigation"); assert.equal(result.citations.length, 1);
  });
});
