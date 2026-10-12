# Meida

## What it is

Meida is a subscription web app for keeping a calm, source-linked view of one website's public market. A member submits a page URL; Meida keeps the exact page for its on-page check while grouping the room by the website's root domain. Each room has one of Meida's reusable 3D characters, a simple themed setting, a separate competitor panel, sourced updates, and a conversation for questions or draft wording.

## Why it exists

Small teams and solo operators are asked to keep up with search visibility, competitors, and public conversation across too many tabs. Meida is intended to collect those signals into a place a person can revisit, see what changed, open the original sources, and decide what to do. It should reduce the stress of constant checking without pretending that every search result matters or that an automated score can replace judgment.

## What makes it different

The character and room make recurring market research feel more like tending a creative space than operating a technical dashboard. The character is decorative and reacts to real workflow states; evidence and competitor records stay outside the 3D scene and remain readable. No competitor-specific models are generated. A room is public by default; Partner members may make it private. Empty states stay empty until the app has real results.

## Honest v1 scope

- Search once when a room is created, suggest competitors from those results, and let the member choose which to keep.
- Run scheduled or member-requested web searches and save new source-linked results. Search results are not guaranteed to be news, complete, current to the minute, or relevant; members can inspect the source.
- Read the submitted page's title, description, main heading, canonical URL, and robots directive. This is a basic on-page check, not a Google ranking report, whole-site crawl, or search-engine-specific GEO score.
- Provide an Exa Answer-backed question and drafting conversation with citations. Meida does not publish social posts.
- Show one main 3D character and a category-colored, procedural setting. The competitor list is beside the viewer, not in it. The base GLB is the still state; pose GLBs crossfade for work and response states. PNGs are load-failure fallbacks.
- Support public room browsing. Only the Partner plan can hide a room.

There are no seeded users, sample analytics, fictional check results, or prefilled public rooms. A new account sees empty states until it creates real data.

## Pages

- `/` explains Meida and links to plans and public rooms.
- `/signup` and `/signin` are separate username-and-password pages. Passwords are hashed in the Worker. There is no logged-out password recovery flow in this version.
- `/security` and `/profile` are authenticated account pages. A signed-in member can change their password from Security, subject to the server-side limit.
- `/pricing` describes the monthly tiers.
- `/about` explains how the app works; `/announcements` is honestly empty until a real announcement exists.
- `/rooms` lists the member's rooms; `/rooms/new` requires an active subscription.
- `/rooms/:id` contains the character viewer, competitor controls, sourced updates, page check, chat, and room visibility controls.
- `/share` and `/share/:id` show public rooms only. Competitors and owner-only controls are not included in public room responses.
- API authentication is cookie-based and can also be used by API clients that retain the session cookie. There is no OAuth requirement.

## Monthly plans and limits

| Plan | Price | Websites | Scheduled checks per website | Competitors | Chat replies | Manual search allowance | Page checks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Solo | $19/month | 1 | Up to 1/day | 3 | 30/month | 2/month | 1 per website/month |
| Studio | $49/month | 3 | Up to 2/day | 5 | 150/month | 6/month | 1 per website/month |
| Partner | $129/month | 8 | Up to 3/day | 8 | 400/month | 20/month | 2 per website/month |

The hourly Worker schedule selects only rooms whose interval is due and processes at most five rooms per invocation. The actual check is therefore approximate under load, not a guaranteed wall-clock appointment. Competitor monitoring is weekly when a room is due for a scheduled pass. Manual search allowance is shared by “Check now” and fresh competitor discovery. Initial room creation performs one search and a basic page check. A room per plan means one unique root domain; another URL on that same domain cannot be added until its existing room is deleted.

All tiers are public by default. Partner can switch an individual room to private. Plan changes are blocked while a subscription is active; cancel and wait until access ends before choosing another tier.

## Provider routing

The Worker reads provider keys only from these bindings:

- `TAVILY_API_KEY_1`, `TAVILY_API_KEY_2`, `TAVILY_API_KEY_3`
- `EXA_API_KEY_1`, `EXA_API_KEY_2`, `EXA_API_KEY_3`
- `FIRECRAWL_API_KEY_1`, `FIRECRAWL_API_KEY_2`, `FIRECRAWL_API_KEY_3`

For web search, Meida tries Tavily Search, then Exa Search, then Firecrawl Search; it stops at the first successful provider with results. A provider's three slots are tried in order, skipping slots on cooldown. HTTP 402 marks that slot exhausted temporarily and moves to the next key; 429 waits briefly; invalid/forbidden credentials are cooled down. Tavily and Exa balances are not guessed or presented as exact. Their local cost counters are estimates based on returned costs when available. Firecrawl's team credit-usage endpoint is checked and cached before use; a zero balance causes rotation. Provider limits can be shared across keys belonging to the same provider account, so key rotation is not additional quota.

Exa Answer is used for the room conversation and returns citations plus a reported cost. Exa Agent is not called by v1. Agent runs are asynchronous and separately metered; a future integration should create a run with a per-run budget, persist the run ID and owning user, poll its status, and record the final returned cost before exposing a result. It must not be silently substituted for ordinary search or chat.

Calls use the providers' HTTP APIs directly, so no Node-only SDK is required in the Cloudflare Worker runtime:

- [Tavily Search API](https://docs.tavily.com/documentation/api-reference/endpoint/search)
- [Exa Search API](https://exa.ai/docs/reference/search)
- [Exa Answer API](https://exa.ai/docs/reference/answer)
- [Exa Agent create-run API](https://exa.ai/docs/reference/agent-api/create-a-run)
- [Firecrawl Search API](https://docs.firecrawl.dev/api-reference/endpoint/search)
- [Firecrawl credit-usage API](https://docs.firecrawl.dev/api-reference/endpoint/credit-usage)

Provider keys are not read, printed, or used in live tests during deployment. Add them after deploy using the names above. Search and conversation features remain unavailable until the corresponding bindings are configured.

## Account and session security

- Sign-up requires a unique username and a password of 7-18 characters with at least one letter and one digit. The UI shows username availability and password validity; the Worker enforces both.
- Passwords use salted PBKDF2-SHA-256 in Web Crypto, which runs in Workers.
- The signed session is an HS256 JWT in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie with a 28-day lifetime. `MEIDA_JWT_SECRET` is not committed or exposed in this document.
- Password changes are available only after sign-in and are limited to four successful changes per rolling 24 hours.
- There is deliberately no email, TOTP, security question, passcode, or logged-out recovery endpoint in this version. A lost password currently requires a support-assisted account process; do not claim self-service recovery exists.

## Stripe setup and webhook

Checkout creates the displayed Solo ($19/month), Studio ($49/month), and Partner ($129/month) recurring Prices inline. No Stripe Price IDs need to be created or configured. Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Worker secrets.

1. Deploy Meida and copy its HTTPS Worker URL.
2. In Stripe Dashboard, open Developers → Webhooks and add `https://<worker-host>/api/stripe/webhook` as the destination.
3. Subscribe the destination to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`.
4. Reveal the destination's signing secret in Stripe and set it in Cloudflare as `STRIPE_WEBHOOK_SECRET`. Do not put the value in source, chat, or `APP.md`.
5. Perform a deliberate Stripe test-mode checkout and webhook test before enabling live payments.

The billing page offers a 50% refund of the first successful subscription payment only during the first 47 hours after that payment; requesting it also cancels the subscription immediately. Renewals are not eligible. Refund/cancel behavior must be verified in Stripe test mode before live sales. Stripe credentials are not present in the deployment until the owner configures them.

## Deploy checklist

- Confirm D1 `meida-db` migrations and R2 bucket `meida-assets` exist in the target Cloudflare account.
- Confirm the 48 authored `.glb` and `.png` model files from `haissac-asset` are present in R2. They are served publicly through `/assets/<filename>` with explicit GLB/PNG MIME types.
- Set the already-generated `MEIDA_JWT_SECRET` in the Worker secret store; never print or commit its value.
- Add provider key bindings after deployment. Do not run paid/live-provider checks without an explicit separate request.
- Configure the Stripe API key and webhook secret; set up the webhook as above. Until then, checkout remains unavailable by design.
- Build and inspect desktop, tablet, and narrow-screen UI. PWA support is not included.

## Runtime and data

The frontend uses React Router with the Cloudflare Vite plugin; the request handler receives Worker environment bindings directly. D1 stores accounts, sessions' version counters, billing state, rooms, competitors, findings, page checks, and chat messages. R2 stores the authored viewer assets. A scheduled Worker trigger handles due market checks. No secret value belongs in `.env.example`, `.dev.vars.example`, Git, logs, generated screenshots, or browser code.
