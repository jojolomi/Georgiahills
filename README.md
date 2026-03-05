# Georgiahills Monorepo

This repository is organized as a pnpm workspace monorepo.

## Workspace Layout
- `apps/web` — Next.js web application (canonical app).
- `packages/ui` — shared UI components.
- `packages/lib` — shared utilities and domain logic.
- `packages/types` — shared TypeScript types/contracts.
- `infrastructure` — deployment and infrastructure assets.

## Workspace Config
- `pnpm-workspace.yaml` includes:
  - `apps/*`
  - `packages/*`

## Quick Start
```bash
pnpm install
pnpm -w list
```

## Production Caching Notes (Vercel / Cloudflare)

The web app applies cache headers in two layers:
- `apps/web/next.config.js`:
  - `/_next/static/*` => `Cache-Control: public, max-age=31536000, immutable`
  - common static assets/images/fonts => `Cache-Control: public, max-age=31536000, immutable`
- `apps/web/src/middleware.js`:
  - HTML/document responses => `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`

### Vercel
- Keep the above app-level headers enabled.
- If adding overrides in dashboard/project config, preserve:
  - immutable caching for `/_next/static/*`
  - short edge TTL + `stale-while-revalidate` for HTML routes.

### Cloudflare (example rules)
- Cache Rule 1 (`/_next/static/*`):
  - Cache eligibility: On
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: Respect Existing Headers (or 1 year)
- Cache Rule 2 (HTML pages):
  - Match: non-API routes, content-type text/html
  - Edge Cache TTL: 60s
  - Serve stale while revalidate: 300s
  - Bypass for authenticated/admin paths if needed.

### Header Verification Examples
```bash
curl -I https://<host>/_next/static/chunks/<file>.js
curl -I https://<host>/en
```

## SEO/GEO Program Artifacts
- `docs/seo-geo-program/12-week-gantt.md`
- `docs/seo-geo-program/outreach-targets.csv`
- `docs/seo-geo-program/outreach-email-template.md`
- `docs/seo-geo-program/influencer-shortlist.md`
- `docs/seo-geo-program/kpi-dashboard-access.md`
- `docs/seo-geo-program/performance-remediation-log.md`
- `docs/seo-geo-program/firebase-next-cutover.md`
- `docs/seo-geo-program/executive-summary-en.md`
- `docs/seo-geo-program/executive-summary-ar.md`
