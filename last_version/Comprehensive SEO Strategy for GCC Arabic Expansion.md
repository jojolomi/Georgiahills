# Comprehensive SEO Strategy for GCC Arabic Expansion

## Objectives
- Improve Arabic visibility in GCC search markets.
- Ensure mobile-first performance and accessibility compliance.
- Standardize bilingual technical SEO (hreflang, schema, canonical, sitemap).

## Pillars
1. Arabic content quality (MSA baseline + measured colloquial FAQ hints)
2. Technical SEO correctness (lang/dir, hreflang/x-default, canonical, JSON-LD)
3. Performance and UX (image optimization, caching, compression)
4. Measurement and indexing (GA4, Search Console, Lighthouse artifacts)
5. Distribution and authority (outreach list and bilingual PR pitches)

## Implementation Artifacts
- `seo/seo-checklist.md`
- `seo/keyword-mapping.csv`
- `content/ar/blog/*.md`
- `src/styles/rtl.css`
- `.github/workflows/seo-checks.yml`
- `scripts/check-lighthouse-threshold.js`
- `seo/outreach-list.md`

## Acceptance Thresholds
- Lighthouse mobile: Performance >= 85
- Lighthouse mobile: Accessibility >= 90
- LCP <= 2.5s on mobile 4G test profile
- hreflang/schema/on-page validators pass in CI

## Release Protocol
1. Open PR from `seo/gcc-ar-precision` into `main`.
2. Attach Lighthouse JSON before/after + screenshots.
3. Attach Rich Results screenshots for homepage/tour/blog pages.
4. Attach Search Console and GA4 verification evidence.
5. Verify all items in `.github/pull_request_template.md` are checked.
