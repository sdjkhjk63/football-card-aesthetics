import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const projectRoot = process.cwd();
const defaultSourceDir = path.resolve(projectRoot, "..", "..", "inception-ucc-2025-26-images");
const sourceDir = process.env.INCEPTION_SOURCE_DIR
  ? path.resolve(process.env.INCEPTION_SOURCE_DIR)
  : defaultSourceDir;
const outputRoot = path.join(projectRoot, "public", "images", "topps-inception-ucc-2025-26");
const cardOutputDir = path.join(outputRoot, "cards");
const packagingUrl = "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/544c5eb8d0cb9341bb14fcd35e4398b0e2fb1ee6_26UCCI_FGC7056H_BOX.png?v=1782142771";

const assets = [
  ["01-base-first-xi-yamal-purple-25.webp", "first-xi", [130, 110, 955, 1330]],
  ["02-base-emerging-stars-jobe-bellingham-yellow-150.webp", "emerging-stars", [290, 150, 700, 1000]],
  ["03-base-succession-rodrigo-mora-purple-25.webp", "succession", [195, 330, 780, 1000]],
  ["04-base-showman-kvaratskhelia-purple-25.webp", "showman", [45, 60, 1080, 1450]],
  ["05-base-star-quality-salah-red-10.webp", "star-quality", [140, 170, 945, 1300]],
  ["06-base-superior-legends-hegerberg-purple-25.webp", "superior-legends", [120, 115, 885, 1260]],
  ["07-base-worldwide-ronaldo-green-99.webp", "worldwide", [48, 145, 800, 1100]],
  ["08-insert-dark-flow-ronaldinho-gold-1of1.webp", "dark-flow", [105, 140, 920, 1300]],
  ["09-auto-first-xi-vitinha-purple-25.webp", "first-xi-autographs", [25, 75, 1105, 1450]],
  ["10-auto-emerging-stars-max-dowman-red-10.webp", "emerging-stars-autographs", [205, 240, 770, 1080]],
  ["11-auto-succession-ibrahim-mbaye-orange-5.webp", "succession-autographs", [175, 185, 865, 1135]],
  ["12-auto-showman-eberechi-eze-purple-25.webp", "showman-autographs", [110, 125, 720, 890]],
  ["13-auto-star-quality-zubimendi-red-10.webp", "star-quality-autographs", [80, 65, 1040, 1450]],
  ["14-auto-superior-legends-caroline-graham-hansen.webp", "superior-legends-autographs", [170, 170, 820, 1140]],
  ["15-auto-worldwide-rafael-marquez-purple-25.webp", "worldwide-autographs", [185, 205, 730, 1020]],
  ["16-auto-dawn-of-greatness-fernando-torres-red-10.webp", "dawn-of-greatness-autographs", [60, 40, 1040, 1500]],
  ["17-auto-silver-signings-messi-gold-ink-1of1.jpg", "silver-signings-autographs", null, "landscape"],
  ["18-auto-marks-of-excellence-del-piero.jpg", "marks-of-excellence", null],
  ["19-auto-dual-de-bruyne-mctominay.jpg", "inception-dual-autographs", null, "landscape"],
  ["23-relic-inception-patch-oscar-bobb-red-10.webp", "inception-patch", [210, 205, 800, 1050]],
  ["24-relic-match-day-memories-dida-red-10.webp", "match-day-memories-relic", [255, 195, 760, 1065]],
  ["25-relic-uwcl-goal-net-stina-blackstenius-1of1.webp", "uwcl-final-goal-net-relic", [15, 30, 720, 1010]],
  ["27-auto-relic-inception-patch-vlahovic-purple-25.webp", "inception-autograph-patch", [330, 550, 1130, 850], "landscape"],
  ["29-auto-relic-match-day-memories-de-bruyne-red-10.webp", "match-day-memories-autograph-relic", [95, 405, 1025, 720], "landscape"],
  ["33-auto-relic-dual-patch-book-putellas-bonmati-orange-5.webp", "dual-autograph-patch-book", [110, 260, 1365, 620], "landscape"],
];

const canvas = {
  portrait: { width: 750, height: 1050 },
  landscape: { width: 1050, height: 750 },
};

async function normalizeCard([sourceName, slug, crop, layout = "portrait"]) {
  const sourcePath = path.join(sourceDir, sourceName);
  const outputPath = path.join(cardOutputDir, `${slug}.webp`);
  let pipeline = sharp(sourcePath).rotate();

  if (crop) {
    const [left, top, width, height] = crop;
    pipeline = pipeline.extract({ left, top, width, height });
  }

  const size = canvas[layout];
  await pipeline
    .resize({
      ...size,
      fit: "contain",
      background: { r: 20, g: 24, b: 34, alpha: 1 },
      withoutEnlargement: false,
    })
    .webp({ quality: 92, smartSubsample: true })
    .toFile(outputPath);
  console.log(`Imported ${slug} (${size.width}x${size.height})`);
}

async function importPackaging() {
  const response = await fetch(packagingUrl);
  if (!response.ok) throw new Error(`Packaging download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());

  await sharp(buffer)
    .rotate()
    .flatten({ background: { r: 20, g: 24, b: 34 } })
    .resize({
      width: 1200,
      height: 900,
      fit: "contain",
      background: { r: 20, g: 24, b: 34, alpha: 1 },
    })
    .webp({ quality: 94, smartSubsample: true })
    .toFile(path.join(outputRoot, "packaging.webp"));
  console.log("Imported official Topps packaging");
}

await fs.access(sourceDir);
await fs.mkdir(cardOutputDir, { recursive: true });
await Promise.all(assets.map(normalizeCard));
await importPackaging();
