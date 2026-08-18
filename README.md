# Football Card Aesthetics

A multilingual, open-source catalogue for rating the visual design of football trading cards. The first release covers **2026 Topps Merlin Premier League** with 38 independent rating objects: 25 base/parallel designs and 13 inserts. It rates the card design—not the player, rarity, or market price.

Interface languages: Simplified Chinese, English, and Spanish. Ratings are private to the current browser; the app does not invent community averages.

## Run locally

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Release checks:

```bash
pnpm test
pnpm test:e2e
pnpm lint
pnpm build
```

## Windows desktop app

The desktop edition is an offline Electron wrapper around the same multilingual interface. It keeps ratings on the current computer and opens external source links in the normal web browser.

```bash
pnpm desktop:dev    # build and launch a local desktop window
pnpm desktop:build  # export the 43 offline pages to out/
pnpm desktop:pack   # create release/win-unpacked/Card Aesthetics.exe
pnpm desktop:dist   # create release/Card Aesthetics Setup 0.1.0.exe
```

The Windows installer creates `Card Aesthetics` shortcuts on the Desktop and in the Start Menu. Generated `out/` and `release/` files are intentionally ignored by Git.

The current card and packaging photographs are included only for private local research and evaluation. Do not publish the repository, installer, or copied imagery until the relevant image permissions have been confirmed or the images have been replaced with licensed assets. The original desktop cover and icon do not contain third-party card, league, club, or player artwork.

## Scoring method

Each design is rated from 1 to 10 in four public dimensions:

- Composition: 30%
- Color and finish: 30%
- Theme and identity: 25%
- Typography and details: 15%

`card score = composition × .30 + color/finish × .30 + theme/identity × .25 + typography/details × .15`

The complete series score is `rated-card average × .80 + player-photo selection × .20`. Until the player-photo selection score exists, the UI explicitly labels the result as a card average rather than a complete series score.

## Add a product series

1. Add packaging and representative design images under `public/images/<series>/`.
2. Add one typed `CardSeries` entry and its independent `CardDesign` objects in `data/catalogue.ts`.
3. Preserve a stable slug, localized names, print-run display, original source URL, platform, and authorization status for every image.
4. Add the series to the catalogue array. The generic routes then provide the series and card detail URLs without new route files.
5. Extend `tests/catalogue.test.ts` with the expected counts and critical numbering checks.

Sticker-only autograph variants should not become separate rating objects when the underlying visual design is otherwise identical.

## Image provenance and reuse

The packaging image is linked to its official Topps product page. Representative card images currently marked `research-only` retain visible links to their CardHobby or eBay listings; the project does not claim ownership of those images. Before a public or commercial deployment, confirm permission or replace them with licensed/owner-supplied images. Never remove the source metadata merely because a local copy exists.

The deterministic import command is:

```bash
node scripts/copy-merlin-assets.mjs
```

Its source research folder is intentionally not committed.

## Architecture and current limitation

Catalogue data, translation helpers, scoring rules, and persistence are separated into typed modules. `RatingRepository` is the boundary for persistence, so a future Supabase or other database adapter can replace browser storage without changing the scoring components.

At present, scores are local-only. There are no accounts, shared votes, or fabricated community statistics.
