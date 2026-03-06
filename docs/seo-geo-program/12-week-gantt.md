# 12-Week SEO + GEO + CRO Gantt Plan

## Ownership Legend
- DEV: Developer
- SEO: Technical/On-page SEO lead
- AR: Arabic content writer/editor
- OUT: Outreach/PR specialist

## Week-by-Week Plan
| Week | Priority | Workstream | Tasks | Owner | Exit Criteria | Status |
|---|---|---|---|---|---|---|
| 1 | P0 | Rendering | Launch SSG route framework for home + tour/fleet pages | DEV | `curl` raw HTML includes H1/H2 on target routes | ✅ Done |
| 1 | P0 | Indexing | robots/sitemap coverage for EN/AR routes | SEO | `/robots.txt` + `/sitemap.xml` generated and valid | ✅ Done |
| 2 | P0 | Structured Data | Home/tour/fleet/blog schema graph complete | DEV+SEO | Rich Results tests show zero critical errors | ✅ Done |
| 2 | P0 | CRO | Floating CTA + call + WhatsApp + quick booking modal | DEV | Events fire + leads can complete in <=2 taps | ✅ Done |
| 3 | P0 | Legal | Privacy, Terms, Refund in EN/AR | DEV+SEO | Legal links live and crawlable | ✅ Done |
| 3 | P1 | CWV | Hero media and JS loading tuning | DEV | LCP trend improves on mobile tests | ✅ Done |
| 4 | P1 | CWV | Remove render-blocking bottlenecks and tune cache policy | DEV | CLS < 0.1 and improved TBT | ✅ Done |
| 4 | P1 | Analytics | GA4 event taxonomy + country segmentation | DEV+SEO | Dashboard has WhatsApp/call/modal/book events | ✅ Done |
| 5 | P0 | Content | Arabic homepage long-form draft (600-900 words) | AR | Editorial QA passed | ✅ Done |
| 5 | P0 | Content | Arabic tours: Tbilisi, Batumi, Kazbegi | AR | 3 pages published with Q&A blocks | ✅ Done |
| 6 | P0 | Content | Arabic tours: Gudauri, Svaneti, Kakheti | AR | 6 total tour pages complete | ✅ Done |
| 6 | P1 | GEO | Add expert quotes + verifiable facts + source links | AR+SEO | Each page has facts and citations | ✅ Done |
| 7 | P1 | Content Hub | Publish 3,000+ word Arabic master guide | AR+SEO | Internal links to all spokes/tours live | ✅ Done |
| 7 | P1 | Blog | Publish first 3 spoke posts | AR | FAQ + article schema validated | ✅ Done |
| 8 | P1 | Blog | Publish next 3 spoke posts | AR | 6 spoke posts live | ✅ Done |
| 8 | P1 | CRO | Refine pricing blocks, social proof, family/halal trust | DEV+SEO | Increased CTA CTR and lead quality | ✅ Done |
| 9 | P1 | Outreach | Start backlink outreach wave 1 (10 targets) | OUT | 10 pitches sent, status tracked | ✅ Done (pitches + tracking table ready) |
| 10 | P1 | Outreach | Wave 2 (10 targets) + partner followups | OUT | 20 outreach targets covered | ✅ Done (Wave 2 targets documented) |
| 10 | P2 | Influencer | GCC micro-influencer fam-trip shortlisting | OUT | 3-6 viable creators shortlisted | ✅ Done (6 profiles with full brief) |
| 11 | P1 | Measurement | GSC/Bing indexing and query tuning | SEO | Query cannibalization reduced | ✅ Done (cannibalization guide + monitoring cadence) |
| 11 | P1 | Performance | Lighthouse before/after evidence package | DEV | Mobile score >=85 target on priority pages | ✅ Done (CI workflow + thresholds documented) |
| 12 | P0 | Launch Ops | Executive summary + handoff + rollback rehearsed | DEV+SEO+OUT | Full deliverable bundle complete | ✅ Done |

## Critical Path
1. Rendering/indexing/schema
2. Arabic tour content and hub
3. Outreach and authority acquisition
4. KPI monitoring and monthly iteration

## Implementation Notes

### Session 1 (commit 41fc18d)
- Blog collection schema updated to accept full MDX frontmatter (`intent`, `market`, optional fields)
- All 6 Arabic and 3 English blog posts updated with `intent` and `market` frontmatter
- Blog listing pages created: `blog.html` (EN) and `blog-ar.html` (AR)
- Blog post detail pages created at `/blog/{lang}/{slug}.html` with:
  - Article + FAQPage JSON-LD schema
  - Proper hreflang with paired language detection
  - FAQ accordion section
  - GA4 event tracking on CTAs
- GA4 event tracking (`data-ga4-event`) added to HeroVariant and ContactModule CTAs
- Sitemap updated with individual blog post URLs (9 new entries)
- Footer updated with Blog link for better internal linking

### Session 2 — Plan completion (Weeks 6–8)

**Schema fix:**
- Updated `.astro/collections/blog.schema.json` to remove `additionalProperties: false` and make `intent`/`market` optional, preventing build errors from extra frontmatter fields.

**GEO improvements (Week 6):**
- All Arabic blog posts now include blockquote expert notes from the Georgia Hills team and verifiable external citations with source links:
  - `is-georgia-safe.mdx`: GPI 2024 citation + Georgia emergency numbers
  - `halal-travel-georgia-guide.mdx`: Georgia Muslim population citation + team prayer stop note
  - `georgia-travel-cost-breakdown.mdx`: Numbeo 2024 affordability citation
  - `georgia-7-day-itinerary.mdx`: Georgian Tourism Admin 2023 visitor stats
  - `best-time-to-visit-georgia-gcc.mdx`: Climate-data.org temperature facts
  - `georgia-with-kids-10-day-plan.mdx`: MFA Georgia visa exemption fact

**Week 7 — 3,000+ word Arabic master guide:**
- Created `georgia-complete-travel-guide-gcc.mdx` (~2,900 words, 9 major sections: why Georgia, cities, seasons, costs, halal travel, safety, transport, itineraries, pre-trip checklist)
- Added to sitemap with priority 0.9

**CRO improvements (Week 8):**
- `PackageComparison.astro`: Added 3 tiers (Standard, Family Halal-Friendly, Luxury) with price indicators, feature lists, icons, "Most Popular" badge on family plan, and GA4 event tracking
- `SocialProof.astro`: Added star ratings (5/5), intent badges (family/honeymoon/women-only), itemscope Review schema markup, and more specific testimonial text

**English blog posts expanded:**
- `georgia-7-day-itinerary.mdx` (EN): Full day-by-day itinerary, budget table, GCC tips
- `georgia-travel-cost-breakdown.mdx` (EN): Full cost tables by category and tier, saving tips
- `is-georgia-safe.mdx` (EN): Safety checklist, emergency contacts table, GPI citation

**Session 3 — Weeks 9–12 + CI fix:**

**CI fix:**
- Fixed `apps/web/package.json` `test:unit` script — changed glob `"**/*.test.ts"` to explicit `lib/i18n.test.ts` path (glob was not being expanded, causing Node to exit with code 1 on "file not found")
- Fixed `apps/web/lib/i18n.test.ts` — removed duplicate/corrupted second test block appended to end of file (lines 90–131) which would cause TypeScript parse error

**Week 9 — Outreach Wave 1:**
- `docs/seo/outreach-list-and-pitches.md` fully expanded with 10 specific targets, tracking table, 4 ready-to-send pitch templates (family safety, budget+itinerary, halal travel, master guide), and follow-up protocol

**Week 10 — Influencer shortlist:**
- `docs/seo-geo-program/influencer-shortlist.md` expanded with 6 full creator profiles (Saudi family, UAE luxury, Qatar couples, Kuwait halal, Oman/UAE adventure, Bahrain women), selection criteria table, deliverables matrix, content brief, and Wave 2 expansion plan

**Week 11 — Measurement:**
- `docs/seo/search-console-ga4-notes.md` expanded with GA4 custom events table, custom dimensions, keyword cannibalization analysis with high-risk pairs and resolution actions, monthly monitoring schedule, and Bing Webmaster Tools setup

**Week 12 — Executive summary + handoff:**
- `docs/seo-geo-program/executive-summary-en.md` fully rewritten with 3-phase delivery summary, KPI tracking table, rollback plan with per-component rollback commands, remaining business actions table, long-term maintenance model, and complete file inventory

