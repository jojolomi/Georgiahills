# Firebase Cost Monitoring

Set the following GitHub repository variables:
- `FIREBASE_MONTHLY_BUDGET_USD`
- `FIREBASE_CURRENT_MONTH_COST_USD`

The scheduled workflow `.github/workflows/firebase-cost-monitor.yml` runs daily and fails when current spend exceeds budget.
When the threshold fails, it also creates or updates a GitHub issue titled `Firebase budget alert` with the latest budget and spend values plus a link to the workflow run.

Recommended setup:
1. Connect Firebase billing export to BigQuery.
2. Update `FIREBASE_CURRENT_MONTH_COST_USD` automatically from your billing pipeline.
3. Keep alert threshold at 80%+ and hard-fail above 100%.
4. Triage the `Firebase budget alert` issue and close it only after budget variables are corrected.
