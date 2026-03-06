# Phase 1: Canonical Platform Inventory

## Objective

Establish a single source of truth for the website before broader work begins on design, mobile UX, SEO, content, backend logic, and code quality.

This document completes Phase 1, Step 1 of the improvement roadmap:

- decide what the canonical website is
- identify what legacy surface is still influencing production
- separate live pages from transitional artifacts
- define ownership rules so fixes stop drifting across duplicate files

## Canonical Decision

The long-term canonical website is `apps/web/app`.

Reason:

- the monorepo README already defines `apps/web` as the canonical app
- the Next cutover plan is written around `apps/web/app`
- keeping the repo root HTML site as a parallel source of truth will continue to fragment design, SEO, routing, and code ownership

## Current Production Behavior

Production is not yet app-canonical, even though the target architecture is.

Verified facts:

1. `firebase.json` serves `apps/web/dist` as the hosting public directory.
2. `scripts/prepare-seo-dist.js` copies `apps/web/public` into `apps/web/dist`.
3. `scripts/prepare-seo-dist.js` also copies root market folders such as `ae/`, `sa/`, `qa/`, `kw/`, and `eg/` into `apps/web/dist`.
4. `scripts/prepare-seo-dist.js` forces the root legacy homepage into `apps/web/dist/index.html` when root `index.html` exists.
5. `scripts/prepare-seo-dist.js` also copies root-level legacy HTML pages into `apps/web/dist`, excluding admin, report, and temp patterns only in the final pass.

Conclusion:

`apps/web/dist` is the deployed artifact, but the build is still partially composed from legacy root HTML and assets. That means the repo root still influences production behavior.

## Verified Live Legacy Footprint

### Root HTML Surface

There are 51 root-level `.html` files in the repository root.

These include:

- core marketing pages such as homepage, about, contact, booking, blog, destinations, destination hubs, safety hubs, and services
- tour landing pages such as Tbilisi, Batumi, Kazbegi, Martvili, and Signagi
- English and Arabic article pages
- admin and temporary/report HTML files that should not be treated as canonical site content

### Market Subfolder Surface

There are 5 root-level market HTML entry points still present:

- `ae/index.html`
- `eg/index.html`
- `kw/index.html`
- `qa/index.html`
- `sa/index.html`

### Total Legacy HTML Outside App Public/Dist

There are 56 `.html` files outside `apps/web/public`, `apps/web/dist`, and the reference snapshot folder.

This is the legacy footprint that must be classified as one of:

- migrate into `apps/web/app`
- keep temporarily as transitional static content under `apps/web/public`
- redirect and retire
- exclude as non-production artifact

## Duplicate Shared Asset Ownership Problem

The same shared asset names exist in multiple locations:

- `shared-navbar.js`
- `shared-footer.js`
- `style.css`
- `script.js`
- `destination-script.js`

Verified duplicate locations include:

- repository root
- `apps/web/public`
- `apps/web/dist`
- `geohilks-reference`

Impact:

- fixes can land in one copy and silently miss another
- mobile navigation and language switching can diverge between legacy and app-generated surfaces
- SEO fixes in one copy do not guarantee production parity

## Route Ownership Model

Effective immediately, route ownership should be treated as follows.

### Canonical Route Layer

`apps/web/app`

Owns:

- locale layouts
- homepage and localized app routing
- blog routes
- tours routes
- fleet routes
- booking route
- API routes and app-side integrations
- robots and sitemap generation

### Transitional Static Layer

`apps/web/public`

Owns only temporary static assets and legacy pages that have not yet been replaced in the app router.

Rules:

- it is transitional, not strategic
- it may exist during migration, but it should not become the long-term product layer
- any shared assets still needed by legacy pages should be owned here, not in the repo root

### Legacy Freeze Layer

Repository root

Rules:

- no new feature work should be done directly in root HTML, CSS, or shared JS files
- root files should be treated as migration inputs only until they are removed
- if a temporary legacy fix is unavoidable, the canonical source must still be `apps/web/public` or `apps/web/app`, then copied intentionally if needed

### Non-Production Artifact Layer

These should not influence roadmap priorities except for cleanup:

- Lighthouse report HTML files
- temporary files such as `tmp_live_home.html`
- `geohilks-reference`
- generated `apps/web/dist` files

## Migration Buckets

### Bucket A: Already Belongs To The Canonical App

These are already represented in `apps/web/app` and should be improved there, not in root HTML:

- localized layouts
- tours pages
- fleet pages
- blog slug routes
- booking route
- robots and sitemap output
- admin and account app surfaces that already exist in the app structure

### Bucket B: Still Transitional And Needs App Migration

These still exist as legacy HTML and need explicit migration planning into the app:

- about
- contact
- services
- destination landing page
- destination hub pages
- itinerary hub pages
- family travel hub pages
- halal travel hub pages
- honeymoon hub pages
- safety hub pages
- GCC market landing pages
- legacy standalone destination pages that are still static-only

### Bucket C: Needs Redirect Strategy

These are legacy URLs that may keep value but should not remain permanent standalone sources of truth:

- root legacy article HTML pages
- root tour slug aliases that already have canonical app routes
- duplicated Arabic and English static variants once equivalent app routes exist

### Bucket D: Cleanup Only

These should be excluded from canonical planning and cleaned up later:

- report HTML files
- old reference snapshot directories
- temporary one-off HTML files

## Immediate Rules For The Next Phase

Before any broader redesign or SEO expansion work:

1. Stop treating the repository root as a valid place for new frontend changes.
2. Treat `apps/web/app` as the target for all new page development.
3. Treat `apps/web/public` as the only temporary source for shared legacy assets still required during migration.
4. Do not edit generated `apps/web/dist` files directly.
5. Any migration task must declare whether a page is being migrated, temporarily retained, redirected, or retired.

## Phase 1 Exit Criteria

Phase 1, Step 1 is complete when the following are accepted as project rules:

- `apps/web/app` is the canonical frontend target
- repo root is frozen as a migration input, not an active product layer
- duplicate shared asset ownership is assigned away from the repo root
- every remaining root HTML page is assigned to a migration bucket

## Recommended Next Step

Proceed to Phase 1, Step 2: consolidate shared front-end assets and routing logic.

That step should do the following:

1. define a single canonical source for `shared-navbar.js`, `shared-footer.js`, `style.css`, and `script.js`
2. update any scripts that still pull root assets into production output unless explicitly required for migration
3. document which legacy pages still depend on those assets
4. fix language-switch and market-route logic in the canonical shared navbar implementation

## Notes Used For This Inventory

- `firebase.json` currently points hosting to `apps/web/dist`
- `README.md` defines `apps/web` as the canonical app
- `MONOREPO_MIGRATION_PLAN.md` still marks shared contracts rollout and root HTML decommission as pending
- `docs/seo-geo-program/firebase-next-cutover.md` confirms that Next canonical routes are not yet production-primary
- `scripts/prepare-seo-dist.js` confirms that root legacy pages and assets still feed the production artifact