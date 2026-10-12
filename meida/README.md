# Meida

Meida is a subscription-based market room for one website per room. It finds public web signals, keeps source links beside the character scene, and offers a basic website-page review. Room creation requires an active Stripe subscription. There is no password recovery: losing the username or password means losing access to that account.

## Local setup

```sh
pnpm install
pnpm run dev
```

The Worker uses the `MEIDA_JWT_SECRET` value from the ignored `.env` file for local development. It must be exactly 32 random bytes encoded as 64 hexadecimal characters. Create it without printing the value to the terminal:

```sh
openssl rand -hex 32 | awk '{ print "MEIDA_JWT_SECRET=" $0 }' > .env
chmod 600 .env
```

For local Wrangler development, put the same variable in `.dev.vars`. Do not commit either file.

## Stripe setup

Checkout creates the Solo ($19/month), Studio ($49/month), and Partner ($129/month) recurring Prices inline. No Stripe Price IDs need to be created or configured. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Worker secrets. Checkout remains unavailable until both are configured.

To connect Stripe webhooks:

1. Deploy the Worker and copy its public URL.
2. In Stripe Dashboard, open **Developers → Webhooks** and add an endpoint at `https://<your-worker-host>/api/stripe/webhook`.
3. Subscribe the endpoint to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`.
4. Reveal the endpoint's signing secret once and save it as the Worker secret `STRIPE_WEBHOOK_SECRET`. Save your Stripe API secret as `STRIPE_SECRET_KEY`.
5. Test checkout and webhook delivery in Stripe test mode before switching to a live-mode API key and webhook secret.

The Worker verifies Stripe's timestamped signature against the raw request body before processing an event. It stores handled event IDs so Stripe retries do not normally repeat the work. The Billing page offers a 50% refund of the first successful payment when requested within 47 hours; submitting that request also cancels the subscription immediately.

## Cloudflare resources

`wrangler.jsonc` binds the `meida-db` D1 database and `meida-assets` R2 bucket. Apply database migrations before the first deployment:

```sh
pnpm exec wrangler d1 migrations apply meida-db --remote
pnpm run deploy
```

The app expects the Worker secret `MEIDA_JWT_SECRET` to contain the same 32-byte hex secret as `.env`. Set it without displaying the value:

```sh
sed -n 's/^MEIDA_JWT_SECRET=//' .env | pnpm exec wrangler secret put MEIDA_JWT_SECRET
```

Add the Tavily, Exa, or Firecrawl API keys as Worker secrets named `TAVILY_API_KEY_1` through `_3`, `EXA_API_KEY_1` through `_3`, and `FIRECRAWL_API_KEY_1` through `_3`. Search-provider credentials are independent from Stripe checkout; a paid plan can be purchased before search keys are configured, but room creation waits until at least one search provider is available.
