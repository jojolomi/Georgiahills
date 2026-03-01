# Georgiahills Monorepo

This repository is organized as a pnpm workspace monorepo.

## Workspace Layout
- `apps/web` — Next.js web application (canonical app).
- `packages/ui` — shared UI components.
- `packages/lib` — shared utilities and domain logic.
- `packages/types` — shared TypeScript types/contracts.
- `infrastructure` — deployment and infrastructure assets.

## Workspace Config
- `pnpm-workspace.yaml` includes:
  - `apps/*`
  - `packages/*`

## Quick Start
```bash
pnpm install
pnpm -w list
```
