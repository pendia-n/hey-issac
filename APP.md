# heyIssac

heyIssac is a small business's living office: it reads the public website, finds a few evidence-backed market alternatives, explains how clearly the offer can be understood through search and AI answers, and suggests practical next steps. Paid offices can receive a weekly site and market pulse. It never publishes on the user's behalf and never invents activity or results.

## Why This Exists

Marketing advice can feel like a pile of disconnected tools: search rankings in one place, AI-answer visibility in another, competitor research somewhere else, and draft copy in a fourth. heyIssac brings one useful first read and later evidence-backed updates into a single, approachable office so owners can see what changed and decide what to do next.

The product should feel like tending a small business, not operating a technical console. Its eventual animated office is a presentation layer for real work states and real findings. It must not manufacture activity, rankings, news, or customer metrics. The current version uses ordinary dashboard and report screens; the polished 2D character animation is deliberately deferred to a separate design and engineering pass. Scheduled checks are weekly, not continuous.

## What Is Included

- First Visit: $9 once for one complete report on one root website. It has no recurring monitoring or later refresh.
- Starter: $19/month for one office; Studio: $49/month for three offices; Partner: $99/month for eight offices. Each office receives one full report per billing period and up to four weekly site/market pulses during that period. Partner can add three offices for $8/month.
- A full report combines public-site reading, a few possible competitors from search, search discoverability and AI-answer readability observations, and practical next steps plus draft social posts. Candidate competitors are not described as confirmed without evidence. Search positions are only reported when observed in returned search results; GEO is not represented as a guaranteed ranking score.
- Push and Max remain optional model upgrades in the existing run flow; they do not increase the included office count or monitoring cadence. Their add-on pricing and model-cost guardrails must be configured and verified before they are offered as purchasable features.

The subscription quantities above are product entitlements encoded in this implementation, not provider query counts. The first full report uses that office's billing-period report allowance; another becomes available at renewal. A weekly pulse is a smaller scheduled check, capped at four per office per billing period, and does not consume the full-report allowance. Provider calls and model requests remain implementation details and require operational limits so the app's cost stays bounded.

## Account and Safety

Sign-up uses a unique username and a 7-18 character password with at least one letter and one digit. The password is PBKDF2-SHA-256 hashed using the Workers Web Crypto API. Sign-in uses username and password only. Users may set up an 8-character lowercase-alphanumeric recovery passcode, an authenticator (TOTP), or both. TOTP setup is verified before saving. Recovery is a standalone signed-out page; it shows only methods enabled on that account and permits a password reset only after one method verifies. Security controls are available after sign-in. Sessions use a Secure, HttpOnly cookie for 35 days. API-only sign-up and sign-in are supported alongside the UI.

## Technical Design

- React Router + React, built by Vite for Cloudflare Workers.
- Hono API routes in the same Worker.
- Cloudflare D1 for accounts, workspaces, projects/offices, reports, actions, evidence, usage, billing records, and provider quota ledger.
- Durable Object alarm for asynchronous report execution.
- OpenRouter for report synthesis and diagnosis; model requests are recorded per run with request IDs, token counts, and provider cost when returned.
- Exa, Tavily, and Firecrawl pools: ten free-account slots plus one separate paid-tier slot per provider. Free slots are preferred. Tavily's plan allowance and Firecrawl's remaining credits are checked before use; the Firecrawl paid slot is additionally capped by its monthly plan allocation and current-period usage, excluding purchased credit balance. Exa is budgeted by a local estimate because this implementation cannot query an authoritative live Exa balance. Exa reset dates are configured individually.
- Stripe Checkout for subscriptions and the one-time brief. Stripe products/prices and webhook setup must exist in the Stripe account before checkout is available.

## Deployment Checklist

1. Create a new D1 database and apply every SQL migration in order.
2. Add the Worker secrets listed in `.env.example` to the Cloudflare Worker. Never commit `.env` or paste secret values into chat or logs.
3. Configure each Exa reset date using an ISO-8601 UTC timestamp. The local Exa meter is an estimate, not provider-confirmed remaining credit.
4. Create Stripe prices for $19, $49, $99 monthly, $9 one-time, and optional $8/month Partner office expansion. Set the matching price IDs and webhook secret in the Worker configuration.
5. Set the Stripe webhook endpoint to `/api/stripe/webhook` and subscribe to Checkout completion and subscription update/deletion events.
6. Deploy and complete a small real paid end-to-end run before inviting users.

## Important Current Boundaries

- The $9 report is queued after a verified paid Stripe webhook; configure D1, the Durable Object, OpenRouter, search credentials, and Stripe before it can complete.
- Weekly checks are opt-in per office and run through the Worker Cron trigger. The first scheduled check establishes a real baseline; subsequent checks save only actual site changes and returned market sources.
- The office feed and source viewing are implemented. Ask Issac provides a bounded number of evidence-only answers per workspace billing period; it does not launch new web searches for each question.
- The animated office and per-business character/room variations are deferred to a separate design/engineering pass. The target is a reusable 2D sprite/state system, not a large prebuilt asset library.
- The on-page plan quota needs reconciliation against actual Stripe billing periods and thorough webhook idempotency review before production launch.
- Do not display estimated provider usage as a live account balance, and do not show invented metrics as real findings.

## Fountain-Over-Tap Direction

- Keep monthly plans; the product's weekly rhythm is the office pulse, not a weekly subscription. Each office gets one complete report per billing period and at most four weekly pulses. A separate $9 report is an explicit purchase, not an automatic overage. Push and Max change the full-report model only; saved-evidence questions use the plan model and do not trigger a web search.
- The later animated office should be a detailed, readable 2D room with the composed environment of the third supplied reference and the character scale/detail of the second. Do not build the first reference's schematic boxes as the animation.
- Render motion in the open browser with a small reusable sprite/room kit. Vary the room using a stable palette, furniture, props, and a small set of character accessories selected from the real site category and its visible content; a booking service and a pet-food shop should not look identical. Use a neutral room if classification is uncertain. This is modular art direction, not a huge pre-made asset library.
- Keep the monitored website's character and helpers on a cooperative office team. Competitors are sourced market notes on a board, not invented rival characters or a battle scene. A character may report a saved, cited update when a real check finds something; never stage work just to keep the room busy.
- The Worker schedules checks and writes actual state to D1; it does not render animation frames. The browser animates locally while visible, pauses when hidden, and respects reduced-motion settings. A decorative idle loop must not imply a check or market event occurred.
- Refund policy recommendation, not yet implemented: offer a seven-day refund on the first subscription payment or a $9 report when processing has not begun; if a paid report fails and cannot be delivered after a retry within 24 hours, refund it in full regardless of that window. Publish final terms only after local legal review and implement refund operations before presenting them as an active guarantee.
