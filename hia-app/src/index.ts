/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { generateTotpSecret, hashPassword, normalizeSecurityAnswer, readSession, readSignedToken, randomId, SESSION_SECONDS, sessionCookie, signJwt, expiredCookie, validPasscode, validPassword, validRecoveryEmail, verifyPassword, verifyTotp } from './auth';

interface AppEnv {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
	DB: D1Database;
	JWT_SECRET: string;
	OPENROUTER_API_KEY?: string;
	OPENROUTER_MODEL?: string;
	STRIPE_SECRET_KEY?: string;
	STRIPE_WEBHOOK_SECRET?: string;
	SEARCH_PROVIDER?: string;
	TAVILY_API_KEY?: string;
	BRAVE_SEARCH_API_KEY?: string;
	FIRECRAWL_API_KEY?: string;
}

const app = new Hono<{ Bindings: AppEnv }>();
app.use('*', async (c, next) => { await next(); c.header('X-Content-Type-Options', 'nosniff'); c.header('Referrer-Policy', 'strict-origin-when-cross-origin'); c.header('X-Frame-Options', 'DENY'); c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); });
app.get('/api/health', (c) => c.json({ ok: true, service: 'heyIssac' }));
const apiError = (c: any, message: string, status = 400) => c.json({ error: message }, status);
const securityQuestions = [
	{ key: 'first_school', question: 'What was the name of your first school?' },
	{ key: 'childhood_street', question: 'What street did you grow up on?' },
	{ key: 'first_manager_teacher', question: 'What was the name of your first manager or teacher?' },
	{ key: 'first_pet', question: 'What was the name of your first pet?' },
	{ key: 'parents_met_city', question: 'What city did your parents meet in?' },
	{ key: 'first_live_event', question: 'What was the first concert or live event you attended?' },
	{ key: 'childhood_friend', question: 'What was the name of your childhood best friend?' },
	{ key: 'first_phone', question: 'What was the model of your first phone?' },
	{ key: 'childhood_place', question: 'What was your favorite place to visit as a child?' },
	{ key: 'first_dish', question: 'What was the first dish you learned to cook?' },
	{ key: 'first_company', question: 'What was the name of the first company you worked for?' },
	{ key: 'family_nickname', question: 'What nickname did your family use for you?' },
	{ key: 'first_book', question: 'What was the first book you remember loving?' },
	{ key: 'childhood_game', question: 'What was the name of your favorite childhood game?' },
	{ key: 'first_username', question: 'What was the first username or screen name you used?' },
];
type SecurityAnswer = { questionKey?: string; answer?: string };
const validQuestionKeys = new Set(securityQuestions.map((item) => item.key));
const MODEL_CATALOG = {
	starter: { default: 'qwen/qwen3.8-flash', push: ['stepfun/step-3.5-flash', 'writer/palmyra-x5', 'arcee-ai/trinity-large-thinking'], max: 'minimax/minimax-m3:batch' },
	studio: { default: 'moonshotai/kimi-k2.7-code', push: ['google/gemini-3.8-flash', 'thinkingmachines/inkling-small'], max: 'anthropic/claude-sonnet-5:batch' },
	partner: { default: 'mistralai/mistral-medium-3-5', push: ['openai/gpt-6-astra'], max: 'openai/gpt-6-astra-pro' },
} as const;
type Tier = keyof typeof MODEL_CATALOG;
type Addon = 'default' | 'push' | 'max';
const tierNames = new Set<Tier>(['starter', 'studio', 'partner']);
const addonNames = new Set<Addon>(['default', 'push', 'max']);
const providerName = (env: AppEnv) => env.SEARCH_PROVIDER?.toLowerCase() || (env.TAVILY_API_KEY ? 'tavily' : env.BRAVE_SEARCH_API_KEY ? 'brave' : 'none');
const jsonText = (value: unknown) => JSON.stringify(value ?? {});
const centsFromUsd = (value: number) => Math.max(0, Math.ceil(value * 100));
const getWorkspaceForUser = (db: D1Database, userId: string) => db.prepare('SELECT workspace_id FROM workspace_members WHERE user_id = ? ORDER BY workspace_id LIMIT 1').bind(userId).first<{ workspace_id: string }>();
const validHttpUrl = (value: string) => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; } };
async function sha256(value: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map((byte) => byte.toString(16).padStart(2, '0')).join(''); }
function modelFor(tier: Tier, addon: Addon) { const selected = MODEL_CATALOG[tier][addon]; return Array.isArray(selected) ? selected[0] : selected; }
function safeSearchResult(value: any) { return { title: String(value.title ?? value.name ?? '').slice(0, 300), url: String(value.url ?? value.link ?? ''), excerpt: String(value.content ?? value.description ?? value.snippet ?? '').slice(0, 1200) }; }
async function searchWeb(env: AppEnv, query: string) {
	const provider = providerName(env);
	if (provider === 'tavily' && env.TAVILY_API_KEY) {
		const response = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_key: env.TAVILY_API_KEY, query, max_results: 5, include_answer: false }) });
		if (!response.ok) throw new Error(`search_${response.status}`);
		const body = await response.json() as any;
		return { provider, results: (body.results ?? []).map(safeSearchResult).filter((item: any) => validHttpUrl(item.url)) };
	}
	if (provider === 'brave' && env.BRAVE_SEARCH_API_KEY) {
		const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, { headers: { Accept: 'application/json', 'X-Subscription-Token': env.BRAVE_SEARCH_API_KEY } });
		if (!response.ok) throw new Error(`search_${response.status}`);
		const body = await response.json() as any;
		return { provider, results: (body.web?.results ?? []).map(safeSearchResult).filter((item: any) => validHttpUrl(item.url)) };
	}
	return { provider: 'none', results: [] };
}
async function crawlUrl(env: AppEnv, url: string) {
	if (!env.FIRECRAWL_API_KEY) return { provider: 'none', title: '', excerpt: '', markdown: '' };
	const response = await fetch('https://api.firecrawl.dev/v1/scrape', { method: 'POST', headers: { Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }) });
	if (!response.ok) throw new Error(`crawl_${response.status}`);
	const body = await response.json() as any;
	return { provider: 'firecrawl', title: String(body.data?.metadata?.title ?? '').slice(0, 300), excerpt: String(body.data?.markdown ?? '').slice(0, 2400), markdown: String(body.data?.markdown ?? '').slice(0, 12000) };
}
async function callOpenRouter(env: AppEnv, model: string, messages: { role: string; content: string }[]) {
	if (!env.OPENROUTER_API_KEY) throw new Error('openrouter_not_configured');
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://hey-issac.pendia-community.workers.dev', 'X-Title': 'heyIssac' }, body: JSON.stringify({ model, messages, temperature: 0.2 }) });
	const body = await response.json() as any;
	if (!response.ok) throw new Error(`openrouter_${response.status}`);
	return { id: String(body.id ?? ''), requestId: response.headers.get('x-request-id') ?? '', text: String(body.choices?.[0]?.message?.content ?? ''), cost: Number(body.usage?.cost ?? 0), inputTokens: Number(body.usage?.prompt_tokens ?? 0), outputTokens: Number(body.usage?.completion_tokens ?? 0) };
}
const getUserByUsername = (db: D1Database, username: string) => db.prepare('SELECT id, username, password_hash, role, recovery_email, totp_secret, passcode_hash FROM users WHERE username = ?').bind(username).first<{ id: string; username: string; password_hash: string; role: string; recovery_email?: string | null; totp_secret?: string | null; passcode_hash?: string | null }>();
const getSession = async (c: any) => {
	const session = await readSession(c.req.raw, c.env.JWT_SECRET);
	return session;
};
async function applyRecoverySetup(db: D1Database, userId: string, body: { recoveryEmail?: string; passcode?: string; securityAnswers?: SecurityAnswer[]; totpSecret?: string; totpCode?: string }) {
	const updates: string[] = [];
	const bindings: unknown[] = [];
	if (body.recoveryEmail !== undefined) {
		const email = body.recoveryEmail.trim().toLowerCase();
		if (email && !validRecoveryEmail(email)) throw new Error('email');
		updates.push('recovery_email = ?');
		bindings.push(email || null);
	}
	if (body.passcode !== undefined) {
		const passcode = body.passcode.trim();
		if (passcode && !validPasscode(passcode)) throw new Error('passcode');
		updates.push('passcode_hash = ?');
		bindings.push(passcode ? await hashPassword(passcode) : null);
	}
	if (body.totpSecret !== undefined || body.totpCode !== undefined) {
		const secret = body.totpSecret?.trim().replace(/\s+/g, '').toUpperCase() ?? '';
		const code = body.totpCode?.trim() ?? '';
		if (secret && !(await verifyTotp(secret, code))) throw new Error('totp');
		updates.push('totp_secret = ?');
		bindings.push(secret || null);
	}
	if (updates.length) await db.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`).bind(...bindings, new Date().toISOString(), userId).run();
	if (body.securityAnswers !== undefined) {
		const answers = body.securityAnswers.filter((item) => item.questionKey || item.answer);
		const keys = answers.map((item) => item.questionKey);
		const normalized = answers.map((item) => normalizeSecurityAnswer(item.answer ?? ''));
		if (answers.length && (answers.length < 2 || answers.length > 3 || new Set(keys).size !== answers.length || new Set(normalized).size !== answers.length || answers.some((item) => !item.questionKey || !validQuestionKeys.has(item.questionKey) || !normalizeSecurityAnswer(item.answer ?? '')))) throw new Error('security_answers');
		await db.prepare('DELETE FROM security_answers WHERE user_id = ?').bind(userId).run();
		for (const item of answers) await db.prepare('INSERT INTO security_answers (user_id, question_key, answer_hash, created_at) VALUES (?, ?, ?, ?)').bind(userId, item.questionKey, await hashPassword(normalizeSecurityAnswer(item.answer ?? '')), new Date().toISOString()).run();
	}
}
app.get('/api/auth/me', async (c) => {
	const session = await readSession(c.req.raw, c.env.JWT_SECRET);
	return session ? c.json({ user: { id: session.sub, username: session.username, role: session.role } }) : apiError(c, 'Sign in required', 401);
});
app.get('/api/auth/username-availability', async (c) => {
	const username = c.req.query('username')?.trim().toLowerCase() ?? '';
	if (!/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(username)) return c.json({ username, valid: false, available: false });
	const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
	return c.json({ username, valid: true, available: !existing });
});
app.get('/api/auth/security-questions', (c) => c.json({ questions: securityQuestions }));
app.get('/api/auth/totp/setup-preview', (c) => {
	const secret = generateTotpSecret();
	const issuer = 'heyIssac';
	const label = `${issuer}:new-account`;
	return c.json({ secret, otpauth: `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30` });
});
app.post('/api/auth/register', async (c) => {
	try {
		const body = await c.req.json<{ username?: string; password?: string; recoveryEmail?: string; passcode?: string; securityAnswers?: SecurityAnswer[]; totpSecret?: string; totpCode?: string }>();
		const username = body.username?.trim().toLowerCase();
		const password = body.password ?? '';
		if (!username || !/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(username) || !validPassword(password)) return apiError(c, 'Use a valid username and a password with 7–18 characters, including one letter and one digit.');
		const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
		if (existing) return apiError(c, 'Unable to create this account.', 409);
		const id = randomId();
		const workspaceId = randomId();
		const now = new Date().toISOString();
		const encodedPassword = await hashPassword(password);
		await c.env.DB.prepare('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, username, encodedPassword, 'owner', now).run();
		await c.env.DB.prepare('INSERT INTO workspaces (id, owner_user_id, name, plan, created_at) VALUES (?, ?, ?, ?, ?)').bind(workspaceId, id, 'My workspace', 'free', now).run();
		await c.env.DB.prepare('INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)').bind(workspaceId, id, 'owner').run();
		await c.env.DB.prepare('INSERT INTO wallets (workspace_id, balance_cents, updated_at) VALUES (?, 0, ?)').bind(workspaceId, now).run();
		await applyRecoverySetup(c.env.DB, id, body);
		const current = Math.floor(Date.now() / 1000);
		const token = await signJwt({ sub: id, username, role: 'owner', iat: current, exp: current + SESSION_SECONDS }, c.env.JWT_SECRET);
		return new Response(JSON.stringify({ user: { id, username, role: 'owner' } }), { status: 201, headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie(token) } });
	} catch (cause) {
		console.error('registration_failed', cause instanceof Error ? cause.message : 'unknown_error');
		return apiError(c, 'Unable to create your account right now.', 500);
	}
});

app.post('/api/auth/login', async (c) => {
	const body = await c.req.json<{ username?: string; password?: string }>();
	const username = body.username?.trim().toLowerCase();
	const row = username ? await c.env.DB.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').bind(username).first<{ id: string; username: string; password_hash: string; role: string }>() : null;
	if (!row || !(await verifyPassword(body.password ?? '', row.password_hash))) return apiError(c, 'Username or password is not correct.', 401);
	const current = Math.floor(Date.now() / 1000);
	const token = await signJwt({ sub: row.id, username: row.username, role: row.role, iat: current, exp: current + SESSION_SECONDS }, c.env.JWT_SECRET);
	return new Response(JSON.stringify({ user: { id: row.id, username: row.username, role: row.role } }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie(token) } });
});

app.post('/api/auth/logout', (c) => new Response(null, { status: 204, headers: { 'Set-Cookie': expiredCookie } }));
app.get('/api/auth/recovery-status', async (c) => {
	const username = c.req.query('username')?.trim().toLowerCase() ?? '';
	if (!username) return apiError(c, 'Username is required.');
	const row = await getUserByUsername(c.env.DB, username);
	const answers = row ? await c.env.DB.prepare('SELECT question_key FROM security_answers WHERE user_id = ? ORDER BY question_key').bind(row.id).all<{ question_key: string }>() : { results: [] };
	return c.json({ username, canRecover: !!row && (!!row.recovery_email || !!row.totp_secret || !!row.passcode_hash || answers.results.length >= 2), methods: row ? { email: !!row.recovery_email, totp: !!row.totp_secret, passcode: !!row.passcode_hash, securityQuestions: answers.results.map((item) => item.question_key) } : { email: false, totp: false, passcode: false, securityQuestions: [] } });
});
app.post('/api/auth/recovery/verify', async (c) => {
	const body = await c.req.json<{ username?: string; method?: string; email?: string; code?: string; passcode?: string; securityAnswers?: SecurityAnswer[] }>();
	const username = body.username?.trim().toLowerCase() ?? '';
	const row = username ? await getUserByUsername(c.env.DB, username) : null;
	if (!row) return apiError(c, 'Recovery could not be verified.', 401);
	let verified = false;
	if (body.method === 'email' && row.recovery_email) verified = body.email?.trim().toLowerCase() === row.recovery_email;
	if (body.method === 'totp' && row.totp_secret) verified = await verifyTotp(row.totp_secret, body.code ?? '');
	if (body.method === 'passcode' && row.passcode_hash) verified = await verifyPassword(body.passcode ?? '', row.passcode_hash);
	if (body.method === 'securityQuestions') {
		const stored = await c.env.DB.prepare('SELECT question_key, answer_hash FROM security_answers WHERE user_id = ?').bind(row.id).all<{ question_key: string; answer_hash: string }>();
		const submitted = new Map((body.securityAnswers ?? []).map((item) => [item.questionKey, normalizeSecurityAnswer(item.answer ?? '')]));
		verified = stored.results.length >= 2 && stored.results.every((item) => submitted.has(item.question_key)) && (await Promise.all(stored.results.map((item) => verifyPassword(submitted.get(item.question_key) ?? '', item.answer_hash)))).every(Boolean);
	}
	if (!verified) return apiError(c, 'Recovery could not be verified.', 401);
	const current = Math.floor(Date.now() / 1000);
	const resetToken = await signJwt({ sub: row.id, username: row.username, role: row.role, iat: current, exp: current + 600, purpose: 'password_reset' }, c.env.JWT_SECRET);
	return c.json({ resetToken });
});
app.post('/api/auth/password-reset', async (c) => {
	const body = await c.req.json<{ resetToken?: string; password?: string }>();
	const claims = body.resetToken ? await readSignedToken(body.resetToken, c.env.JWT_SECRET, 'password_reset') : null;
	if (!claims) return apiError(c, 'Reset link expired. Start recovery again.', 401);
	if (!validPassword(body.password ?? '')) return apiError(c, 'Use 7–18 characters with one letter and one digit.');
	await c.env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').bind(await hashPassword(body.password ?? ''), new Date().toISOString(), claims.sub).run();
	return c.json({ ok: true });
});
app.post('/api/auth/password-change', async (c) => {
	const session = await getSession(c);
	if (!session) return apiError(c, 'Sign in required', 401);
	const body = await c.req.json<{ password?: string }>();
	if (!validPassword(body.password ?? '')) return apiError(c, 'Use 7–18 characters with one letter and one digit.');
	await c.env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').bind(await hashPassword(body.password ?? ''), new Date().toISOString(), session.sub).run();
	return c.json({ ok: true });
});
app.post('/api/auth/security/setup', async (c) => {
	const session = await getSession(c);
	if (!session) return apiError(c, 'Sign in required', 401);
	try {
		await applyRecoverySetup(c.env.DB, session.sub, await c.req.json());
		return c.json({ ok: true });
	} catch {
		return apiError(c, 'Check your recovery details and try again.');
	}
});
app.get('/api/catalog', (c) => c.json({ plans: { starter: { label: 'Starter', default: MODEL_CATALOG.starter.default, push: MODEL_CATALOG.starter.push, max: MODEL_CATALOG.starter.max }, studio: { label: 'Studio', default: MODEL_CATALOG.studio.default, push: MODEL_CATALOG.studio.push, max: MODEL_CATALOG.studio.max }, partner: { label: 'Partner', default: MODEL_CATALOG.partner.default, push: MODEL_CATALOG.partner.push, max: MODEL_CATALOG.partner.max } }, addons: { push: 'Usage-priced model upgrade', max: 'Usage-priced highest-capability upgrade' }, topUpMinimumCents: 300 }));
app.get('/api/billing', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const wallet = await c.env.DB.prepare('SELECT balance_cents, updated_at FROM wallets WHERE workspace_id = ?').bind(workspace.workspace_id).first<{ balance_cents: number; updated_at: string }>();
	const recent = await c.env.DB.prepare('SELECT kind, amount_cents, balance_after_cents, created_at FROM wallet_transactions WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 20').bind(workspace.workspace_id).all();
	return c.json({ workspaceId: workspace.workspace_id, balanceCents: wallet?.balance_cents ?? 0, transactions: recent.results ?? [] });
});
app.post('/api/billing/top-up', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const body = await c.req.json<{ amountCents?: number }>(); const amount = Math.floor(Number(body.amountCents ?? 0));
	if (!Number.isFinite(amount) || amount < 300 || amount > 100000) return apiError(c, 'Top-up must be between $3 and $1,000.');
	if (!c.env.STRIPE_SECRET_KEY) return apiError(c, 'Payments are not configured yet.', 503);
	const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const params = new URLSearchParams({ mode: 'payment', success_url: 'https://hey-issac.pendia-community.workers.dev/?topup=success', cancel_url: 'https://hey-issac.pendia-community.workers.dev/?topup=cancelled', 'line_items[0][price_data][currency]': 'usd', 'line_items[0][price_data][product_data][name]': 'heyIssac usage balance', 'line_items[0][price_data][unit_amount]': String(amount), 'line_items[0][quantity]': '1', 'metadata[workspace_id]': workspace.workspace_id, 'metadata[amount_cents]': String(amount), integration_identifier: `heyissac_${randomId().slice(0, 8)}` });
	const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params });
	const stripeBody = await stripeResponse.json() as any; if (!stripeResponse.ok) return apiError(c, 'Could not start payment.', 502);
	return c.json({ checkoutUrl: stripeBody.url, checkoutSessionId: stripeBody.id });
});
app.post('/api/stripe/webhook', async (c) => {
	if (!c.env.STRIPE_WEBHOOK_SECRET) return apiError(c, 'Webhook verification is not configured.', 503);
	const raw = await c.req.text(); const signature = c.req.header('stripe-signature') ?? ''; const timestamp = signature.match(/t=(\d+)/)?.[1]; const v1 = signature.match(/v1=([^,]+)/)?.[1];
	if (!timestamp || !v1 || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return apiError(c, 'Invalid webhook.', 400);
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(c.env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']); const valid = await crypto.subtle.verify('HMAC', key, Uint8Array.from(v1.match(/.{1,2}/g)?.map((x) => parseInt(x, 16)) ?? []), new TextEncoder().encode(`${timestamp}.${raw}`));
	if (!valid) return apiError(c, 'Invalid webhook.', 400);
	const event = JSON.parse(raw) as any; if (event.type !== 'checkout.session.completed') return c.json({ received: true });
	const object = event.data?.object; const workspaceId = object?.metadata?.workspace_id; const amount = Number(object?.metadata?.amount_cents ?? object?.amount_total ?? 0); if (!workspaceId || amount < 300) return c.json({ received: true });
	const now = new Date().toISOString(); const transactionId = `stripe_${String(event.id)}`; const existing = await c.env.DB.prepare('SELECT id FROM wallet_transactions WHERE idempotency_key = ?').bind(transactionId).first(); if (existing) return c.json({ received: true, duplicate: true });
	const wallet = await c.env.DB.prepare('SELECT balance_cents FROM wallets WHERE workspace_id = ?').bind(workspaceId).first<{ balance_cents: number }>(); const balance = (wallet?.balance_cents ?? 0) + amount;
	await c.env.DB.batch([c.env.DB.prepare('INSERT INTO wallets (workspace_id, balance_cents, updated_at) VALUES (?, ?, ?) ON CONFLICT(workspace_id) DO UPDATE SET balance_cents = excluded.balance_cents, updated_at = excluded.updated_at').bind(workspaceId, balance, now), c.env.DB.prepare('INSERT INTO wallet_transactions (id, workspace_id, kind, amount_cents, balance_after_cents, idempotency_key, stripe_checkout_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(transactionId, workspaceId, 'top_up', amount, balance, transactionId, object.id, now)]);
	return c.json({ received: true });
});
app.get('/api/search', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const query = c.req.query('q')?.trim() ?? ''; if (!query || query.length > 240) return apiError(c, 'Search query is required.');
	try { return c.json(await searchWeb(c.env, query)); } catch { return apiError(c, 'Search provider failed.', 502); }
});
app.get('/api/runs/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const run = await c.env.DB.prepare('SELECT id, site_url, objective, addon, tier, model, status, result_json, provider_cost_usd, charged_cents, error, created_at, completed_at FROM runs WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), workspace.workspace_id).first<any>(); if (!run) return apiError(c, 'Run not found.', 404);
	const requests = await c.env.DB.prepare('SELECT id, provider, model, provider_request_id, provider_generation_id, status, provider_cost_usd, input_tokens, output_tokens, created_at, completed_at FROM run_requests WHERE run_id = ? AND workspace_id = ? ORDER BY created_at').bind(run.id, workspace.workspace_id).all();
	const evidence = await c.env.DB.prepare('SELECT provider, query, url, title, excerpt, fetched_at FROM evidence_snapshots WHERE run_id = ? AND workspace_id = ? ORDER BY fetched_at').bind(run.id, workspace.workspace_id).all();
	return c.json({ run: { ...run, result: run.result_json ? JSON.parse(run.result_json) : null }, requests: requests.results, evidence: evidence.results });
});
app.post('/api/runs', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const body = await c.req.json<{ siteUrl?: string; objective?: string; tier?: string; addon?: string; idempotencyKey?: string }>(); const siteUrl = body.siteUrl?.trim() ?? ''; const objective = body.objective?.trim() ?? 'Find the most useful next growth actions.'; const tier = (body.tier ?? 'starter') as Tier; const addon = (body.addon ?? 'default') as Addon; const idempotencyKey = body.idempotencyKey?.trim() || randomId();
	if (!validHttpUrl(siteUrl) || objective.length < 3 || objective.length > 500 || !tierNames.has(tier) || !addonNames.has(addon)) return apiError(c, 'Add a valid website, objective, plan, and add-on.');
	const duplicate = await c.env.DB.prepare('SELECT id, status FROM runs WHERE idempotency_key = ? AND workspace_id = ?').bind(idempotencyKey, workspace.workspace_id).first<{ id: string; status: string }>(); if (duplicate) return c.json({ runId: duplicate.id, status: duplicate.status, duplicate: true });
	const runId = randomId(); const projectId = randomId(); const model = modelFor(tier, addon); const now = new Date().toISOString();
	await c.env.DB.batch([
		c.env.DB.prepare('INSERT INTO projects (id, workspace_id, site_url, product_category, icp, target_geo, competitors_json, brand_voice_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(projectId, workspace.workspace_id, siteUrl, null, null, null, '[]', '{}', now),
		c.env.DB.prepare('INSERT INTO runs (id, workspace_id, project_id, site_url, objective, addon, tier, model, status, idempotency_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(runId, workspace.workspace_id, projectId, siteUrl, objective, addon, tier, model, 'running', idempotencyKey, now),
		c.env.DB.prepare('INSERT INTO scans (id, project_id, status, scan_type, provider_cost_json, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(runId, projectId, 'running', 'agent_diagnosis', '{}', now),
	]);
	try {
		const search = await searchWeb(c.env, `${siteUrl} ${objective}`); const crawl = await crawlUrl(c.env, siteUrl); const sources = [...search.results, ...(crawl.provider !== 'none' ? [{ title: crawl.title, url: siteUrl, excerpt: crawl.excerpt }] : [])].filter((item, index, all) => item.url && all.findIndex((other) => other.url === item.url) === index).slice(0, 8);
		for (const source of sources) await c.env.DB.prepare('INSERT INTO evidence_snapshots (id, run_id, workspace_id, provider, query, url, title, excerpt, content_hash, fetched_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), runId, workspace.workspace_id, search.provider, `${siteUrl} ${objective}`, source.url, source.title, source.excerpt, await sha256(`${source.url}|${source.excerpt}`), new Date().toISOString()).run();
		const context = sources.map((source, index) => `[${index + 1}] ${source.title}\n${source.url}\n${source.excerpt}`).join('\n\n'); const prompt = `You are heyIssac, a practical growth diagnosis agent. Analyze this website and public evidence. Return JSON only with keys summary, score (0-100), findings (array of {title, diagnosis, priority, confidence, evidenceIndexes}), actions (array of {title, rationale, type, priority, draft, approvalRequired}). Do not invent facts; cite evidenceIndexes. Website: ${siteUrl}\nObjective: ${objective}\nEvidence:\n${context || 'No search provider is configured. Say that evidence is unavailable and give only clearly labeled setup actions.'}`;
		const requestId = randomId(); await c.env.DB.prepare('INSERT INTO run_requests (id, run_id, workspace_id, request_key, provider, model, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(requestId, runId, workspace.workspace_id, `${runId}:analysis`, 'openrouter', model, 'started', now).run();
		const result = await callOpenRouter(c.env, model, [{ role: 'user', content: prompt }]); const providerCost = Number.isFinite(result.cost) ? result.cost : 0; await c.env.DB.prepare('UPDATE run_requests SET status = ?, provider_request_id = ?, provider_generation_id = ?, provider_cost_usd = ?, input_tokens = ?, output_tokens = ?, completed_at = ? WHERE id = ? AND run_id = ?').bind('completed', result.requestId, result.id, providerCost, result.inputTokens, result.outputTokens, new Date().toISOString(), requestId, runId).run();
		let structured: any; try { structured = JSON.parse(result.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '')); } catch { structured = { summary: result.text, score: null, findings: [], actions: [] }; }
		for (const action of structured.actions ?? []) await c.env.DB.prepare('INSERT INTO actions (id, scan_id, project_id, type, priority, score, confidence, evidence_json, diagnosis, recommended_action, draft, risk, status, approval_required, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), runId, projectId, String(action.type ?? 'growth'), String(action.priority ?? 'medium'), 0, Number(action.confidence ?? 0.5), jsonText(action.evidenceIndexes ?? []), String(action.rationale ?? ''), String(action.title ?? ''), action.draft ? String(action.draft) : null, 'Review before publishing', 'pending', action.approvalRequired === false ? 0 : 1, new Date().toISOString()).run();
		const chargedCents = addon === 'default' ? 0 : centsFromUsd(providerCost * 1.4); if (chargedCents > 0) { const ledgerKey = `${runId}:charge`; const debit = await c.env.DB.prepare('UPDATE wallets SET balance_cents = balance_cents - ?, updated_at = ? WHERE workspace_id = ? AND balance_cents >= ?').bind(chargedCents, new Date().toISOString(), workspace.workspace_id, chargedCents).run(); if (debit.meta.changes !== 1) throw new Error('insufficient_balance'); const balanceAfter = await c.env.DB.prepare('SELECT balance_cents FROM wallets WHERE workspace_id = ?').bind(workspace.workspace_id).first<{ balance_cents: number }>(); await c.env.DB.prepare('INSERT INTO wallet_transactions (id, workspace_id, kind, amount_cents, balance_after_cents, idempotency_key, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), workspace.workspace_id, 'run_charge', -chargedCents, balanceAfter?.balance_cents ?? 0, ledgerKey, jsonText({ runId, providerCostUsd: providerCost, multiplier: 1.4, model }), new Date().toISOString()).run(); }
		const finishedAt = new Date().toISOString(); await c.env.DB.batch([c.env.DB.prepare('UPDATE scans SET status = ?, provider_cost_json = ?, completed_at = ? WHERE id = ? AND project_id = ?').bind('completed', jsonText({ providerCostUsd: providerCost }), finishedAt, runId, projectId), c.env.DB.prepare('UPDATE runs SET status = ?, result_json = ?, provider_cost_usd = ?, charged_cents = ?, completed_at = ? WHERE id = ? AND workspace_id = ?').bind('completed', jsonText(structured), providerCost, chargedCents, finishedAt, runId, workspace.workspace_id)]); return c.json({ runId, status: 'completed', model, providerCostUsd: providerCost, chargedCents, result: structured, evidenceCount: sources.length });
	} catch (cause) { const error = cause instanceof Error ? cause.message : 'run_failed'; await c.env.DB.prepare('UPDATE runs SET status = ?, error = ?, completed_at = ? WHERE id = ? AND workspace_id = ?').bind('failed', error === 'insufficient_balance' ? 'Add balance before using this usage-priced add-on.' : 'The run could not be completed.', new Date().toISOString(), runId, workspace.workspace_id).run(); return apiError(c, error === 'insufficient_balance' ? 'Add balance before using this usage-priced add-on.' : 'The run could not be completed.', error === 'insufficient_balance' ? 402 : 502); }
});
app.get('/api/list', async (c) => {
	const session = await readSession(c.req.raw, c.env.JWT_SECRET);
	if (!session) return apiError(c, 'Sign in required', 401);
	return c.json({ refreshedAt: new Date().toISOString(), status: 'ready', user: { username: session.username, role: session.role } });
});
app.notFound((c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
