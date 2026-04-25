# Firebase Cutover: Next.js Canonical Deployment

## Why This Cutover Is Required
Current Firebase Hosting deploys static output (`apps/web/dist`).
New SEO/GEO implementation is in Next.js App Router (`apps/web/app`).
Without cutover, new canonical EN/AR tour/fleet routes are not production primary.

## Cutover Options
1. Firebase App Hosting for Next.js (recommended).
2. Firebase Hosting + Cloud Run/SSR adapter.

## Recommended Steps
1. Create a staging backend for `apps/web` Next app.
2. Configure env vars in staging:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
3. Deploy staging and verify:
- `/en`, `/ar`
- `/en/tours/*`, `/ar/tours/*`
- `/en/fleet/*`, `/ar/fleet/*`
- `/robots.txt`, `/sitemap.xml`
4. Run rendered HTML verification and Lighthouse in staging.
5. Update production deployment workflow to build/deploy Next app artifact.
6. Keep legacy static hosting as rollback target for first week.

## Rollback
1. Repoint production to legacy static hosting release.
2. Keep DNS unchanged; switch backend release only.
3. Re-run smoke checks for homepage, booking, sitemap.
