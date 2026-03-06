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
| 6 | P1 | GEO | Add expert quotes + verifiable facts + source links | AR+SEO | Each page has facts and citations | 🔄 In Progress |
| 7 | P1 | Content Hub | Publish 3,000+ word Arabic master guide | AR+SEO | Internal links to all spokes/tours live | ✅ Done (blog routes + listings) |
| 7 | P1 | Blog | Publish first 3 spoke posts | AR | FAQ + article schema validated | ✅ Done |
| 8 | P1 | Blog | Publish next 3 spoke posts | AR | 6 spoke posts live | ✅ Done |
| 8 | P1 | CRO | Refine pricing blocks, social proof, family/halal trust | DEV+SEO | Increased CTA CTR and lead quality | 🔄 In Progress |
| 9 | P1 | Outreach | Start backlink outreach wave 1 (10 targets) | OUT | 10 pitches sent, status tracked | ⏳ Pending |
| 10 | P1 | Outreach | Wave 2 (10 targets) + partner followups | OUT | 20 outreach targets covered | ⏳ Pending |
| 10 | P2 | Influencer | GCC micro-influencer fam-trip shortlisting | OUT | 3-6 viable creators shortlisted | ⏳ Pending |
| 11 | P1 | Measurement | GSC/Bing indexing and query tuning | SEO | Query cannibalization reduced | ⏳ Pending |
| 11 | P1 | Performance | Lighthouse before/after evidence package | DEV | Mobile score >=85 target on priority pages | ⏳ Pending |
| 12 | P0 | Launch Ops | Executive summary + handoff + rollback rehearsed | DEV+SEO+OUT | Full deliverable bundle complete | ⏳ Pending |

## Critical Path
1. Rendering/indexing/schema
2. Arabic tour content and hub
3. Outreach and authority acquisition
4. KPI monitoring and monthly iteration

## Implementation Notes

### Completed in this session
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

