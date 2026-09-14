# Premium COD ecommerce

Next.js App Router, TypeScript, Tailwind, Radix Dialog, Supabase, Zod, React Hook Form, Zustand, Vitest and Playwright. The catalog starts empty; test products exist only in tests.

## Local setup

1. Run `npm ci` with Node 20.9+ (Node 24 recommended).
2. Copy `.env.example` to `.env.local` and supply the Supabase URL, publishable key and server-only service-role key. Set `SITE_URL` to the exact browser origin. Set `RATE_LIMIT_SECRET` to a cryptographically random secret of at least 32 bytes.
3. Apply `supabase/migrations/001_store.sql` to a fresh Supabase PostgreSQL project using the SQL editor or Supabase CLI migrations.
4. Create the administrator in Supabase Authentication. Disable public signup in Auth settings. Insert the corresponding UUID into `public.profiles` with `role = 'admin'` using the SQL editor. Role creation is intentionally unavailable through the application.
5. Run `npm run dev`, visit `/admin/login`, and configure branding, support, policies and shipping rules. Mark policies reviewed only after business approval. Add real categories, products, images and inventory.

No matching active shipping rule means the destination is not served. More specific city rules precede regional rules, followed by the default. Prices and fees are stored as integer minor units. The UI accepts currency units in admin editors.

## Checks

`npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`.

Playwright uses installed Microsoft Edge by default. Set a Chromium channel in `playwright.config.ts` if your environment uses another supported browser. Responsive tests cover 375, 430, 768, 1024 and 1440 pixels. The browser suite runs against an unconfigured, intentionally empty store; configure an isolated Supabase test project for live Auth/Storage acceptance testing.

## Security model

Every admin page and mutation checks a verified Supabase user plus the explicit profile role. RLS separately limits table access. Only server-side order/quote/tracking code imports the service-role client. Orders and item snapshots have no anonymous policies. A PostgreSQL transaction serializes duplicate idempotency keys, locks stock rows, validates active products/options, calculates shipping and prices, reserves stock, and writes immutable snapshots and status history. Cancelling or returning an order restores stock once through the allowed status transition RPC.

Confirmation uses a random secret in an HTTP-only same-site receipt cookie; the database stores only its hash. Tracking checks order number plus normalized phone and returns only status, item quantities/names, timestamps and city/region. It never returns full addresses or phone numbers. Checkout retries reuse the same key and receipt secret; an ambiguous attempt retains its key rather than risking a duplicate order.

Persistent database rate limiting protects login by normalized email, checkout by phone, quote by destination and tracking by both phone and order number. Deploy behind a trusted edge/WAF with an IP limit for these endpoints to prevent distributed or identity-rotating abuse. Do not trust arbitrary forwarded IP headers. Expired `rate_limits` rows may be pruned by a scheduled database job.

Use HTTPS in production, set Auth site URLs, configure backups and review policies before opening orders. The service-role key must never use a `NEXT_PUBLIC_` prefix. No payment provider, public admin signup, customer accounts, newsletter or unrelated commerce features are included.

## Workspace dependency placement

The initial dependency installation ran out of disk space. A temporary installation on D: recovered the packages; the completed dependencies were restored to the workspace to avoid Windows cross-drive module resolution issues. A normal `npm ci` is the supported setup.

