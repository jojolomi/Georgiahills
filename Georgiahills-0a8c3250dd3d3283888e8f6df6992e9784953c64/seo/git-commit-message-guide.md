# Git Commit Message Guide (Atomic Commits)

Use small, single-purpose commits with Conventional Commit prefixes.

## Recommended examples
- `feat(seo): add Arabic content structure and RTL stylesheet`
- `fix(perf): compress hero images to WebP and add srcset`
- `chore(ci): add lighthouse CI workflow`
- `feat(schema): add FAQ and Breadcrumb JSON-LD for tours`
- `docs(seo): add seo/seo-checklist.md and keyword-mapping.csv`

## Rules
- One concern per commit.
- Keep subject line concise and imperative.
- Reference changed scope (`seo`, `perf`, `ci`, `schema`, `docs`).
- Avoid mixing docs + logic + workflow changes in one commit.
