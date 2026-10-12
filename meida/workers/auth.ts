import type { AppEnv, UserRow } from "./types";
import { bodyObject, error, json } from "./types";

const enc = new TextEncoder();
const COOKIE = "meida_session";
const LIFETIME = 28 * 24 * 60 * 60;
const ROUNDS = 210_000;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2) throw new Error("Invalid secret format");
  return Uint8Array.from(hex.match(/.{2}/g)!, part => parseInt(part, 16));
}

function validJwtSecret(secret: string | undefined): secret is string {
  return typeof secret === "string" && /^[0-9a-f]{64}$/i.test(secret);
}

function ownedBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decode64(text: string): string {
  const standard = text.replace(/-/g, "+").replace(/_/g, "/");
  return atob(standard + "=".repeat((4 - standard.length % 4) % 4));
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i++) result |= left[i] ^ right[i];
  return result === 0;
}

async function sign(text: string, secret: string): Promise<Uint8Array> {
  if (!validJwtSecret(secret)) throw new Error("JWT secret must be 32-byte hex");
  const key = await crypto.subtle.importKey("raw", ownedBuffer(hexToBytes(secret)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(text)));
}

async function passwordHash(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: ownedBuffer(salt), iterations: ROUNDS, hash: "SHA-256" }, key, 256);
  return bytesToHex(new Uint8Array(hash));
}

export function validUsername(username: unknown): username is string {
  return typeof username === "string" && /^[a-z][a-z0-9_]{2,19}$/.test(username);
}

export function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 7 && password.length <= 18 && /[a-z]/i.test(password) && /\d/.test(password);
}

async function issueToken(user: UserRow, secret: string): Promise<string> {
  const header = base64Url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = base64Url(enc.encode(JSON.stringify({ sub: user.id, ver: user.session_version, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + LIFETIME })));
  const unsigned = `${header}.${payload}`;
  return `${unsigned}.${base64Url(await sign(unsigned, secret))}`;
}

export async function currentUser(request: Request, env: AppEnv): Promise<UserRow | null> {
  const token = request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token || !validJwtSecret(env.MEIDA_JWT_SECRET)) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(decode64(parts[0])) as { alg?: string };
    if (header.alg !== "HS256") return null;
    const expected = await sign(`${parts[0]}.${parts[1]}`, env.MEIDA_JWT_SECRET);
    const provided = Uint8Array.from(decode64(parts[2]), char => char.charCodeAt(0));
    if (!equalBytes(expected, provided)) return null;
    const payload = JSON.parse(decode64(parts[1])) as { sub?: string; ver?: number; exp?: number };
    if (!payload.sub || !payload.exp || payload.exp <= Date.now() / 1000) return null;
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(payload.sub).first<UserRow>();
    return user && user.session_version === payload.ver ? user : null;
  } catch {
    return null;
  }
}

function sessionCookie(token: string): string {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${LIFETIME}`;
}

export async function handleAuth(request: Request, path: string, env: AppEnv): Promise<Response> {
  if (path === "/api/auth/check-username" && request.method === "GET") {
    const username = new URL(request.url).searchParams.get("username")?.toLowerCase();
    if (!validUsername(username)) return json({ valid: false, available: false });
    const found = await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(username).first();
    return json({ valid: true, available: !found });
  }

  if (path === "/api/auth/me" && request.method === "GET") {
    const user = await currentUser(request, env);
    return json({ user: user ? { id: user.id, username: user.username } : null });
  }

  if (path === "/api/auth/signup" && request.method === "POST") {
    if (!validJwtSecret(env.MEIDA_JWT_SECRET)) return error("Authentication is not configured.", 503);
    const body = await bodyObject(request);
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : null;
    const password = body?.password;
    if (!validUsername(username)) return error("Use 3–20 lowercase letters, numbers or underscores; start with a letter.");
    if (!validPassword(password)) return error("Use 7–18 characters with at least one letter and one number.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const user: UserRow = { id: crypto.randomUUID(), username, password_hash: "", password_salt: bytesToHex(salt), session_version: 0, password_changed_at: null, password_changes_24h: 0, created_at: Date.now() };
    let stage = "password_hash";
    try {
      user.password_hash = await passwordHash(password, salt);
      stage = "session_signing";
      const token = await issueToken(user, env.MEIDA_JWT_SECRET);
      stage = "database_insert";
      await env.DB.prepare("INSERT INTO users (id, username, password_hash, password_salt, created_at) VALUES (?,?,?,?,?)")
        .bind(user.id, user.username, user.password_hash, user.password_salt, user.created_at).run();
      return json({ user: { id: user.id, username: user.username } }, 201, { "set-cookie": sessionCookie(token) });
    } catch {
      console.error("meida_signup_failed", { stage });
      let collision = null;
      if (stage === "database_insert") {
        try { collision = await env.DB.prepare("SELECT 1 FROM users WHERE username=?").bind(user.username).first(); } catch { /* Keep the response generic if D1 is unavailable. */ }
      }
      return collision ? error("That username is already taken.", 409) : error("Your account could not be created. Please try again.", 503);
    }
  }

  if (path === "/api/auth/signin" && request.method === "POST") {
    if (!validJwtSecret(env.MEIDA_JWT_SECRET)) return error("Authentication is not configured.", 503);
    const body = await bodyObject(request);
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
    const key = `signin:${username}:${request.headers.get("cf-connecting-ip") || "unknown"}`;
    const now = Date.now();
    const attempt = await env.DB.prepare("SELECT attempts, window_start FROM auth_attempts WHERE key = ?").bind(key).first<{ attempts: number; window_start: number }>();
    if (attempt && now - attempt.window_start < 15 * 60_000 && attempt.attempts >= 8) return error("Too many attempts. Try again in 15 minutes.", 429);
    const user = validUsername(username) ? await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first<UserRow>() : null;
    const candidate = typeof body?.password === "string" ? body.password : "";
    const match = user && candidate ? equalBytes(hexToBytes(await passwordHash(candidate, hexToBytes(user.password_salt))), hexToBytes(user.password_hash)) : false;
    if (!match || !user) {
      await env.DB.prepare("INSERT INTO auth_attempts (key,attempts,window_start) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN ? - window_start > 900000 THEN 1 ELSE attempts + 1 END, window_start = CASE WHEN ? - window_start > 900000 THEN ? ELSE window_start END")
        .bind(key, 1, now, now, now, now).run();
      return error("Username or password is incorrect.", 401);
    }
    await env.DB.prepare("DELETE FROM auth_attempts WHERE key = ?").bind(key).run();
    return json({ user: { id: user.id, username: user.username } }, 200, { "set-cookie": sessionCookie(await issueToken(user, env.MEIDA_JWT_SECRET)) });
  }

  if (path === "/api/auth/signout" && request.method === "POST") {
    const user = await currentUser(request, env);
    if (user) await env.DB.prepare("UPDATE users SET session_version = session_version + 1 WHERE id = ?").bind(user.id).run();
    return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
  }

  if (path === "/api/auth/password" && request.method === "POST") {
    const user = await currentUser(request, env);
    if (!user) return error("Sign in required.", 401);
    const body = await bodyObject(request);
    if (typeof body?.currentPassword !== "string" || !equalBytes(hexToBytes(await passwordHash(body.currentPassword, hexToBytes(user.password_salt))), hexToBytes(user.password_hash))) return error("Current password is incorrect.", 403);
    if (!validPassword(body.newPassword)) return error("Use 7–18 characters with at least one letter and one number.");
    const now = Date.now();
    if (user.password_changed_at && now - user.password_changed_at < 24 * 60 * 60_000 && user.password_changes_24h >= 4) return error("Password can be changed at most four times in 24 hours.", 429);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await passwordHash(body.newPassword, salt);
    const count = user.password_changed_at && now - user.password_changed_at < 24 * 60 * 60_000 ? user.password_changes_24h + 1 : 1;
    const updated = await env.DB.prepare("UPDATE users SET password_hash=?, password_salt=?, password_changed_at=?, password_changes_24h=?, session_version=session_version+1 WHERE id=? AND session_version=? AND (password_changed_at IS NULL OR password_changed_at<=? OR password_changes_24h<4)")
      .bind(hash, bytesToHex(salt), now, count, user.id, user.session_version, now - 24 * 60 * 60_000).run();
    if (!updated.meta.changes) return error("Your session changed or the 24-hour password-change limit was reached. Sign in again and retry later.", 429);
    return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
  }

  return error("Not found.", 404);
}
