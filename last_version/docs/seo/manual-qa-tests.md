# Manual QA Tests (Local, Explicit)

## 1) Mobile RTL layout checks
- Open preview URL in Chrome Device Emulator at width 375.
- Verify RTL layout, nav behavior, and button alignment.
- Repeat at width 430.

## 2) Lighthouse mobile run
Run:
`npx lighthouse <preview-url> --preset=mobile --output=json --output-path=./lighthouse.json`

Attach `lighthouse.json`.
Threshold: Performance >= 85.

## 3) Rich Results validation
- Validate at least 3 pages: homepage, tour page, blog post.
- Attach screenshots from Google Rich Results Test.

## 4) Search Console validation
- Run URL Inspection for key pages.
- Confirm crawl + index status.

## 5) 4G throttling + CWV
- Enable mobile network throttling (4G).
- Test LCP and confirm largest-contentful-paint <= 2.5s.

## 6) Optional helper script
- After generating `lighthouse.json`, run:
`node scripts/check-lighthouse-threshold.js ./lighthouse.json`
