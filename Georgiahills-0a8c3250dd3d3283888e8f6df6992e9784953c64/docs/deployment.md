# Deployment & Rollback

## Pre-deploy checklist

1. `pnpm i`
2. `pnpm typecheck`
3. `pnpm build:astro`
4. Optional quality checks:
   - `pnpm test:a11y`
   - `pnpm test:e2e:core`
   - `pnpm seo:validate`

## Deploy steps

1. Merge approved PR into `main`.
2. Confirm environment variables are set in hosting platform.
3. Trigger deployment from CI/CD or platform dashboard.
4. Verify smoke routes after deploy:
   - `/`
   - `/en`
   - `/ar`
   - `/booking`
   - `/admin/login`

## Rollback strategy

### Fast rollback (recommended)

- Redeploy the previous successful build from hosting provider history.

### Git rollback

1. Revert the bad commit(s):

```bash
git revert <commit_sha>
```

2. Push revert commit:

```bash
git push origin main
```

3. Re-run deployment.

## Post-rollback validation

- Confirm homepage renders for EN/AR.
- Confirm API health for booking/analytics endpoints.
- Confirm admin login page is reachable.
- Confirm cache/security headers are still present.
