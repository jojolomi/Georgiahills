# Contributing

## Workflow

1. Create a branch from `main`.
2. Make focused changes.
3. Run relevant checks locally.
4. Open a PR with clear scope and testing notes.

## Local setup

```bash
pnpm i
pnpm dev
```

## Quality gates

Run as applicable before PR:

```bash
pnpm typecheck
pnpm test:a11y
pnpm test:e2e:core
pnpm build:astro
```

## Commit style

Use concise, scoped messages, for example:

- `feat: add admin media variants`
- `fix: prevent duplicate booking submit`
- `docs: onboarding`

## Pull request checklist

- [ ] Scope is limited and clear.
- [ ] Docs updated for behavior/config changes.
- [ ] Env var changes documented.
- [ ] Tests/checks run and results noted.

## Security

- Never commit secrets.
- Use `.env.local` for local secrets.
- Prefer least-privileged service keys.
