import type { AppEnv, Plan, RoomRow } from "./types";
import { newYorkClock } from "./new-york";
import { discover, saveReview, updateProfile } from "./rooms";
import { fingerprint, refreshRoom, searchWeb } from "./search";

export function marketSearchSlot(plan: Plan, weekday: number, hour: number): boolean {
  if (plan === "solo") return weekday <= 5 && hour === 13;
  if (plan === "studio") return weekday <= 5 && (hour === 9 || hour === 13);
  return weekday <= 4 ? hour === 9 || hour === 13 || hour === 21 : weekday === 5 && (hour === 9 || hour === 13 || hour === 15);
}
export function competitorDay(domain: string): number {
  return [...domain].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 6;
}
interface Job { id: string; room_id: string; kind: string; subject: string; attempts: number }
async function enqueue(env: AppEnv, room: RoomRow, kind: string, subject: string, slot: string, due: number): Promise<void> {
  await env.DB.prepare("INSERT OR IGNORE INTO research_jobs(id,room_id,kind,subject,slot,due_at) VALUES (?,?,?,?,?,?)")
    .bind([room.id, kind, subject, slot].join(":"), room.id, kind, subject, slot, due).run();
}
async function competitorNews(room: RoomRow, domain: string, plan: Plan, env: AppEnv): Promise<void> {
  const competitor = await env.DB.prepare("SELECT name FROM competitors WHERE room_id=? AND root_domain=?").bind(room.id, domain).first<{ name: string }>();
  if (!competitor) return;
  await env.DB.prepare("UPDATE rooms SET search_started_at=? WHERE id=?").bind(Date.now(), room.id).run();
  try {
    const hits = await searchWeb('"' + competitor.name + '" ' + domain + " product launches partnerships funding market news", env, plan, "news");
    for (const hit of hits) {
      await env.DB.prepare("INSERT OR IGNORE INTO findings(id,room_id,fingerprint,kind,title,summary,source_url,published_at,fetched_at,pose,provider,subject_domain) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), room.id, await fingerprint(hit), "competitor", hit.title, hit.excerpt, hit.url, hit.publishedAt, Date.now(), 0, hit.provider, domain).run();
    }
    await env.DB.prepare("UPDATE competitors SET last_checked_at=? WHERE room_id=? AND root_domain=?").bind(Date.now(), room.id, domain).run();
  } finally {
    await env.DB.prepare("UPDATE rooms SET search_finished_at=? WHERE id=?").bind(Date.now(), room.id).run();
  }
}

export async function scheduledChecks(env: AppEnv, scheduledAt = Date.now()): Promise<void> {
  const now = Date.now();
  const cursor = await env.DB.prepare("SELECT enqueued_through FROM research_scheduler WHERE id=1").first<{ enqueued_through: number }>();
  const earliest = Math.max(cursor?.enqueued_through ?? scheduledAt, scheduledAt - 48 * 3600_000);
  const active = await env.DB.prepare("SELECT r.*,s.plan FROM rooms r JOIN subscriptions s ON s.user_id=r.owner_id WHERE s.status IN ('active','trialing') AND s.current_period_end>?")
    .bind(Math.floor(now / 1000)).all<RoomRow & { plan: Plan }>();
  // Keep the existing hourly trigger. Persist jobs and recover missed slots for 48 hours.
  for (const room of active.results) {
    const competitors = await env.DB.prepare("SELECT root_domain FROM competitors WHERE room_id=?").bind(room.id).all<{ root_domain: string }>();
    for (let offset = 0; offset < 48; offset++) {
      const due = Math.floor(scheduledAt / 3600_000) * 3600_000 - offset * 3600_000;
      if (due < room.created_at || due < earliest) continue;
      const clock = newYorkClock(due);
      const slot = clock.date + ":" + clock.hour;
      if (marketSearchSlot(room.plan, clock.weekday, clock.hour)) await enqueue(env, room, "market", "", slot, due);
      if (clock.hour === 14) for (const item of competitors.results) {
        if (competitorDay(item.root_domain) === clock.weekday) await enqueue(env, room, "competitor", item.root_domain, slot, due);
      }
      if (clock.hour === 21 && (room.plan === "partner" ? clock.day === 11 || clock.day === 22 : clock.day === 19)) await enqueue(env, room, "review", "", slot, due);
    }
    if (env.AUTOMATIC_RESEARCH === "true") {
      const clock = newYorkClock(scheduledAt);
      const monthly = clock.monthKey;
      if (!room.profile_checked_at || now - room.profile_checked_at > 30 * 86400_000) await enqueue(env, room, "profile", "", monthly, now);
      if (!room.discovery_checked_at || now - room.discovery_checked_at > 90 * 86400_000) await enqueue(env, room, "discovery", "", monthly, now);
    }
  }
  await env.DB.prepare("UPDATE research_scheduler SET enqueued_through=MAX(enqueued_through,?) WHERE id=1").bind(Math.floor(scheduledAt / 3600_000) * 3600_000).run();
  const jobs = await env.DB.prepare("SELECT id,room_id,kind,subject,attempts FROM research_jobs WHERE completed_at IS NULL AND due_at<=? AND lease_until<=? AND attempts<3 ORDER BY due_at LIMIT 15")
    .bind(now, now).all<Job>();
  for (let start = 0; start < jobs.results.length; start += 3) {
    await Promise.allSettled(jobs.results.slice(start, start + 3).map(async job => {
      const claimed = await env.DB.prepare("UPDATE research_jobs SET lease_until=?,attempts=attempts+1 WHERE id=? AND completed_at IS NULL AND lease_until<=?")
        .bind(Date.now() + 300_000, job.id, Date.now()).run();
      if (!claimed.meta.changes) return;
      try {
        const room = active.results.find(item => item.id === job.room_id);
        if (room) {
          if (job.kind === "market") await refreshRoom(room, env, room.plan);
          if (job.kind === "competitor") await competitorNews(room, job.subject, room.plan, env);
          if (job.kind === "review") await saveReview(room, env, undefined, true);
          if (env.AUTOMATIC_RESEARCH === "true" && job.kind === "profile") await updateProfile(room, env, room.plan);
          if (env.AUTOMATIC_RESEARCH === "true" && job.kind === "discovery") await discover(room, { plan: room.plan }, env);
        }
        await env.DB.prepare("UPDATE research_jobs SET completed_at=?,lease_until=0 WHERE id=?").bind(Date.now(), job.id).run();
      } catch {
        await env.DB.prepare("UPDATE research_jobs SET lease_until=? WHERE id=?").bind(Date.now() + 3600_000, job.id).run();
      }
    }));
  }
  await env.DB.prepare("DELETE FROM research_jobs WHERE completed_at<?").bind(now - 90 * 86400_000).run();
}
