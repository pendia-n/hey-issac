export type ProviderName = 'exa' | 'brave' | 'tavily' | 'firecrawl';

export type ProviderCredential = {
	provider: ProviderName;
	label: string;
	apiKey?: string;
};

export type UsageAmount = {
	used: number | null;
	limit: number | null;
	remaining: number | null;
};

export type ProviderUsageSnapshot = {
	provider: ProviderName;
	label: string;
	status: 'available' | 'observed_only' | 'unsupported' | 'not_configured' | 'error';
	unit: 'credits' | 'requests' | 'none';
	asOf: string;
	resetAt: string | null;
	amount: UsageAmount;
	details?: Record<string, unknown>;
	note: string;
};

type Fetcher = typeof fetch;

const emptyAmount = (): UsageAmount => ({ used: null, limit: null, remaining: null });
const finiteNumber = (value: unknown): number | null => {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const remaining = (used: number | null, limit: number | null) => used === null || limit === null ? null : Math.max(0, limit - used);

async function readJson(response: Response): Promise<Record<string, any>> {
	if (!response.ok) throw new Error(`provider_usage_${response.status}`);
	const body = await response.json();
	if (!body || typeof body !== 'object') throw new Error('provider_usage_invalid_response');
	return body as Record<string, any>;
}

async function readFirecrawl(label: string, apiKey: string, fetcher: Fetcher, asOf: string): Promise<ProviderUsageSnapshot> {
	const response = await fetcher('https://api.firecrawl.dev/v2/team/credit-usage', {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	const body = await readJson(response);
	const data = body.data && typeof body.data === 'object' ? body.data : {};
	const remainingCredits = finiteNumber(data.remainingCredits);
	const planCredits = finiteNumber(data.planCredits);
	return {
		provider: 'firecrawl',
		label,
		status: 'available',
		unit: 'credits',
		asOf,
		resetAt: typeof data.billingPeriodEnd === 'string' ? data.billingPeriodEnd : null,
		amount: { used: null, limit: planCredits, remaining: remainingCredits },
		details: {
			billingPeriodStart: typeof data.billingPeriodStart === 'string' ? data.billingPeriodStart : null,
			planCredits,
		},
		note: 'Remaining team credits from Firecrawl. Credits are not a USD cash balance.',
	};
}

async function readTavily(label: string, apiKey: string, fetcher: Fetcher, asOf: string): Promise<ProviderUsageSnapshot> {
	const response = await fetcher('https://api.tavily.com/usage', {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	const body = await readJson(response);
	const key = body.key && typeof body.key === 'object' ? body.key : {};
	const account = body.account && typeof body.account === 'object' ? body.account : {};
	const keyUsed = finiteNumber(key.usage);
	const keyLimit = finiteNumber(key.limit);
	const planUsed = finiteNumber(account.plan_usage);
	const planLimit = finiteNumber(account.plan_limit);
	const paygoUsed = finiteNumber(account.paygo_usage);
	const paygoLimit = finiteNumber(account.paygo_limit);
	return {
		provider: 'tavily',
		label,
		status: 'available',
		unit: 'credits',
		asOf,
		resetAt: null,
		amount: { used: planUsed, limit: planLimit, remaining: remaining(planUsed, planLimit) },
		details: {
			currentPlan: typeof account.current_plan === 'string' ? account.current_plan : null,
			key: { used: keyUsed, limit: keyLimit, remaining: remaining(keyUsed, keyLimit) },
			paygo: { used: paygoUsed, limit: paygoLimit, remaining: remaining(paygoUsed, paygoLimit) },
			searchUsage: finiteNumber(account.search_usage),
			extractUsage: finiteNumber(account.extract_usage),
			crawlUsage: finiteNumber(account.crawl_usage),
			mapUsage: finiteNumber(account.map_usage),
			researchUsage: finiteNumber(account.research_usage),
		},
		note: 'Plan remaining capacity is calculated from Tavily usage and limit fields. No USD wallet balance is claimed.',
	};
}

function unavailableSnapshot(credential: ProviderCredential, asOf: string): ProviderUsageSnapshot {
	if (!credential.apiKey) return {
		provider: credential.provider,
		label: credential.label,
		status: 'not_configured',
		unit: 'none',
		asOf,
		resetAt: null,
		amount: emptyAmount(),
		note: 'No runtime credential was supplied.',
	};
	if (credential.provider === 'exa') return {
		provider: 'exa',
		label: credential.label,
		status: 'unsupported',
		unit: 'none',
		asOf,
		resetAt: null,
		amount: emptyAmount(),
		note: 'Exa does not document a public current-balance API. Team Management can report historical spend only.',
	};
	return {
		provider: 'brave',
		label: credential.label,
		status: 'observed_only',
		unit: 'requests',
		asOf,
		resetAt: null,
		amount: emptyAmount(),
		note: 'Brave exposes quota only in headers on legitimate API responses; prepaid USD balance remains dashboard-only.',
	};
}

export async function readProviderUsage(
	credentials: readonly ProviderCredential[],
	options: { fetcher?: Fetcher; now?: Date } = {},
): Promise<ProviderUsageSnapshot[]> {
	const fetcher = options.fetcher ?? fetch;
	const asOf = (options.now ?? new Date()).toISOString();
	return Promise.all(credentials.map(async (credential): Promise<ProviderUsageSnapshot> => {
		if (!credential.apiKey || credential.provider === 'exa' || credential.provider === 'brave') return unavailableSnapshot(credential, asOf);
		try {
			return credential.provider === 'firecrawl'
				? await readFirecrawl(credential.label, credential.apiKey, fetcher, asOf)
				: await readTavily(credential.label, credential.apiKey, fetcher, asOf);
		} catch (cause) {
			return {
				provider: credential.provider,
				label: credential.label,
				status: 'error',
				unit: 'credits',
				asOf,
				resetAt: null,
				amount: emptyAmount(),
				note: cause instanceof Error ? cause.message : 'provider_usage_failed',
			};
		}
	}));
}

function parseQuotaHeader(value: string | null): number[] {
	if (!value) return [];
	return value.split(',').map((item) => Number(item.trim())).filter((item) => Number.isFinite(item) && item >= 0);
}

export function captureBraveQuotaHeaders(label: string, headers: Headers, now = new Date()): ProviderUsageSnapshot {
	const limits = parseQuotaHeader(headers.get('X-RateLimit-Limit'));
	const remainingValues = parseQuotaHeader(headers.get('X-RateLimit-Remaining'));
	const resets = parseQuotaHeader(headers.get('X-RateLimit-Reset'));
	const monthlyIndex = limits.length > 1 ? limits.length - 1 : 0;
	const limit = limits[monthlyIndex] ?? null;
	const remainingRequests = remainingValues[monthlyIndex] ?? null;
	const resetSeconds = resets[monthlyIndex] ?? null;
	return {
		provider: 'brave',
		label,
		status: limit === null && remainingRequests === null ? 'observed_only' : 'available',
		unit: 'requests',
		asOf: now.toISOString(),
		resetAt: resetSeconds === null ? null : new Date(now.getTime() + resetSeconds * 1000).toISOString(),
		amount: {
			used: limit === null || remainingRequests === null ? null : Math.max(0, limit - remainingRequests),
			limit,
			remaining: remainingRequests,
		},
		details: { limits, remaining: remainingValues, resetSeconds: resets },
		note: 'Quota observed on a legitimate Brave response. It is not the prepaid USD balance.',
	};
}
