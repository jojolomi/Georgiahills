# Documentation Index

This folder contains onboarding and handover docs for the Next.js web app (`apps/web`) and admin operations.

## Quick start

1. Install dependencies:

```bash
pnpm i
```

2. Start development server:

```bash
pnpm dev
```

3. Build production bundle:

```bash
pnpm build:astro
```

## Environment variables

Set these in `apps/web/.env.local` for local development.

### Required for full functionality

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### Observability / analytics

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_TRACES_SAMPLE_RATE`
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`
- `GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `GA4_API_SECRET`
- `GA4_TEST_EVENT_CODE`

### Optional / environment-specific

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_MEDIA_BUCKET`
- `ROBOTS_DISALLOW_ALL`
- `NEXT_PUBLIC_APP_ENV`
- `API_RATE_LIMIT_CAPACITY`
- `API_RATE_LIMIT_REFILL_PER_SEC`
- `VERCEL_ENV`

### Content sync tooling (optional)

- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIREBASE_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `CONTENTFUL_EXPORT_PATH`

## Common commands

- `pnpm dev` — run app locally.
- `pnpm build:astro` — build `apps/web`.
- `pnpm preview:astro` — run built app.
- `pnpm test:e2e:core` — core Playwright flow tests.
- `pnpm test:a11y` — Playwright + axe critical accessibility scan.
- `pnpm seo:validate` — SEO validation suite.

## Guides

- [Setup guide](./setup.md)
- [Deployment & rollback](./deployment.md)
- [Admin users & roles](./admin-users-and-roles.md)
- [Content editing (MDX/CMS)](./content-editing.md)
- [Maintenance checklist](./maintenance-checklist.md)
