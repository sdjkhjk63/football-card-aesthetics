# Football Card Aesthetics Desktop App Design

## Goal

Turn the existing multilingual card-rating website into a polished Windows desktop application that the user can install, launch from a desktop shortcut, and use without opening a browser manually.

This phase produces a private local build. It does not upload the repository, publish a GitHub Release, contact Topps, or publicly distribute third-party card images.

## Product Experience

- The installed name is **Card Aesthetics / 卡面审美馆**.
- The installer creates a Windows desktop shortcut and Start Menu entry.
- Launching the shortcut first shows a premium original cover, then opens the existing catalogue in a desktop window.
- The window defaults to 1280×850 and supports resizing down to 900×650.
- Existing Chinese, English, and Spanish interfaces remain available.
- Existing local ratings persist between launches.
- External source links open in the user's normal browser, not inside the app window.
- The desktop shell never presents itself as an official Topps product.

## Visual Direction

The cover uses an original dark editorial style: black lacquer, warm gold foil, restrained electric violet light, an abstract football-card silhouette, and gallery-like depth. It contains no player likeness, club badge, Topps logo, Premier League logo, or copied card artwork.

The generated raster cover contains no text. The application overlays the exact product name and loading state in HTML/CSS so Chinese and English remain crisp and editable. The app icon is a deterministic code-native `CA` monogram rather than an AI-generated trademark-like badge.

## Architecture

### Static application build

The Next.js application gains a desktop export mode. The known Merlin series and all 38 card routes are generated ahead of time with `generateStaticParams`. A desktop build creates a self-contained `out/` directory.

The normal web-development commands remain intact. Desktop-specific configuration is selected by an environment flag so future web hosting is still possible.

### Electron shell

Electron is used because it provides the most reliable Windows installer, desktop shortcut, local storage, and packaging workflow for the existing Next.js/React codebase.

The Electron main process:

1. Shows a frameless splash window using the original cover asset.
2. Starts a loopback-only static server on a random available port.
3. Serves only files inside the packaged `out/` directory with path-traversal protection.
4. Opens the main `BrowserWindow` after the local app is ready.
5. Opens approved `https:` source links through the default system browser.
6. Shuts down the local server when the application exits.

Security settings use `contextIsolation: true`, `nodeIntegration: false`, sandboxing, a restrictive navigation policy, and no remote content in privileged Electron contexts.

### Packaging

`electron-builder` produces an NSIS Windows installer in `release/`. The installer creates a desktop shortcut and Start Menu entry. A portable unpacked build is also retained for diagnosis.

Expected installer name:

```text
Card Aesthetics Setup 0.1.0.exe
```

## Assets

- `desktop/assets/cover.png`: original AI-generated splash/cover image.
- `desktop/assets/icon.svg`: deterministic monogram source.
- `desktop/assets/icon.ico`: Windows installer and shortcut icon.
- Existing card images remain part of this private local build only.

All project-bound generated assets are committed to the feature branch. The cover prompt and provenance are documented in the README.

## Copyright Boundary

This local desktop build may use the existing research images on the user's computer. Before any public GitHub push or installer distribution:

1. Request written image-use permission from Topps.
2. Confirm whether marketplace photographs require separate permission from their photographers or sellers.
3. If permission is not granted, remove third-party images from the public Git history and installer, then use local user-imported assets or licensed replacements.
4. Keep the original cover, app icon, code, catalogue facts, and scoring methodology, which do not copy Topps artwork.

No public release action is part of this implementation.

## Commands

- `pnpm desktop:dev`: build/start the desktop application for local development.
- `pnpm desktop:build`: create the static Next.js desktop payload.
- `pnpm desktop:pack`: create an unpacked Windows build for smoke testing.
- `pnpm desktop:dist`: create the Windows installer with desktop-shortcut configuration.

## Error Handling

- A missing static payload shows a clear local error instead of a blank window.
- Static-server errors are logged locally and close the splash window safely.
- Unknown routes return the exported 404 page.
- Failure to open an external URL is non-fatal.
- Packaging never silently uploads or publishes output.

## Verification

- Unit-test static path resolution and path-traversal rejection.
- Re-run the existing 17 unit/component tests and four browser journeys.
- Build the static export and confirm all 38 card detail pages exist.
- Launch the unpacked Electron application and verify the splash, main window, language switching, local ratings, and external links.
- Build the NSIS installer and confirm the executable exists with the intended product name and shortcut settings.
- Visually inspect the splash and application at desktop window sizes.

## Out of Scope

- GitHub upload, repository creation, or GitHub Releases.
- Topps permission requests or any communication sent on the user's behalf.
- Public distribution of the installer.
- Automatic updates, accounts, cloud ratings, payments, or analytics.
