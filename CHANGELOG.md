# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased]

### Added

- Root onboarding documentation under `docs/`:
  - setup
  - deployment & rollback
  - admin users & roles
  - content editing
  - maintenance checklist
- New contributor guide (`CONTRIBUTING.md`).
- Quick wins:
  - 3 AVIF homepage hero assets (`hero-home-640/1024/1600.avif`)
  - hero image preloads in root layout
  - root homepage metadata + Open Graph + hreflang alternates
  - explicit server compression config in Next.js
- Reusable GitHub composite actions:
  - `.github/actions/checkout-with-fallback`
  - `.github/actions/setup-node-pnpm`
- Firebase cost monitor alerting behavior now creates/updates a `Firebase budget alert` GitHub issue when budget checks fail.

### Changed

- Root `pnpm dev` script now runs `apps/web` development server.
- Standardized workflow checkout/setup logic across CI/deploy/SEO/lighthouse jobs.
- Added workflow timeouts and artifact retention policies to reduce hung runs and storage sprawl.
- Hardened production functions deploy with `ENABLE_FUNCTIONS_DEPLOY` opt-in guard.
- Expanded cutover smoke checks to validate mode input and response content-type for `sitemap.xml`/`robots.txt`.
- Expanded market hreflang audit to enforce canonical, `og:url`, and HTML `lang`/`dir` consistency for GCC locale pages.
- Added Lighthouse config guardrails (`perf:lighthouse:config`) to enforce critical route coverage and stronger CWV thresholds.
- Expanded Playwright accessibility scan coverage to EN/AR critical routes and wired `test:a11y` into `release:verify`.
- Added deployment observability enhancements: workflow step summaries plus failure diagnostics artifacts for staging/production/release and lighthouse jobs.
- Added `seo:validate:parity` locale-content parity gate for EN/AR root page pairs (strict ratio checks for substantial pages, warnings for low-content templates).
- Legacy/site HTML now defaults to `style.min.css` and `script.min.js` references; added `perf:legacy-assets` guard to prevent regressions.
- Homepage and Arabic homepage LCP delivery tuned to mobile-first hero preload/source defaults (`image-640` baseline with responsive srcset).
- CI and release verification now enforce strict asset budget failure thresholds (`GH_BUDGET_FAIL=1`, asset 250KB, page 80KB).
- Startup runtime is now route-aware for session attribution/experiment assignment and defers non-critical destination/blog dynamic loaders to idle time on non-conversion routes.
- Article routes now use `destination-script.js` instead of `script.min.js` (smaller runtime payload), with a new `perf:article-runtime-split` guard wired into `preflight:pr`.

## [2026-03-01]

### Previous milestones

- Block 18: production caching headers and CDN notes.
- Block 19: accessibility + font strategy + CLS-focused updates.
