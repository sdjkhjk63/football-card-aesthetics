# Topps Inception UCC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the complete 33-item 2025/26 Topps Inception UEFA Club Competitions display catalogue and normalized real-card imagery to the desktop app.

**Architecture:** Extend the existing typed catalogue with one new `CardSeries`; reuse generic catalogue/detail routes. A deterministic Sharp import script copies and normalizes verified research images while unverified card types remain data-only placeholders.

**Tech Stack:** Next.js 16, TypeScript, Vitest, Sharp, Electron.

**Spec:** `docs/superpowers/specs/2026-08-24-topps-inception-ucc-design.md`

## Global Constraints

- Publish exactly 33 independent display objects.
- Preserve real card artwork, text, signatures, serials, patches, and memorabilia without generative reconstruction.
- Use 750 x 1050 portrait canvases and 1050 x 750 landscape canvases.
- Mark the eight missing trustworthy images as `unverified` and do not substitute similar cards.
- Dark Flow is Gold Foil `1/1`; Club Crest versions 1 and 2 are separate objects.

---

### Task 1: Catalogue contract

**Files:**
- Modify: `tests/catalogue.test.ts`
- Modify: `data/catalogue.ts`

**Interfaces:**
- Consumes: `CardSeries`, `CardDesign`, `getSeries()`, `validateSeries()`.
- Produces: exported `toppsInceptionUcc202526` series with slug `topps-inception-ucc-2025-26`.

- [x] **Step 1: Write the failing catalogue tests**

Add assertions for the exact 33 slugs, Dark Flow `1/1`, distinct `club-crest-autograph-patch-v1` and `v2`, eight `unverified` cards, all nine landscape layouts, and unique valid localized data.

- [x] **Step 2: Run the focused tests and verify RED**

Run: `pnpm test tests/catalogue.test.ts`

Expected: failure because `topps-inception-ucc-2025-26` is absent.

- [x] **Step 3: Add the minimal typed series data**

Define an Inception-specific card helper, 33 `CardDesign` objects with representative serials and verification state, packaging metadata, and add the series to `catalogue`.

- [x] **Step 4: Run the focused tests and verify GREEN**

Run: `pnpm test tests/catalogue.test.ts`

Expected: catalogue contract assertions pass, with file-presence checks deferred to Task 2.

### Task 2: Deterministic image import

**Files:**
- Create: `scripts/import-inception-ucc-assets.mjs`
- Create: `public/images/topps-inception-ucc-2025-26/packaging.*`
- Create: `public/images/topps-inception-ucc-2025-26/cards/*`
- Modify: `tests/catalogue.test.ts`

**Interfaces:**
- Consumes: verified research assets from the workspace root and the fixed card slug mapping.
- Produces: normalized assets at catalogue paths, without modifying source images.

- [x] **Step 1: Add failing asset-dimension and file-presence assertions**

For every verified card, assert a local file exists and Sharp metadata is exactly 750 x 1050 or 1050 x 750 according to layout. Assert the packaging asset exists.

- [x] **Step 2: Run the focused tests and verify RED**

Run: `pnpm test tests/catalogue.test.ts`

Expected: failure listing missing Inception asset paths.

- [x] **Step 3: Implement and run the deterministic importer**

Map each verified research filename to a stable app slug. Use Sharp `rotate()`, contain-fit resizing, and a neutral canvas; never generate or alter card content. Copy the packaging image from an official product source.

- [x] **Step 4: Run the focused tests and verify GREEN**

Run: `pnpm test tests/catalogue.test.ts`

Expected: all Inception catalogue and asset checks pass.

### Task 3: Full app and desktop verification

**Files:**
- Modify: `README.md`
- Generated, ignored output: `out/`, `release/`

**Interfaces:**
- Consumes: the new catalogue and normalized assets.
- Produces: updated documentation, static desktop export, and Windows installer.

- [x] **Step 1: Update the README catalogue totals and import command**

Document the seventh series, 205 display objects, Inception import command, and eight intentionally unverified placeholders.

- [x] **Step 2: Run the complete quality gate**

Run: `pnpm test`, `pnpm lint`, and `pnpm build`.

Expected: zero test failures, zero TypeScript errors, successful Next.js export/build.

- [x] **Step 3: Build the Windows desktop installer**

Run: `pnpm desktop:dist`.

Expected: `release/Card Aesthetics Setup 0.1.0.exe` exists and exits successfully.

- [x] **Step 4: Inspect the final diff and artifact**

Run: `git status --short`, `git diff --check`, and verify the installer file metadata.

Expected: no whitespace errors; only planned source/assets/docs changes plus ignored build artifacts.
