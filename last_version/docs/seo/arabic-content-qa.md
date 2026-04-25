# Arabic Content Guidelines (Deliverables & QA)

## Language Standard
- Public-facing Arabic pages use Modern Standard Arabic (MSA).
- Gulf colloquial is optional and should be limited to short FAQ clarifications where conversion intent is strong.
- Any non-MSA phrasing should be validated with A/B or conversion testing before wider rollout.

## Mandatory Frontmatter for Arabic Blog Content
Use these keys for QA traceability:

- `lang: "ar"`
- `author: "<native reviewer name>"`
- `reviewer_name: "<native reviewer name>"`
- `reviewed_date: "YYYY-MM-DD"`
- `meta_title`
- `meta_description`
- `publish_date`

The parser also supports camelCase aliases (`metaTitle`, `metaDescription`, `date`) for compatibility.

## Human Review Requirement
- Every Arabic page must be proofread by a native Arabic reviewer.
- Reviewer identity and review date are required in frontmatter and enforced in CI.

## Currency Display Rule
- Show base pricing in `GEL` first.
- Show approximate GCC currency in parentheses (e.g., `SAR`/`AED`) with conversion note and date.
- Structured data uses `Offer.priceCurrency = "GEL"` with explicit `price`.

## Automated QA
Included in `npm run seo:validate`:
- `scripts/validate-ar-content-frontmatter.js`
  - checks reviewer fields, language, metadata keys, publish date format, and Arabic H1/title presence.
- `scripts/validate-onpage-seo.js`
  - checks one JSON-LD block, language/direction, canonical self-reference, and Product Offer currency/price.
