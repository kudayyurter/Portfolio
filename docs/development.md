# Development

## Checks

Run the same checks as CI before opening a pull request:

```bash
npm run lint
npx next typegen    # generates next-env.d.ts and route types, which tsc needs on a fresh clone
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` starts the dev server on port 3000, or reuses one already running there.

| Test file | Covers |
|---|---|
| `tests/site.spec.ts` | The page: content and order, nav jumps, scroll reveals, reduced motion, no-JS fallback, contrast, small screens, security headers |
| `tests/pixel-font.spec.ts` | The 5×7 glyphs behind the name and monograms |
| `tests/pixelate.spec.ts` | How heading text wraps before it is pixelated |

## CI and dependencies

GitHub Actions ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs the checks above plus `npm audit --audit-level=high` on pushes to `main`, on pull requests, and weekly, so a newly published advisory fails CI even without new commits. Dependabot ([`.github/dependabot.yml`](../.github/dependabot.yml)) opens weekly update PRs for npm packages and GitHub Actions.

## Motion

Motion only runs when `(scripting: enabled) and (prefers-reduced-motion: no-preference)` matches ([`src/lib/motion.ts`](../src/lib/motion.ts), mirrored in [`globals.css`](../src/app/globals.css)). Otherwise, and in print, everything shows in its final state.

## Deploying

Pushes to `main` deploy to [kudayyurter.dev](https://kudayyurter.dev) on Vercel. Preview deployments are disabled.

## README media

The demo GIF in the README is recorded from the live site. To regenerate it, see [`.github/assets/capture.sh`](../.github/assets/capture.sh).
