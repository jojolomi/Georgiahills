## Summary
- [ ] Added Arabic site tree and/or Arabic content updates
- [ ] Implemented/updated RTL styles and templates
- [ ] Updated hreflang + sitemap + structured data where needed
- [ ] Added/updated performance optimizations (images/preload/caching)

## PR Checklist (must be checked before merge)
- [ ] Branch is rebased on `main`
- [ ] Lighthouse: Performance >= 85, Accessibility >= 90 (JSON attached)
- [ ] RTL CSS present and tested at 375px & 430px (screenshots attached)
- [ ] Arabic pages use `lang="ar"` `dir="rtl"` and native reviews added
- [ ] hreflang links for every localized page validated (validation notes attached)
- [ ] JSON-LD passes Rich Results Test (screenshots attached)
- [ ] `sitemap.xml` updated and submitted to Search Console (screenshot attached)
- [ ] GA4 and Search Console verification notes included
- [ ] `seo/keyword-mapping.csv` included and mapped to pages
- [ ] 6 Arabic blog posts added to `content/ar/blog/` and proofread
- [ ] `seo/outreach-list.md` present with contacts + PR pitches
- [ ] Required checks passing on PR: `CI Checks / validate` and `Release Verify / release-readiness`
- [ ] Release verification run completed (`npm run release:verify`) or workflow evidence attached
- [ ] Cutover smoke matrix verified for `/`, `/arabic.html`, `/booking.html`, `/booking-ar.html`, `/sitemap.xml`, `/robots.txt`

## Validation Artifacts
- Lighthouse JSON(s):
- Release Verify run link or logs:
- Cutover smoke output (strict/warn):
- Rich Results screenshots:
- Search Console evidence:
- GA4 evidence:

## Manual QA
- [ ] Mobile emulation @375 verified (RTL layout/nav/buttons)
- [ ] Mobile emulation @430 verified (RTL layout/nav/buttons)
- [ ] URL Inspection done for key pages
- [ ] LCP under 2.5s tested with 4G throttling
