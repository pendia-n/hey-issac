import { currentUser } from "./auth";
import { hasPaidAccess, subscriptionFor } from "./billing";
import { canonicalSite, categoryFor, competitorCandidates, fingerprint, refreshRoom, reviewSite, searchConfigured, searchWeb } from "./search";
import { hasProvider, providerPost, withProviderKey } from "./provider-pool";
import type { AppEnv, Plan, RoomRow, SubscriptionRow } from "./types";
import { bodyObject, error, json, monthKey, PLANS } from "./types";

async function details(room: RoomRow, env: AppEnv, owner: boolean): Promise<Record<string, unknown>> {
  const findings = await env.DB.prepare("SELECT id,kind,title,summary,source_url,published_at,fetched_at,pose FROM findings WHERE room_id=? ORDER BY fetched_at DESC LIMIT 40").bind(room.id).all();
  const base = { id: room.id, rootDomain: room.root_domain, displayName: room.display_name, category: room.category, createdAt: room.created_at, lastCheckedAt: room.last_checked_at, findings: findings.results };
  if (!owner) return base;
  const subscription = await env.DB.prepare("SELECT plan FROM subscriptions WHERE user_id=?").bind(room.owner_id).first<{ plan: Plan }>();
  const competitors = await env.DB.prepare("SELECT root_domain,name FROM competitors WHERE room_id=? ORDER BY name").bind(room.id).all();
  const review = await env.DB.prepare("SELECT * FROM reviews WHERE room_id=?").bind(room.id).first();
  const messages = await env.DB.prepare("SELECT role,content,citations_json,created_at FROM conversations WHERE room_id=? AND user_id=? ORDER BY created_at DESC LIMIT 30").bind(room.id, room.owner_id).all();
  return { ...base, submittedUrl: room.submitted_url, isPrivate: !!room.is_private, canHide: subscription?.plan === "partner", competitors: competitors.results, review, messages: messages.results.reverse() };
}

async function ownerRoom(id: string, userId: string, env: AppEnv): Promise<RoomRow | null> {
  return env.DB.prepare("SELECT * FROM rooms WHERE id=? AND owner_id=?").bind(id, userId).first<RoomRow>();
}

async function incrementUsage(userId: string, kind: string, limit: number, env: AppEnv): Promise<boolean> {
  const result = await env.DB.prepare("INSERT INTO usage(user_id,month,kind,count) VALUES (?,?,?,1) ON CONFLICT(user_id,month,kind) DO UPDATE SET count=count+1 WHERE count < ?")
    .bind(userId, monthKey(), kind, limit).run();
  return result.meta.changes > 0;
}

async function undoUsage(userId: string, kind: string, env: AppEnv): Promise<void> {
  await env.DB.prepare("UPDATE usage SET count=MAX(0,count-1) WHERE user_id=? AND month=? AND kind=?").bind(userId, monthKey(), kind).run();
}

async function saveReview(room: RoomRow, env: AppEnv): Promise<void> {
  const review = await reviewSite(room.submitted_url, env);
  await env.DB.prepare("INSERT INTO reviews(room_id,checked_at,source_url,status,title,description,canonical,h1,robots,issues_json) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(room_id) DO UPDATE SET checked_at=excluded.checked_at,source_url=excluded.source_url,status=excluded.status,title=excluded.title,description=excluded.description,canonical=excluded.canonical,h1=excluded.h1,robots=excluded.robots,issues_json=excluded.issues_json")
    .bind(room.id, review.checkedAt, review.sourceUrl, review.status, review.title, review.description, review.canonical, review.h1, review.robots, JSON.stringify(review.issues)).run();
  await env.DB.prepare("UPDATE rooms SET last_review_at=? WHERE id=?").bind(review.checkedAt, room.id).run();
}

async function discover(room: RoomRow, subscription: SubscriptionRow, env: AppEnv): Promise<Array<{ domain: string; name: string; sourceUrl: string }>> {
  const hits = await searchWeb(`${room.display_name} ${room.category} alternatives competitors`, env);
  return competitorCandidates(hits, room.root_domain, PLANS[subscription.plan].competitors);
}

async function chat(room: RoomRow, userId: string, message: string, env: AppEnv): Promise<Response> {
  if (!hasProvider(env, "exa")) return error("The question service is not available yet.", 503);
  const past = await env.DB.prepare("SELECT role,content FROM conversations WHERE room_id=? AND user_id=? ORDER BY created_at DESC LIMIT 6").bind(room.id, userId).all<{ role: string; content: string }>();
  const context = past.results.reverse().map(row => `${row.role}: ${row.content}`).join("\n").slice(-2500);
  const query = `About ${room.display_name} (${room.root_domain}). Use current public web sources. If evidence is absent, say so. Help with market observations or draft wording but never claim a post was published. Recent conversation:\n${context}\nUser: ${message}`;
  let answer: string;
  let citations: Array<{ title: string; url: string }>;
  try {
    const data = await withProviderKey(env, "exa", async key => {
      const result = await providerPost("https://api.exa.ai/answer", { "x-api-key": key }, { query }) as { answer?: unknown; citations?: Array<{ title?: unknown; url?: unknown }>; costDollars?: { total?: number } };
      return { value: result, cost: result.costDollars?.total ?? 0.012 };
    });
    answer = typeof data.answer === "string" ? data.answer.slice(0, 8000) : "";
    citations = (data.citations || []).filter(item => typeof item.url === "string" && canonicalSite(item.url)).slice(0, 8).map(item => ({ title: typeof item.title === "string" ? item.title.slice(0, 180) : String(item.url), url: String(item.url) }));
    if (!answer) throw new Error("Empty answer");
  } catch { return error("The question service is temporarily unavailable.", 503); }
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO conversations (id,room_id,user_id,role,content,created_at) VALUES (?,?,?,?,?,?)").bind(crypto.randomUUID(), room.id, userId, "user", message, now),
    env.DB.prepare("INSERT INTO conversations (id,room_id,user_id,role,content,citations_json,created_at) VALUES (?,?,?,?,?,?,?)").bind(crypto.randomUUID(), room.id, userId, "assistant", answer, JSON.stringify(citations), now + 1),
  ]);
  return json({ answer, citations });
}

export async function handleRooms(request: Request, path: string, env: AppEnv): Promise<Response> {
  if (path === "/api/share" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT r.id,r.root_domain,r.display_name,r.category,r.created_at,r.last_checked_at FROM rooms r LEFT JOIN subscriptions s ON s.user_id=r.owner_id WHERE r.is_private=0 ORDER BY r.created_at DESC LIMIT 60").all();
    return json({ rooms: result.results });
  }
  const publicMatch = path.match(/^\/api\/share\/([a-f0-9-]{36})$/);
  if (publicMatch && request.method === "GET") {
    const room = await env.DB.prepare("SELECT * FROM rooms WHERE id=? AND is_private=0").bind(publicMatch[1]).first<RoomRow>();
    return room ? json({ room: await details(room, env, false) }) : error("Room not found.", 404);
  }

  const user = await currentUser(request, env);
  if (!user) return error("Sign in required.", 401);
  const subscription = await subscriptionFor(user.id, env);
  if (!subscription || !hasPaidAccess(subscription)) return error("Choose an active subscription before entering a URL.", 402);
  const limits = PLANS[subscription.plan];

  if (path === "/api/rooms" && request.method === "GET") {
    const rows = await env.DB.prepare("SELECT * FROM rooms WHERE owner_id=? ORDER BY created_at DESC").bind(user.id).all<RoomRow>();
    const counts = await env.DB.prepare("SELECT kind,count FROM usage WHERE user_id=? AND month=?").bind(user.id, monthKey()).all<{ kind: string; count: number }>();
    return json({ rooms: rows.results, usage: Object.fromEntries(counts.results.map(row => [row.kind, row.count])), limits });
  }

  if (path === "/api/rooms" && request.method === "POST") {
    const body = await bodyObject(request);
    const site = canonicalSite(body?.url);
    if (!site) return error("Enter a public http or https website URL.");
    if (body?.private === true && subscription.plan !== "partner") return error("Private rooms are available on Partner only.", 403);
    const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM rooms WHERE owner_id=?").bind(user.id).first<{ count: number }>();
    if ((count?.count || 0) >= limits.rooms) return error("Your plan's website limit is full.", 409);
    const duplicate = await env.DB.prepare("SELECT 1 FROM rooms WHERE owner_id=? AND root_domain=?").bind(user.id, site.domain).first();
    if (duplicate) return error("You already have a room for this website. Delete it before adding this URL again.", 409);
    if (!searchConfigured(env)) return error("Web search is not configured yet.", 503);
    let hits;
    try { hits = await searchWeb(`${site.domain} products services competitors`, env); }
    catch { return error("Search is temporarily unavailable. No room was created.", 503); }
    const selected = Array.isArray(body?.competitors) ? body.competitors : [];
    const selectedDomains = Array.from(new Set(selected.map(value => canonicalSite(value)?.domain).filter((value): value is string => !!value && value !== site.domain))).slice(0, limits.competitors);
    const titleHit = hits.find(hit => canonicalSite(hit.url)?.domain === site.domain);
    const displayName = titleHit?.title.slice(0, 80) || site.domain;
    const now = Date.now();
    const room: RoomRow = { id: crypto.randomUUID(), owner_id: user.id, root_domain: site.domain, submitted_url: site.url, display_name: displayName, category: categoryFor(`${displayName} ${hits.map(hit => hit.title).join(" ")}`), is_private: body?.private === true ? 1 : 0, created_at: now, last_checked_at: null, last_review_at: null, last_competitor_checked_at: null };
    try {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO rooms (id,owner_id,root_domain,submitted_url,display_name,category,is_private,created_at) VALUES (?,?,?,?,?,?,?,?)").bind(room.id, room.owner_id, room.root_domain, room.submitted_url, room.display_name, room.category, room.is_private, now),
        ...selectedDomains.map(domain => env.DB.prepare("INSERT INTO competitors(room_id,root_domain,name,created_at) VALUES (?,?,?,?)").bind(room.id, domain, domain, now)),
      ]);
    } catch { return error("This website is already in your rooms, or your plan limit was reached.", 409); }
    const review = await reviewSite(room.submitted_url, env);
    await env.DB.prepare("INSERT INTO reviews(room_id,checked_at,source_url,status,title,description,canonical,h1,robots,issues_json) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .bind(room.id, review.checkedAt, review.sourceUrl, review.status, review.title, review.description, review.canonical, review.h1, review.robots, JSON.stringify(review.issues)).run();
    await env.DB.prepare("UPDATE rooms SET last_review_at=? WHERE id=?").bind(review.checkedAt, room.id).run();
    return json({ room: await details(room, env, true), candidates: competitorCandidates(hits, site.domain, limits.competitors) }, 201);
  }

  const match = path.match(/^\/api\/rooms\/([a-f0-9-]{36})(?:\/(delete|privacy|discover|competitors|check|review|chat))?$/);
  if (!match) return error("Not found.", 404);
  const room = await ownerRoom(match[1], user.id, env);
  if (!room) return error("Room not found.", 404);
  const action = match[2];

  if (!action && request.method === "GET") return json({ room: await details(room, env, true) });
  if (action === "delete" && request.method === "POST") {
    await env.DB.prepare("DELETE FROM rooms WHERE id=? AND owner_id=?").bind(room.id, user.id).run();
    return json({ ok: true });
  }
  if (action === "privacy" && request.method === "POST") {
    if (subscription.plan !== "partner") return error("Only Partner can make rooms private.", 403);
    const body = await bodyObject(request);
    if (typeof body?.private !== "boolean") return error("Choose public or private.");
    await env.DB.prepare("UPDATE rooms SET is_private=? WHERE id=?").bind(body.private ? 1 : 0, room.id).run();
    return json({ ok: true, private: body.private });
  }
  if (action === "discover" && request.method === "GET") {
    if (!await incrementUsage(user.id, "manual_checks", limits.manualChecks, env)) return error("Your check-now allowance is used for this month.", 429);
    try { return json({ candidates: await discover(room, subscription, env) }); }
    catch { await undoUsage(user.id, "manual_checks", env); return error("Competitor discovery is temporarily unavailable. Your allowance was not used.", 503); }
  }
  if (action === "competitors" && request.method === "POST") {
    const body = await bodyObject(request);
    if (!Array.isArray(body?.domains) || body.domains.length > limits.competitors) return error(`Choose at most ${limits.competitors} competitors.`);
    const domains = body.domains.map(value => canonicalSite(value)?.domain);
    if (domains.some(value => !value || value === room.root_domain) || new Set(domains).size !== domains.length) return error("Choose distinct public competitor websites.");
    await env.DB.batch([
      env.DB.prepare("DELETE FROM competitors WHERE room_id=?").bind(room.id),
      ...domains.map(domain => env.DB.prepare("INSERT INTO competitors(room_id,root_domain,name,created_at) VALUES (?,?,?,?)").bind(room.id, domain!, domain!, Date.now())),
    ]);
    return json({ ok: true });
  }
  if (action === "check" && request.method === "POST") {
    if (!await incrementUsage(user.id, "manual_checks", limits.manualChecks, env)) return error("Your check-now allowance is used for this month.", 429);
    try { return json(await refreshRoom(room, env)); }
    catch { await undoUsage(user.id, "manual_checks", env); return error("Search is temporarily unavailable. Your check was not used.", 503); }
  }
  if (action === "review" && request.method === "POST") {
    if (!await incrementUsage(user.id, `review:${room.id}`, limits.reviewsPerMonth, env)) return error("This website's review allowance is used for this month.", 429);
    try { await saveReview(room, env); return json({ ok: true }); }
    catch { await undoUsage(user.id, `review:${room.id}`, env); return error("Review could not be completed. Your allowance was not used.", 503); }
  }
  if (action === "chat" && request.method === "POST") {
    const body = await bodyObject(request);
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 1200) return error("Write a question of up to 1,200 characters.");
    if (!await incrementUsage(user.id, "chat", limits.chats, env)) return error("Your question allowance is used for this month.", 429);
    const result = await chat(room, user.id, message, env);
    if (!result.ok) await undoUsage(user.id, "chat", env);
    return result;
  }
  return error("Not found.", 404);
}

export async function scheduledChecks(env: AppEnv): Promise<void> {
  if (!searchConfigured(env)) return;
  const now = Date.now();
  const active = await env.DB.prepare("SELECT r.* , s.plan FROM rooms r JOIN subscriptions s ON s.user_id=r.owner_id WHERE s.status IN ('active','trialing') AND s.current_period_end>? AND (r.last_checked_at IS NULL OR r.last_checked_at<=?-CASE s.plan WHEN 'solo' THEN 86400000 WHEN 'studio' THEN 43200000 ELSE 28800000 END) ORDER BY COALESCE(r.last_checked_at,0) LIMIT 5")
    .bind(Math.floor(now / 1000), now).all<RoomRow & { plan: Plan }>();
  for (const room of active.results) {
    const interval = 24 * 60 * 60_000 / PLANS[room.plan].checksPerDay;
    if (!room.last_checked_at || now - room.last_checked_at >= interval) {
      try { await refreshRoom(room, env); } catch { /* Keep the old timestamp so a later cron can retry. */ }
    }
    if (!room.last_competitor_checked_at || now - room.last_competitor_checked_at >= 7 * 24 * 60 * 60_000) {
      const competitors = await env.DB.prepare("SELECT root_domain FROM competitors WHERE room_id=?").bind(room.id).all<{ root_domain: string }>();
      if (competitors.results.length) {
        try {
          const domains = new Set(competitors.results.map(item => item.root_domain));
          const query = competitors.results.map(item => "site:" + item.root_domain).join(" OR ") + " " + room.category + " news updates";
          const hits = await searchWeb(query, env);
          for (const hit of hits) {
            const site = canonicalSite(hit.url);
            if (!site || !domains.has(site.domain)) continue;
            const hash = await fingerprint(hit);
            await env.DB.prepare("INSERT OR IGNORE INTO findings(id,room_id,fingerprint,kind,title,summary,source_url,published_at,fetched_at,pose) VALUES (?,?,?,?,?,?,?,?,?,?)")
              .bind(crypto.randomUUID(), room.id, hash, "competitor", hit.title, hit.excerpt || "Open the source for details.", hit.url, hit.publishedAt, Date.now(), 0).run();
          }
          await env.DB.prepare("UPDATE rooms SET last_competitor_checked_at=? WHERE id=?").bind(now, room.id).run();
        } catch { /* Retry on the next scheduled run. */ }
      } else {
        await env.DB.prepare("UPDATE rooms SET last_competitor_checked_at=? WHERE id=?").bind(now, room.id).run();
      }
    }
    const reviewInterval = 30 * 24 * 60 * 60_000 / PLANS[room.plan].reviewsPerMonth;
    if (!room.last_review_at || now - room.last_review_at >= reviewInterval) {
      try { await saveReview(room, env); } catch { /* Retry on the next scheduled run. */ }
    }
  }
}
