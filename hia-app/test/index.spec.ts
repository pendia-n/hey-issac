import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

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

	it("rejects a missing session", async () => {
		const response = await SELF.fetch("http://example.com/api/auth/me");
		expect(response.status).toBe(401);
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
		const body = await response.json() as { plans: { starter: { default: string }; partner: { max: string } }; topUpMinimumCents: number };
		expect(body.plans.starter.default).toBe("qwen/qwen3.8-flash");
		expect(body.plans.partner.max).toBe("openai/gpt-6-astra-pro");
		expect(body.topUpMinimumCents).toBe(300);
	});

	it("protects run, billing, and search boundaries behind the session", async () => {
		for (const path of ["/api/billing", "/api/search?q=hello", "/api/runs/not-a-run"]) {
			const response = await SELF.fetch(`http://example.com${path}`);
			expect(response.status).toBe(401);
		}
	});
});
