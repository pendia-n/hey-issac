import { describe, expect, it, vi } from 'vitest';
import { captureBraveQuotaHeaders, readProviderUsage } from '../src/provider-usage';

const now = new Date('2026-09-22T10:00:00.000Z');

describe('provider usage reader', () => {
	it('reads Firecrawl remaining credits without exposing the credential', async () => {
		const fetcher = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
			expect(init?.headers).toEqual({ Authorization: 'Bearer hidden-firecrawl-key' });
			return Response.json({ success: true, data: { remainingCredits: 825, planCredits: 1000, billingPeriodStart: '2026-09-01T00:00:00Z', billingPeriodEnd: '2026-10-01T00:00:00Z' } });
		}) as unknown as typeof fetch;
		const [snapshot] = await readProviderUsage([{ provider: 'firecrawl', label: 'primary', apiKey: 'hidden-firecrawl-key' }], { fetcher, now });
		expect(snapshot).toMatchObject({ provider: 'firecrawl', label: 'primary', status: 'available', unit: 'credits', resetAt: '2026-10-01T00:00:00Z', amount: { limit: 1000, remaining: 825 } });
		expect(JSON.stringify(snapshot)).not.toContain('hidden-firecrawl-key');
	});

	it('derives Tavily plan and key remaining capacity', async () => {
		const fetcher = vi.fn(async () => Response.json({
			key: { usage: 150, limit: 1000 },
			account: { current_plan: 'Free', plan_usage: 500, plan_limit: 1000, paygo_usage: 0, paygo_limit: 0, search_usage: 300, research_usage: 200 },
		})) as unknown as typeof fetch;
		const [snapshot] = await readProviderUsage([{ provider: 'tavily', label: 'primary', apiKey: 'hidden-tavily-key' }], { fetcher, now });
		expect(snapshot.amount).toEqual({ used: 500, limit: 1000, remaining: 500 });
		expect(snapshot.details?.key).toEqual({ used: 150, limit: 1000, remaining: 850 });
	});

	it('does not invent Exa or Brave balances', async () => {
		const snapshots = await readProviderUsage([
			{ provider: 'exa', label: 'primary', apiKey: 'hidden-exa-key' },
			{ provider: 'brave', label: 'search', apiKey: 'hidden-brave-key' },
		], { now });
		expect(snapshots[0]).toMatchObject({ status: 'unsupported', amount: { remaining: null } });
		expect(snapshots[1]).toMatchObject({ status: 'observed_only', amount: { remaining: null } });
	});

	it('captures Brave monthly quota from an existing response', () => {
		const headers = new Headers({
			'X-RateLimit-Limit': '2, 1000',
			'X-RateLimit-Remaining': '1, 740',
			'X-RateLimit-Reset': '1, 86400',
		});
		const snapshot = captureBraveQuotaHeaders('search', headers, now);
		expect(snapshot).toMatchObject({ status: 'available', unit: 'requests', amount: { used: 260, limit: 1000, remaining: 740 }, resetAt: '2026-09-23T10:00:00.000Z' });
	});
});
