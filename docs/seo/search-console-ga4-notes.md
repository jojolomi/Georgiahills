# GA4 + Search Console Verification Notes

## GA4 Setup

## Environment Variables
Set in deployment environment (GitHub/hosting secrets):
- `NEXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX`
- `NEXT_PUBLIC_SITE_URL=https://<your-production-domain>`

## Runtime Verification
1. Open `/en` and `/ar` in production preview.
2. Confirm GA script loads:
   - `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
3. In browser console, verify `window.dataLayer` exists.
4. In GA4 Realtime report, confirm `page_view` for `/en` and `/ar`.

## Search Console Setup

### Properties
Create and verify:
- Main domain property (or URL-prefix property)
- Market-relevant checks for visibility in Google.sa and Google.ae search result contexts

### Verification Methods
Use one of:
- DNS TXT record (recommended)
- HTML tag in head
- HTML file upload

### Sitemaps
Submit:
- `/sitemap.xml`

Optional if you split later:
- `/sitemap-en.xml`
- `/sitemap-ar.xml`

### Post-Submit Checks
- Validate no hreflang errors in Search Console International Targeting/Indexing reports.
- Confirm discovered URLs include `/en/*` and `/ar/*` trees.

## Evidence to Attach in PR
- Screenshot: GA4 Data Stream + Realtime event
- Screenshot: Search Console property verified
- Screenshot: Sitemap accepted
- Note: any excluded URLs with reasons
