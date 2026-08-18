# Windows Desktop App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the existing Card Aesthetics web application as a polished, offline-capable Windows app with an original splash cover, installer, and desktop shortcut.

**Architecture:** Add a conditional Next.js static-export mode, then serve the exported files from a loopback-only Node HTTP server owned by an Electron main process. Electron shows an original local splash, opens the static app in a sandboxed `BrowserWindow`, keeps ratings in browser storage, and uses electron-builder to produce an NSIS installer.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, Electron 43.4.0, electron-builder 26.15.3, sharp 0.35.3, png-to-ico 3.0.2, Vitest 4.1.10, Playwright 1.62.1, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-18-desktop-app-design.md`

## Global Constraints

- The installed product name is `Card Aesthetics` and the visible Chinese name is `卡面审美馆`.
- The desktop app must work without an internet connection except when opening external image-source pages.
- The installer must create both a Windows desktop shortcut and a Start Menu shortcut.
- The default window is 1280×850 with a minimum of 900×650.
- `contextIsolation` is true, `nodeIntegration` is false, and the renderer is sandboxed.
- The splash cover, icon, and branding may not contain Topps, Premier League, club, or player intellectual property.
- Existing card images remain in the private local build; no GitHub upload or public installer distribution occurs in this plan.
- Existing web commands, three languages, 38 card routes, and local rating persistence must keep working.

---

## File Structure

```text
desktop/
  main.mjs                         Electron lifecycle, windows, navigation policy
  staticServer.mjs                 Loopback static server and safe route resolution
  splash.html                      Branded local startup screen
  splash.css                       Cover overlay and progress animation
  assets/cover.png                 Original generated desktop cover
  assets/icon.svg                  Deterministic CA monogram
  assets/icon.ico                  Windows shortcut/installer icon
  assets/icon-512.png              Runtime window icon
scripts/
  build-desktop.mjs                Cross-platform DESKTOP_BUILD Next export
  generate-desktop-icons.mjs       SVG to PNG/ICO asset build
app/series/[seriesSlug]/page.tsx    Static series parameters
app/series/[seriesSlug]/cards/[cardSlug]/page.tsx
                                    Static card parameters
next.config.ts                     Conditional desktop export settings
tests/desktopRoutes.test.ts        Static route enumeration contract
tests/desktopStaticServer.test.ts  Safe static-file resolution contract
tests/desktopAssets.test.ts        Cover/icon existence and dimensions
package.json                       Electron entry, scripts, builder configuration
README.md                          Desktop commands, output path, copyright boundary
```

### Task 1: Static Desktop Export

**Files:**
- Modify: `next.config.ts`
- Modify: `app/series/[seriesSlug]/page.tsx`
- Modify: `app/series/[seriesSlug]/cards/[cardSlug]/page.tsx`
- Create: `scripts/build-desktop.mjs`
- Create: `tests/desktopRoutes.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `merlinPremierLeague2026` and its 38 stable card slugs.
- Produces: `generateStaticParams()` for both dynamic routes and `pnpm desktop:build`, which creates `out/index.html` plus all 39 series/card route pages.

- [ ] **Step 1: Write the failing route enumeration test**

```ts
import { expect, it } from "vitest";
import { generateStaticParams as seriesParams } from "@/app/series/[seriesSlug]/page";
import { generateStaticParams as cardParams } from "@/app/series/[seriesSlug]/cards/[cardSlug]/page";

it("enumerates the complete desktop route set", async () => {
  expect(await seriesParams()).toEqual([{ seriesSlug: "topps-merlin-premier-league-2026" }]);
  const cards = await cardParams();
  expect(cards).toHaveLength(38);
  expect(cards).toContainEqual({ seriesSlug: "topps-merlin-premier-league-2026", cardSlug: "red-mojo" });
});
```

- [ ] **Step 2: Run the test and confirm the missing-export failure**

Run: `pnpm test tests/desktopRoutes.test.ts`

Expected: FAIL because neither page exports `generateStaticParams`.

- [ ] **Step 3: Add deterministic static parameters**

The series route returns the one known series slug. The card route maps `merlinPremierLeague2026.cardDesigns` to `{ seriesSlug, cardSlug }`. Export `dynamicParams = false` from both routes.

- [ ] **Step 4: Add conditional export configuration**

```ts
const desktopBuild = process.env.DESKTOP_BUILD === "1";
const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  ...(desktopBuild ? {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};
```

- [ ] **Step 5: Add a cross-platform desktop build runner**

`scripts/build-desktop.mjs` spawns `pnpm exec next build` with `DESKTOP_BUILD=1`, inherited stdio, and the current environment. It exits with the child exit code and fails on spawn errors.

- [ ] **Step 6: Verify the export**

Run: `pnpm test tests/desktopRoutes.test.ts && pnpm desktop:build`

Expected: test passes and these files exist:

```text
out/index.html
out/series/topps-merlin-premier-league-2026/index.html
out/series/topps-merlin-premier-league-2026/cards/red-mojo/index.html
```

- [ ] **Step 7: Commit the export mode**

```powershell
git add next.config.ts app/series scripts/build-desktop.mjs tests/desktopRoutes.test.ts package.json pnpm-lock.yaml
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add offline desktop export"
```

### Task 2: Safe Static Server and Electron Shell

**Files:**
- Create: `desktop/staticServer.mjs`
- Create: `desktop/main.mjs`
- Create: `tests/desktopStaticServer.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: exported `out/` directory.
- Produces: `resolveStaticFile(root: string, requestPath: string): string | null`, `createStaticServer(root: string): Promise<{ server, origin, close }>` and Electron entry `desktop/main.mjs`.

- [ ] **Step 1: Write failing safe-path tests**

```ts
// @vitest-environment node
import path from "node:path";
import { expect, it } from "vitest";
import { resolveStaticFile } from "@/desktop/staticServer.mjs";

const root = path.resolve("out");

it("maps exported routes to index files", () => {
  expect(resolveStaticFile(root, "/")).toBe(path.join(root, "index.html"));
  expect(resolveStaticFile(root, "/series/demo/")).toBe(path.join(root, "series", "demo", "index.html"));
});

it("rejects path traversal", () => {
  expect(resolveStaticFile(root, "/../../package.json")).toBeNull();
  expect(resolveStaticFile(root, "/%2e%2e/%2e%2e/package.json")).toBeNull();
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

Run: `pnpm test tests/desktopStaticServer.test.ts`

Expected: FAIL because `desktop/staticServer.mjs` does not exist.

- [ ] **Step 3: Implement path resolution and loopback serving**

`resolveStaticFile` decodes the path, resolves it against the export root, verifies the result remains inside that root, maps extensionless and trailing-slash routes to `index.html`, and returns `null` for invalid encodings or traversal. `createStaticServer` listens only on `127.0.0.1` with port `0`, returns the assigned origin, serves correct HTML/CSS/JS/image MIME types, and uses the exported `404.html` for misses.

- [ ] **Step 4: Implement the Electron lifecycle**

`desktop/main.mjs` must:

- enforce a single app instance;
- use `app.getAppPath()/out` and fail visibly if `index.html` is missing;
- create the splash before starting the server;
- create a sandboxed 1280×850 main window with the specified minimum size;
- close the splash on `ready-to-show`;
- deny renderer-created windows;
- open only `https:` external links with `shell.openExternal`;
- prevent navigation away from the loopback origin;
- close the server on `before-quit`.

- [ ] **Step 5: Install pinned desktop dependencies and add the entry point**

Run:

```powershell
pnpm add -D electron@43.4.0 electron-builder@26.15.3 sharp@0.35.3 png-to-ico@3.0.2
```

Set `"main": "desktop/main.mjs"` and add `desktop:dev` as `pnpm desktop:build && electron .`.

- [ ] **Step 6: Verify server tests and Electron syntax**

Run: `pnpm test tests/desktopStaticServer.test.ts && node --check desktop/main.mjs && node --check desktop/staticServer.mjs`

Expected: all commands exit 0.

- [ ] **Step 7: Commit the shell**

```powershell
git add desktop/main.mjs desktop/staticServer.mjs tests/desktopStaticServer.test.ts package.json pnpm-lock.yaml
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add secure Electron desktop shell"
```

### Task 3: Original Cover, Splash, and Windows Icons

**Files:**
- Create: `desktop/assets/cover.png`
- Create: `desktop/assets/icon.svg`
- Create: `desktop/assets/icon.ico`
- Create: `desktop/assets/icon-512.png`
- Create: `desktop/splash.html`
- Create: `desktop/splash.css`
- Create: `scripts/generate-desktop-icons.mjs`
- Create: `tests/desktopAssets.test.ts`

**Interfaces:**
- Consumes: original cover produced with the built-in image-generation tool.
- Produces: local splash UI and Windows-compatible icon files referenced by Electron and electron-builder.

- [ ] **Step 1: Write the failing asset validation test**

```ts
// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import sharp from "sharp";

it("has a landscape cover and installable icons", async () => {
  const cover = path.resolve("desktop/assets/cover.png");
  const icon = path.resolve("desktop/assets/icon-512.png");
  expect(fs.existsSync(cover)).toBe(true);
  expect(fs.existsSync(path.resolve("desktop/assets/icon.ico"))).toBe(true);
  const coverMeta = await sharp(cover).metadata();
  const iconMeta = await sharp(icon).metadata();
  expect((coverMeta.width ?? 0) / (coverMeta.height ?? 1)).toBeGreaterThan(1.4);
  expect(iconMeta.width).toBe(512);
  expect(iconMeta.height).toBe(512);
});
```

- [ ] **Step 2: Run the test and confirm missing assets**

Run: `pnpm test tests/desktopAssets.test.ts`

Expected: FAIL because the cover and icon outputs do not exist.

- [ ] **Step 3: Generate the original cover**

Use the built-in image-generation tool with this project-bound prompt:

```text
Use case: stylized-concept
Asset type: Windows desktop app splash cover
Primary request: an original premium football trading-card aesthetics gallery, represented by one abstract blank card silhouette floating inside a dark museum-like space
Style/medium: luxury editorial 3D illustration, black lacquer, subtle brushed metal, warm gold foil edges, restrained electric violet refraction
Composition/framing: landscape 16:10, main abstract card on the right, generous dark negative space on the left for an HTML title overlay
Lighting/mood: cinematic, refined, collector-focused, quiet rather than flashy
Constraints: no text, no letters, no numbers, no logos, no trademarks, no player, no human likeness, no club badge, no league symbol, no copied card artwork, no watermark
```

Inspect the output, then copy the selected file into `desktop/assets/cover.png`.

- [ ] **Step 4: Create and convert the monogram icon**

Create a square SVG with a near-black background, thin warm-gold circular border, and original `CA` monogram. `scripts/generate-desktop-icons.mjs` uses sharp to render 512, 256, 128, 64, 48, 32, and 16 pixel PNG buffers, writes `icon-512.png`, and passes all buffers to `png-to-ico` to create `icon.ico`.

- [ ] **Step 5: Build the local splash**

`splash.html` uses `cover.png` as the full background, overlays `CARD AESTHETICS`, `卡面审美馆`, and a small animated loading line in real HTML text, and imports only `splash.css`. No network request or remote font is allowed.

- [ ] **Step 6: Verify the visual assets**

Run: `node scripts/generate-desktop-icons.mjs && pnpm test tests/desktopAssets.test.ts`

Expected: test passes and all asset files exist.

- [ ] **Step 7: Commit the original brand assets**

```powershell
git add desktop/assets desktop/splash.html desktop/splash.css scripts/generate-desktop-icons.mjs tests/desktopAssets.test.ts
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add original desktop cover and branding"
```

### Task 4: Windows Installer and Desktop Shortcut

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Test: `release/win-unpacked/Card Aesthetics.exe` generated output

**Interfaces:**
- Consumes: Electron shell, `out/`, `desktop/assets/icon.ico`.
- Produces: `pnpm desktop:pack`, `pnpm desktop:dist`, unpacked executable, and NSIS installer.

- [ ] **Step 1: Add electron-builder configuration**

```json
{
  "build": {
    "appId": "com.cardaesthetics.desktop",
    "productName": "Card Aesthetics",
    "asar": true,
    "directories": { "output": "release" },
    "files": ["desktop/**/*", "out/**/*", "package.json"],
    "win": {
      "icon": "desktop/assets/icon.ico",
      "target": ["nsis"],
      "artifactName": "Card Aesthetics Setup ${version}.${ext}"
    },
    "nsis": {
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Card Aesthetics",
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

- [ ] **Step 2: Add packaging scripts and ignore generated output**

Add:

```json
"desktop:pack": "pnpm desktop:build && electron-builder --dir --win",
"desktop:dist": "pnpm desktop:build && electron-builder --win nsis"
```

Add `out/` and `release/` to `.gitignore`.

- [ ] **Step 3: Create the unpacked application**

Run: `pnpm desktop:pack`

Expected: `release/win-unpacked/Card Aesthetics.exe` exists and electron-builder reports a successful directory build.

- [ ] **Step 4: Launch and inspect the unpacked application**

Start the executable, confirm the splash and main window appear, interact with language switching and one saved rating, restart it, and confirm the rating persists. Confirm a source link opens in the normal browser.

- [ ] **Step 5: Create the installer**

Run: `pnpm desktop:dist`

Expected: `release/Card Aesthetics Setup 0.1.0.exe` exists and is non-empty.

- [ ] **Step 6: Commit packaging configuration**

```powershell
git add package.json pnpm-lock.yaml .gitignore
git -c user.name=Codex -c user.email=codex@local commit -m "build: add Windows installer and shortcut"
```

### Task 5: Documentation and Release Gate

**Files:**
- Modify: `README.md`
- Create: `docs/desktop-image-prompt.md`

**Interfaces:**
- Consumes: completed desktop scripts and outputs.
- Produces: reproducible local desktop instructions and explicit non-public copyright boundary.

- [ ] **Step 1: Document desktop usage**

README must list `desktop:dev`, `desktop:build`, `desktop:pack`, and `desktop:dist`, the installer path, the shortcut behavior, and the requirement that current card images are for the private local build only.

- [ ] **Step 2: Document original cover provenance**

Save the exact built-in image-generation prompt, asset purpose, generation date, and the statement that no external reference image was used in `docs/desktop-image-prompt.md`.

- [ ] **Step 3: Run the complete verification gate**

Run:

```powershell
pnpm test
pnpm test:e2e
pnpm lint
pnpm build
pnpm desktop:build
pnpm desktop:pack
pnpm desktop:dist
```

Expected: 0 test failures, TypeScript exits 0, the web and desktop builds exit 0, the unpacked executable exists, and the NSIS installer exists.

- [ ] **Step 4: Check source-control scope**

Run: `git status --short`

Expected: no `out/`, `release/`, test reports, or other generated binaries are staged. Only documentation changes remain.

- [ ] **Step 5: Commit documentation**

```powershell
git add README.md docs/desktop-image-prompt.md
git -c user.name=Codex -c user.email=codex@local commit -m "docs: add private desktop build guide"
```

## Final Acceptance Checklist

- [ ] Double-clicking the unpacked executable opens the splash and app.
- [ ] The installer creates the configured desktop shortcut.
- [ ] The application works offline after installation.
- [ ] All 38 card routes load inside the desktop window.
- [ ] Chinese, English, and Spanish still work.
- [ ] Ratings persist across app restarts.
- [ ] External source links leave the Electron window and open in the system browser.
- [ ] The cover and icon contain no third-party logo, player, club, or copied artwork.
- [ ] No GitHub upload, release, permission request, or public distribution has occurred.
