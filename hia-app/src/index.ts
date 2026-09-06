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
import { DurableObject } from 'cloudflare:workers';
import { generateTotpSecret, hashPassword, normalizeSecurityAnswer, readSession, readSignedToken, randomId, SESSION_SECONDS, sessionCookie, signJwt, expiredCookie, validPasscode, validPassword, validRecoveryEmail, verifyPassword, verifyTotp } from './auth';

interface AppEnv {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
	DB: D1Database;
	RUNS: DurableObjectNamespace<RunCoordinator>;
	JWT_SECRET: string;
	OPENROUTER_API_KEY?: string;
	OPENROUTER_MODEL?: string;
	STRIPE_SECRET_KEY?: string;
	STRIPE_WEBHOOK_SECRET?: string;
	SEARCH_PROVIDER?: string;
	EXA_API_KEY?: string;
	TAVILY_API_KEY?: string;
	BRAVE_SEARCH_API_KEY?: string;
	FIRECRAWL_API_KEY?: string;
	STRIPE_STARTER_PRICE_ID?: string;
	STRIPE_STUDIO_PRICE_ID?: string;
	STRIPE_PARTNER_PRICE_ID?: string;
}

const app = new Hono<{ Bindings: AppEnv }>();
app.use('*', async (c, next) => { await next(); c.header('X-Content-Type-Options', 'nosniff'); c.header('Referrer-Policy', 'strict-origin-when-cross-origin'); c.header('X-Frame-Options', 'DENY'); c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); c.header('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"); });
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
type RecoverySetup = { recoveryEmail?: string; passcode?: string; securityAnswers?: SecurityAnswer[]; totpSecret?: string; totpCode?: string };
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
const providerName = (env: AppEnv) => env.SEARCH_PROVIDER?.toLowerCase() || (env.EXA_API_KEY ? 'exa' : env.TAVILY_API_KEY ? 'tavily' : env.BRAVE_SEARCH_API_KEY ? 'brave' : 'none');
const jsonText = (value: unknown) => JSON.stringify(value ?? {});
const readJson = (value: unknown) => { if (typeof value !== 'string' || !value) return null; try { return JSON.parse(value); } catch { return null; } };
const centsFromUsd = (value: number) => Math.max(0, Math.ceil(value * 100));
const getWorkspaceForUser = (db: D1Database, userId: string) => db.prepare('SELECT workspace_id FROM workspace_members WHERE user_id = ? ORDER BY workspace_id LIMIT 1').bind(userId).first<{ workspace_id: string }>();
const getWorkspaceContext = (db: D1Database, userId: string) => db.prepare('SELECT w.id, w.plan, w.subscription_status, w.stripe_subscription_id, w.current_period_end, w.cancel_at_period_end FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id WHERE m.user_id = ? ORDER BY w.created_at LIMIT 1').bind(userId).first<{ id: string; plan: string; subscription_status: string; stripe_subscription_id?: string | null; current_period_end?: string | null; cancel_at_period_end?: number }>();
const planRank = (value: string) => ({ starter: 1, studio: 2, partner: 3 } as Record<string, number>)[value] ?? 1;
const subscriptionActive = (status: string) => status === 'active' || status === 'canceling' || status === 'trialing';
const validHttpUrl = (value: string) => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; } };
async function sha256(value: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map((byte) => byte.toString(16).padStart(2, '0')).join(''); }
function modelFor(tier: Tier, addon: Addon, requestedModel?: string) {
	const selected = MODEL_CATALOG[tier][addon];
	if (Array.isArray(selected)) return requestedModel && selected.includes(requestedModel as never) ? requestedModel : selected[0];
	return requestedModel && requestedModel !== selected ? null : selected;
}
function safeSearchResult(value: any, index = 0) { return { title: String(value.title ?? value.name ?? '').slice(0, 300), url: String(value.url ?? value.link ?? ''), excerpt: String(value.content ?? value.text ?? value.description ?? value.snippet ?? '').slice(0, 1200), position: index + 1 }; }
async function searchWithProvider(env: AppEnv, provider: string, query: string) {
	if (provider === 'exa' && env.EXA_API_KEY) {
		const response = await fetch('https://api.exa.ai/search', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': env.EXA_API_KEY }, body: JSON.stringify({ query, numResults: 5, contents: { text: { maxCharacters: 1200 } } }) });
		if (!response.ok) throw new Error(`search_${response.status}`);
		const body = await response.json() as any;
		return { provider, results: (body.results ?? []).map((item: any, index: number) => safeSearchResult(item, index)).filter((item: any) => validHttpUrl(item.url)) };
	}
	if (provider === 'tavily' && env.TAVILY_API_KEY) {
		const response = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_key: env.TAVILY_API_KEY, query, max_results: 5, include_answer: false }) });
		if (!response.ok) throw new Error(`search_${response.status}`);
		const body = await response.json() as any;
		return { provider, results: (body.results ?? []).map((item: any, index: number) => safeSearchResult(item, index)).filter((item: any) => validHttpUrl(item.url)) };
	}
	if (provider === 'brave' && env.BRAVE_SEARCH_API_KEY) {
		const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, { headers: { Accept: 'application/json', 'X-Subscription-Token': env.BRAVE_SEARCH_API_KEY } });
		if (!response.ok) throw new Error(`search_${response.status}`);
		const body = await response.json() as any;
		return { provider, results: (body.web?.results ?? []).map((item: any, index: number) => safeSearchResult(item, index)).filter((item: any) => validHttpUrl(item.url)) };
	}
	return null;
}
async function searchWeb(env: AppEnv, query: string) {
	const preferred = providerName(env);
	const candidates = Array.from(new Set([preferred, 'exa', 'tavily', 'brave']));
	let lastError: unknown = null;
	for (const provider of candidates) {
		try {
			const result = await searchWithProvider(env, provider, query);
			if (result) return result;
		} catch (cause) { lastError = cause; }
	}
	if (lastError) throw lastError;
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
const MAX_CRAWL_PAGES = 5;
const MAX_RUNS_PER_DAY = 20;
async function crawlSite(env: AppEnv, siteUrl: string) {
	const origin = new URL(siteUrl); const paths = Array.from(new Set([origin.pathname || '/', '/', '/about', '/services', '/contact', '/pricing'])).slice(0, MAX_CRAWL_PAGES); const pages: { url: string; title: string; excerpt: string; provider: string }[] = [];
	for (const path of paths) { try { const page = await crawlUrl(env, new URL(path, origin).toString()); if (page.provider !== 'none') pages.push({ url: new URL(path, origin).toString(), title: page.title, excerpt: page.excerpt, provider: page.provider }); } catch { /* Individual pages may be unavailable; the run can still use search evidence. */ } }
	return pages;
}
function parseAgentResult(text: string) {
	const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim(); let parsed: any;
	try { parsed = JSON.parse(clean); } catch { throw new Error('invalid_model_output'); }
	if (!parsed || typeof parsed.summary !== 'string' || !Array.isArray(parsed.findings) || !Array.isArray(parsed.actions)) throw new Error('invalid_model_output');
	const geo = parsed.geo && typeof parsed.geo === 'object' ? { visibility: String(parsed.geo.visibility ?? 'not_measured').slice(0, 40), notes: String(parsed.geo.notes ?? '').slice(0, 1000), gaps: Array.isArray(parsed.geo.gaps) ? parsed.geo.gaps.slice(0, 10).map((item: unknown) => String(item).slice(0, 240)) : [] } : { visibility: 'not_measured', notes: '', gaps: [] };
	return { summary: parsed.summary.slice(0, 2000), score: Number.isFinite(Number(parsed.score)) ? Math.max(0, Math.min(100, Number(parsed.score))) : null, geo, findings: parsed.findings.slice(0, 20).map((item: any) => ({ title: String(item.title ?? '').slice(0, 240), diagnosis: String(item.diagnosis ?? '').slice(0, 1200), priority: String(item.priority ?? 'medium'), confidence: Math.max(0, Math.min(1, Number(item.confidence ?? 0.5))), evidenceIndexes: Array.isArray(item.evidenceIndexes) ? item.evidenceIndexes.slice(0, 10).map(Number).filter(Number.isFinite) : [] })), actions: parsed.actions.slice(0, 20).map((item: any) => ({ title: String(item.title ?? '').slice(0, 240), rationale: String(item.rationale ?? '').slice(0, 1200), type: String(item.type ?? 'growth').slice(0, 80), priority: String(item.priority ?? 'medium').slice(0, 40), draft: item.draft ? String(item.draft).slice(0, 3000) : null, approvalRequired: item.approvalRequired !== false })) };
}
async function trackedModelRequest(db: D1Database, env: AppEnv, runId: string, workspaceId: string, model: string, stage: string, messages: { role: string; content: string }[]) {
	const requestId = randomId(); const requestKey = `${runId}:${stage}`; const now = new Date().toISOString(); await db.prepare('INSERT INTO run_requests (id, run_id, workspace_id, request_key, provider, model, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(requestId, runId, workspaceId, requestKey, 'openrouter', model, 'started', now).run();
	try { const result = await callOpenRouter(env, model, messages); await db.prepare('UPDATE run_requests SET status = ?, provider_request_id = ?, provider_generation_id = ?, provider_cost_usd = ?, input_tokens = ?, output_tokens = ?, completed_at = ? WHERE id = ? AND run_id = ? AND workspace_id = ?').bind('completed', result.requestId, result.id, result.cost, result.inputTokens, result.outputTokens, new Date().toISOString(), requestId, runId, workspaceId).run(); return result; } catch (cause) { await db.prepare('UPDATE run_requests SET status = ?, error = ?, completed_at = ? WHERE id = ? AND run_id = ? AND workspace_id = ?').bind('failed', cause instanceof Error ? cause.message : 'provider_failed', new Date().toISOString(), requestId, runId, workspaceId).run(); throw cause; }
}
async function validatedModelStage(db: D1Database, env: AppEnv, runId: string, workspaceId: string, model: string, stage: string, prompt: string) {
	const result = await trackedModelRequest(db, env, runId, workspaceId, model, stage, [{ role: 'user', content: prompt }]);
	try { return { result, structured: parseAgentResult(result.text) }; } catch {
		const repair = await trackedModelRequest(db, env, runId, workspaceId, model, `${stage}_repair`, [{ role: 'user', content: `Return valid JSON only. Required keys: summary string, score number or null, findings array, actions array. Repair this response without inventing evidence:\n${result.text}` }]);
		return { result: repair, structured: parseAgentResult(repair.text) };
	}
}
const getUserByUsername = (db: D1Database, username: string) => db.prepare('SELECT id, username, password_hash, role, recovery_email, totp_secret, passcode_hash FROM users WHERE username = ?').bind(username).first<{ id: string; username: string; password_hash: string; role: string; recovery_email?: string | null; totp_secret?: string | null; passcode_hash?: string | null }>();
const getSession = async (c: any) => {
	const session = await readSession(c.req.raw, c.env.JWT_SECRET);
	if (session) return session;
	const authorization = c.req.header('Authorization') ?? '';
	if (!authorization.startsWith('Bearer ')) return null;
	const rawToken = authorization.slice(7).trim(); if (rawToken.length < 20 || rawToken.length > 300) return null;
	const tokenHash = await sha256(rawToken); const db = c.env.DB as D1Database;
	const token = await db.prepare('SELECT t.id, t.user_id, t.workspace_id, t.expires_at, u.username, u.role FROM api_tokens t JOIN users u ON u.id = t.user_id WHERE t.token_hash = ? AND t.revoked_at IS NULL').bind(tokenHash).first<{ id: string; user_id: string; workspace_id: string; expires_at?: string | null; username: string; role: string }>();
	if (!token || (token.expires_at && token.expires_at <= new Date().toISOString())) return null;
	await db.prepare('UPDATE api_tokens SET last_used_at = ? WHERE id = ?').bind(new Date().toISOString(), token.id).run();
	return { sub: token.user_id, username: token.username, role: token.role, workspaceId: token.workspace_id, iat: 0, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
};
async function validateRecoverySetup(body: RecoverySetup) {
	if (body.recoveryEmail !== undefined) { const email = body.recoveryEmail.trim().toLowerCase(); if (email && !validRecoveryEmail(email)) throw new Error('email'); }
	if (body.passcode !== undefined) { const passcode = body.passcode.trim(); if (passcode && !validPasscode(passcode)) throw new Error('passcode'); }
	if (body.totpSecret !== undefined || body.totpCode !== undefined) { const secret = body.totpSecret?.trim().replace(/\s+/g, '').toUpperCase() ?? ''; const code = body.totpCode?.trim() ?? ''; if (secret && !(await verifyTotp(secret, code))) throw new Error('totp'); }
	if (body.securityAnswers !== undefined) { const answers = body.securityAnswers.filter((item) => item.questionKey || item.answer); const keys = answers.map((item) => item.questionKey); const normalized = answers.map((item) => normalizeSecurityAnswer(item.answer ?? '')); if (answers.length && (answers.length < 2 || answers.length > 3 || new Set(keys).size !== answers.length || new Set(normalized).size !== answers.length || answers.some((item) => !item.questionKey || !validQuestionKeys.has(item.questionKey) || !normalizeSecurityAnswer(item.answer ?? '')))) throw new Error('security_answers'); }
}
async function applyRecoverySetup(db: D1Database, userId: string, body: RecoverySetup) {
	await validateRecoverySetup(body);
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
	const session = await getSession(c);
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
		await validateRecoverySetup(body);
		await c.env.DB.prepare('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, username, encodedPassword, 'owner', now).run();
		await c.env.DB.prepare('INSERT INTO workspaces (id, owner_user_id, name, plan, created_at) VALUES (?, ?, ?, ?, ?)').bind(workspaceId, id, 'My workspace', 'starter', now).run();
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
app.get('/api/profile', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const profile = await c.env.DB.prepare('SELECT id, username, business_name, brand_voice, created_at FROM users WHERE id = ?').bind(session.sub).first();
	return profile ? c.json({ profile }) : apiError(c, 'Profile not found.', 404);
});
app.patch('/api/profile', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const body = await c.req.json<{ businessName?: string; brandVoice?: string }>(); const businessName = body.businessName?.trim() ?? ''; const brandVoice = body.brandVoice?.trim() ?? '';
	if (businessName.length > 120 || brandVoice.length > 240) return apiError(c, 'Profile details are too long.');
	await c.env.DB.prepare('UPDATE users SET business_name = ?, brand_voice = ?, updated_at = ? WHERE id = ?').bind(businessName || null, brandVoice || null, new Date().toISOString(), session.sub).run();
	return c.json({ ok: true });
});
app.get('/api/security/status', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const user = await c.env.DB.prepare('SELECT recovery_email, totp_secret, passcode_hash FROM users WHERE id = ?').bind(session.sub).first<{ recovery_email?: string | null; totp_secret?: string | null; passcode_hash?: string | null }>(); const answers = await c.env.DB.prepare('SELECT COUNT(*) AS total FROM security_answers WHERE user_id = ?').bind(session.sub).first<{ total: number }>(); return c.json({ email: !!user?.recovery_email, totp: !!user?.totp_secret, passcode: !!user?.passcode_hash, securityQuestions: answers?.total ?? 0 });
});
app.get('/api/auth/tokens', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const rows = await c.env.DB.prepare('SELECT id, name, expires_at, revoked_at, created_at, last_used_at FROM api_tokens WHERE user_id = ? AND revoked_at IS NULL ORDER BY created_at DESC').bind(session.sub).all(); return c.json({ tokens: rows.results });
});
app.post('/api/auth/tokens', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const body = await c.req.json<{ name?: string; expiresInDays?: number }>(); const name = body.name?.trim() || 'Agent access'; if (name.length > 80) return apiError(c, 'Token name is too long.');
	const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const existing = await c.env.DB.prepare('SELECT COUNT(*) AS total FROM api_tokens WHERE user_id = ? AND revoked_at IS NULL').bind(session.sub).first<{ total: number }>(); if ((existing?.total ?? 0) >= 10) return apiError(c, 'You can keep up to 10 active agent tokens.', 429);
	const token = `hia_${randomId()}${randomId()}`; const expiresInDays = Math.min(365, Math.max(1, Math.floor(body.expiresInDays ?? 90))); const expiresAt = new Date(Date.now() + expiresInDays * 86400000).toISOString(); const now = new Date().toISOString();
	await c.env.DB.prepare('INSERT INTO api_tokens (id, user_id, workspace_id, name, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(randomId(), session.sub, workspace.workspace_id, name, await sha256(token), expiresAt, now).run();
	return c.json({ token, name, expiresAt }, 201);
});
app.delete('/api/auth/tokens/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const result = await c.env.DB.prepare('UPDATE api_tokens SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL').bind(new Date().toISOString(), c.req.param('id'), session.sub).run(); return result.meta.changes === 1 ? c.json({ ok: true }) : apiError(c, 'Token not found.', 404);
});
app.get('/api/projects', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const projects = await c.env.DB.prepare('SELECT id, site_url, product_category, icp, target_geo, created_at FROM projects WHERE workspace_id = ? ORDER BY created_at DESC').bind(workspace.workspace_id).all(); return c.json({ projects: projects.results });
});
app.post('/api/projects', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const body = await c.req.json<{ siteUrl?: string; productCategory?: string; icp?: string; targetGeo?: string }>(); const siteUrl = body.siteUrl?.trim() ?? ''; if (!validHttpUrl(siteUrl) || siteUrl.length > 500) return apiError(c, 'Enter a valid public website.');
	const id = randomId(); await c.env.DB.prepare('INSERT INTO projects (id, workspace_id, site_url, product_category, icp, target_geo, competitors_json, brand_voice_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, workspace.workspace_id, siteUrl, body.productCategory?.trim().slice(0, 120) || null, body.icp?.trim().slice(0, 240) || null, body.targetGeo?.trim().slice(0, 120) || null, '[]', '{}', new Date().toISOString()).run(); return c.json({ project: { id, siteUrl } }, 201);
});
app.patch('/api/projects/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const body = await c.req.json<{ productCategory?: string; icp?: string; targetGeo?: string }>(); const result = await c.env.DB.prepare('UPDATE projects SET product_category = ?, icp = ?, target_geo = ? WHERE id = ? AND workspace_id = ?').bind(body.productCategory?.trim().slice(0, 120) || null, body.icp?.trim().slice(0, 240) || null, body.targetGeo?.trim().slice(0, 120) || null, c.req.param('id'), workspace.workspace_id).run(); return result.meta.changes === 1 ? c.json({ ok: true }) : apiError(c, 'Project not found.', 404);
});
app.delete('/api/projects/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const result = await c.env.DB.prepare('DELETE FROM projects WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), workspace.workspace_id).run(); return result.meta.changes === 1 ? c.json({ ok: true }) : apiError(c, 'Project not found.', 404);
});
app.get('/api/runs', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const limit = Math.min(50, Math.max(1, Number(c.req.query('limit') ?? 20))); const runs = await c.env.DB.prepare(`SELECT id, site_url, objective, addon, tier, model, status, result_json, provider_cost_usd, charged_cents, error, created_at, completed_at FROM runs WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ${limit}`).bind(workspace.workspace_id).all<any>(); return c.json({ runs: runs.results.map((run) => ({ ...run, result: readJson(run.result_json) })) });
});
app.get('/api/actions', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const status = c.req.query('status'); const query = status ? 'SELECT a.* FROM actions a JOIN projects p ON p.id = a.project_id WHERE p.workspace_id = ? AND a.status = ? ORDER BY a.score DESC, a.created_at DESC LIMIT 100' : 'SELECT a.* FROM actions a JOIN projects p ON p.id = a.project_id WHERE p.workspace_id = ? ORDER BY a.created_at DESC LIMIT 100'; const actionsRows = status ? await c.env.DB.prepare(query).bind(workspace.workspace_id, status).all() : await c.env.DB.prepare(query).bind(workspace.workspace_id).all(); return c.json({ actions: actionsRows.results });
});
app.patch('/api/actions/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const body = await c.req.json<{ status?: string }>(); if (!body.status || !['pending', 'approved', 'dismissed', 'completed', 'published'].includes(body.status)) return apiError(c, 'Invalid action status.'); const result = await c.env.DB.prepare('UPDATE actions SET status = ? WHERE id = ? AND project_id IN (SELECT id FROM projects WHERE workspace_id = ?)').bind(body.status, c.req.param('id'), workspace.workspace_id).run(); return result.meta.changes === 1 ? c.json({ ok: true }) : apiError(c, 'Action not found.', 404);
});
app.get('/api/catalog', (c) => c.json({ plans: { starter: { label: 'Starter', default: MODEL_CATALOG.starter.default, push: MODEL_CATALOG.starter.push, max: MODEL_CATALOG.starter.max }, studio: { label: 'Studio', default: MODEL_CATALOG.studio.default, push: MODEL_CATALOG.studio.push, max: MODEL_CATALOG.studio.max }, partner: { label: 'Partner', default: MODEL_CATALOG.partner.default, push: MODEL_CATALOG.partner.push, max: MODEL_CATALOG.partner.max } }, addons: { push: 'Usage-priced model upgrade', max: 'Usage-priced highest-capability upgrade' }, topUpMinimumCents: 300 }));
app.get('/api/workspace', async (c) => { const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await c.env.DB.prepare('SELECT id, name, plan, subscription_status, current_period_end, cancel_at_period_end FROM workspaces WHERE id IN (SELECT workspace_id FROM workspace_members WHERE user_id = ?) ORDER BY created_at LIMIT 1').bind(session.sub).first(); return workspace ? c.json({ workspace }) : apiError(c, 'Workspace not found.', 404); });
app.post('/api/billing/subscribe', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceContext(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const body = await c.req.json<{ plan?: string }>(); const plan = body.plan as Tier; const priceId = plan === 'starter' ? c.env.STRIPE_STARTER_PRICE_ID : plan === 'studio' ? c.env.STRIPE_STUDIO_PRICE_ID : plan === 'partner' ? c.env.STRIPE_PARTNER_PRICE_ID : undefined; if (!priceId) return apiError(c, 'Choose a valid plan.', 400); if (!c.env.STRIPE_SECRET_KEY) return apiError(c, 'Subscription checkout is not available.', 503);
	const params = new URLSearchParams({ mode: 'subscription', success_url: 'https://hey-issac.pendia-community.workers.dev/?subscription=success', cancel_url: 'https://hey-issac.pendia-community.workers.dev/?subscription=cancelled', 'line_items[0][price]': priceId, 'line_items[0][quantity]': '1', 'metadata[workspace_id]': workspace.id, 'metadata[plan]': plan, integration_identifier: `heyissac_${randomId().slice(0, 8)}` }); const response = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params }); const result = await response.json() as any; if (!response.ok) return apiError(c, 'Could not start subscription.', 502); return c.json({ checkoutUrl: result.url, checkoutSessionId: result.id });
});
async function setStripeSubscriptionCancellation(env: AppEnv, subscriptionId: string, cancelAtPeriodEnd: boolean) {
	if (!env.STRIPE_SECRET_KEY) throw new Error('stripe_not_configured');
	const params = new URLSearchParams({ cancel_at_period_end: cancelAtPeriodEnd ? 'true' : 'false' });
	const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: 'POST', headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params });
	const result = await response.json() as any;
	if (!response.ok) throw new Error('stripe_subscription_update_failed');
	return result;
}
app.post('/api/billing/subscription/cancel', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const workspace = await getWorkspaceContext(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	if (!workspace.stripe_subscription_id || workspace.plan === 'starter') return apiError(c, 'There is no paid subscription to cancel.', 400);
	try {
		const stripeSubscription = await setStripeSubscriptionCancellation(c.env, workspace.stripe_subscription_id, true);
		const currentPeriodEnd = stripeSubscription.current_period_end ? new Date(Number(stripeSubscription.current_period_end) * 1000).toISOString() : workspace.current_period_end ?? null;
		await c.env.DB.prepare("UPDATE workspaces SET subscription_status = 'canceling', cancel_at_period_end = 1, current_period_end = ? WHERE id = ?").bind(currentPeriodEnd, workspace.id).run();
		return c.json({ ok: true, subscription_status: 'canceling', cancel_at_period_end: 1, current_period_end: currentPeriodEnd });
	} catch { return apiError(c, 'Subscription could not be canceled.', 502); }
});
app.post('/api/billing/subscription/enable', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const workspace = await getWorkspaceContext(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	if (!workspace.stripe_subscription_id || workspace.plan === 'starter') return apiError(c, 'Choose a paid plan to start a subscription.', 400);
	try {
		const stripeSubscription = await setStripeSubscriptionCancellation(c.env, workspace.stripe_subscription_id, false);
		const currentPeriodEnd = stripeSubscription.current_period_end ? new Date(Number(stripeSubscription.current_period_end) * 1000).toISOString() : workspace.current_period_end ?? null;
		await c.env.DB.prepare("UPDATE workspaces SET subscription_status = 'active', cancel_at_period_end = 0, current_period_end = ? WHERE id = ?").bind(currentPeriodEnd, workspace.id).run();
		return c.json({ ok: true, subscription_status: 'active', cancel_at_period_end: 0, current_period_end: currentPeriodEnd });
	} catch { return apiError(c, 'Subscription could not be enabled.', 502); }
});
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
	const event = JSON.parse(raw) as any; const object = event.data?.object; const workspaceId = object?.metadata?.workspace_id;
	if (event.type === 'checkout.session.completed' && object?.mode === 'subscription' && workspaceId && tierNames.has(object.metadata?.plan)) { await c.env.DB.prepare('UPDATE workspaces SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, subscription_status = ?, cancel_at_period_end = 0 WHERE id = ?').bind(object.metadata.plan, object.customer ?? null, object.subscription ?? null, 'active', workspaceId).run(); return c.json({ received: true }); }
	if (event.type === 'customer.subscription.deleted' && object?.id) { await c.env.DB.prepare("UPDATE workspaces SET plan = 'starter', subscription_status = 'canceled', cancel_at_period_end = 0, current_period_end = NULL WHERE stripe_subscription_id = ?").bind(object.id).run(); return c.json({ received: true }); }
	if (event.type === 'customer.subscription.updated' && object?.id) { const status = String(object.status ?? 'unknown'); const cancelAtPeriodEnd = object.cancel_at_period_end ? 1 : 0; await c.env.DB.prepare('UPDATE workspaces SET subscription_status = ?, cancel_at_period_end = ?, current_period_end = ? WHERE stripe_subscription_id = ?').bind(status === 'active' && cancelAtPeriodEnd ? 'canceling' : status, cancelAtPeriodEnd, object.current_period_end ? new Date(Number(object.current_period_end) * 1000).toISOString() : null, object.id).run(); return c.json({ received: true }); }
	if (event.type !== 'checkout.session.completed') return c.json({ received: true });
	const amount = Number(object?.metadata?.amount_cents ?? object?.amount_total ?? 0); if (!workspaceId || amount < 300) return c.json({ received: true });
	const now = new Date().toISOString(); const transactionId = `stripe_${String(event.id)}`; const existing = await c.env.DB.prepare('SELECT id FROM wallet_transactions WHERE idempotency_key = ?').bind(transactionId).first(); if (existing) return c.json({ received: true, duplicate: true });
	const creditBatch = await c.env.DB.batch([c.env.DB.prepare('INSERT INTO wallets (workspace_id, balance_cents, updated_at) VALUES (?, ?, ?) ON CONFLICT(workspace_id) DO UPDATE SET balance_cents = wallets.balance_cents + excluded.balance_cents, updated_at = excluded.updated_at').bind(workspaceId, amount, now), c.env.DB.prepare("INSERT INTO wallet_transactions (id, workspace_id, kind, amount_cents, balance_after_cents, idempotency_key, stripe_checkout_id, created_at) SELECT ?, ?, 'top_up', ?, balance_cents, ?, ?, ? FROM wallets WHERE workspace_id = ? AND changes() = 1").bind(transactionId, workspaceId, amount, transactionId, object.id, now, workspaceId)]);
	if (creditBatch[1].meta.changes !== 1) return apiError(c, 'Balance was not credited.', 500);
	return c.json({ received: true });
});
app.get('/api/search', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const query = c.req.query('q')?.trim() ?? ''; if (!query || query.length > 240) return apiError(c, 'Search query is required.');
	try { return c.json(await searchWeb(c.env, query)); } catch { return apiError(c, 'Search provider failed.', 502); }
});
async function executeRun(env: AppEnv, runId: string) {
	type StoredRun = { id: string; workspace_id: string; project_id: string | null; site_url: string; objective: string; keywords_json: string; addon: Addon; tier: Tier; model: string; status: string; created_at: string };
	const run = await env.DB.prepare('SELECT id, workspace_id, project_id, site_url, objective, keywords_json, addon, tier, model, status, created_at FROM runs WHERE id = ?').bind(runId).first<StoredRun>();
	if (!run || !run.project_id || !['queued', 'running'].includes(run.status)) return;
	const workspaceId = run.workspace_id;
	const projectId = run.project_id;
	const project = await env.DB.prepare('SELECT target_geo, competitors_json FROM projects WHERE id = ? AND workspace_id = ?').bind(projectId, workspaceId).first<{ target_geo?: string | null; competitors_json?: string | null }>();
	const targetGeo = String(project?.target_geo ?? '');
	const keywordValue = readJson(run.keywords_json);
	const keywords = Array.isArray(keywordValue) ? keywordValue.filter((item): item is string => typeof item === 'string') : [];
	const competitorValue = readJson(project?.competitors_json);
	const competitors = Array.isArray(competitorValue) ? competitorValue.filter((item): item is string => typeof item === 'string') : [];
	const claimed = await env.DB.prepare("UPDATE runs SET status = 'running' WHERE id = ? AND workspace_id = ? AND status = 'queued'").bind(runId, workspaceId).run();
	if (run.status === 'queued' && claimed.meta.changes !== 1) return;
	await env.DB.prepare("UPDATE scans SET status = 'running' WHERE id = ? AND project_id = ? AND status = 'queued'").bind(runId, projectId).run();
	try {
		const searchQueries = Array.from(new Set([`${run.site_url} ${run.objective}`, ...keywords.map((keyword) => `${keyword}${targetGeo ? ` ${targetGeo}` : ''}`)])).slice(0, 5);
		const searchResults: any[] = [];
		let searchProvider = providerName(env);
		for (const [queryIndex, query] of searchQueries.entries()) {
			const searchRequest = randomId();
			await env.DB.prepare('INSERT INTO run_requests (id, run_id, workspace_id, request_key, provider, model, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(searchRequest, runId, workspaceId, `${runId}:search:${queryIndex}`, providerName(env), 'web-search', 'started', run.created_at).run();
			try {
				const currentSearch = await searchWeb(env, query);
				searchProvider = currentSearch.provider;
				searchResults.push(...currentSearch.results.map((item: any) => ({ ...item, query })));
				await env.DB.prepare('UPDATE run_requests SET status = ?, provider = ?, completed_at = ? WHERE id = ? AND run_id = ? AND workspace_id = ?').bind('completed', currentSearch.provider, new Date().toISOString(), searchRequest, runId, workspaceId).run();
			} catch (cause) {
				await env.DB.prepare('UPDATE run_requests SET status = ?, error = ?, completed_at = ? WHERE id = ? AND run_id = ? AND workspace_id = ?').bind('failed', cause instanceof Error ? cause.message : 'search_failed', new Date().toISOString(), searchRequest, runId, workspaceId).run();
			}
		}
		const search = { provider: searchProvider, results: searchResults };
		const crawled = await crawlSite(env, run.site_url);
		for (const [index, page] of crawled.entries()) await env.DB.prepare('INSERT INTO run_requests (id, run_id, workspace_id, request_key, provider, model, status, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), runId, workspaceId, `${runId}:crawl:${index}`, page.provider, 'page-reader', 'completed', run.created_at, new Date().toISOString()).run();
		const sourceMap = new Map<string, { title: string; url: string; excerpt: string; provider: string; position?: number; query?: string }>();
		for (const source of [...search.results, ...crawled]) if (validHttpUrl(source.url) && !sourceMap.has(source.url)) sourceMap.set(source.url, { title: source.title, url: source.url, excerpt: source.excerpt, provider: source.provider, position: source.position, query: source.query });
		const sources = Array.from(sourceMap.values()).slice(0, 12);
		for (const source of sources) await env.DB.prepare('INSERT INTO evidence_snapshots (id, run_id, workspace_id, provider, query, url, title, excerpt, content_hash, fetched_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), runId, workspaceId, source.provider, source.query ?? `${run.site_url} ${run.objective}`, source.url, source.title, source.excerpt, await sha256(`${source.url}|${source.excerpt}`), new Date().toISOString()).run();
		const targetHost = new URL(run.site_url).hostname.replace(/^www\./, '');
		const rankChecks = searchQueries.map((query) => {
			const results = search.results.filter((source: any) => source.query === query && validHttpUrl(source.url));
			const targetIndex = results.findIndex((source: any) => { try { const host = new URL(source.url).hostname.replace(/^www\./, ''); return host === targetHost || host.endsWith(`.${targetHost}`); } catch { return false; } });
			return { query, position: targetIndex >= 0 ? Number(results[targetIndex].position ?? targetIndex + 1) : null, observedResults: results.slice(0, 5).map((source: any) => ({ position: Number(source.position ?? 0), title: source.title, url: source.url })) };
		});
		const context = sources.map((source, index) => `[${index + 1}] ${source.title}${source.position ? ` (search position ${source.position})` : ''}\n${source.url}\n${source.excerpt}`).join('\n\n');
		const researchPrompt = `You are the research and diagnosis stage of heyIssac. Analyze only the supplied evidence for ${run.site_url}. The user's objective is: ${run.objective}. Target geography: ${targetGeo || 'not specified'}. Target keywords: ${keywords.join(', ') || 'not specified'}. Competitors: ${competitors.join(', ') || 'not specified'}. Return JSON only with summary, score, geo, findings, and actions. geo must include visibility (observed, limited, or not_measured), notes, and gaps. Each finding must include title, diagnosis, priority, confidence, and evidenceIndexes. Each action must include title, rationale, type, priority, draft, and approvalRequired. Separate observed facts from hypotheses and never invent a search position.\nEvidence:\n${context || 'No public evidence was returned; explain the limitation.'}`;
		const diagnosis = await validatedModelStage(env.DB, env, runId, workspaceId, run.model, 'diagnosis', researchPrompt);
		const planningPrompt = `You are the ranking and GEO action stage of heyIssac. Using this evidence-backed diagnosis, produce a final JSON object with summary, score, geo, findings, and actions. geo must include visibility, notes, and gaps, and must distinguish measured search positions from unmeasured recommendations. Rank actions by impact and effort. Include specific search/discovery or GEO actions when supported; do not claim a ranking position without measured rank evidence. Preserve evidenceIndexes and mark drafts approvalRequired true. Diagnosis:\n${jsonText(diagnosis.structured)}\nMeasured rank checks:\n${jsonText(rankChecks)}\nEvidence:\n${context}`;
		const planning = await validatedModelStage(env.DB, env, runId, workspaceId, run.model, 'planning', planningPrompt);
		const structured = planning.structured;
		const providerCost = diagnosis.result.cost + planning.result.cost;
		const chargedCents = run.addon === 'default' ? 0 : centsFromUsd(providerCost * 1.4);
		for (const action of structured.actions) await env.DB.prepare('INSERT INTO actions (id, scan_id, project_id, type, priority, score, confidence, evidence_json, diagnosis, recommended_action, draft, risk, status, approval_required, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(randomId(), runId, projectId, action.type, action.priority, structured.score ?? 0, action.approvalRequired ? 0.7 : 0.5, jsonText(action.evidenceIndexes), action.rationale, action.title, action.draft, 'Review before publishing', 'pending', action.approvalRequired ? 1 : 0, new Date().toISOString()).run();
		if (chargedCents > 0) {
			const chargedAt = new Date().toISOString();
			const chargeBatch = await env.DB.batch([env.DB.prepare('UPDATE wallets SET balance_cents = balance_cents - ?, updated_at = ? WHERE workspace_id = ? AND balance_cents >= ?').bind(chargedCents, chargedAt, workspaceId, chargedCents), env.DB.prepare("INSERT INTO wallet_transactions (id, workspace_id, kind, amount_cents, balance_after_cents, idempotency_key, metadata_json, created_at) SELECT ?, ?, 'run_charge', ?, balance_cents, ?, ?, ? FROM wallets WHERE workspace_id = ? AND changes() = 1").bind(randomId(), workspaceId, -chargedCents, `${runId}:charge`, jsonText({ runId, providerCostUsd: providerCost, multiplier: 1.4, model: run.model }), chargedAt, workspaceId)]);
			if (chargeBatch[0].meta.changes !== 1 || chargeBatch[1].meta.changes !== 1) throw new Error('insufficient_balance');
		}
		const requestCount = await env.DB.prepare('SELECT COUNT(*) AS total FROM run_requests WHERE run_id = ? AND workspace_id = ?').bind(runId, workspaceId).first<{ total: number }>();
		const finishedAt = new Date().toISOString();
		await env.DB.batch([env.DB.prepare('UPDATE scans SET status = ?, provider_cost_json = ?, completed_at = ? WHERE id = ? AND project_id = ?').bind('completed', jsonText({ providerCostUsd: providerCost, requestCount: requestCount?.total ?? 0 }), finishedAt, runId, projectId), env.DB.prepare('UPDATE runs SET status = ?, result_json = ?, provider_cost_usd = ?, charged_cents = ?, completed_at = ? WHERE id = ? AND workspace_id = ?').bind('completed', jsonText({ ...structured, rankChecks, evidenceCount: sources.length }), providerCost, chargedCents, finishedAt, runId, workspaceId)]);
	} catch (cause) {
		const publicError = cause instanceof Error && cause.message === 'insufficient_balance' ? 'Add balance before using this usage-priced add-on.' : 'The run could not be completed.';
		const failedAt = new Date().toISOString();
		await env.DB.batch([env.DB.prepare("UPDATE run_requests SET status = 'failed', error = ?, completed_at = ? WHERE run_id = ? AND workspace_id = ? AND status = 'started'").bind(publicError, failedAt, runId, workspaceId), env.DB.prepare('DELETE FROM actions WHERE scan_id = ? AND project_id = ?').bind(runId, projectId), env.DB.prepare('DELETE FROM evidence_snapshots WHERE run_id = ? AND workspace_id = ?').bind(runId, workspaceId), env.DB.prepare('UPDATE scans SET status = ?, error = ?, completed_at = ? WHERE id = ? AND project_id = ?').bind('failed', publicError, failedAt, runId, projectId), env.DB.prepare('UPDATE runs SET status = ?, error = ?, completed_at = ? WHERE id = ? AND workspace_id = ?').bind('failed', publicError, failedAt, runId, workspaceId)]);
	}
}

app.get('/api/runs/:id', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const run = await c.env.DB.prepare('SELECT id, site_url, objective, addon, tier, model, status, result_json, provider_cost_usd, charged_cents, error, created_at, completed_at FROM runs WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), workspace.workspace_id).first<any>(); if (!run) return apiError(c, 'Run not found.', 404);
	const requests = await c.env.DB.prepare('SELECT id, provider, model, provider_request_id, provider_generation_id, status, provider_cost_usd, input_tokens, output_tokens, created_at, completed_at FROM run_requests WHERE run_id = ? AND workspace_id = ? ORDER BY created_at').bind(run.id, workspace.workspace_id).all();
	const evidence = await c.env.DB.prepare('SELECT provider, query, url, title, excerpt, fetched_at FROM evidence_snapshots WHERE run_id = ? AND workspace_id = ? ORDER BY fetched_at').bind(run.id, workspace.workspace_id).all();
	return c.json({ run: { ...run, result: readJson(run.result_json) }, requests: requests.results, evidence: evidence.results });
});
app.post('/api/runs', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401);
	const workspace = await getWorkspaceContext(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404);
	const body = await c.req.json<{ siteUrl?: string; objective?: string; tier?: string; addon?: string; model?: string; targetGeo?: string; keywords?: string[]; competitors?: string[]; idempotencyKey?: string }>();
	const siteUrl = typeof body.siteUrl === 'string' ? body.siteUrl.trim() : ''; const objective = typeof body.objective === 'string' ? body.objective.trim() || 'Find the most useful next growth actions.' : 'Find the most useful next growth actions.'; const tier = (typeof body.tier === 'string' ? body.tier : workspace.plan) as Tier; const addon = (typeof body.addon === 'string' ? body.addon : 'default') as Addon; const idempotencyKey = typeof body.idempotencyKey === 'string' && body.idempotencyKey.trim() ? body.idempotencyKey.trim() : randomId(); const keywords = Array.isArray(body.keywords) ? body.keywords.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 20) : []; const competitors = Array.isArray(body.competitors) ? body.competitors.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 10) : []; const targetGeo = typeof body.targetGeo === 'string' ? body.targetGeo.trim().slice(0, 120) : '';
	const model = tierNames.has(tier) && addonNames.has(addon) ? modelFor(tier, addon, typeof body.model === 'string' ? body.model : undefined) : null;
	if (!model) return apiError(c, 'Choose a valid model for this add-on.');
	if (!validHttpUrl(siteUrl) || objective.length < 3 || objective.length > 500 || !tierNames.has(tier) || !addonNames.has(addon) || planRank(tier) > planRank(workspace.plan) || (planRank(tier) > 1 && !subscriptionActive(workspace.subscription_status))) return apiError(c, 'Choose a plan available to this workspace.');
	const duplicate = await c.env.DB.prepare('SELECT id, status FROM runs WHERE idempotency_key = ?').bind(idempotencyKey).first<{ id: string; status: string }>(); if (duplicate) return c.json({ runId: duplicate.id, status: duplicate.status, duplicate: true });
	const today = new Date(Date.now() - 86400000).toISOString(); const count = await c.env.DB.prepare("SELECT COUNT(*) AS total FROM runs WHERE workspace_id = ? AND created_at > ?").bind(workspace.id, today).first<{ total: number }>(); if ((count?.total ?? 0) >= MAX_RUNS_PER_DAY) return apiError(c, 'Daily run limit reached. Try again tomorrow.', 429);
	const active = await c.env.DB.prepare("SELECT COUNT(*) AS total FROM runs WHERE workspace_id = ? AND status IN ('queued', 'running')").bind(workspace.id).first<{ total: number }>(); if ((active?.total ?? 0) >= 2) return apiError(c, 'Two runs are already working. Let one finish first.', 429);
	const project = await c.env.DB.prepare('SELECT id FROM projects WHERE workspace_id = ? AND site_url = ? ORDER BY created_at LIMIT 1').bind(workspace.id, siteUrl).first<{ id: string }>(); const projectId = project?.id ?? randomId(); const runId = randomId(); const now = new Date().toISOString();
	if (!project) await c.env.DB.prepare('INSERT INTO projects (id, workspace_id, site_url, product_category, icp, target_geo, competitors_json, brand_voice_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(projectId, workspace.id, siteUrl, null, null, targetGeo || null, jsonText(competitors), '{}', now).run(); else await c.env.DB.prepare('UPDATE projects SET target_geo = ?, competitors_json = ? WHERE id = ? AND workspace_id = ?').bind(targetGeo || null, jsonText(competitors), projectId, workspace.id).run();
	await c.env.DB.batch([c.env.DB.prepare('INSERT INTO runs (id, workspace_id, project_id, site_url, objective, addon, tier, model, status, idempotency_key, created_at, keywords_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(runId, workspace.id, projectId, siteUrl, objective, addon, tier, model, 'queued', idempotencyKey, now, jsonText(keywords)), c.env.DB.prepare('INSERT INTO scans (id, project_id, status, scan_type, provider_cost_json, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(runId, projectId, 'queued', 'agent_diagnosis', '{}', now)]);
	const coordinator = c.env.RUNS.get(c.env.RUNS.idFromName(runId));
	const scheduled = await coordinator.fetch(new Request('https://hey-issac.internal/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ runId }) }));
	if (!scheduled.ok) { await c.env.DB.prepare("UPDATE runs SET status = 'failed', error = ? WHERE id = ? AND workspace_id = ?").bind('The run could not be scheduled.', runId, workspace.id).run(); return apiError(c, 'The run could not be scheduled.', 503); }
	return c.json({ runId, status: 'queued', model }, 202);
});
app.get('/api/list', async (c) => {
	const session = await getSession(c); if (!session) return apiError(c, 'Sign in required', 401); const workspace = await getWorkspaceForUser(c.env.DB, session.sub); if (!workspace) return apiError(c, 'Workspace not found.', 404); const rows = await c.env.DB.prepare('SELECT a.id, a.type, a.priority, a.score, a.confidence, a.diagnosis, a.recommended_action, a.draft, a.status, a.approval_required, a.created_at FROM actions a JOIN projects p ON p.id = a.project_id WHERE p.workspace_id = ? ORDER BY a.created_at DESC LIMIT 100').bind(workspace.workspace_id).all(); return c.json({ refreshedAt: new Date().toISOString(), status: 'ready', user: { username: session.username, role: session.role }, actions: rows.results });
});
app.notFound(async (c) => {
	const response = await c.env.ASSETS.fetch(c.req.raw); const headers = new Headers(response.headers);
	headers.set('X-Content-Type-Options', 'nosniff'); headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); headers.set('X-Frame-Options', 'DENY'); headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});

export class RunCoordinator extends DurableObject<AppEnv> {
	async fetch(request: Request) {
		if (new URL(request.url).pathname !== '/schedule' || request.method !== 'POST') return new Response('Not found', { status: 404 });
		const body = await request.json() as { runId?: string };
		if (!body.runId || body.runId.length > 100) return new Response('Invalid run', { status: 400 });
		const storedRunId = await this.ctx.storage.get<string>('runId');
		if (storedRunId && storedRunId !== body.runId) return new Response('Run coordinator already assigned', { status: 409 });
		await this.ctx.storage.put('runId', body.runId);
		await this.ctx.storage.setAlarm(Date.now());
		return new Response(JSON.stringify({ queued: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });
	}

	async alarm() {
		const runId = await this.ctx.storage.get<string>('runId');
		if (!runId) return;
		await executeRun(this.env, runId);
		await this.ctx.storage.delete('runId');
	}
}

export default app;
