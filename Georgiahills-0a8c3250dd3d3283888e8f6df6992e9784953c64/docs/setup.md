# Setup Guide

## Prerequisites

- Node.js 20+
- Corepack enabled (`corepack enable`)
- pnpm 9+

## Install

From repo root:

```bash
pnpm i
```

## Configure environment

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Fill required keys listed in [docs/README.md](./README.md).

## Run locally

```bash
pnpm dev
```

Default local URL is printed by Next.js (`http://localhost:3000` unless overridden).

## Build and run production locally

```bash
pnpm build:astro
pnpm preview:astro
```

## Useful checks

```bash
pnpm typecheck
pnpm test:a11y
pnpm test:e2e:core
pnpm seo:validate
```
