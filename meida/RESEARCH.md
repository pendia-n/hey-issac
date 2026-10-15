# Meida research pipeline

## Task mapping

| Task | Primary | Fallback | Frequency |
| --- | --- | --- | --- |
| Business overview/category | Exa Answer, structured | Official search/page evidence | Creation and monthly when automatic research is enabled; manual refresh once/site/month |
| Competitor discovery | Exa Deep Search, structured | Search evidence plus Exa Answer | Creation and quarterly when enabled; manual discovery uses shared manual checks |
| Main-site news | Tavily Basic/news | Firecrawl news, Exa Auto/news | Existing Solo/Studio/Partner market slots |
| Competitor news | Tavily Basic/news | Firecrawl news, Exa Auto/news | Once per competitor/week, spread over Sun-Fri at 14:00 New York |
| Website review | Direct HTML | Firecrawl HTML scrape | Creation, monthly Solo/Studio, twice monthly Partner, plus existing manual allowance |
| Website advice | Exa Answer grounded in measured observations | Preserve measurements if synthesis fails | Manual review; automatic review only when enabled |
| Chat and marketing drafts | Exa Answer with conversation/profile/saved findings | Explicit unavailable response | Existing 30/150/400 monthly chat limits |
| Deeper investigation | Exa Agent, fixed low effort | No silent escalation | Explicit Partner request, one/account/month |

No function publishes social posts. Competitors remain beside the character viewer.

## Credit handling

The existing nine secret names are unchanged: TAVILY_API_KEY_1..3,
EXA_API_KEY_1..3, FIRECRAWL_API_KEY_1..3. Each secret must represent a usable
allowance; keys sharing a provider account can share its balance.

Tavily and Firecrawl usage observations are cached for 15 minutes. Account and
key limits are respected. Known reset dates affect selection priority. A key's
balance check, reservation and request are serialized with a D1 lease. Actual
reported usage replaces the request estimate; uncertain failures retain an
estimated charge. No balance or credential values are logged.

Exa remaining credit is an estimate, initially $10 per configured slot. It does
not pretend that a 24-hour cooldown renews monthly credit. Optional non-secret
EXA_CREDIT_WINDOWS can describe independently verified windows:

```json
{"1":{"startsAt":"2026-10-16T00:00:00Z","endsAt":"2026-11-16T00:00:00Z","allowance":10}}
```

Dates above are illustrative, not account information. Configure actual dates
and available allowance, including any prior playground consumption. Advance
the window only when renewal is confirmed. Without confirmed renewal data an
exhausted estimated budget stays exhausted. An Exa window is applied once; an
unchanged window never refills the balance.

Tavily switches behind Firecrawl for news when three observed Tavily slots
collectively fall below the 600-credit reserve. Tavily remains a fallback if
Firecrawl cannot complete the request. Empty successful news is not an error.
Firecrawl routine search does not scrape every result. Agent never uses auto
effort or paid contact enrichment. Provider prices and estimates are not a
guarantee of account entitlement or future billing rates.

## Scheduling and rollout

Keep the existing hourly cron. D1 research_jobs provides leases, up to three
attempts, and recovery of missed slots for 48 hours. The first rollout does not
replay pre-migration hours. Jobs recheck paid access and competitor selection.

AUTOMATIC_RESEARCH defaults off. Set this non-secret Worker variable to true
only after approval to enable initial Exa overview/discovery and automatic
profile/discovery/advice refreshes. Manual features work independently. This
switch exists because automatic approval review blocked enabling the additional
automatic calls; it is not an additional subscription restriction.

Apply migration 0005 before deploying the new Worker. Existing subscription
prices, URL limits, main-site market slots and monthly chat limits are preserved.

## Verification

`node --test tests/research-pipeline.test.mjs` uses in-memory SQLite and intercepted
fetch calls only. No live provider credentials or production user records are
used. TypeScript and the production build must also pass before release.
