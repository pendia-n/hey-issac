import { env, SELF } from "cloudflare:test";
import { beforeAll, describe, it, expect } from "vitest";

beforeAll(async () => {
	(env as unknown as { JWT_SECRET: string }).JWT_SECRET = "test-only-jwt-secret-for-vitest";
	await env.DB.exec(`
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'owner', created_at TEXT NOT NULL, recovery_email TEXT, totp_secret TEXT, passcode_hash TEXT, updated_at TEXT, business_name TEXT, brand_voice TEXT);
CREATE TABLE IF NOT EXISTS workspaces (id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, name TEXT NOT NULL, plan TEXT NOT NULL DEFAULT 'starter', created_at TEXT NOT NULL, stripe_customer_id TEXT, stripe_subscription_id TEXT, subscription_status TEXT NOT NULL DEFAULT 'active', current_period_end TEXT, cancel_at_period_end INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS workspace_members (workspace_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, PRIMARY KEY (workspace_id, user_id));
CREATE TABLE IF NOT EXISTS wallets (workspace_id TEXT PRIMARY KEY, balance_cents INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS security_answers (user_id TEXT NOT NULL, question_key TEXT NOT NULL, answer_hash TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (user_id, question_key));
CREATE TABLE IF NOT EXISTS api_tokens (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, workspace_id TEXT NOT NULL, name TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT, revoked_at TEXT, created_at TEXT NOT NULL, last_used_at TEXT);
`);
});

describe("Hia app Worker API", () => {
	it("reports health", async () => {
		const response = await SELF.fetch("http://example.com/api/health");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true, service: "heyIssac" });
	});

	it("protects the list behind authentication", async () => {
		const response = await SELF.fetch("http://example.com/api/list");
		expect(response.status).toBe(401);
		expect(await response.json()).toEqual({ error: "Sign in required" });
	});

	it("reports a guest session without a browser error", async () => {
		const response = await SELF.fetch("http://example.com/api/auth/me");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ user: null });
	});

	it("validates username availability input", async () => {
		const response = await SELF.fetch("http://example.com/api/auth/username-availability?username=ab");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ username: "ab", valid: false, available: false });
	});

	it("rejects passwords outside the baseline rule", async () => {
		const response = await SELF.fetch("http://example.com/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: "skillcheckuser", password: "onlyletters" }),
		});
		expect(response.status).toBe(400);
	});

	it("exposes shared recovery questions", async () => {
		const response = await SELF.fetch("http://example.com/api/auth/security-questions");
		expect(response.status).toBe(200);
		const body = await response.json() as { questions: { key: string; question: string }[] };
		expect(body.questions.length).toBeGreaterThanOrEqual(10);
	});

	it("exposes the model and add-on catalog without exposing secrets", async () => {
		const response = await SELF.fetch("http://example.com/api/catalog");
		expect(response.status).toBe(200);
		const body = await response.json() as { plans: { starter: { default: string; push: string[]; max: string }; studio: { default: string; push: string[]; max: string }; partner: { default: string; push: string[]; max: string } }; topUpMinimumCents: number };
		expect(body.plans.starter.default).toBe("qwen/qwen3.8-flash");
		expect(body.plans.starter.push).toEqual(["stepfun/step-3.5-flash", "writer/palmyra-x5", "arcee-ai/trinity-large-thinking"]);
		expect(body.plans.studio.push).toEqual(["google/gemini-3.8-flash", "thinkingmachines/inkling-small"]);
		expect(body.plans.partner.push).toEqual(["openai/gpt-6-astra"]);
		expect(body.plans.starter.max).toBe("minimax/minimax-m3:batch");
		expect(body.plans.studio.max).toBe("anthropic/claude-sonnet-5:batch");
		expect(body.plans.partner.max).toBe("openai/gpt-6-astra-pro");
		expect(body.topUpMinimumCents).toBe(300);
	});

	it("protects run, billing, and search boundaries behind the session", async () => {
		for (const path of ["/api/billing", "/api/search?q=hello", "/api/runs/not-a-run"]) {
			const response = await SELF.fetch(`http://example.com${path}`);
			expect(response.status).toBe(401);
		}
	});

	it("supports profile persistence and bearer-token API access", async () => {
		const username = `apiuser${Date.now()}`;
		const register = await SELF.fetch("http://example.com/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: "abc12345" }) });
		expect(register.status).toBe(201);
		const registeredBody = await register.json() as { user: { id: string } };
		const setCookie = register.headers.get("set-cookie") ?? "";
		expect(setCookie).toContain("Max-Age=2419200");
		expect(setCookie).toContain("HttpOnly");
		expect(setCookie).toContain("Secure");
		const cookie = setCookie.split(";")[0] ?? "";
		const profile = await SELF.fetch("http://example.com/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify({ businessName: "API Studio", brandVoice: "Clear and kind" }) });
		expect(profile.status).toBe(200);
		const tokenResponse = await SELF.fetch("http://example.com/api/auth/tokens", { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify({ name: "test client", expiresInDays: 2 }) });
		expect(tokenResponse.status).toBe(201);
		const tokenBody = await tokenResponse.json() as { token: string };
		const workspace = await SELF.fetch("http://example.com/api/workspace", { headers: { Authorization: `Bearer ${tokenBody.token}` } });
		expect(workspace.status).toBe(200);
		const ownWorkspaceId = (await workspace.json() as { workspace: { id: string } }).workspace.id;
		const otherWorkspaceId = `000_other_${Date.now()}`;
		await env.DB.prepare("INSERT INTO workspaces (id, owner_user_id, name, plan, created_at) VALUES (?, ?, ?, ?, ?)").bind(otherWorkspaceId, registeredBody.user.id, "Other workspace", "partner", "0000-01-01T00:00:00.000Z").run();
		await env.DB.prepare("INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)").bind(otherWorkspaceId, registeredBody.user.id, "owner").run();
		const scopedWorkspace = await SELF.fetch("http://example.com/api/workspace", { headers: { Authorization: `Bearer ${tokenBody.token}` } });
		expect(scopedWorkspace.status).toBe(200);
		expect((await scopedWorkspace.json() as { workspace: { id: string; plan: string } }).workspace).toMatchObject({ id: ownWorkspaceId, plan: "starter" });
		const me = await SELF.fetch("http://example.com/api/auth/me", { headers: { Authorization: `Bearer ${tokenBody.token}` } });
		expect(me.status).toBe(200);
	});
});
