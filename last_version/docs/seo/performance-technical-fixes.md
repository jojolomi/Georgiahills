# Performance & Technical Fixes (Explicit Steps + Commands)

## Implemented Fixes
- Hero image preload is limited to above-the-fold hero image in layout head.
- Non-hero images use lazy loading by default through image component behavior.
- Responsive formats are generated via script (`avif` + `webp`) with multiple widths.
- Static assets use long immutable cache TTL.
- HTML responses use `s-maxage=3600` and `stale-while-revalidate=604800`.
- Compression is enabled in Next.js (`compress: true`).
- HSTS header is configured via response headers.

## Image Handling
### Generate responsive variants (1x/2x-ready width sets)
Run from repo root:

`node apps/web/scripts/generate-responsive-images.mjs apps/web/public/images`

Output variants are generated as:
- `*-320.webp`, `*-640.webp`, `*-1024.webp`, `*-1600.webp`
- `*-320.avif`, `*-640.avif`, `*-1024.avif`, `*-1600.avif`

### Recommended markup pattern
Use responsive `srcset` and `sizes`, eager only for hero:

```html
<img src="/images/tbilisi-hero-800.webp"
     srcset="/images/tbilisi-hero-400.webp 400w, /images/tbilisi-hero-800.webp 800w, /images/tbilisi-hero-1600.webp 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     alt="صورة تبليسي - المشهد الوطني"
     loading="eager">
```

Use `loading="lazy"` for non-hero images.

## Critical CSS / JS
- Keep above-the-fold critical CSS minimal (target <= 14KB).
- Keep non-critical CSS deferred using preload/onload or print-media loading pattern when using static templates.
- Next.js production build already minifies/splits bundles by default.

## Caching & Headers
Configured in `apps/web/next.config.js`:
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=604800`
- HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

## Developer-run Commands
### Local Lighthouse (mobile)
`npx lighthouse https://preview.example.com --preset=mobile --output=json --output-path=./lighthouse.json`

### Lighthouse CI
`npx -p @lhci/cli@0.9 lhci autorun --collect.url=https://preview.example.com`

### Project build + SEO checks
`npm run build:astro ; npm run seo:validate`
