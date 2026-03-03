# GCC Arabic SEO Checklist (PR Ready)

## 1) Technical SEO
- [x] Branch created: `seo/gcc-ar-precision`
- [x] GitHub Pages deploy workflow updated for Pages-safe output
- [x] Root page fail-safe static `index.html` generation for Pages
- [x] `robots` + sitemap endpoint available
- [x] `sitemap.tsx` expanded for EN/AR routes, blog and destination trees

## 2) International SEO (EN/AR)
- [x] Localized route-level metadata via `buildPageMetadata`
- [x] EN/AR hreflang alternates for homepage locales
- [x] Locale-aware blog routing in `app/[locale]/blog/[slug]/page.tsx`
- [x] `lang` + `dir` synchronization for locale pages
- [x] RTL stylesheet added (`app/rtl.css`)

## 3) Structured Data
- [x] `BreadcrumbList` added to localized marketing page
- [x] `FAQPage` added for localized marketing and blog articles with FAQ frontmatter
- [x] `Product` schema added for tour offering on landing page
- [x] `BlogPosting` schema retained for blog pages

## 4) Content (Arabic)
- [x] 6 Arabic posts in `apps/web/content/blog/ar/`
- [x] Each article includes H1
- [x] Each article includes FAQ section + FAQ schema-ready frontmatter
- [x] Meta title/description included per article
- [ ] Native Arabic editor review pending (manual external step)

## 5) Performance & Monitoring
- [x] Mobile Lighthouse workflow added: `.github/workflows/lighthouse-mobile-preview.yml`
- [x] JSON artifact upload enabled for Lighthouse reports
- [x] Mobile thresholds asserted in CI script:
  - Performance >= 0.85
  - Accessibility >= 0.90
  - Best Practices >= 0.90
  - LCP <= 2500ms
  - INP <= 200ms
  - CLS <= 0.10
- [ ] Production preview URL run + final report attachment pending in CI run

## 6) Analytics & Search Console
- [x] GA4 script integration in app layout (env-driven)
- [x] Verification notes documented in `docs/seo/search-console-ga4-notes.md`
- [ ] GA4 Data Stream screenshot/evidence pending (manual external step)
- [ ] Search Console property validation + sitemap submission pending (manual external step)

## 7) Outreach
- [x] Outreach target list + 3 PR pitches in `docs/seo/outreach-list-and-pitches.md`

## Release Notes
- Deploy and validate on production preview domain.
- Run Lighthouse Mobile Preview workflow with preview URL.
- Submit sitemaps and inspect hreflang/indexing in Search Console.

## Additional QA Docs
- Performance technical steps: `docs/seo/performance-technical-fixes.md`
- Accessibility + RTL checks: `docs/seo/accessibility-rtl-qa.md`
