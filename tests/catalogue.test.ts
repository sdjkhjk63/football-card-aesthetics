import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  getCatalogue,
  getCardDesign,
  getSeries,
  merlinPremierLeague2026,
} from "@/data/catalogue";
import { validateSeries } from "@/domain/catalogue";

const finestPremierLeagueSlug = "topps-finest-premier-league-2026";
const chromeArsenalSlug = "topps-chrome-arsenal-2025-26";
const chromeSapphireBundesligaSlug = "topps-chrome-sapphire-bundesliga-2025-26";
const chromeSapphireBundesligaDesigns = [
  "base-sapphire",
  "base-green-sapphire",
  "base-yellow-sapphire",
  "base-gold-sapphire",
  "base-orange-sapphire",
  "base-black-sapphire",
  "base-red-sapphire",
  "base-padparadscha-sapphire",
  "sapphire-selections",
  "sapphire-selections-yellow",
  "sapphire-selections-gold",
  "sapphire-selections-orange",
  "sapphire-selections-black",
  "sapphire-selections-red",
  "sapphire-selections-padparadscha",
  "infinite-sapphire",
  "infinite-sapphire-padparadscha",
  "base-autograph-orange-sapphire",
  "base-autograph-black-sapphire",
  "base-autograph-red-sapphire",
  "base-autograph-padparadscha-sapphire",
  "sapphire-selections-autograph-black",
  "sapphire-selections-autograph-red",
  "sapphire-selections-autograph-padparadscha",
];
const chromeArsenalDesigns = [
  "base-image-one",
  "base-image-two",
  "prism-refractor",
  "red-vision",
  "arsenal-blue-refractor",
  "green-refractor",
  "purple-refractor",
  "arsenal-gold-refractor",
  "white-refractor",
  "orange-refractor",
  "black-refractor",
  "arsenal-red-refractor",
  "superfractor",
  "golden-title",
  "highbury-highs",
  "marble-icons",
  "n5-heritage",
  "the-arsenal",
  "base-autographs",
  "highbury-highs-autographs",
  "marble-icons-autographs",
  "arsenal-all-stars-autographs",
  "228-and-out-autographs",
  "the-arsenal-away-autographs",
];
const commonBaseVariants = [
  "base-common",
  "base-common-checkerboard",
  "base-common-refractor",
  "base-common-saturday-3pm",
  "base-common-blue",
  "base-common-purple-checkerboard",
  "base-common-blue-checkerboard",
  "base-common-green",
  "base-common-pearl",
  "base-common-gold",
  "base-common-orange",
  "base-common-black",
  "base-common-red",
  "base-common-superfractor",
];

const uncommonBaseVariants = [
  "base-uncommon",
  "base-uncommon-checkerboard",
  "base-uncommon-refractor",
  "base-uncommon-saturday-3pm",
  "base-uncommon-blue",
  "base-uncommon-purple-checkerboard",
  "base-uncommon-blue-checkerboard",
  "base-uncommon-pearl",
  "base-uncommon-green",
  "base-uncommon-gold",
  "base-uncommon-orange",
  "base-uncommon-black",
  "base-uncommon-red",
  "base-uncommon-superfractor",
];

const rareBaseVariants = [
  "base-rare",
  "base-rare-checkerboard",
  "base-rare-refractor",
  "base-rare-saturday-3pm",
  "base-rare-blue",
  "base-rare-purple-checkerboard",
  "base-rare-blue-checkerboard",
  "base-rare-pearl",
  "base-rare-green",
  "base-rare-gold",
  "base-rare-orange",
  "base-rare-black",
  "base-rare-red",
  "base-rare-superfractor",
];

const finestPremierLeagueDesigns = [
  ...commonBaseVariants,
  ...uncommonBaseVariants,
  ...rareBaseVariants,
  "arrivals",
  "clean",
  "expected-brilliance",
  "aura",
  "gusto",
  "headliners",
  "main-attraction",
  "nightmare-fuel",
  "polka",
  "swerve",
  "swerve-fusion",
  "finest-idols",
  "finest-fans-autographs",
  "finest-moments-autographs",
  "finest-partnerships",
  "finest-seasons-autographs",
];

describe("Merlin Premier League 2026 catalogue", () => {
  it("contains all independent rating designs", () => {
    expect(merlinPremierLeague2026.cardDesigns).toHaveLength(38);
    expect(
      merlinPremierLeague2026.cardDesigns.filter((card) => card.group === "base"),
    ).toHaveLength(25);
    expect(
      merlinPremierLeague2026.cardDesigns.filter((card) => card.group === "insert"),
    ).toHaveLength(13);
  });

  it("uses the verified low-numbered print runs", () => {
    expect(getCardDesign("red-mojo")?.serial).toBe("/5");
    expect(getCardDesign("superfractor")?.serial).toBe("1/1");
  });

  it("passes source, translation, and uniqueness validation", () => {
    expect(validateSeries(merlinPremierLeague2026)).toEqual([]);
    expect(getSeries("topps-merlin-premier-league-2026")).toBe(
      merlinPremierLeague2026,
    );
  });

  it("has one packaging image and one local image per card", () => {
    const images = [
      merlinPremierLeague2026.packaging.path,
      ...merlinPremierLeague2026.cardDesigns.map((card) => card.image.path),
    ];

    expect(new Set(images)).toHaveLength(39);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image))).toBe(true);
    }
  });

  it("uses high-resolution, tightly framed catalogue images", async () => {
    for (const card of merlinPremierLeague2026.cardDesigns) {
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      const metadata = await sharp(imagePath).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      const aspectRatio = width / height;

      expect(Math.min(width, height), card.slug).toBeGreaterThanOrEqual(900);
      expect(
        aspectRatio <= 0.8 || aspectRatio >= 1.2,
        `${card.slug} should be cropped to the card rather than a square seller photo`,
      ).toBe(true);
    }
  });
});

describe("Finest Premier League 2026 catalogue", () => {
  it("contains every independent Finest Premier League card-type design", () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(
      finestPremierLeagueDesigns,
    );
    expect(series?.cardDesigns.filter((card) => card.group === "base")).toHaveLength(42);
    expect(series?.cardDesigns.filter((card) => card.group === "insert")).toHaveLength(16);
  });

  it("keeps each base parallel as its own numbered visual design without duplicate autograph-only designs", () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series?.cardDesigns.filter((card) => card.slug.startsWith("base-common")).map((card) => card.serial)).toEqual([
      null,
      null,
      null,
      null,
      "/200",
      "/150",
      "/99",
      "/75",
      "/60",
      "/50",
      "/25",
      "/20",
      "/10",
      "1/1",
    ]);
    expect(series?.cardDesigns.filter((card) => card.slug.startsWith("base-uncommon")).map((card) => card.serial)).toEqual([
      null,
      null,
      null,
      null,
      "/150",
      "/99",
      "/75",
      "/40",
      "/35",
      "/25",
      "/20",
      "/15",
      "/5",
      "1/1",
    ]);
    expect(series?.cardDesigns.filter((card) => card.slug.startsWith("base-rare")).map((card) => card.serial)).toEqual([
      null,
      null,
      null,
      null,
      "/99",
      "/75",
      "/49",
      "/30",
      "/25",
      "/20",
      "/15",
      "/10",
      "/3",
      "1/1",
    ]);
    expect(series?.cardDesigns.find((card) => card.slug === "base-rare-pearl")?.officialName).toBe("Base Rare Pearl");
    expect(series?.cardDesigns.some((card) => card.slug === "arrivals-autographs")).toBe(false);
    expect(series?.cardDesigns.some((card) => card.slug === "finest-autographs")).toBe(false);
    expect(series?.cardDesigns.some((card) => card.slug === "gustographs")).toBe(false);
    expect(series?.cardDesigns.some((card) => card.slug === "main-attraction-autographs")).toBe(false);
  });

  it("marks horizontal designs for larger landscape presentation", () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series?.cardDesigns.find((card) => card.slug === "finest-partnerships")?.layout).toBe("landscape");
  });

  it("passes source, translation, and uniqueness validation", () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);
  });

  it("has one packaging image and one local image per card", () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series).toBeDefined();
    if (!series) return;

    const images = [
      series.packaging.path,
      ...series.cardDesigns.map((card) => card.image.path),
    ];

    expect(new Set(images)).toHaveLength(59);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image))).toBe(true);
    }
  });

  it("uses high-resolution, tightly framed catalogue images", async () => {
    const series = getSeries(finestPremierLeagueSlug);

    expect(series).toBeDefined();
    if (!series) return;

    for (const card of series.cardDesigns) {
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      const metadata = await sharp(imagePath).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      const aspectRatio = width / height;

      expect(Math.min(width, height), card.slug).toBeGreaterThanOrEqual(900);
      expect(
        aspectRatio <= 0.8 || aspectRatio >= 1.2,
        `${card.slug} should be cropped to the card rather than a square seller photo`,
      ).toBe(true);
    }
  });
});

describe("Topps Chrome Arsenal 2025-26 catalogue", () => {
  it("contains every independent Arsenal Chrome visual design", () => {
    const series = getSeries(chromeArsenalSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(chromeArsenalDesigns);
    expect(series?.cardDesigns.filter((card) => card.group === "base")).toHaveLength(13);
    expect(series?.cardDesigns.filter((card) => card.group === "insert")).toHaveLength(11);
  });

  it("keeps the verified base rainbow numbering", () => {
    const series = getSeries(chromeArsenalSlug);

    expect(series?.cardDesigns.slice(0, 13).map((card) => card.serial)).toEqual([
      null,
      null,
      null,
      null,
      "/150",
      "/99",
      "/75",
      "/49",
      "/30",
      "/25",
      "/10",
      "/5",
      "1/1",
    ]);
  });

  it("keeps each autograph layout independent while grouping its colour parallels", () => {
    const series = getSeries(chromeArsenalSlug);
    const designs = series?.cardDesigns ?? [];

    for (const slug of [
      "base-autographs",
      "highbury-highs-autographs",
      "marble-icons-autographs",
    ]) {
      expect(designs.find((card) => card.slug === slug)?.parallels).toHaveLength(8);
    }
    expect(designs.find((card) => card.slug === "highbury-highs")?.parallels)
      .not.toContainEqual({ name: "Highbury Highs Autographs", serial: null });
    expect(designs.find((card) => card.slug === "marble-icons")?.parallels)
      .not.toContainEqual({ name: "Marble Icons Autographs", serial: null });
  });

  it("marks the horizontal N5 Heritage design for landscape presentation", () => {
    const series = getSeries(chromeArsenalSlug);

    expect(series?.cardDesigns.find((card) => card.slug === "n5-heritage")?.layout)
      .toBe("landscape");
  });

  it("passes translation, image, and uniqueness validation", () => {
    const series = getSeries(chromeArsenalSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(25);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image)), image).toBe(true);
    }
  });
});

describe("Topps Chrome Sapphire Bundesliga 2025-26 catalogue", () => {
  it("publishes every Sapphire visual version as an independent rating card", () => {
    const series = getSeries(chromeSapphireBundesligaSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(
      chromeSapphireBundesligaDesigns,
    );
    expect(series?.cardDesigns).toHaveLength(24);
  });

  it("keeps the official serial-number ladder for every Sapphire family", () => {
    const series = getSeries(chromeSapphireBundesligaSlug);

    expect(series?.cardDesigns.map((card) => card.serial)).toEqual([
      null,
      "/99",
      "/75",
      "/50",
      "/25",
      "/10",
      "/5",
      "1/1",
      null,
      "/75",
      "/50",
      "/25",
      "/10",
      "/5",
      "1/1",
      null,
      "1/1",
      "/25",
      "/10",
      "/5",
      "1/1",
      "/10",
      "/5",
      "1/1",
    ]);
  });

  it("uses a distinct local image for the box and every card version", () => {
    const series = getSeries(chromeSapphireBundesligaSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(25);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image)), image).toBe(true);
    }
  });

  it("publishes an exact verified photo for every Sapphire version", () => {
    const series = getSeries(chromeSapphireBundesligaSlug);

    expect(series?.cardDesigns.map((card) => [card.slug, card.image.verification])).toEqual(
      chromeSapphireBundesligaDesigns.map((slug) => [slug, "exact"]),
    );
  });

  it("uses consistently cropped 5:7 card images without screenshot padding", async () => {
    const series = getSeries(chromeSapphireBundesligaSlug);

    expect(series).toBeDefined();
    if (!series) return;

    for (const card of series.cardDesigns) {
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      const metadata = await sharp(imagePath).metadata();
      const expected = card.layout === "landscape"
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };

      expect(
        { width: metadata.width, height: metadata.height },
        `${card.slug} should fill a standard card frame`,
      ).toEqual(expected);
    }
  });
});

it("does not publish image provenance for any series", () => {
  for (const series of getCatalogue()) {
    const images = [series.packaging, ...series.cardDesigns.map((card) => card.image)];
    for (const image of images) {
      expect(image).not.toHaveProperty("platform");
      expect(image).not.toHaveProperty("sourceUrl");
      expect(image).not.toHaveProperty("authorization");
    }
  }
});
