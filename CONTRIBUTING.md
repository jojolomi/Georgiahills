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
npm run preflight:pr
npm run seo:validate
npm run perf:asset-budget
npm run perf:render-blocking-css
npm run ops:cutover:smoke:warn
```

For full release readiness parity (same chain used by release gating), run:

```bash
npm run release:verify
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
- [ ] Required status checks are green: `CI Checks / validate` and `Release Verify / release-readiness`.

## CI policy

- Required on PR: `CI Checks` and `Release Verify`.
- Optional/manual deep audits: `Lint and Test`, `SEO Checks`.
- Scheduled trend audit: `Build and Lighthouse`.

## Security

- Never commit secrets.
- Use `.env.local` for local secrets.
- Prefer least-privileged service keys.
