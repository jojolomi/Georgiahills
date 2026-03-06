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
5. Fixed shared static-site navbar routing so EN/AR switching resolves correctly across destination, article, and hub pages.
6. Switched shared navbar links and logo assets to root-relative paths so `/ae/` and other nested routes no longer break navigation.
7. Fixed mobile menu state handling by enforcing body scroll lock, restoring consistent `aria-expanded` and `aria-hidden` values, and removing conflicting hide-on-scroll behavior from the navbar.
8. Rebuilt minified JS/CSS bundles after the shared frontend fixes and added unit coverage for locale resolution helpers.

## Verification Evidence
- `npm run build` (apps/web): PASS.
- `npm run verify:rendered-html`: PASS for homepage, tours, and fleet routes.
- `npm run check`: PASS after shared frontend fixes.
- `npm run test:unit`: PASS after adding web locale coverage and refreshing workspace dependencies.

## Remaining Remediation Backlog
1. Run Lighthouse mobile in CI for route-level before/after artifacts.
2. Replace legacy `<img>` usage in admin/media UI where performance warning exists.
3. Finalize deployment cutover so production serves Next canonical routes directly.
4. Remove or consolidate the duplicated shared frontend assets between the repository root and `apps/web/public` so future navbar/mobile fixes cannot drift.
5. Clean up GitHub PR state separately from the local codebase; the useful code has been carried forward locally, but PR closure/replacement is still an operational task.
