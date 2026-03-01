# Maintenance Checklist

## Weekly

- Run `pnpm test:a11y` and review critical violations.
- Run `pnpm seo:validate` and fix regressions.
- Review analytics and error monitoring status.

## Before release

- `pnpm typecheck`
- `pnpm build:astro`
- `pnpm test:e2e:core`
- Verify key pages and headers manually.

## Image conversion and optimization

### Convert repository images to AVIF set

```bash
pnpm images:convert
```

### Generate responsive optimization report

```bash
node scripts/optimize-images.js
```

Review report at:

- `scripts/audit/perf/image-optimization-report.json`

## Backup procedures

### Content backups

- Keep MDX changes in Git via PRs.
- For Firestore-driven content, export collections (`cms_pages`, `destinations`, `articles`) before major edits.
- Archive `apps/web/src/data/cms-export.json` for release snapshots.

### Database backups

- Take regular PostgreSQL/Supabase backups per provider tooling.
- Validate restore process monthly in non-production.

## Incident checklist

1. Identify impact scope (routes, APIs, admin).
2. Capture logs and error context.
3. Roll back deployment or revert commit.
4. Add postmortem notes and action items.
