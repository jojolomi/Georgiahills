Title: feat(seo): add Arabic site, RTL, structured data, performance improvements for GCC

Body:

Summary:
- Added Arabic site tree under /ar/
- Implemented RTL stylesheet and Arabic templates
- Added hreflang head tags and sitemap updates
- Added Breadcrumb + FAQ + Product JSON-LD for tours
- Optimized images to WebP and added srcset for responsive loading
- Added Lighthouse CI workflow, GA4, and keyword mapping
- Added 6 Arabic blog posts (proofread by: <name>)

How to review:
1. Preview: https://pr-preview.example.com
2. Check Lighthouse report attached: seo/lighthouse-before.json & seo/lighthouse-after.json
3. Validate structured data via Rich Results Test (screenshots in /seo/validation/)
4. Review Arabic copy in content/ar/blog/*.md

Acceptance tests (must pass before merge):
- Lighthouse mobile Performance >= 85
- Accessibility >= 90
- hreflang validated (no errors)
- JSON-LD validates for 3 sample pages

References:
- Comprehensive SEO Strategy document (root)
