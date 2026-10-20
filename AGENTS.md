# AGENTS.md

Photography portfolio single page. Next.js 14 (App Router) + React 18 + TypeScript (strict), Tailwind, framer-motion, react-three-fiber, three.

## Commands

- `npm run dev` — dev server.
- `npm run build` — production build. This is the typecheck gate (Next runs `tsc`); there is no separate typecheck script.
- `npm run lint` — `next lint`. There is **no committed ESLint config**; on first run it prompts to scaffold one.
- No test suite exists. Do not invent one.

## Layout & structure

- Everything renders from a single route: `src/app/page.tsx` composes the page as numbered sections `01…08`, each separated by `<FilmLine exposure="NN" kanji="…">`. Keep the exposure numbers/kanji consistent when you add or remove a section.
- Components live in `src/components/`. Nearly everything is `'use client'` (framer-motion + R3F).
- Path alias `@/*` → `src/*`.

## Design system (use these, not raw hex)

Defined in `tailwind.config.ts` + `src/app/globals.css`:

- Colors are RGB-triplet CSS vars: `--paper`, `--ink`, `--accent` (red). Use Tailwind classes `bg-paper text-ink …` (alpha via `/<value>`).
- Fonts are loaded via `next/font/google` in `src/app/layout.tsx` and exported as CSS vars consumed by Tailwind: `font-display` (Oswald), `font-jp`, `font-mono`, `font-comic`, `font-light`. Match the `mode` of layout's `next/font` instance when adding a font.
- Fluid type scale: `text-step--2 … text-step-5`, plus `text-display`.
- Custom utilities only in `globals.css`: `.grain`, `.halftone*`, `.wrap`, `.grid-swiss` (14-column Swiss grid), `.film-line`, `.rebate`.

## Media & assets

- All media is static under `public/`. Per-section folders like `public/models/exp-05/` hold the carousel frames (`iimage-*.jpeg`) and video.
- Remote image hosts must be allow-listed in `next.config.js` `images.remotePatterns` (currently `images.unsplash.com`, `prasad-atelier.vercel.app`). Add new hosts there or `next/image` will 400.
- Video: the client plays `-web.mp4` (H.264/web-optimized). The `-web` file is produced from the source clip with the bundled ffmpeg binary (`ffmpeg/ffmpeg-master-latest-win64-gpl`); if you add a video, provide the web version too.

## Do not touch (junk / third-party)

- Root scratch scripts (`extract*.js`, `find_*.js`, `generate-carousel.js`, `write_hero.js`), `temp_js/`, and `1.css/2.css/3.css/carousel.html` are disposable one-off generator/search outputs — never wire them into the app or "clean them up" as part of a feature.
- `Skills-main/` is a vendored copy of the MengTo/Skills agent-skills library (a separate repo, governed by its own `CLAUDE.md` inside it). Not application code.
- `ffmpeg.zip` is just the archived ffmpeg build.
- The repo root is **not a git repository**; only commit/PR flows apply if the user says so.

## Protected SATYA portfolio sections

* The Hero, EXP 01, EXP 02, EXP 03, EXP 04 — The Project Arcade, and EXP 05 — The Moment Vault sections are locked and must not be modified unless the user explicitly requests changes to them.
* Do not change their layout, island positioning, layers, typography, colors, animations, content, or functionality.
* When working on another section, preserve the existing appearance and behavior of all locked sections.
* Before modifying a locked section, verify that the user has explicitly requested that specific change. Do not infer permission from a general redesign or feature request.
* If a requested change could affect a locked section indirectly, explain the potential impact and ask for approval before proceeding.
