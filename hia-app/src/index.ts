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
}

const app = new Hono<{ Bindings: AppEnv }>();
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
app.get('/api/list', async (c) => {
	const session = await readSession(c.req.raw, c.env.JWT_SECRET);
	if (!session) return apiError(c, 'Sign in required', 401);
	return c.json({ refreshedAt: new Date().toISOString(), status: 'ready', user: { username: session.username, role: session.role } });
});
app.notFound((c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
