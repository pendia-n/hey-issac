export type Plan = "solo" | "studio" | "partner";

export interface AppEnv {
  DB: D1Database;
  ASSETS: R2Bucket;
  MEIDA_JWT_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_SOLO?: string;
  STRIPE_PRICE_STUDIO?: string;
  STRIPE_PRICE_PARTNER?: string;
  TAVILY_API_KEY_1?: string;
  TAVILY_API_KEY_2?: string;
  TAVILY_API_KEY_3?: string;
  EXA_API_KEY_1?: string;
  EXA_API_KEY_2?: string;
  EXA_API_KEY_3?: string;
  FIRECRAWL_API_KEY_1?: string;
  FIRECRAWL_API_KEY_2?: string;
  FIRECRAWL_API_KEY_3?: string;
}

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  password_salt: string;
  session_version: number;
  password_changed_at: number | null;
  password_changes_24h: number;
  created_at: number;
}

export interface SubscriptionRow {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: Plan;
  status: string;
  current_period_end: number;
  cancel_at_period_end: number;
  first_paid_at: number | null;
  first_payment_intent: string | null;
  first_payment_amount: number | null;
  first_payment_currency: string | null;
  first_refund_id: string | null;
}

export interface RoomRow {
  id: string;
  owner_id: string;
  root_domain: string;
  submitted_url: string;
  display_name: string;
  category: string;
  is_private: number;
  created_at: number;
  last_checked_at: number | null;
  last_review_at: number | null;
  last_competitor_checked_at: number | null;
}

export const PLANS = {
  solo: { name: "Solo", price: 19, rooms: 1, checksPerDay: 1, competitors: 3, chats: 30, manualChecks: 2, reviewsPerMonth: 1 },
  studio: { name: "Studio", price: 49, rooms: 3, checksPerDay: 2, competitors: 5, chats: 150, manualChecks: 6, reviewsPerMonth: 1 },
  partner: { name: "Partner", price: 129, rooms: 8, checksPerDay: 3, competitors: 8, chats: 400, manualChecks: 20, reviewsPerMonth: 2 },
} as const;

export function isPlan(value: unknown): value is Plan {
  return value === "solo" || value === "studio" || value === "partner";
}

export function json(value: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export async function bodyObject(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return null;
  if (Number(request.headers.get("content-length") || 0) > 20_000) return null;
  try {
    const value: unknown = await request.json();
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return origin === new URL(request.url).origin;
  return !request.headers.get("sec-fetch-site");
}

export function monthKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 7);
}
