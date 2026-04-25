# Accessibility & RTL QA (Explicit Checks)

## Required Checks
- Ensure `lang="ar"` and `dir="rtl"` on Arabic pages.
- Ensure nav toggle/button controls include `aria-label`.
- Ensure RTL does not break focus order and keyboard navigation.
- Ensure tab order follows visual order for Arabic nav.
- Ensure Arabic form labels/placeholders are present.
- Ensure validation messages are localized in Arabic.

## Automated Coverage
The SEO/on-page validators currently enforce:
- valid `lang` and `dir`
- canonical correctness
- one H1 and one JSON-LD block

Run:
`npm run seo:validate`

## Manual QA Pass (RTL Keyboard)
1. Open `/ar` page.
2. Use keyboard only (`Tab`, `Shift+Tab`, `Enter`, `Esc`).
3. Confirm focus order follows visible RTL order in header/nav/actions.
4. Open any form page in Arabic, submit invalid values, confirm Arabic validation text and labels.

## Optional Automated E2E Extension
If you want this fully automated, add Playwright assertions for:
- tab order sequence in Arabic header
- Arabic labels/placeholders in forms
- focus trap behavior in mobile nav overlay
