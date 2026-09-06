# heyIssac

heyIssac is a small-business growth companion built as a Cloudflare Worker app. It gives non-technical founders a calm weekly place to understand what people can find, what is missing, and what next action is worth doing.

## Why This App Exists

Small businesses often know they should improve marketing, search visibility, website clarity, and public conversation, but the work arrives as noise. heyIssac turns that noise into a short list. The goal is not to automate the founder out of the loop; the goal is to make the next useful move easier to see.

## What It Solves

heyIssac helps users:

- Check whether their public website and discovery signals are clear.
- Rank small growth actions by usefulness.
- Keep recommendations understandable without requiring marketing vocabulary.
- Hold final approval before public content, edits, or promises are made.
- Return to a weekly rhythm instead of starting from scratch each time.

## How It Reduces Stress

The app reduces stress by gathering scattered signals into one familiar workspace. It uses simple language, short lists, visible progress, and account recovery options so users feel oriented instead of trapped inside technical settings. The interface is designed to behave like a practical shop shelf: see what is present, notice what is missing, and choose the next item to handle.

## Why It Is Unique

heyIssac combines growth diagnosis, ranked action planning, public evidence, and human approval in a small-business-first interface. It is intentionally lighter than a full enterprise SEO or marketing suite, but more practical than a generic chatbot because it has account structure, recovery, workspace context, and API-first auth ready for future agentic or MCP clients.

## Auth And Security Baseline

The app uses username-first authentication. Username and password are the only required signup fields. Recovery email, authenticator setup, security questions, and passcode are optional recovery methods. Passwords and passcodes are hashed server-side with a Cloudflare Worker-compatible Web Crypto flow. Sessions are issued as signed JWTs in secure HttpOnly cookies.

## Agent and billing readiness

The Worker exposes an API-first run loop. A run is owned by the authenticated workspace and receives a random `run_id`; every provider call receives a child `request_id`, with provider request/generation IDs, token usage, provider cost, and status stored in D1. Evidence is stored as run-scoped snapshots, and result retrieval always filters by both `run_id` and workspace membership. Browser sessions use a 28-day signed JWT HttpOnly cookie; agent and MCP clients can use a revocable, hashed bearer token created from Security.

The default model is included in the selected plan. `push` and `max` are usage-priced upgrades using the model catalog in `src/index.ts`. Stripe Checkout handles top-ups of at least $3, and a signature-verified webhook credits the workspace wallet exactly once. Provider usage is measured from the OpenRouter response, and the server applies the 1.4 multiplier before recording the charge. Wallet debit and its ledger row are committed as one D1 batch; the browser never calculates or authorizes a charge.

Each run moves through `queued`, `running`, and `completed` or `failed`. The Worker performs a search stage, up to five bounded page reads, evidence deduplication, a diagnosis stage, a planning/ranking stage, and a single repair attempt for malformed model JSON. Search positions are retained as measured rank checks; GEO visibility is recorded separately and is never invented when it was not measured. Runs are limited to 20 per workspace per rolling day and two active runs at once. Failed runs remove partial actions and evidence so the List only shows complete recommendations.

Projects, runs, evidence, actions, profiles, wallets, subscription state, and API tokens are persisted in D1. Actions can be approved, dismissed, completed, or published from the List. Subscription tier access is checked server-side against the workspace plan and active subscription status, while the UI reflects the same entitlement.

Required integration secrets before live agent runs: `OPENROUTER_API_KEY`, one search provider key (`TAVILY_API_KEY` or `BRAVE_SEARCH_API_KEY`), and `FIRECRAWL_API_KEY` for page reading. Required payment secrets before top-ups: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Without them, the app keeps auth and read-only catalog/health behavior available and reports the missing capability clearly.

## Design Notes

The current visual direction follows a user-friendly, cozy, practical style rather than a technical dashboard. Current Apple Human Interface Guidelines emphasize persistent top-level navigation, a small number of clear destinations, recognizable symbols, and layouts that adapt across compact and regular screen sizes. The mobile app navigation therefore uses symbols for the tabs while preserving accessible names.

Glassmorphism and brick-like systems can be considered for future themes, but the current implementation keeps the design warmer, clearer, and easier to read for ordinary business users.

## Domain Search

Namecheap availability was checked for the heyIssac name on September 2, 2026. Available domains at or below 18 USD/year:

- heyissac.com - 10.98 USD/year
- heyissac.net - 11.98 USD/year
- heyissac.org - 7.98 USD/year
- heyissac.app - 6.98 USD/year
- heyissac.co - 7.98 USD/year
- hey-issac.com - 10.98 USD/year
- hey-issac.net - 11.98 USD/year
- hey-issac.org - 7.98 USD/year
- hey-issac.app - 6.98 USD/year
- hey-issac.co - 7.98 USD/year

Excluded because over 18 USD/year:

- heyissac.io - 34.98 USD/year
- hey-issac.io - 34.98 USD/year
