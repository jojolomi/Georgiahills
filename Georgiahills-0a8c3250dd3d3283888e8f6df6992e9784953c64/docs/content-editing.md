# Content Editing Guide (MDX/CMS)

## 1) MDX content (repo-managed)

### Blog

- EN: `apps/web/content/blog/en/*.mdx`
- AR: `apps/web/content/blog/ar/*.mdx`

### Destinations

- EN: `apps/web/content/destinations/en/*.mdx`
- AR: `apps/web/content/destinations/ar/*.mdx`

After edits, run:

```bash
pnpm build:astro
```

## 2) Admin Content Manager (CMS-style)

Use `/admin/content` to edit managed content blocks and insert image URLs from Media Library.

Role requirement: `SuperAdmin` or `Editor`.

## 3) Firestore content snapshot sync (optional)

If using Firestore-backed editorial data:

```bash
cd apps/web
node scripts/sync-firestore-content.mjs
```

Required env for sync:

- `FIREBASE_SERVICE_ACCOUNT_PATH` or `GOOGLE_APPLICATION_CREDENTIALS`
- optional `FIREBASE_PROJECT_ID`

Output is written to:

- `apps/web/src/data/cms-export.json`

## 4) Media workflow

- Upload media in `/admin/media`.
- Copy original or variant URL.
- Insert URL into content via Content Manager.
