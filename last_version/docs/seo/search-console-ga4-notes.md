# GA4 + Search Console Verification Notes

## GA4 Setup

### Environment Variables
Set in deployment environment (GitHub/hosting secrets):
- `NEXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX`
- `NEXT_PUBLIC_SITE_URL=https://georgiahills.com`

### Runtime Verification
1. Open `/en` and `/ar` in production preview.
2. Confirm GA script loads:
   - `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
3. In browser console, verify `window.dataLayer` exists.
4. In GA4 Realtime report, confirm `page_view` for `/en` and `/ar`.

### Custom Events to Verify (Week 4 taxonomy)

| Event | Trigger | Expected data-ga4-event |
|---|---|---|
| `whatsapp_click` | WhatsApp CTA button click | `whatsapp_click` |
| `call_click` | Phone number click | `call_click` |
| `booking_modal_open` | "Book" button click | `booking_modal_open` |
| `booking_modal_whatsapp_submit` | Booking form → WhatsApp | `booking_modal_whatsapp_submit` |
| `package_cta_click` | Package comparison CTA | `package_cta_click` |
| `blog_cta_click` | Blog post CTA buttons | `blog_cta_click` |
| `hero_cta_click` | Hero section CTA | `hero_cta_click` |

### Custom Dimensions to Create in GA4
- `gcc_country` (user property): derived from Accept-Language or geo-IP
- `lead_channel`: whatsapp / call / form
- `booking_variant`: standard / family / luxury
- `page_locale`: en / ar

---

## Search Console Setup

### Properties
Create and verify:
- Main domain property: `https://georgiahills.com`
- Optional: URL prefix property for staging

### Verification Methods
Use one of:
- DNS TXT record (recommended for production)
- HTML tag in `<head>` (quick for staging)
- HTML file upload to web root

### Sitemaps to Submit
```
https://georgiahills.com/sitemap.xml
```

Optional once volume grows:
- `/sitemap-en.xml`
- `/sitemap-ar.xml`
- `/sitemap-blog.xml`

### Post-Submit Checks
- Validate no hreflang errors in International Targeting report.
- Confirm discovered URLs include both `/en/*` and `/ar/*` trees.
- Check for coverage errors on blog post URLs added in Week 7.

---

## Week 11 — Keyword Cannibalization Analysis

### Queries to Monitor for Cannibalization

Check Search Console Performance report → group by page to find if multiple URLs compete for the same query.

#### High-risk cannibalization pairs:
| Query | Risk pages | Preferred canonical |
|---|---|---|
| "هل جورجيا آمنة" | `/blog/ar/is-georgia-safe` vs `/arabic.html` | Blog post (richer answer) |
| "تكلفة السفر إلى جورجيا" | `/blog/ar/georgia-travel-cost-breakdown` vs `/arabic.html` | Blog post |
| "برنامج جورجيا 7 أيام" | `/blog/ar/georgia-7-day-itinerary` vs any tour page | Blog post (informational) |
| "Georgia safe family" | `/blog/en/is-georgia-safe` vs `/` | Blog post |
| "private driver Georgia" | `/` vs `/en/tours/*` | Tour/landing page |

#### Resolution actions if cannibalization detected:
1. Add `rel="canonical"` pointing to preferred URL on weaker page.
2. Strengthen preferred page with more specific on-page content.
3. Update internal links to route all mentions to canonical URL.
4. Consider 301 redirect if weaker page has zero unique value.

### Monthly Monitoring Schedule (Week 11+)

| Frequency | Task |
|---|---|
| Weekly | Check GSC top queries by country (SA, UAE, QA) |
| Weekly | Review new crawl errors and coverage issues |
| Monthly | Compare click-through rates vs previous period |
| Monthly | Run cannibalization check on top 20 queries |
| Monthly | Update `dateModified` on refreshed pages |
| Quarterly | Full structured data re-validation (Rich Results Test) |

---

## Bing Webmaster Tools Setup

1. Verify domain using `msvalidate.01` meta tag in `<head>` — add to `_document.tsx` or site layout.
2. Submit sitemap: `https://georgiahills.com/sitemap.xml`
3. Monitor crawl errors weekly.
4. Enable IndexNow for faster page indexing (Bing supports IndexNow API).

---

## Evidence to Attach in PR
- Screenshot: GA4 Data Stream + Realtime custom event firing
- Screenshot: Search Console property verified + sitemap accepted
- Screenshot: Coverage report — no critical errors on blog URLs
- Screenshot: Hreflang validation — no issues in International Targeting
- Note: any excluded URLs with reasons
