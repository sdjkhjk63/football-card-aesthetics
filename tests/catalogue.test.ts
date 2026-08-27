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
const barcelonaForeverSlug = "topps-forever-fc-barcelona-2025-26";
const argentinaTeamSetSlug = "topps-argentina-team-set-2026";
const inceptionUccSlug = "topps-inception-ucc-2025-26";
const decoUccSlug = "topps-deco-ucc-2025-26";
const realMadridTeamSetSlug = "topps-real-madrid-team-set-2025-26";
const manchesterUnitedTeamSetSlug = "topps-manchester-united-team-set-2025-26";

async function studioPackagingStats(imagePath: string) {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
  let blackPixels = 0;
  let brightPixels = 0;
  let visibleMaxY = 0;
  let lowerContactMinX = Number.POSITIVE_INFINITY;
  let lowerContactPixels = 0;

  for (let index = 0; index < data.length; index += info.channels) {
    const pixelIndex = index / info.channels;
    const y = Math.floor(pixelIndex / info.width);
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const visibleObjectPixel = red > 70 || green > 70 || blue > 70;
    if (red < 12 && green < 12 && blue < 12) blackPixels += 1;
    if (red > 190 && green > 190 && blue > 190) brightPixels += 1;
    if (visibleObjectPixel) {
      visibleMaxY = Math.max(visibleMaxY, y);
      if (y === 910) {
        lowerContactMinX = Math.min(lowerContactMinX, pixelIndex % info.width);
        lowerContactPixels += 1;
      }
    }
  }

  const pixelCount = info.width * info.height;
  return {
    width: info.width,
    height: info.height,
    blackRatio: blackPixels / pixelCount,
    brightRatio: brightPixels / pixelCount,
    visibleMaxY,
    lowerContactMinX,
    lowerContactPixels,
  };
}
const manchesterUnitedBaseFamilies = [
  "first-team",
  "bona-fide-baller",
  "pitch-pursuits",
  "collectors-corner",
  "united-road",
];
const manchesterUnitedVersionSuffixes = ["base", "halo", "static"];
const manchesterUnitedTeamSetDesigns = [
  ...manchesterUnitedBaseFamilies.flatMap((family) =>
    manchesterUnitedVersionSuffixes.map((suffix) => `${family}-${suffix}`),
  ),
  "rainbow-flick",
  "base-autograph",
  "bona-fide-baller-autograph",
];
const realMadridBaseFamilies = [
  "first-team",
  "bona-fide-baller",
  "pitch-pursuits",
  "collectors-corner",
  "king-real",
];
const realMadridVersionSuffixes = ["base", "halo", "static"];
const realMadridTeamSetDesigns = [
  ...realMadridBaseFamilies.flatMap((family) =>
    realMadridVersionSuffixes.map((suffix) => `${family}-${suffix}`),
  ),
  "rainbow-flick",
  "base-autograph",
  "bona-fide-baller-autograph",
];
const realMadridLandscapeDesigns = [
  "collectors-corner-base",
  "collectors-corner-halo",
  "collectors-corner-static",
  "rainbow-flick",
];
const inceptionUccDesigns = [
  "first-xi",
  "emerging-stars",
  "succession",
  "showman",
  "star-quality",
  "superior-legends",
  "worldwide",
  "dark-flow",
  "first-xi-autographs",
  "emerging-stars-autographs",
  "succession-autographs",
  "showman-autographs",
  "star-quality-autographs",
  "superior-legends-autographs",
  "worldwide-autographs",
  "dawn-of-greatness-autographs",
  "silver-signings-autographs",
  "marks-of-excellence",
  "inception-dual-autographs",
  "role-models-quad-autograph-book",
  "ucl-winners-quad-autograph-book",
  "uwcl-winners-quad-autograph-book",
  "inception-patch",
  "match-day-memories-relic",
  "uwcl-final-goal-net-relic",
  "uwcl-final-corner-flag-relic",
  "inception-autograph-patch",
  "number-1-patch-autographs",
  "match-day-memories-autograph-relic",
  "club-crest-autograph-patch-v1",
  "club-crest-autograph-patch-v2",
  "autograph-branded-patch-book",
  "dual-autograph-patch-book",
];
const inceptionUnverifiedDesigns = [
  "role-models-quad-autograph-book",
  "ucl-winners-quad-autograph-book",
  "uwcl-winners-quad-autograph-book",
  "uwcl-final-corner-flag-relic",
  "club-crest-autograph-patch-v1",
  "club-crest-autograph-patch-v2",
  "autograph-branded-patch-book",
];
const inceptionLandscapeDesigns = [
  "silver-signings-autographs",
  "inception-dual-autographs",
  "role-models-quad-autograph-book",
  "ucl-winners-quad-autograph-book",
  "uwcl-winners-quad-autograph-book",
  "inception-autograph-patch",
  "match-day-memories-autograph-relic",
  "autograph-branded-patch-book",
  "dual-autograph-patch-book",
];
const decoUccDesigns = [
  "current-stars",
  "artistry",
  "moderne-marvels",
  "then-and-now",
  "one-club",
  "legends",
  "prodigy",
  "l-nouvel-esprit",
  "joueur-emblematique",
  "razzmatazz",
  "cubist",
  "current-stars-autographs",
  "legends-autographs",
  "joueur-emblematique-autographs",
  "l-nouvel-esprit-autographs",
  "one-club-autographs",
  "nouveau-short-print-autographs",
  "dual-autographs",
  "then-and-now-autographs",
  "triple-autographs",
  "antiquity-autograph-relics",
  "prodigy-autographs",
];
const decoLandscapeDesigns = [
  "dual-autographs",
  "antiquity-autograph-relics",
];
const argentinaBaseFamilies = [
  "first-team",
  "bona-fide-baller",
  "block",
  "toast-the-host",
  "afa-in-the-apple",
];
const argentinaBaseVersionSuffixes = [
  "base",
  "halo",
  "static",
];
const argentinaTeamSetDesigns = [
  ...argentinaBaseFamilies.flatMap((family) =>
    argentinaBaseVersionSuffixes.map((suffix) => `${family}-${suffix}`),
  ),
  "rainbow-flick",
  "first-team-autograph-red",
  "bona-fide-baller-autograph-red",
  "golden-sun-autograph-black",
  "vis10nary-autograph-gold-foilfractor",
];
const argentinaLandscapeDesigns = [
  "toast-the-host-base",
  "toast-the-host-halo",
  "toast-the-host-static",
  "rainbow-flick",
];
const barcelonaForeverDesigns = [
  "blaugrana-vault-green",
  "forever-kit",
  "forever-legends-gold-foilfractor",
  "forever-mens-purple",
  "forever-womens-orange",
  "identity-respect",
  "century-club-gold-foilfractor",
  "home-view",
];
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

describe("Topps Forever FC Barcelona 2025-26 catalogue", () => {
  it("rates base designs and verified low-numbered photos without losing the 57-version total", () => {
    const series = getSeries(barcelonaForeverSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(
      barcelonaForeverDesigns,
    );
    expect(series?.cardDesigns).toHaveLength(8);
    expect(series?.totalVariants).toBe(57);
  });

  it("lists ordinary parallels on each base design instead of rating them separately", () => {
    const series = getSeries(barcelonaForeverSlug);
    const standardParallelSerials = ["/125", "/99", "/75", "/50", "/25", "/10", "/5", "1/1"];

    expect(series?.cardDesigns.find((card) => card.slug === "forever-kit")?.parallels?.map((parallel) => parallel.serial)).toEqual(standardParallelSerials);
    expect(series?.cardDesigns.find((card) => card.slug === "blaugrana-vault-green")?.parallels?.map((parallel) => parallel.serial)).toEqual(standardParallelSerials);
    expect(series?.cardDesigns.find((card) => card.slug === "forever-legends-gold-foilfractor")?.parallels?.map((parallel) => parallel.serial)).toEqual(standardParallelSerials);
    expect(series?.cardDesigns.find((card) => card.slug === "identity-respect")?.parallels?.map((parallel) => parallel.serial)).toEqual(["/50", "/25", "/10", "/5", "1/1"]);
    expect(series?.cardDesigns.find((card) => card.slug === "century-club-gold-foilfractor")?.parallels?.map((parallel) => parallel.serial)).toEqual(["/10", "/5", "1/1"]);
    expect(series?.cardDesigns.find((card) => card.slug === "home-view")?.parallels?.map((parallel) => parallel.serial)).toEqual(["1/1"]);
  });

  it("keeps the card-family title generic when a numbered parallel supplies the representative photo", () => {
    const series = getSeries(barcelonaForeverSlug);

    expect(series?.cardDesigns.map((card) => [card.slug, card.name["zh-CN"], card.officialName])).toEqual([
      ["blaugrana-vault-green", "红蓝宝库签名", "Blaugrana Vault Autographs"],
      ["forever-kit", "永恒球衣签名", "Forever Kit Autographs"],
      ["forever-legends-gold-foilfractor", "永恒传奇签名", "Forever Legend's Autographs"],
      ["forever-mens-purple", "永恒男足签名", "Forever Men's Autographs"],
      ["forever-womens-orange", "永恒女足签名", "Forever Women's Autographs"],
      ["identity-respect", "巴萨精神签名", "Identity Autographs"],
      ["century-club-gold-foilfractor", "百场纪念：亚马尔签名比赛球网实物", "Century Club: Yamal Edition Autograph Relic"],
      ["home-view", "主场视角签名实物", "Home View Autograph Relics"],
    ]);
  });

  it("distinguishes the Century Club net relic from the Forever Kit design and marks Home View as one-of-one", () => {
    const series = getSeries(barcelonaForeverSlug);
    const foreverKit = series?.cardDesigns.find((card) => card.slug === "forever-kit");
    const centuryClub = series?.cardDesigns.find((card) => card.slug === "century-club-gold-foilfractor");
    const homeView = series?.cardDesigns.find((card) => card.slug === "home-view");

    expect(foreverKit?.curatorNote?.["zh-CN"]).toContain("不含实物");
    expect(centuryClub?.curatorNote?.["zh-CN"]).toContain("比赛球网");
    expect(homeView?.curatorNote?.["zh-CN"]).toContain("诺坎普座椅");
    expect(homeView?.serial).toBe("1/1");
  });

  it("uses the exact numbered versions shown in the four replacement photos", () => {
    const series = getSeries(barcelonaForeverSlug);

    expect(series?.cardDesigns.find((card) => card.slug === "blaugrana-vault-green")?.serial).toBe("/99");
    expect(series?.cardDesigns.find((card) => card.slug === "forever-mens-purple")?.serial).toBe("/75");
    expect(series?.cardDesigns.find((card) => card.slug === "century-club-gold-foilfractor")?.serial).toBe("1/1");
    expect(series?.cardDesigns.find((card) => card.slug === "home-view")?.serial).toBe("1/1");
  });

  it("crops the replacement photos to their card frames without phone screenshot padding", async () => {
    const series = getSeries(barcelonaForeverSlug);
    const expectedSizes = new Map([
      ["blaugrana-vault-green", { width: 750, height: 1050 }],
      ["forever-mens-purple", { width: 750, height: 1050 }],
      ["century-club-gold-foilfractor", { width: 750, height: 1050 }],
      ["home-view", { width: 1050, height: 750 }],
    ]);

    for (const [slug, expected] of expectedSizes) {
      const card = series?.cardDesigns.find((design) => design.slug === slug);
      expect(card, slug).toBeDefined();
      if (!card) continue;
      const metadata = await sharp(path.join(process.cwd(), "public", card.image.path)).metadata();
      expect({ width: metadata.width, height: metadata.height }, slug).toEqual(expected);
    }
  });

  it("enlarges the padded women's autograph photo without changing its proportions", () => {
    const series = getSeries(barcelonaForeverSlug);
    const women = series?.cardDesigns.find((card) => card.slug === "forever-womens-orange");

    expect(women?.image.displayScale).toBeGreaterThan(1);
  });

  it("uses a distinct local image for the box and every published version", () => {
    const series = getSeries(barcelonaForeverSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(9);
    for (const image of images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image)), image).toBe(true);
    }
  });

  it("presents the three-dimensional box on a black studio background", async () => {
    const series = getSeries(barcelonaForeverSlug);
    expect(series).toBeDefined();
    if (!series) return;

    const stats = await studioPackagingStats(path.join(process.cwd(), "public", series.packaging.path));
    expect({ width: stats.width, height: stats.height }).toEqual({ width: 1200, height: 1200 });
    expect(stats.blackRatio).toBeGreaterThan(0.25);
    expect(stats.brightRatio).toBeGreaterThan(0.1);
    expect(stats.visibleMaxY).toBeGreaterThan(900);
    expect(stats.lowerContactMinX).toBeLessThan(400);
    expect(stats.lowerContactPixels).toBeGreaterThan(180);
  });

  it("publishes every marketplace or official image that has been matched to an exact version", () => {
    const series = getSeries(barcelonaForeverSlug);
    const exactSlugs = series?.cardDesigns
      .filter((card) => card.image.verification === "exact")
      .map((card) => card.slug);

    expect(exactSlugs).toEqual([
      "blaugrana-vault-green",
      "forever-kit",
      "forever-legends-gold-foilfractor",
      "forever-mens-purple",
      "forever-womens-orange",
      "identity-respect",
      "century-club-gold-foilfractor",
      "home-view",
    ]);
  });
});

describe("Topps Argentina Team Set 2026 catalogue", () => {
  it("publishes the approved 20 independently rateable display cards", () => {
    const series = getSeries(argentinaTeamSetSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(argentinaTeamSetDesigns);
    expect(series?.cardDesigns).toHaveLength(20);
    expect(series?.totalVariants).toBe(116);
  });

  it("shows only Base, Halo, and Static for each of the five base designs", () => {
    const series = getSeries(argentinaTeamSetSlug);

    for (const family of argentinaBaseFamilies) {
      const versions = argentinaBaseVersionSuffixes.map((suffix) =>
        series?.cardDesigns.find((card) => card.slug === `${family}-${suffix}`),
      );
      expect(versions.map((card) => card?.serial), family).toEqual([
        null,
        null,
        null,
      ]);
      expect(versions[0]?.parallels).toHaveLength(15);
    }
  });

  it("keeps Rainbow Flick unnumbered and uses the matched autograph representatives", () => {
    const series = getSeries(argentinaTeamSetSlug);
    const serialBySlug = new Map(series?.cardDesigns.map((card) => [card.slug, card.serial]));

    expect(serialBySlug.get("rainbow-flick")).toBeNull();
    expect(serialBySlug.get("first-team-autograph-red")).toBe("/5");
    expect(serialBySlug.get("bona-fide-baller-autograph-red")).toBe("/5");
    expect(serialBySlug.get("golden-sun-autograph-black")).toBe("/10");
    expect(serialBySlug.get("vis10nary-autograph-gold-foilfractor")).toBe("1/1");
  });

  it("uses one exact, tightly cropped local image for every displayed version", async () => {
    const series = getSeries(argentinaTeamSetSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(21);
    for (const card of series.cardDesigns) {
      expect(card.image.verification, card.slug).toBe("exact");
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      expect(fs.existsSync(imagePath), card.slug).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      const expectedSize = argentinaLandscapeDesigns.includes(card.slug)
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };
      expect({ width: metadata.width, height: metadata.height }, card.slug).toEqual(expectedSize);
    }

  });

  it("marks Toast the Host and Rainbow Flick for landscape presentation", () => {
    const series = getSeries(argentinaTeamSetSlug);
    const landscapeSlugs = series?.cardDesigns
      .filter((card) => card.layout === "landscape")
      .map((card) => card.slug);

    expect(landscapeSlugs).toEqual(argentinaLandscapeDesigns);
  });

  it("presents the two featured autograph cards edge-to-edge without the photo background", async () => {
    const featuredAutographs = [
      "bona-fide-baller-autograph-red",
      "golden-sun-autograph-black",
    ];

    for (const slug of featuredAutographs) {
      const imagePath = path.join(
        process.cwd(),
        "public/images/topps-argentina-team-set-2026/cards",
        `${slug}.jpg`,
      );
      const { data, info } = await sharp(imagePath)
        .extract({ left: 0, top: 0, width: 750, height: 40 })
        .raw()
        .toBuffer({ resolveWithObject: true });
      let saturatedPixels = 0;

      for (let index = 0; index < data.length; index += info.channels) {
        const red = data[index] / 255;
        const green = data[index + 1] / 255;
        const blue = data[index + 2] / 255;
        const maximum = Math.max(red, green, blue);
        const minimum = Math.min(red, green, blue);
        const saturation = maximum === 0 ? 0 : (maximum - minimum) / maximum;
        if (saturation > 0.18 && maximum > 0.08) saturatedPixels += 1;
      }

      const saturatedRatio = saturatedPixels / (info.width * info.height);
      expect(saturatedRatio, slug).toBeGreaterThan(0.6);
    }
  });
});

describe("Topps Real Madrid Team Set 2025-26 catalogue", () => {
  it("publishes the 18 independently rateable display cards and the full 1,448-card master set", () => {
    const series = getSeries(realMadridTeamSetSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(realMadridTeamSetDesigns);
    expect(series?.cardDesigns).toHaveLength(18);
    expect(series?.totalVariants).toBe(1448);
  });

  it("shows Base, Halo, and Static for each of the five base designs", () => {
    const series = getSeries(realMadridTeamSetSlug);

    for (const family of realMadridBaseFamilies) {
      const versions = realMadridVersionSuffixes.map((suffix) =>
        series?.cardDesigns.find((card) => card.slug === `${family}-${suffix}`),
      );
      expect(versions.map((card) => card?.serial), family).toEqual([null, null, null]);
      expect(versions[0]?.parallels).toHaveLength(17);
    }
  });

  it("keeps the official base and autograph parallel ladders", () => {
    const series = getSeries(realMadridTeamSetSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));

    expect(cards.get("first-team-base")?.parallels?.map((parallel) => parallel.serial)).toEqual([
      "/250", "/250", "/199", "/199", "/150", "/150", "/99", "/99",
      "/50", "/50", "/25", "/25", "/10", "/10", "/5", "/5", "1/1",
    ]);
    expect(cards.get("base-autograph")?.parallels?.map((parallel) => parallel.serial)).toEqual([
      "/199", "/150", "/99", "/50", "/25", "/10", "/5", "1/1",
    ]);
    expect(cards.get("bona-fide-baller-autograph")?.parallels).toHaveLength(8);
  });

  it("uses exact, normalized local assets and marks every horizontal design", async () => {
    const series = getSeries(realMadridTeamSetSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);
    expect(series.cardDesigns.filter((card) => card.layout === "landscape").map((card) => card.slug))
      .toEqual(realMadridLandscapeDesigns);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(19);
    for (const card of series.cardDesigns) {
      expect(card.image.verification, card.slug).toBe("exact");
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      expect(fs.existsSync(imagePath), card.slug).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      const expected = card.layout === "landscape"
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };
      expect({ width: metadata.width, height: metadata.height }, card.slug).toEqual(expected);
    }
  });

  it("uses tightly framed artwork for the King Real Base and Static cards", async () => {
    for (const slug of ["king-real-base", "king-real-static"]) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "images",
        realMadridTeamSetSlug,
        "cards",
        `${slug}.jpg`,
      );
      const corner = await sharp(imagePath)
        .extract({ left: 0, top: 0, width: 50, height: 50 })
        .stats();
      const meanLuminance = corner.channels
        .slice(0, 3)
        .reduce((sum, channel) => sum + channel.mean, 0) / 3;

      expect(meanLuminance, `${slug} still includes the dark seller backdrop`).toBeGreaterThan(160);
    }
  });
});

describe("Topps Manchester United Team Set 2025-26 catalogue", () => {
  it("publishes the 18 independently rateable displays and all 1,377 physical variants", () => {
    const series = getSeries(manchesterUnitedTeamSetSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(manchesterUnitedTeamSetDesigns);
    expect(series?.cardDesigns).toHaveLength(18);
    expect(series?.totalVariants).toBe(1377);
  });

  it("uses Manchester United's 19-set base ladder and seven numbered autograph parallels", () => {
    const series = getSeries(manchesterUnitedTeamSetSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));

    expect(cards.get("first-team-base")?.parallels?.map((parallel) => parallel.serial)).toEqual([
      "/199", "/199", "/150", "/150", "/99", "/99", "/75", "/75",
      "/50", "/50", "/25", "/25", "/10", "/10", "/5", "/5", "1/1",
    ]);
    expect(cards.get("base-autograph")?.parallels?.map((parallel) => parallel.serial)).toEqual([
      "/150", "/99", "/50", "/25", "/10", "/5", "1/1",
    ]);
    expect(cards.get("bona-fide-baller-autograph")?.parallels).toHaveLength(7);
  });

  it("marks every numbered parallel shown by the representative photos", () => {
    const series = getSeries(manchesterUnitedTeamSetSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));

    expect({
      serial: cards.get("bona-fide-baller-base")?.serial,
      displayParallelName: cards.get("bona-fide-baller-base")?.displayParallelName,
    }).toEqual({ serial: "1/1", displayParallelName: "Gold FoilFractor" });
    expect({
      serial: cards.get("base-autograph")?.serial,
      displayParallelName: cards.get("base-autograph")?.displayParallelName,
    }).toEqual({ serial: "1/1", displayParallelName: "Gold FoilFractor" });
    expect({
      serial: cards.get("bona-fide-baller-autograph")?.serial,
      displayParallelName: cards.get("bona-fide-baller-autograph")?.displayParallelName,
    }).toEqual({ serial: "/10", displayParallelName: "Black" });
  });

  it("presents the isolated retail box on a black studio background", async () => {
    const series = getSeries(manchesterUnitedTeamSetSlug);
    expect(series).toBeDefined();
    if (!series) return;

    const stats = await studioPackagingStats(path.join(process.cwd(), "public", series.packaging.path));
    expect({ width: stats.width, height: stats.height }).toEqual({ width: 1200, height: 1200 });
    expect(stats.blackRatio).toBeGreaterThan(0.25);
    expect(stats.brightRatio).toBeGreaterThan(0.1);
  });

  it("uses exact normalized local assets and marks every horizontal design", async () => {
    const series = getSeries(manchesterUnitedTeamSetSlug);

    expect(series).toBeDefined();
    if (!series) return;
    expect(validateSeries(series)).toEqual([]);
    expect(series.cardDesigns.filter((card) => card.layout === "landscape").map((card) => card.slug))
      .toEqual([
        "collectors-corner-base",
        "collectors-corner-halo",
        "collectors-corner-static",
        "rainbow-flick",
      ]);

    const images = [series.packaging.path, ...series.cardDesigns.map((card) => card.image.path)];
    expect(new Set(images)).toHaveLength(19);
    for (const image of images) {
      const imagePath = path.join(process.cwd(), "public", image);
      expect(fs.existsSync(imagePath), image).toBe(true);
    }
    for (const card of series.cardDesigns) {
      expect(card.image.verification, card.slug).toBe("exact");
      const metadata = await sharp(path.join(process.cwd(), "public", card.image.path)).metadata();
      const expected = card.layout === "landscape"
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };
      expect({ width: metadata.width, height: metadata.height }, card.slug).toEqual(expected);
    }
  });
});

it("does not repeat independently rated Halo or Static cards under their Base card", () => {
  const independentlyRatedFamilies = [
    { seriesSlug: argentinaTeamSetSlug, families: argentinaBaseFamilies },
    { seriesSlug: realMadridTeamSetSlug, families: realMadridBaseFamilies },
    { seriesSlug: manchesterUnitedTeamSetSlug, families: manchesterUnitedBaseFamilies },
  ];

  for (const { seriesSlug, families } of independentlyRatedFamilies) {
    const series = getSeries(seriesSlug);
    for (const family of families) {
      const labels = series?.cardDesigns
        .find((card) => card.slug === `${family}-base`)
        ?.parallels?.map((parallel) => parallel.name) ?? [];

      expect(labels, `${seriesSlug}/${family}`).not.toContain("Halo");
      expect(labels, `${seriesSlug}/${family}`).not.toContain("Static");
      expect(labels, `${seriesSlug}/${family}`).not.toContain("Static Foil");
      expect(labels.every((label) => !/^(Halo|Static(?: Foil)?)$/.test(label))).toBe(true);
    }
  }
});

describe("Topps Inception UEFA Club Competitions 2025-26 catalogue", () => {
  it("publishes one representative for all 32 main card types and both Club Crest versions", () => {
    const series = getSeries(inceptionUccSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(inceptionUccDesigns);
    expect(series?.cardDesigns).toHaveLength(33);
    expect(series?.totalVariants).toBe(33);
    expect(validateSeries(series!)).toEqual([]);
  });

  it("keeps Dark Flow at Gold Foil 1/1 and separates both Club Crest versions", () => {
    const series = getSeries(inceptionUccSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));

    expect(cards.get("dark-flow")?.serial).toBe("1/1");
    expect(cards.get("dark-flow")?.parallels).toEqual([
      { name: "Gold Foil", serial: "1/1" },
    ]);
    expect(cards.get("marks-of-excellence")?.serial).toBe("/5");
    expect(cards.get("inception-dual-autographs")?.serial).toBe("/5");
    expect(cards.get("club-crest-autograph-patch-v1")?.officialName).toContain("Version 1");
    expect(cards.get("club-crest-autograph-patch-v2")?.officialName).toContain("Version 2");
  });

  it("publishes the complete numbered parallel ladder for every displayed card type", () => {
    const series = getSeries(inceptionUccSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));

    expect(cards.get("first-xi")?.parallels).toEqual([
      { name: "Foil", serial: "/199" },
      { name: "Yellow Foil", serial: "/150" },
      { name: "Magenta Foil", serial: "/125" },
      { name: "Green Foil", serial: "/99" },
      { name: "Pink Foil", serial: "/75" },
      { name: "Blue Foil", serial: "/49" },
      { name: "Purple Foil", serial: "/25" },
      { name: "Red Foil", serial: "/10" },
      { name: "Orange Foil", serial: "/5" },
      { name: "Gold Foil", serial: "1/1" },
      { name: "Printing Plates", serial: "1/1" },
    ]);
    expect(cards.get("first-xi-autographs")?.parallels).toHaveLength(7);
    expect(cards.get("dawn-of-greatness-autographs")?.parallels).toHaveLength(4);
    expect(cards.get("marks-of-excellence")?.parallels).toHaveLength(5);
    expect(cards.get("inception-dual-autographs")?.parallels).toHaveLength(3);
    expect(cards.get("inception-patch")?.parallels).toHaveLength(4);
    expect(cards.get("inception-autograph-patch")?.parallels).toHaveLength(7);
    expect(cards.get("number-1-patch-autographs")?.parallels).toHaveLength(4);
    expect(cards.get("dual-autograph-patch-book")?.parallels).toHaveLength(2);
    expect(series?.cardDesigns.every((card) => (card.parallels?.length ?? 0) > 0)).toBe(true);
  });

  it("shows placeholders for card types without trustworthy exact public images", () => {
    const series = getSeries(inceptionUccSlug);
    const unverified = series?.cardDesigns
      .filter((card) => card.image.verification === "unverified")
      .map((card) => card.slug);

    expect(unverified).toEqual(inceptionUnverifiedDesigns);
    expect(series?.cardDesigns.filter((card) => card.image.verification === "exact")).toHaveLength(26);
  });

  it("marks every horizontal card design for landscape presentation", () => {
    const series = getSeries(inceptionUccSlug);
    const landscape = series?.cardDesigns
      .filter((card) => card.layout === "landscape")
      .map((card) => card.slug);

    expect(landscape).toEqual(inceptionLandscapeDesigns);
  });

  it("uses normalized local assets for the packaging and all 26 displayed cards", async () => {
    const series = getSeries(inceptionUccSlug);

    expect(series).toBeDefined();
    if (!series) return;

    const packagingPath = path.join(process.cwd(), "public", series.packaging.path);
    expect(fs.existsSync(packagingPath)).toBe(true);

    const verified = series.cardDesigns.filter((card) => card.image.verification === "exact");
    expect(verified).toHaveLength(26);
    for (const card of verified) {
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      expect(fs.existsSync(imagePath), card.slug).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      const expectedSize = card.layout === "landscape"
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };
      expect({ width: metadata.width, height: metadata.height }, card.slug).toEqual(expectedSize);
    }
  });
});

describe("Topps Deco UEFA Club Competitions 2025-26 catalogue", () => {
  it("publishes the 22 reviewed visual families and omits the unpictured Only1 chase", () => {
    const series = getSeries(decoUccSlug);

    expect(series?.cardDesigns.map((card) => card.slug)).toEqual(decoUccDesigns);
    expect(series?.cardDesigns).toHaveLength(22);
    expect(series?.totalVariants).toBe(22);
    expect(series?.cardDesigns.some((card) => card.slug.includes("only1"))).toBe(false);
    expect(validateSeries(series!)).toEqual([]);
  });

  it("records the verified seven-level main-set parallel ladder", () => {
    const series = getSeries(decoUccSlug);
    const cards = new Map(series?.cardDesigns.map((card) => [card.slug, card]));
    const expected = [
      { name: "Blue", serial: "/99" },
      { name: "Green", serial: "/75" },
      { name: "Purple", serial: "/50" },
      { name: "Orange", serial: "/25" },
      { name: "Black", serial: "/10" },
      { name: "Red", serial: "/5" },
      { name: "Gold", serial: "1/1" },
    ];

    for (const slug of decoUccDesigns.slice(0, 9)) {
      expect(cards.get(slug)?.parallels, slug).toEqual(expected);
    }
    expect(cards.get("razzmatazz")?.parallels).toBeUndefined();
    expect(cards.get("cubist")?.parallels).toBeUndefined();
  });

  it("marks only the two genuinely horizontal card designs as landscape", () => {
    const series = getSeries(decoUccSlug);

    expect(series?.cardDesigns
      .filter((card) => card.layout === "landscape")
      .map((card) => card.slug)).toEqual(decoLandscapeDesigns);
  });

  it("uses normalized exact local images for the packaging and all displayed cards", async () => {
    const series = getSeries(decoUccSlug);

    expect(series).toBeDefined();
    if (!series) return;

    expect(series.packaging.verification).toBe("exact");
    const packagingPath = path.join(process.cwd(), "public", series.packaging.path);
    expect(fs.existsSync(packagingPath)).toBe(true);
    const packaging = await sharp(packagingPath).metadata();
    expect({ width: packaging.width, height: packaging.height }).toEqual({ width: 1050, height: 750 });

    for (const card of series.cardDesigns) {
      expect(card.image.verification, card.slug).toBe("exact");
      const imagePath = path.join(process.cwd(), "public", card.image.path);
      expect(fs.existsSync(imagePath), card.slug).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      const expectedSize = card.layout === "landscape"
        ? { width: 1050, height: 750 }
        : { width: 750, height: 1050 };
      expect({ width: metadata.width, height: metadata.height }, card.slug).toEqual(expectedSize);
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
