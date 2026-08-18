# Football Card Aesthetics App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, multilingual Next.js app where users enter a football-card series through its product packaging, browse 38 Merlin card designs, and save transparent weighted aesthetic ratings locally.

**Architecture:** Use Next.js App Router with typed, version-controlled catalogue data and small domain modules for validation, translation, rating calculation, and persistence. UI components consume repository interfaces rather than browser storage directly, allowing a future Supabase adapter to replace the local adapter without rewriting routes or components.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 7.0.2, Vitest 4.1.10, Testing Library 16.3.2, Playwright 1.62.1, CSS Modules/global design tokens, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-18-card-aesthetics-app-design.md`

## Global Constraints

- Support exactly `zh-CN`, `en`, and `es`, with English fallback for missing card-name translations.
- Seed exactly 38 independent Merlin rating objects: 25 base/base-parallel designs and 13 insert designs.
- Use Red Mojo `/5` and Superfractor `1/1`.
- Use four public rating dimensions: composition 30%, color/finish 30%, theme/identity 25%, typography/details 15%.
- Never display fabricated community votes or community averages; local-only results are labeled “My rating” in the active language.
- Preserve image source URLs and authorization status in data.
- Do not include sticker-only autograph variants.
- Treat absent ratings differently from a numeric zero.
- Use the one-time commit identity `Codex <codex@local>` unless the user configures Git identity before execution.

---

## File Structure

```text
app/
  methodology/page.tsx                  Public scoring methodology
  series/[seriesSlug]/page.tsx          Series catalogue route
  series/[seriesSlug]/cards/[cardSlug]/page.tsx
                                           Card design detail route
  globals.css                           Design tokens and responsive global styles
  layout.tsx                            Root metadata, providers, and shell
  not-found.tsx                         Friendly missing-content state
  page.tsx                              Product-series landing page
components/
  AppHeader.tsx                         Brand, navigation, and language control
  CardDesignGrid.tsx                    Searchable/filterable design grid
  CardDesignTile.tsx                    Individual catalogue tile
  LanguageProvider.tsx                  Locale context and browser persistence
  ProductHero.tsx                       Packaging-led series presentation
  RatingForm.tsx                        Four-dimension rating controls
  RatingSummary.tsx                     My-rating and series-summary display
  SourceNotice.tsx                      Image provenance and authorization label
data/
  catalogue.ts                          Typed Merlin series and 38 card objects
  messages.ts                           Three-language interface copy
domain/
  catalogue.ts                          Domain types and catalogue validation
  i18n.ts                               Locale resolution and translation helpers
  ratings.ts                            Weighted score and aggregate functions
lib/
  ratingRepository.ts                   Repository contract
  localRatingRepository.ts              localStorage/session fallback adapter
public/images/merlin-2026/
  packaging.webp                        Official product packaging image
  cards/*                               38 representative research images
tests/
  catalogue.test.ts                     Dataset counts, uniqueness, and source checks
  i18n.test.ts                          Locale and fallback behavior
  ratings.test.ts                       Formula, update, and aggregation tests
  components/RatingForm.test.tsx        Accessible interaction test
  e2e/app.spec.ts                       Main user journey in three viewports
scripts/
  copy-merlin-assets.mjs                Deterministic research-to-public asset copy
vitest.config.ts                        Unit/component test configuration
vitest.setup.ts                         Testing Library DOM matchers
playwright.config.ts                    Browser-test server and projects
package.json                            Scripts and pinned dependencies
README.md                               Run, data-update, scoring, and image-source guide
```

### Task 1: Runnable Next.js Shell and Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Test: `tests/smoke.test.tsx`

**Interfaces:**
- Consumes: none.
- Produces: `pnpm dev`, `pnpm test`, `pnpm test:e2e`, `pnpm lint`, and a renderable root layout used by every later task.

- [ ] **Step 1: Write the failing shell test**

```tsx
// tests/smoke.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

it("renders the catalogue heading", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: /card aesthetics/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Create pinned package scripts and run the test to confirm failure**

```json
{
  "name": "football-card-aesthetics",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "16.3.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.2",
    "@types/node": "26.2.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "jsdom": "30.0.1",
    "typescript": "7.0.2",
    "vitest": "4.1.10"
  }
}
```

Run: `pnpm install && pnpm test tests/smoke.test.tsx`

Expected: FAIL because `app/page.tsx` and test configuration do not yet exist.

- [ ] **Step 3: Implement the minimal App Router shell and test configuration**

```tsx
// app/page.tsx
export default function HomePage() {
  return <main><h1>Football Card Aesthetics</h1></main>;
}
```

Configure `@/*` to map to the repository root, `jsdom` as the Vitest environment, and `vitest.setup.ts` to import `@testing-library/jest-dom/vitest`.

- [ ] **Step 4: Verify the shell**

Run: `pnpm test tests/smoke.test.tsx && pnpm lint && pnpm build`

Expected: all commands exit 0 and Next.js builds `/`.

- [ ] **Step 5: Commit the shell**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts vitest.config.ts vitest.setup.ts app tests/smoke.test.tsx
git -c user.name=Codex -c user.email=codex@local commit -m "chore: scaffold card aesthetics app"
```

### Task 2: Typed Catalogue, Asset Pipeline, and 38 Merlin Designs

**Files:**
- Create: `domain/catalogue.ts`
- Create: `data/catalogue.ts`
- Create: `scripts/copy-merlin-assets.mjs`
- Create: `public/images/merlin-2026/packaging.webp`
- Create: `public/images/merlin-2026/cards/*`
- Test: `tests/catalogue.test.ts`

The runtime requires Node.js `>=20.9.0`, matching Next.js 16.3.1's published engine requirement.

**Interfaces:**
- Consumes: research assets under `research/topps-merlin-premier-league-2026/`.
- Produces: `LocaleText`, `ImageSource`, `CardDesign`, `Series`, `validateSeries(series)`, `catalogue`, `getSeries(slug)`, and `getCardDesign(slug)`.

- [ ] **Step 1: Write failing catalogue contract tests**

```ts
import { merlinPremierLeague2026 } from "@/data/catalogue";
import { validateSeries } from "@/domain/catalogue";

it("contains the complete independent-design catalogue", () => {
  expect(merlinPremierLeague2026.cardDesigns).toHaveLength(38);
  expect(merlinPremierLeague2026.cardDesigns.filter(card => card.group === "base")).toHaveLength(25);
  expect(merlinPremierLeague2026.cardDesigns.filter(card => card.group === "insert")).toHaveLength(13);
});

it("uses the verified low-numbered print runs", () => {
  expect(merlinPremierLeague2026.cardDesigns.find(card => card.slug === "red-mojo")?.serial).toBe("/5");
  expect(merlinPremierLeague2026.cardDesigns.find(card => card.slug === "superfractor")?.serial).toBe("1/1");
});

it("passes source, translation, and uniqueness validation", () => {
  expect(validateSeries(merlinPremierLeague2026)).toEqual([]);
});
```

- [ ] **Step 2: Run tests to verify missing-domain failure**

Run: `pnpm test tests/catalogue.test.ts`

Expected: FAIL because the catalogue modules do not exist.

- [ ] **Step 3: Define exact catalogue types and validation**

```ts
export type Locale = "zh-CN" | "en" | "es";
export type LocaleText = Record<Locale, string>;
export type CardGroup = "base" | "insert";
export type CardSection = "base-unnumbered" | "base-numbered" | "regular-insert" | "rare-insert";

export interface ImageSource {
  path: string;
  platform: "Topps" | "CardHobby" | "eBay";
  sourceUrl: string;
  authorization: "official" | "research-only" | "licensed";
  alt: LocaleText;
}

export interface CardDesign {
  slug: string;
  officialName: string;
  name: LocaleText;
  group: CardGroup;
  section: CardSection;
  serial: string | null;
  image: ImageSource;
}

export interface Series {
  slug: string;
  manufacturer: "Topps" | "Panini";
  season: string;
  name: LocaleText;
  packaging: ImageSource;
  cardDesigns: CardDesign[];
}
```

`validateSeries` must return string errors for duplicate slugs, missing English names, missing image paths/source URLs, invalid serial display, and incorrect Merlin counts.

- [ ] **Step 4: Create the deterministic asset-copy script**

The script copies `official-gallery/atlantic-01.webp` to `packaging.webp`, all 29 CardHobby files to matching card slugs, and all 9 secondary-market files to their matching slugs. Use `fs.copyFile` and fail when a source is missing; do not silently skip files.

Exact secondary mappings:

```js
{
  "battle-of-britpop": "battle-of-britpop-95.webp",
  "black-mojo": "black-mojo-10.webp",
  "red-mojo": "red-mojo-5.webp",
  "superfractor": "superfractor-1of1.webp",
  "merlin-premier-league-1996-edition": "1996-edition.webp",
  "renaissance": "renaissance.webp",
  "magic-in-his-boots": "magic-in-his-boots.webp",
  "merlins-magnum-opus": "magnum-opus.webp",
  "mask-off": "mask-off.webp"
}
```

- [ ] **Step 5: Populate all 38 stable slugs**

Use these 25 base/base-parallel slugs in order:

```text
base, refractor, raywave, mojo, vintage-merlin, vhs-refractor,
pink-refractor, aqua-refractor, aqua-mojo, blue-refractor, blue-mojo,
green-refractor, green-mojo, battle-of-britpop, purple-refractor,
purple-mojo, gold-refractor, gold-mojo, orange-refractor, orange-mojo,
black-refractor, black-mojo, red-refractor, red-mojo, superfractor
```

Use these 13 insert slugs in order:

```text
fantasy-football, mystic-afternoons, merlins-young-magicians,
merlin-speaks, ta-da, merlin-premier-league-1996-edition, the-shiny,
renaissance, magic-in-his-boots, rainbow-flick, merlins-magnum-opus,
merlins-mythical-art, mask-off
```

Copy official English and Chinese names from `WORK_ORDER_ZH.md`; add natural Spanish translations while preserving `officialName`. Copy every marketplace source URL from `CARDHOBBY_IMAGE_INDEX.md`.

- [ ] **Step 6: Run asset and catalogue verification**

Run: `node scripts/copy-merlin-assets.mjs && pnpm test tests/catalogue.test.ts && pnpm lint`

Expected: 39 image files copied (one packaging plus 38 cards), all tests pass, and no type errors.

- [ ] **Step 7: Commit the catalogue**

```powershell
git add domain/catalogue.ts data/catalogue.ts scripts/copy-merlin-assets.mjs public/images/merlin-2026 tests/catalogue.test.ts
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add complete Merlin design catalogue"
```

### Task 3: Translation Runtime and Application Shell

**Files:**
- Create: `domain/i18n.ts`
- Create: `data/messages.ts`
- Create: `components/LanguageProvider.tsx`
- Create: `components/AppHeader.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Consumes: `Locale`, `LocaleText` from `domain/catalogue.ts`.
- Produces: `SUPPORTED_LOCALES`, `resolveLocale(value)`, `localize(text, locale)`, `useLanguage(): { locale, setLocale, t }`.

- [ ] **Step 1: Write failing locale and fallback tests**

```ts
import { localize, resolveLocale } from "@/domain/i18n";

it("resolves supported locales and falls back to Chinese", () => {
  expect(resolveLocale("es")).toBe("es");
  expect(resolveLocale("fr")).toBe("zh-CN");
});

it("falls back to English for a missing localized card name", () => {
  expect(localize({ "zh-CN": "", en: "Refractor", es: "" }, "es")).toBe("Refractor");
});
```

- [ ] **Step 2: Verify tests fail, then implement pure helpers**

Run: `pnpm test tests/i18n.test.ts`

Expected: FAIL because `domain/i18n.ts` is missing.

Implement `resolveLocale` and `localize` without browser APIs so they remain unit-testable.

- [ ] **Step 3: Implement messages and provider persistence**

Use storage key `card-aesthetics-locale`. On first client render, read it safely; on failure keep `zh-CN`. `setLocale` updates state, `<html lang>`, and storage. Translate navigation, filters, scoring labels, error states, and source authorization labels.

- [ ] **Step 4: Wire the header and verify**

Run: `pnpm test tests/i18n.test.ts && pnpm lint && pnpm build`

Expected: tests pass and the root layout builds with a three-option language control.

- [ ] **Step 5: Commit i18n**

```powershell
git add domain/i18n.ts data/messages.ts components/LanguageProvider.tsx components/AppHeader.tsx app/layout.tsx tests/i18n.test.ts
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add multilingual application shell"
```

### Task 4: Transparent Rating Domain and Local Repository

**Files:**
- Create: `domain/ratings.ts`
- Create: `lib/ratingRepository.ts`
- Create: `lib/localRatingRepository.ts`
- Test: `tests/ratings.test.ts`

**Interfaces:**
- Consumes: stable `cardSlug` strings from the catalogue.
- Produces: `RatingInput`, `RatingRecord`, `RatingSummary`, `calculateWeightedScore(input)`, `calculateSeriesSummary(records, selectionScore?)`, `RatingRepository`, and `createLocalRatingRepository(storage?)` including series-level player-photo selection scores.

- [ ] **Step 1: Write failing formula and update tests**

```ts
const perfect = { composition: 10, colorFinish: 10, themeIdentity: 10, typographyDetails: 10 };

it("calculates the public weighted score to one decimal", () => {
  expect(calculateWeightedScore(perfect)).toBe(10);
  expect(calculateWeightedScore({ composition: 8, colorFinish: 9, themeIdentity: 7, typographyDetails: 6 })).toBe(7.8);
});

it("updates one local record instead of duplicating it", () => {
  const repository = createLocalRatingRepository(memoryStorage());
  repository.save("refractor", perfect);
  repository.save("refractor", { ...perfect, composition: 8 });
  expect(repository.list()).toHaveLength(1);
  expect(repository.get("refractor")?.input.composition).toBe(8);
});

it("stores one player-photo selection score per series", () => {
  const repository = createLocalRatingRepository(memoryStorage());
  repository.saveSeriesSelection("topps-merlin-premier-league-2026", 7);
  repository.saveSeriesSelection("topps-merlin-premier-league-2026", 9);
  expect(repository.getSeriesSelection("topps-merlin-premier-league-2026")).toBe(9);
});
```

- [ ] **Step 2: Run tests to verify missing-module failure**

Run: `pnpm test tests/ratings.test.ts`

Expected: FAIL because rating modules are missing.

- [ ] **Step 3: Implement bounded scoring and series aggregation**

Reject dimension values outside 1-10. Round card totals to one decimal. When `selectionScore` exists, calculate `cardAverage * 0.8 + selectionScore * 0.2`; otherwise return a result with kind `card-average` and do not imply it is the full series score.

- [ ] **Step 4: Implement the repository contract and fallback**

```ts
export interface RatingRepository {
  get(cardSlug: string): RatingRecord | null;
  list(): RatingRecord[];
  save(cardSlug: string, input: RatingInput): RatingRecord;
  getSeriesSelection(seriesSlug: string): number | null;
  saveSeriesSelection(seriesSlug: string, score: number): number;
}
```

Use storage key `card-aesthetics-ratings-v1`. If browser storage throws, retain records in a module-scoped memory map and expose `persistence: "session"` so the UI can warn the user.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test tests/ratings.test.ts && pnpm lint`

Expected: formula, validation, update, aggregation, and fallback tests pass.

```powershell
git add domain/ratings.ts lib/ratingRepository.ts lib/localRatingRepository.ts tests/ratings.test.ts
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add transparent local rating model"
```

### Task 5: Packaging-Led Landing Page and Series Catalogue

**Files:**
- Create: `components/ProductHero.tsx`
- Create: `components/CardDesignTile.tsx`
- Create: `components/CardDesignGrid.tsx`
- Create: `components/RatingSummary.tsx`
- Modify: `app/page.tsx`
- Create: `app/series/[seriesSlug]/page.tsx`
- Create: `app/not-found.tsx`
- Test: `tests/components/CardDesignGrid.test.tsx`

**Interfaces:**
- Consumes: `Series`, `CardDesign`, `getSeries`, `localize`, and `RatingRecord[]`.
- Produces: packaging-led series navigation and searchable/filterable catalogue links to `/series/[seriesSlug]/cards/[cardSlug]`.

- [ ] **Step 1: Write failing catalogue interaction test**

```tsx
render(<CardDesignGrid designs={merlinPremierLeague2026.cardDesigns} locale="zh-CN" ratings={[]} />);
expect(screen.getAllByRole("link")).toHaveLength(38);
await userEvent.type(screen.getByRole("searchbox"), "Mojo");
expect(screen.getByRole("link", { name: /Red Mojo/i })).toBeVisible();
expect(screen.queryByRole("link", { name: /VHS/i })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the component test and confirm failure**

Run: `pnpm test tests/components/CardDesignGrid.test.tsx`

Expected: FAIL because the grid does not exist.

- [ ] **Step 3: Implement landing and series routes**

The landing page must render the official packaging image as the largest visual, the trilingual series title, manufacturer, season, design count, and an “Enter series” link. The series route must call `notFound()` for unknown slugs and group designs by `section`.

- [ ] **Step 4: Implement client-side search and section filters**

Search official and localized names case-insensitively. Filter controls use buttons with `aria-pressed`; the search input has a visible label. A zero-result state displays a translated message without removing the filters.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test tests/components/CardDesignGrid.test.tsx && pnpm lint && pnpm build`

Expected: 38 accessible design links render, filtering works, and routes build.

```powershell
git add components/ProductHero.tsx components/CardDesignTile.tsx components/CardDesignGrid.tsx components/RatingSummary.tsx app/page.tsx app/series app/not-found.tsx tests/components/CardDesignGrid.test.tsx
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add packaging-led Merlin catalogue"
```

### Task 6: Card Detail, Rating Form, Methodology, and Provenance

**Files:**
- Create: `components/RatingForm.tsx`
- Create: `components/SeriesSelectionRating.tsx`
- Create: `components/SourceNotice.tsx`
- Create: `app/series/[seriesSlug]/cards/[cardSlug]/page.tsx`
- Create: `app/methodology/page.tsx`
- Test: `tests/components/RatingForm.test.tsx`
- Test: `tests/components/SeriesSelectionRating.test.tsx`

**Interfaces:**
- Consumes: `getCardDesign`, `RatingRepository`, `RatingInput`, `calculateWeightedScore`, `useLanguage`.
- Produces: accessible 1-10 controls, card and series-selection save/update flows, local score labels, persistence warning, public formula page, and source links.

- [ ] **Step 1: Write the failing rating-form test**

```tsx
render(<RatingForm cardSlug="refractor" repository={repository} locale="en" />);
for (const name of ["Composition", "Color & finish", "Theme & identity", "Typography & details"]) {
  await userEvent.selectOptions(screen.getByRole("combobox", { name }), "8");
}
await userEvent.click(screen.getByRole("button", { name: "Save rating" }));
expect(screen.getByText("My rating: 8.0")).toBeVisible();
expect(repository.get("refractor")?.score).toBe(8);
```

```tsx
render(<SeriesSelectionRating seriesSlug="topps-merlin-premier-league-2026" repository={repository} locale="en" />);
await userEvent.selectOptions(screen.getByRole("combobox", { name: "Player photo selection" }), "9");
await userEvent.click(screen.getByRole("button", { name: "Save series rating" }));
expect(repository.getSeriesSelection("topps-merlin-premier-league-2026")).toBe(9);
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `pnpm test tests/components/RatingForm.test.tsx tests/components/SeriesSelectionRating.test.tsx`

Expected: FAIL because both rating components are missing.

- [ ] **Step 3: Implement card detail and rating controls**

Use four labeled select or segmented controls with values 1-10, show the weight beside each label, and disable submission until all values exist. Existing records initialize the controls and change the button label to “Update rating”.

- [ ] **Step 4: Implement methodology and source treatment**

The methodology page shows the exact formula and explains the 80/20 series rule. `SourceNotice` links to the original listing, identifies `official`, `licensed`, or `research-only`, and never presents marketplace images as owned by the project.

Add `SeriesSelectionRating` to the series page with one labeled 1-10 control for the series-wide player-photo selection quality. Save it through `saveSeriesSelection(seriesSlug, score)` and have `RatingSummary` label the result as a full series score only when both card ratings and this value exist.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test tests/components/RatingForm.test.tsx tests/components/SeriesSelectionRating.test.tsx tests/ratings.test.ts && pnpm lint && pnpm build`

Expected: save/update behavior, formula display, invalid route handling, and source links pass.

```powershell
git add components/RatingForm.tsx components/SeriesSelectionRating.tsx components/SourceNotice.tsx app/series app/methodology tests/components/RatingForm.test.tsx tests/components/SeriesSelectionRating.test.tsx
git -c user.name=Codex -c user.email=codex@local commit -m "feat: add card scoring experience"
```

### Task 7: Marketplace-Quality Visual System and Responsive Behavior

**Files:**
- Modify: `app/globals.css`
- Modify: `components/AppHeader.tsx`
- Modify: `components/ProductHero.tsx`
- Modify: `components/CardDesignTile.tsx`
- Modify: `components/CardDesignGrid.tsx`
- Modify: `components/RatingForm.tsx`

**Interfaces:**
- Consumes: all existing semantic components.
- Produces: responsive dark marketplace presentation without altering component contracts.

- Test: `tests/components/ProductHero.test.tsx`

- [ ] **Step 1: Write the failing product-presentation accessibility test**

```tsx
render(<ProductHero series={merlinPremierLeague2026} locale="en" />);
expect(screen.getByRole("img", { name: /2026 Topps Merlin Premier League hobby box/i })).toBeVisible();
expect(screen.getByRole("link", { name: "Enter series" })).toHaveAttribute("href", "/series/topps-merlin-premier-league-2026");
```

Run: `pnpm test tests/components/ProductHero.test.tsx`

Expected: FAIL until the product hero exposes the required localized accessible names.

- [ ] **Step 2: Define tokens and layout primitives**

Use CSS custom properties for ink, panel, warm gold, electric violet, muted text, border, radius, shadow, and focus ring. Use a dark radial background, warm product spotlight, and restrained foil gradient only on borders/highlights.

- [ ] **Step 3: Style product and card presentation**

Desktop landing uses a two-column hero with packaging occupying at least 45% width. The catalogue uses `repeat(auto-fill, minmax(220px, 1fr))`; tiles use consistent image frames, readable names, serial badges, rating labels, and keyboard-visible focus.

- [ ] **Step 4: Implement mobile behavior and reduced motion**

At widths below 720px, stack the hero, use two compact catalogue columns when space permits, make filters horizontally scrollable, and keep rating controls full width. Under `prefers-reduced-motion: reduce`, remove tilt/shine transitions.

- [ ] **Step 5: Verify visual constraints and commit**

Run: `pnpm test tests/components/ProductHero.test.tsx && pnpm lint && pnpm build`

Expected: no CSS/build errors. Perform browser inspection at 390x844, 768x1024, and 1440x1000 before committing.

```powershell
git add app/globals.css components tests/components/ProductHero.test.tsx
git -c user.name=Codex -c user.email=codex@local commit -m "style: polish responsive card marketplace UI"
```

### Task 8: End-to-End Verification and Contributor Documentation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/app.spec.ts`
- Create: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: complete application and scripts.
- Produces: repeatable acceptance checks and contributor instructions for adding products.

- [ ] **Step 1: Write the failing main-journey test**

```ts
test("user enters Merlin, rates Refractor, and keeps the score after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /enter series/i }).click();
  await page.getByRole("link", { name: /refractor/i }).first().click();
  for (const label of ["Composition", "Color & finish", "Theme & identity", "Typography & details"]) {
    await page.getByRole("combobox", { name: label }).selectOption("8");
  }
  await page.getByRole("button", { name: "Save rating" }).click();
  await expect(page.getByText("My rating: 8.0")).toBeVisible();
  await page.reload();
  await expect(page.getByText("My rating: 8.0")).toBeVisible();
});
```

- [ ] **Step 2: Configure Playwright and verify the test initially exposes remaining gaps**

Configure `webServer.command` as `pnpm dev`, `baseURL` as `http://127.0.0.1:3000`, and Chromium projects for desktop and mobile. Run `pnpm exec playwright install chromium` once, then `pnpm test:e2e`.

- [ ] **Step 3: Fix only acceptance-test defects**

Address concrete route, accessibility-name, storage, overflow, or language defects reported by Playwright. Do not add new features during this step.

- [ ] **Step 4: Document exact contributor workflow**

README sections:

1. Product purpose and screenshot location.
2. `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
3. How to add a `Series` and `CardDesign` without editing routes.
4. Rating formula and non-fabrication rule.
5. Image-source priority and `research-only` restriction.
6. Current limitation: local scores only; planned repository-compatible database adapter.

- [ ] **Step 5: Run the full release gate**

Run: `pnpm test && pnpm test:e2e && pnpm lint && pnpm build`

Expected: unit/component tests pass, Playwright passes in desktop/mobile projects, TypeScript has zero errors, and production build exits 0.

- [ ] **Step 6: Commit documentation and acceptance tests**

```powershell
git add playwright.config.ts tests/e2e/app.spec.ts README.md .gitignore
git -c user.name=Codex -c user.email=codex@local commit -m "test: verify complete rating journey"
```

## Final Review Gate

- [ ] Confirm `git status --short` contains no unintended generated files.
- [ ] Confirm the catalogue displays 38 unique links and every local image resolves.
- [ ] Confirm all three language choices persist after reload.
- [ ] Confirm a saved score is labeled as the user's score, not a community score.
- [ ] Confirm methodology values and displayed formula match `domain/ratings.ts`.
- [ ] Confirm every research-only image has a visible source link.
- [ ] Confirm the app has been visually inspected at mobile, tablet, and desktop sizes.
