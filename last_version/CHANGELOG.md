# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased]

### Added

- Root onboarding documentation under `docs/`:
  - setup
  - deployment & rollback
  - admin users & roles
  - content editing
  - maintenance checklist
- New contributor guide (`CONTRIBUTING.md`).
- Quick wins:
  - 3 AVIF homepage hero assets (`hero-home-640/1024/1600.avif`)
  - hero image preloads in root layout
  - root homepage metadata + Open Graph + hreflang alternates
  - explicit server compression config in Next.js

### Changed

- Root `pnpm dev` script now runs `apps/web` development server.

## [2026-03-01]

### Previous milestones

- Block 18: production caching headers and CDN notes.
- Block 19: accessibility + font strategy + CLS-focused updates.
