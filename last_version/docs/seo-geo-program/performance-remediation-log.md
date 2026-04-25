# Performance Remediation Log

## Baseline Snapshot (Pre-Implementation)
- Legacy architecture heavily served static pages from `apps/web/dist`.
- LCP risks: hero image loading and JS hydration order.
- Mixed routing model reduced measurement clarity.

## Implemented Remediations
1. Added server-rendered localized tour and fleet routes with crawlable H1/H2 in raw HTML.
2. Added image priority and structured route templates for critical conversion pages.
3. Added persistent quick-contact CTA and reduced path-to-lead steps.
4. Added legal and trust pages in EN/AR to improve policy completeness.

## Verification Evidence
- `npm run build` (apps/web): PASS.
- `npm run verify:rendered-html`: PASS for homepage, tours, and fleet routes.

## Remaining Remediation Backlog
1. Run Lighthouse mobile in CI for route-level before/after artifacts.
2. Replace legacy `<img>` usage in admin/media UI where performance warning exists.
3. Finalize deployment cutover so production serves Next canonical routes directly.
