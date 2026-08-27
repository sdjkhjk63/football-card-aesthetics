# Topps Deco UEFA Club Competitions 2025-26 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Topps Deco UEFA Club Competitions series to Card Aesthetics and deploy a verified Windows desktop build.

**Architecture:** Follow the existing static catalogue architecture: one `CardSeries` entry in `data/catalogue.ts`, normalized local images under `public/images`, and generated static routes derived from `getCatalogue()`. Preserve the existing Electron packaging pipeline and verify deployment by comparing the packaged and installed ASAR hashes.

**Tech Stack:** TypeScript 7, Next.js 16 static export, Vitest 4, Sharp 0.35, Electron 43, electron-builder 26, pnpm 10.

**Spec:** `docs/superpowers/specs/2026-08-27-topps-deco-ucc-design.md`

## Global Constraints

- Publish exactly 22 reviewed visual card families and omit Only1.
- Use Chinese, English, and Spanish localized labels.
- Use only normalized local assets for packaging and displayed cards.
- Keep current catalogue order and existing series behavior intact.
- Install over the current per-user Card Aesthetics application and verify ASAR equality.

---

### Task 1: Catalogue and route contract

**Files:**
- Modify: `tests/catalogue.test.ts`
- Modify: `tests/desktopRoutes.test.ts`
- Modify: `data/catalogue.ts`

**Interfaces:**
- Consumes: `getSeries(slug: string)`, `validateSeries(series: CardSeries)` and static route generators.
- Produces: exported `toppsDecoUcc202526: CardSeries`, series slug `topps-deco-ucc-2025-26`, and 22 card routes.

- [x] **Step 1: Write the failing catalogue test**

Add literal expectations for the 22 approved slugs, total card count, complete standard parallel ladder, landscape layouts, localization validity, and omission of Only1.

- [x] **Step 2: Run the catalogue test to verify RED**

Run: `pnpm test -- tests/catalogue.test.ts`

Expected: FAIL because `getSeries("topps-deco-ucc-2025-26")` returns `undefined`.

- [x] **Step 3: Write the failing desktop-route test**

Add the Deco series route, update the literal total from 241 to 263, and require the `antiquity-autograph-relic` route.

- [x] **Step 4: Run the route test to verify RED**

Run: `pnpm test -- tests/desktopRoutes.test.ts`

Expected: FAIL because the Deco route is absent.

- [x] **Step 5: Implement the minimum catalogue entry**

Add one helper, the shared Deco parallel ladder, 22 literal card definitions, the series metadata, and the catalogue registration in `data/catalogue.ts`.

- [x] **Step 6: Run the focused tests to verify GREEN**

Run: `pnpm test -- tests/catalogue.test.ts tests/desktopRoutes.test.ts`

Expected: catalogue behavior passes after assets are imported in Task 2; route enumeration passes immediately.

### Task 2: Normalized local assets

**Files:**
- Create: `public/images/topps-deco-ucc-2025-26/packaging.png`
- Create: `public/images/topps-deco-ucc-2025-26/cards/*.webp`
- Create: `scripts/import-topps-deco-ucc-assets.mjs`
- Test: `tests/catalogue.test.ts`

**Interfaces:**
- Consumes: reviewed research assets from `research/topps-deco-ucc-2025-26`.
- Produces: one 1050×750 packaging image, portrait card canvases at 750×1050, and landscape card canvases at 1050×750.

- [x] **Step 1: Add asset assertions to the failing catalogue test**

Assert that packaging and all 22 card paths exist, decode with Sharp, and have the orientation-specific normalized dimensions.

- [x] **Step 2: Run the asset test to verify RED**

Run: `pnpm test -- tests/catalogue.test.ts`

Expected: FAIL because the Deco files do not yet exist.

- [x] **Step 3: Implement and run the import script**

Map each reviewed source filename to its catalogue slug, use Sharp `contain` resizing without cropping, flatten transparent pixels against black, and encode card outputs as WebP.

Run: `node scripts/import-topps-deco-ucc-assets.mjs`

- [x] **Step 4: Run the focused tests to verify GREEN**

Run: `pnpm test -- tests/catalogue.test.ts tests/desktopRoutes.test.ts`

Expected: PASS.

### Task 3: Regression verification and desktop deployment

**Files:**
- Generated: `out/**/*`
- Generated: `release/**/*`
- Installed: `%LOCALAPPDATA%/Programs/Card Aesthetics/resources/app.asar`

**Interfaces:**
- Consumes: passing source tree and local image assets.
- Produces: Windows installer and installed desktop application whose ASAR matches the build.

- [x] **Step 1: Run complete source verification**

Run: `pnpm test` and `pnpm lint`.

Expected: all tests pass and TypeScript exits 0.

- [x] **Step 2: Build the desktop installer**

Run: `pnpm desktop:dist`.

Expected: `release/Card Aesthetics Setup 0.1.0.exe` exists and exits 0.

- [x] **Step 3: Install the build**

Run the generated NSIS installer silently for the current user and wait for completion.

- [x] **Step 4: Verify the installed artifact**

Compare SHA-256 for the freshly packaged `app.asar` and `%LOCALAPPDATA%/Programs/Card Aesthetics/resources/app.asar`.

Expected: hashes are identical.

- [x] **Step 5: Commit and publish**

Run: `git add` for the Deco source, tests, assets, spec, and plan; commit with `feat: add Topps Deco UCC 2025-26`; push `HEAD:main`.
