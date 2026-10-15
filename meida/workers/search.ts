import { getDomain } from "tldts";
import type { AppEnv, Plan, RoomRow } from "./types";
import { EXA_COSTS, hasProvider, providerPost, withProviderKey } from "./provider-pool";

export interface SearchHit {
  title: string;
  url: string;
  excerpt: string;
  publishedAt: number | null;
  provider: "tavily" | "exa" | "firecrawl";
}

export interface SiteReview {
  status: "ok" | "unavailable";
  sourceUrl: string;
  checkedAt: number;
  title: string | null;
  description: string | null;
  canonical: string | null;
  h1: string | null;
  robots: string | null;
  issues: string[];
  evidence: { h1Count: number; internalLinks: string[]; jsonLdPresent: boolean; pageText: string; xRobots: string | null };
}

function clean(value: unknown, limit = 500): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, limit) : "";
}

function concise(value: unknown, limit = 600): string {
  const text = clean(value, 1200);
  if (text.length <= limit) return text;
  const boundary = text.lastIndexOf(" ", limit - 1);
  return text.slice(0, boundary > limit * 0.65 ? boundary : limit).replace(/[,:;\s]+$/, "") + "…";
}

function published(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

export function canonicalSite(input: unknown): { domain: string; url: string } | null {
  if (typeof input !== "string" || input.length > 2048) return null;
  let url: URL;
  try { url = new URL(input.trim()); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password || url.port) return null;
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(":") || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname.endsWith(".internal")) return null;
  const domain = getDomain(hostname, { allowPrivateDomains: false });
  if (!domain || domain.length > 253) return null;
  url.hash = "";
  return { domain, url: url.toString() };
}

function validHit(title: unknown, url: unknown, excerpt: unknown, date: unknown, provider: SearchHit["provider"]): SearchHit | null {
  if (typeof url !== "string" || !canonicalSite(url)) return null;
  const name = clean(title, 120);
  if (!name) return null;
  return { title: name, url, excerpt: concise(excerpt), publishedAt: published(date), provider };
}

export type SearchPurpose = "news" | "discovery" | "overview" | "chat";
async function pooledSearch(query: string, env: AppEnv, provider: SearchHit["provider"], purpose: SearchPurpose): Promise<SearchHit[]> {
  const news = purpose === "news";
  return withProviderKey(env, provider, async key => {
    if (provider === "tavily") {
      const result = await providerPost("https://api.tavily.com/search", { authorization: "Bearer " + key }, {
        query, search_depth: "basic", max_results: 8, include_answer: false, include_usage: true,
        include_published_date: true, include_images: false, include_raw_content: false,
        ...(news ? { topic: "news", time_range: "week" } : { topic: "general" }),
      }) as { results?: Array<Record<string, unknown>>; usage?: { credits?: number } };
      return { value: (result.results || []).map(item => validHit(item.title, item.url, item.content, item.published_date, provider)).filter((item): item is SearchHit => !!item), cost: result.usage?.credits };
    }
    if (provider === "exa") {
      const result = await providerPost("https://api.exa.ai/search", { "x-api-key": key }, {
        query, type: "auto", numResults: 8, contents: { highlights: true },
        ...(news ? { category: "news", startPublishedDate: new Date(Date.now() - 7 * 86400_000).toISOString() } : {}),
      }) as { results?: Array<Record<string, unknown>>; costDollars?: { total?: number } };
      return { value: (result.results || []).map(item => validHit(item.title, item.url, Array.isArray(item.highlights) ? item.highlights.join(" ") : item.text || item.summary, item.publishedDate, provider)).filter((item): item is SearchHit => !!item), cost: result.costDollars?.total };
    }
    const result = await providerPost("https://api.firecrawl.dev/v2/search", { authorization: "Bearer " + key }, {
      query, limit: 10, sources: [news ? "news" : "web"],
    }) as { success?: boolean; creditsUsed?: number; data?: { web?: Array<Record<string, unknown>>; news?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> };
    if (result.success === false) throw new Error("Search unavailable.");
    const items = Array.isArray(result.data) ? result.data : news ? result.data?.news || [] : result.data?.web || [];
    return { value: items.map(item => validHit(item.title, item.url, item.snippet || item.description || item.markdown, item.publishedDate || item.date, provider)).filter((item): item is SearchHit => !!item), cost: result.creditsUsed };
  }, { purpose, estimate: provider === "tavily" ? 1 : provider === "firecrawl" ? 2 : EXA_COSTS.auto });
}

export function searchConfigured(env: AppEnv, _plan?: Plan): boolean {
  return hasProvider(env, "tavily") || hasProvider(env, "firecrawl") || hasProvider(env, "exa");
}

export async function searchWeb(query: string, env: AppEnv, _plan: Plan, purpose: SearchPurpose = "news"): Promise<SearchHit[]> {
  let providers: SearchHit["provider"][] = ["tavily", "firecrawl", "exa"];
  const budget = await env.DB.prepare("SELECT COUNT(*) AS count,SUM(remaining) AS remaining FROM provider_key_state WHERE provider='tavily'").first<{ count: number; remaining: number | null }>();
  if ((budget?.count || 0) >= 3 && budget?.remaining !== null && (budget?.remaining ?? 3000) < 600) providers = ["firecrawl", "tavily", "exa"];
  for (const provider of providers) {
    if (!hasProvider(env, provider)) continue;
    try {
      const hits = await pooledSearch(query, env, provider, purpose);
      const unique = new Map<string, SearchHit>();
      for (const hit of hits) {
        if (purpose === "news" && hit.publishedAt !== null && hit.publishedAt < Date.now() - 7 * 86400_000) continue;
        unique.set(normalizeSource(hit.url), hit);
      }
      return [...unique.values()];
    } catch { /* Retry another provider only for an actual failed request. */ }
  }
  throw new Error("Web search is temporarily unavailable.");
}

export function normalizeSource(value: string): string {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (/^utm_|^(fbclid|gclid|ref)$/i.test(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  url.hostname = url.hostname.replace(/^www\./, "");
  return url.toString().replace(/\/$/, "");
}
const excludedCompetitors = new Set(["youtube.com", "reddit.com", "facebook.com", "instagram.com", "linkedin.com", "wikipedia.org", "g2.com", "capterra.com", "trustpilot.com", "medium.com", "x.com"]);

export function competitorCandidates(hits: SearchHit[], ownDomain: string, limit: number): Array<{ domain: string; name: string; sourceUrl: string }> {
  const domains = new Set<string>();
  return hits.flatMap(hit => {
    const site = canonicalSite(hit.url);
    if (!site || site.domain === ownDomain || excludedCompetitors.has(site.domain) || domains.has(site.domain)) return [];
    domains.add(site.domain);
    return [{ domain: site.domain, name: site.domain, sourceUrl: hit.url }];
  }).slice(0, limit);
}

async function firecrawlPage(siteUrl: string, env: AppEnv): Promise<Response | null> {
  if (!hasProvider(env, "firecrawl")) return null;
  try {
    const result = await withProviderKey(env, "firecrawl", async key => {
      const data = await providerPost("https://api.firecrawl.dev/v2/scrape", { authorization: "Bearer " + key }, { url: siteUrl, formats: ["html"], onlyMainContent: false, maxAge: 0, parsers: [] }, 60_000) as { data?: { html?: string } };
      return { value: data };
    }, { purpose: "page-review", estimate: 1 });
    return result.data?.html ? new Response(result.data.html, { headers: { "content-type": "text/html" } }) : null;
  } catch { return null; }
}

export async function reviewSite(siteUrl: string, env: AppEnv): Promise<SiteReview> {
  const review: SiteReview = { status: "unavailable", sourceUrl: siteUrl, checkedAt: Date.now(), title: null, description: null, canonical: null, h1: null, robots: null, issues: [], evidence: { h1Count: 0, internalLinks: [], jsonLdPresent: false, pageText: "", xRobots: null } };
  let response: Response | null = null;
  let checkedUrl = siteUrl;
  try {
    if (!response) {
      for (let redirectCount = 0; redirectCount <= 4; redirectCount++) {
        const current = canonicalSite(checkedUrl);
        if (!current) break;
        response = await fetch(current.url, { redirect: "manual", headers: { accept: "text/html" }, signal: AbortSignal.timeout(10_000) });
        if (response.status < 300 || response.status >= 400) { checkedUrl = current.url; break; }
        const location = response.headers.get("location");
        if (!location || redirectCount === 4) { response = null; break; }
        checkedUrl = new URL(location, current.url).toString();
      }
      if (!response?.ok || !response.headers.get("content-type")?.toLowerCase().includes("text/html")) response = null;
    }
  } catch { /* The page may block public fetching. */ }
  review.sourceUrl = checkedUrl;
  if (!response) response = await firecrawlPage(siteUrl, env);
  if (!response) return review;
  review.evidence.xRobots = response.headers.get("x-robots-tag");

  let inTitle = false;
  let inH1 = false;
  const parser = new HTMLRewriter()
    .on("title", { element(element) { inTitle = true; element.onEndTag(() => { inTitle = false; }); }, text(text) { if (inTitle) review.title = ((review.title || "") + text.text).slice(0, 180); } })
    .on("h1", { element(element) { review.evidence.h1Count++; inH1 = review.evidence.h1Count === 1; element.onEndTag(() => { inH1 = false; }); }, text(text) { if (inH1) review.h1 = ((review.h1 || "") + text.text).slice(0, 180); } })
    .on("script[type='application/ld+json']", { element() { review.evidence.jsonLdPresent = true; } })
    .on("p,h1,h2,h3", { text(text) { if (review.evidence.pageText.length < 6000) review.evidence.pageText += text.text.slice(0, 6000 - review.evidence.pageText.length) + " "; } })
    .on("a[href]", { element(element) { try { const url = new URL(element.getAttribute("href") || "", checkedUrl); if (canonicalSite(url.toString())?.domain === canonicalSite(checkedUrl)?.domain && review.evidence.internalLinks.length < 20 && !review.evidence.internalLinks.includes(url.toString())) review.evidence.internalLinks.push(url.toString()); } catch { /* Invalid anchor. */ } } })
    .on("meta", { element(element) { const name = element.getAttribute("name")?.toLowerCase(); if (name === "description") review.description = clean(element.getAttribute("content"), 300); if (name === "robots") review.robots = clean(element.getAttribute("content"), 120); } })
    .on("link", { element(element) { if (element.getAttribute("rel")?.toLowerCase().split(/\s+/).includes("canonical")) review.canonical = clean(element.getAttribute("href"), 500); } });
  try {
    await parser.transform(response).text();
    review.status = "ok";
    if (!review.title) review.issues.push("Page title is missing or could not be read.");
    if (!review.description) review.issues.push("Meta description is missing or could not be read.");
    if (!review.h1) review.issues.push("Main heading is missing or could not be read.");
    if (!review.canonical) review.issues.push("No canonical URL was observed in the retrieved HTML; review whether this page needs one.");
    if (review.evidence.h1Count > 1) review.issues.push("Multiple H1 headings were observed; review the page hierarchy.");
    if ((review.robots || "").toLowerCase().includes("noindex") || (review.evidence.xRobots || "").toLowerCase().includes("noindex")) review.issues.push("This page asks search engines not to index it.");
  } catch {
    review.status = "unavailable";
    review.issues = [];
  }
  return review;
}

export function categoryFor(text: string): string {
  const value = text.toLowerCase();
  const rules: Array<[string, RegExp]> = [
    ["guide", /travel|tour|hotel|holiday|destination|trip|tourism/],
    ["painter", /art|gallery|illustrat|design studio|paint|drawing/],
    ["musician", /music|song|audio|record label|podcast|concert/],
    ["chef", /food|restaurant|recipe|cook|cafe|bakery/],
    ["farmer", /farm|agricultur|garden|crop|organic produce/],
    ["tailor", /fashion|clothing|apparel|tailor|fabric|garment/],
    ["gamer", /game|esport|gaming|streamer/],
  ];
  return rules.find(([, pattern]) => pattern.test(value))?.[0] || "commercial";
}

export async function fingerprint(hit: SearchHit): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalizeSource(hit.url)));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function refreshRoom(room: RoomRow, env: AppEnv, plan: Plan): Promise<{ added: number; checkedAt: number }> {
  const started = Date.now();
  await env.DB.prepare("UPDATE rooms SET search_started_at=? WHERE id=?").bind(started, room.id).run();
  try {
    const hits = await searchWeb(`"${room.display_name}" ${room.root_domain} news updates`, env, plan);
    let added = 0;
    for (const hit of hits) {
      const site = canonicalSite(hit.url);
      if (!site) continue;
      const hash = await fingerprint(hit);
      const result = await env.DB.prepare("INSERT OR IGNORE INTO findings (id,room_id,fingerprint,kind,title,summary,source_url,published_at,fetched_at,pose,provider,subject_domain) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), room.id, hash, site.domain === room.root_domain ? "official" : "mention", hit.title, hit.excerpt || "Open the source to read the original.", hit.url, hit.publishedAt, Date.now(), 0, hit.provider, room.root_domain).run();
      if (result.meta.changes) added++;
    }
    const checkedAt = Date.now();
    await env.DB.prepare("UPDATE rooms SET last_checked_at=?,search_finished_at=? WHERE id=?").bind(checkedAt, checkedAt, room.id).run();
    return { added, checkedAt };
  } catch (cause) {
    await env.DB.prepare("UPDATE rooms SET search_finished_at=? WHERE id=?").bind(Date.now(), room.id).run();
    throw cause;
  }
}
