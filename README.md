# Kuday Yurter — portfolio

Source for [kudayyurter.dev](https://kudayyurter.dev): a single page on black with pixel lettering, section headings that resolve from pixels as you scroll, and the tools I use shown with their real logos. Built with Next.js 16 and React 19; no animation libraries.

## Development

Requires Node.js 20.19+, 22.13+, or 24+ (CI uses Node 24).

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## How it fits together

- `src/content/portfolio.ts`: all copy (bio, tech stack order, experience, work and personal projects, links). Edit this to change what the page says.
- `src/app/page.tsx`: page markup, server-rendered, so the page is complete without JavaScript.
- `src/components/pixel-name.tsx`: the dot-drawn name at the top of the page.
- `src/components/section.tsx`, `pixel-reveal.tsx`: each section and the canvas overlay that resolves its heading from pixel blocks (`src/lib/pixelate.ts` does the pixelating).
- `src/components/reveal-on-scroll.tsx`, `site-header.tsx`: the other small motion pieces.
- `src/lib/pixel-font.ts`, `src/components/pixel-bitmap.tsx`: 5×7 glyphs for the name and company monograms, drawn as crisp SVG paths.
- `src/app/opengraph-image.tsx`: the 1200×630 link-preview image.
- `public/logos/`: tech-stack, company, school, and contact logos as SVGs (see [Logo credits](#logo-credits)).
- `tests/`: Playwright tests for the page, the pixel font, and the pixelation helpers.

Motion only runs when `(scripting: enabled) and (prefers-reduced-motion: no-preference)` matches (`src/lib/motion.ts`, mirrored in `globals.css`); otherwise, and in print, everything shows in its final state.

## Validation

```bash
npm run lint
npx next typegen    # generates next-env.d.ts and route types, which tsc needs on a fresh clone
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` starts the dev server on port 3000, or reuses one already running there.

GitHub Actions (`.github/workflows/ci.yml`) runs the same checks plus `npm audit --audit-level=high` on pushes to `main`, on pull requests, and weekly. Dependabot opens weekly update PRs for npm packages and GitHub Actions.

## Deploying

Pushes to `main` deploy to kudayyurter.dev on Vercel. Preview deployments are disabled.

## Logo credits

- Tech stack: [Devicon](https://devicon.dev) (MIT), [Simple Icons](https://simpleicons.org) (Databricks, CC0), Microsoft's official [Power Platform icons](https://learn.microsoft.com/power-platform/guidance/icons) (Power Platform, Copilot Studio), and Wikimedia Commons (Power BI; Tux by Larry Ewing, lewing@isc.tamu.edu, created with The GIMP). Dark single-color marks (Rust, Unreal, Unity, the AWS wordmark) are recolored white to show on black.
- Companies and schools: Cummins and University of Houston from Wikimedia Commons (the Cummins badge's missing fill set to Cummins red); Texas A&M University–Victoria from the university's own approved-logos files (its dark gray text switched to the white version it publishes for dark backgrounds).
- Contact: GitHub and LinkedIn from Devicon (the GitHub mark in its white dark-background version), Gmail from Wikimedia Commons.

Logos are trademarks of their owners.

## License

[MIT](LICENSE).
