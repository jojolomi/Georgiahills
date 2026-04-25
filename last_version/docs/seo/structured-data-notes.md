# Structured Data Notes

## Recommended types for Google compatibility
- `Product` + `Offer` for tours and bookable offerings.
- `Event` where event semantics are strong.
- `FAQPage` for concise user Q&A.
- `BreadcrumbList` for page hierarchy.

## Important note
- `TouristTrip` / `Trip` exist on schema.org, but Google rich support is limited.
- Prefer `Product` + `Offer` (or `Event`) for stronger eligibility and presentation.

## Validation
- Validate JSON-LD with Google Rich Results Test.
- Ensure `inLanguage` where applicable.
- Ensure one JSON-LD script block per page if using `@graph` strategy.
