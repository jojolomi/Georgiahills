# Monorepo Migration Plan (Phased, Zero-Downtime)

## Status
- ✅ Step 1 complete: workspace scaffolding (`pnpm-workspace.yaml`, `packages/shared`, `apps/` placeholder).
- ✅ Step 2 complete: moved app folders and updated script/config/CI paths.
- ⏳ Step 3 pending: shared contracts rollout.
- ⏳ Step 4 pending: legacy root HTML decommission.

## Step 1 — Foundation (Completed)
- Added `pnpm` workspace definition.
- Added root `packageManager` metadata.
- Created `packages/shared` package scaffold.
- Created `apps/` placeholder structure.

## Step 2 — Directory Move (Completed)
1. Moved:
   - `astro-site` → `apps/web`
   - `admin-v3` → `apps/admin`
2. Updated path references in:
   - root `package.json`
   - `firebase.json`
   - Playwright configs
   - GitHub workflows
   - build/deploy helper scripts
   - audit/SEO/perf scripts
3. Updated docs to reflect new paths.
4. Validation executed:
   - `npm run build:astro`
   - `npm run build:admin-v3:hosting`
   - `npm --prefix functions test`

## Step 3 — Shared Contracts (Planned)
- Move common interfaces/utilities into `packages/shared`.
- Import shared contracts in `apps/web`, `apps/admin`, and `functions`.

## Step 4 — Legacy Root HTML Decommission (Planned)
- Migrate remaining legacy pages to Astro equivalents.
- Add redirects and SEO parity checks before deletion.
- Remove legacy root `.html` only after verification.
