# Lighthouse Before/After Artifacts

## Existing Baseline Files (Before)
- `lhr.report.json`
- `lhr-prod-final.report.json`

## Existing Improved Runs (After)
- `lhr-prod-final-2`
- `lhr-prod-final-3`
- `lhr-prod-final-4`
- `lhr-headed-fix.report.json`

## New CI Workflow for Mobile Preview
Workflow: `.github/workflows/lighthouse-mobile-preview.yml`

It generates JSON artifacts:
- `artifacts/lighthouse/lhr-en.json`
- `artifacts/lighthouse/lhr-ar.json`

## Thresholds Asserted in CI
- Performance >= 85
- Accessibility >= 90
- Best Practices >= 90
- LCP <= 2500ms
- INP <= 200ms
- CLS <= 0.10

## Run Command (manual trigger)
Use GitHub Actions workflow dispatch with `preview_url` input.

## PR Attachment Checklist
- Upload/download JSON artifacts from workflow run
- Paste metric summary table (EN vs AR)
- Note any failing metric with remediation plan
