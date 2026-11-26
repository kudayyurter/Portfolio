# Monochrome portfolio refinement

## Goal and decisions

Implement the in-chat design, with the user's added requirement that falling Matrix-style letters form the pixel title. Keep the black-led palette, bold white accents, occasional white panels, factual content, and name-only hero. The title is a finite entrance, not an idle background loop. The user selected the black-led direction and requested the Matrix effect on top of the recommended refinements.

Current base: `3733180`, branch `docs/readme-visuals`. Existing `.impeccable/` is untracked and unrelated. Current features already include pixel headings, stepped arrows, hover brackets, a navigation marker, and white Contact.

## Implementation

1. Keep the title server-rendered. The user selected Departure Mono (option A) on October 13, replacing the separate square pixels with connected pixel-art letterforms. Use the locally bundled font through `next/font/local` for both the name and falling characters. Deterministic streams resolve into whole letters within two seconds. CSS gates motion on scripting and reduced-motion preference; no new runtime dependency, canvas loop, or hydration prerequisite. Preserve desktop one-line/mobile stacked layout and reserve each letter's advance width while the font loads.
2. Reorder sections to About, Work, Personal, Experience, Stack, Contact. Match navigation order. Add numbered headings, stronger project outcomes, and two white illustrated panels for Kessler/Dispatch using the existing icon vocabulary. Keep all content and existing link destinations.
3. Compact the stack, refine controls/contact, add a static dither boundary, and tune transitions. Featured panel reveals run once; icon interactions support focus and hover. Reduced motion, print, and missing JavaScript expose the final state.

Primary paths: `src/app/page.tsx`, `src/app/globals.css`, `src/components/pixel-name.tsx`, `src/components/section.tsx`, `src/components/site-header.tsx`, a featured-art component, and `tests/site.spec.ts`.

## Acceptance and verification

- Falling letter streams visibly move down and leave the complete name; no repeating title animation. Verify animation progress and completion in browser tests, including changing reduced motion while active.
- Projects precede Experience/Stack; all content, links, and semantic headings survive. Maintain keyboard access, active navigation, copy email, print, and script-failure behavior.
- White panels remain decorative and do not introduce duplicate link targets. At 390px the stack is substantially shorter than its current 1201px.
- Inspect desktop/mobile and title motion using the collaborative browser; check 320px and 200% text in the suite.
- Run focused regression tests, `npm run lint`, `npx next typegen`, `npx tsc --noEmit`, `npm run build`, and `npm run test:e2e`. Run the Impeccable detector once over changed UI files. Read the installed Next.js guides before product changes.

## Handoff

- Status: complete (including October 13 title refinement).
- Completed: finite Matrix title entrance; section/navigation reorder; numbered headings; work-result callouts; featured Kessler/Dispatch white panels and focus/hover interactions; compact stack; contact typography and dither boundary; grayscale brand marks; motion regression tests.
- Checks: three new Matrix tests failed before implementation and passed afterward. Full suite: 61 passed. Lint, route type generation, TypeScript, and production build passed. Relevant contact/contrast tests were rerun after the final logo-filter adjustment. Impeccable detector returned no findings. Independent static code review reported no findings.
- Browser: inspected desktop (1280px) and mobile (390px); verified the title at an intermediate animation frame and its final state. Fixed an 8px horizontal overflow caused by using viewport width for the dither strip on browsers with classic scrollbars; the strip now occupies normal flow. Confirmed scroll width equals client width at both sizes. At 390px, work projects start at about 1050px (previously 4152px), and Stack is about 851px tall (previously 1201px).
- Motion evidence: `/tmp/portfolio-matrix-preview.mp4`. Local preview: `http://localhost:3000`.
- October 13 update: Departure Mono 1.500 bundled unmodified (22,496-byte WOFF2) with its font license. Replaced the title's bitmap SVG with server-rendered letter spans and matching character streams; added loaded-font and failed-font checks. Prior changes are retained. All 63 browser tests, lint, route type generation, TypeScript, and production build passed. Impeccable detector returned no findings for the title/CSS refinement.
- October 13 browser verification: inspected the selected title at 1280px and 390px, with no horizontal overflow at either size. Confirmed the local typeface, responsive stacking, and finite animation replay. Recording: `/home/namelessmonarch/.t3/userdata/attachments/1a12d391-bc25-486a-9556-0e8ed20dae21-31f7e477-54a0-462d-9ffd-4ac7cff3ccf9-mp4.mp4`.
- Next action: user review at `http://localhost:3000`; no implementation checks remain. Real-device performance and Safari/Firefox were not measured.
- Deployment/commit: not requested; keep changes local for review.
