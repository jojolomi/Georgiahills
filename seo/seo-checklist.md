# SEO / GCC Arabic Checklist

## Technical
- [x] Added `src/styles/rtl.css`
- [x] Added `src/components/HreflangHead.js`
- [x] Added `scripts/generate-sitemap.js`
- [x] Added `.github/workflows/seo-checks.yml`
- [x] Added `content/ar/blog/*.md` (6 files)

## Hreflang
- [x] Includes EN/AR/x-default snippet generation
- [x] Supports page-level alternates (`/slug` <-> `/ar/slug`)

## Sitemaps
- [x] Generates `sitemap.xml`
- [x] Generates `sitemap-en.xml`
- [x] Generates `sitemap-ar.xml`

## Notes
- Replace `NEXT_PUBLIC_SITE_URL` with live domain in CI/hosting env.
- Attach Lighthouse JSON artifacts from workflow run to PR.

## PR Checklist (Before Merge)
- [ ] Branch `seo/gcc-ar-precision` created and rebased on `main`
- [ ] Lighthouse: Performance >= 85, Accessibility >= 90 (JSON attached)
- [ ] RTL CSS tested at 375px and 430px (screenshots attached)
- [ ] Arabic pages use `lang="ar"` and `dir="rtl"` with native reviews in frontmatter
- [ ] hreflang validated for every localized page (notes attached)
- [ ] JSON-LD passes Rich Results Test (screenshots attached)
- [ ] `sitemap.xml` updated and submitted to Search Console (screenshot attached)
- [ ] GA4 + Search Console verification notes included
- [ ] `seo/keyword-mapping.csv` present with required headers
- [ ] 6 Arabic posts in `content/ar/blog/` include proofreader metadata
- [ ] `seo/outreach-list.md` includes >=5 targets + 3 PR pitches (AR+EN)
- [ ] CI passing on PR (`SEO Checks`, Lighthouse where applicable)

## Lighthouse Evidence
- Before JSON: `seo/lighthouse-before.json`
- After JSON: `seo/lighthouse-after.json`
- Screenshot folder: `seo/validation/`
