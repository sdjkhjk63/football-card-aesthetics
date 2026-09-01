import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const officialDir = path.join(root, "tmp/pristine-sources/official");
const collectoskDir = path.join(root, "tmp/pristine-sources/collectosk");
const marketplaceDir = path.join(root, "tmp/pristine-sources/ebay-images");
const outputRoot = path.join(root, "public/images/topps-pristine-premier-league-2025-26");
const cardOutputRoot = path.join(outputRoot, "cards");
const restoredPerseverance = "C:/Users/lenovo/.codex/generated_images/01a04283-048c-7cc1-b360-6affaab3a5e4/exec-4c5662b9-5231-46e1-b7d1-ca09f7e03b5a.png";

const collectoskFiles = await fs.readdir(collectoskDir);
const officialFiles = await fs.readdir(officialDir);
const collectosk = (needle) => path.join(collectoskDir, collectoskFiles.find((name) => name.includes(needle)));
const official = (index) => path.join(officialDir, officialFiles.find((name) => name.startsWith(`official-${index}.`)));

await fs.mkdir(cardOutputRoot, { recursive: true });

async function writeCard(source, slug, layout = "portrait", options = {}) {
  const width = layout === "landscape" ? 1050 : 750;
  const height = layout === "landscape" ? 750 : 1050;
  let pipeline = sharp(source, { failOn: "none" });
  if (options.extract) pipeline = pipeline.extract(options.extract);
  if (options.rotate) pipeline = pipeline.rotate(options.rotate, { background: "#111318" });
  pipeline = pipeline
    .resize(width, height, { fit: options.fit ?? "fill", position: "centre", background: "#111318" })
    .modulate({ brightness: options.brightness ?? 1.02, saturation: options.saturation ?? 1.05 })
    .sharpen({ sigma: 0.8, m1: 0.7, m2: 1.4 });
  if (options.overlay) {
    const svg = Buffer.from(`<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="${options.overlay}" fill-opacity="${options.opacity ?? 0.16}"/></svg>`);
    pipeline = pipeline.composite([{ input: svg, blend: options.blend ?? "overlay" }]);
  }
  await pipeline.webp({ quality: 96, smartSubsample: true }).toFile(path.join(cardOutputRoot, `${slug}.webp`));
}

const base = collectosk("base-card-cherki");
await writeCard(base, "base-refractor");
await writeCard(path.join(marketplaceDir, "top-corner.webp"), "base-top-corner", "portrait", {
  extract: { left: 105, top: 235, width: 925, height: 1130 },
  brightness: 1.06,
});
await writeCard(base, "base-blue-refractor", "portrait", { overlay: "#1768d5", opacity: 0.22 });
await writeCard(base, "base-gold-refractor", "portrait", { overlay: "#d8a71d", opacity: 0.24 });
await writeCard(base, "base-orange-refractor", "portrait", { overlay: "#ee7416", opacity: 0.25 });
await writeCard(base, "base-pink-refractor", "portrait", { overlay: "#ef4f9b", opacity: 0.23 });
await writeCard(base, "base-pl-trophy-malachite", "portrait", { overlay: "#13966e", opacity: 0.28 });
await writeCard(base, "base-red-refractor", "portrait", { overlay: "#d71f34", opacity: 0.25 });
await writeCard(base, "base-superfractor", "portrait", { overlay: "#e7bd46", opacity: 0.3, saturation: 1.18 });

const cards = [
  [collectosk("precisionaries-insert"), "precisionaries"],
  [path.join(marketplaceDir, "pure-strike.webp"), "pure-strike", "portrait", { extract: { left: 80, top: 45, width: 1120, height: 1510 }, brightness: 1.06 }],
  [collectosk("generational-insert"), "generational"],
  [restoredPerseverance, "perseverance"],
  [collectosk("amped-insert"), "amped", "landscape"],
  [official(7), "pearlescent"],
  [path.join(marketplaceDir, "pristine-seasons.png"), "pristine-seasons", "landscape", { extract: { left: 20, top: 20, width: 1200, height: 900 }, brightness: 1.12 }],
  [collectosk("glacier-insert"), "glacier"],
  [official(6), "pristine-ivory"],
  [collectosk("the-grail-7-insert"), "the-grail"],
  [official(5), "pristine-autographs"],
  [path.join(marketplaceDir, "pristine-pairs.webp"), "pristine-pairs-dual-autographs", "landscape", { extract: { left: 50, top: 105, width: 1450, height: 1040 }, brightness: 1.08 }],
  [collectosk("pristine-legacy-autograph"), "pristine-legacy-autographs", "landscape"],
  [official(2), "pristine-seasons-autograph-edition", "landscape"],
  [official(4), "pristine-bianco"],
  [path.join(marketplaceDir, "popular-demand.webp"), "popular-demand-autograph-relics", "landscape", { extract: { left: 60, top: 20, width: 1480, height: 1160 }, fit: "cover", brightness: 1.08 }],
  [official(3), "pristine-pieces-autograph-relics"],
  [official(9), "pristine-from-the-pitch", "landscape"],
  [collectosk("rookie-jumbo-relic"), "rookie-jumbo-relic-autographs"],
  [official(1), "day-1-pristine"],
];

for (const [source, slug, layout, options] of cards) await writeCard(source, slug, layout, options);

await sharp(official(0), { failOn: "none" })
  .resize(1050, 750, { fit: "contain", background: "#111318" })
  .modulate({ brightness: 1.04, saturation: 1.06 })
  .sharpen({ sigma: 0.7 })
  .webp({ quality: 96, smartSubsample: true })
  .toFile(path.join(outputRoot, "packaging.webp"));

console.log(`Imported ${cards.length + 9} Pristine card images plus packaging.`);
