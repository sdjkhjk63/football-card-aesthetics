import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const researchRoot = path.resolve(
  projectRoot,
  "..",
  "..",
  "research",
  "topps-deco-ucc-2025-26",
);
const sourceRoot = path.join(researchRoot, "images");
const outputRoot = path.join(projectRoot, "public", "images", "topps-deco-ucc-2025-26");
const cardOutputRoot = path.join(outputRoot, "cards");

const assets = [
  ["01-current-stars-purple-bellingham.jpg", "current-stars"],
  ["02-artistry-baggio-red.avif", "artistry"],
  ["03-moderne-marvels-doue.jpg", "moderne-marvels"],
  ["04-then-now-yamal-ronaldinho.jpg", "then-and-now", [135, 80, 750, 920]],
  ["05-one-club-gavi-putellas-red.jpg", "one-club"],
  ["06-legends-george-weah.jpg", "legends", [36, 42, 735, 1015]],
  ["07-prodigy-ruben-van-bommel.jpg", "prodigy", [145, 190, 760, 1010]],
  ["08-lnouvel-esprit-rio-ngumoha.jpg", "l-nouvel-esprit", [300, 356, 800, 1080]],
  ["09-joueur-emblematique-baggio.webp", "joueur-emblematique"],
  ["10-razzmatazz-messi-purple.jpg", "razzmatazz"],
  ["11-cubist-messi.jpg", "cubist", [202, 350, 610, 820]],
  ["12-current-stars-auto-marmoush-gold.jpg", "current-stars-autographs"],
  ["13-legends-auto-koeman-orange.jpg", "legends-autographs"],
  ["14-joueur-emblematique-auto-baggio.webp", "joueur-emblematique-autographs", [194, 90, 660, 930]],
  ["15-lnouvel-esprit-auto-lennart-karl.jpg", "l-nouvel-esprit-autographs", [100, 100, 375, 520]],
  ["16-one-club-auto-joao-pedro-lauren-james.webp", "one-club-autographs", [235, 52, 745, 1060]],
  ["17-nouveau-auto-nedved-black.jpg", "nouveau-short-print-autographs"],
  ["18-dual-auto-musiala-luis-diaz.webp", "dual-autographs", [72, 470, 740, 540], "landscape"],
  ["19-then-now-auto-neymar-dembele-red.jpg", "then-and-now-autographs"],
  ["20-triple-auto-isak-haaland-pedro-gold.jpg", "triple-autographs"],
  ["21-antiquity-auto-relic-ronaldinho-orange.jpg", "antiquity-autograph-relics", null, "landscape"],
  ["22-prodigy-auto-reigan-heskey.png", "prodigy-autographs", [215, 45, 590, 850]],
];

const canvas = {
  portrait: { width: 750, height: 1050 },
  landscape: { width: 1050, height: 750 },
};
const background = { r: 20, g: 24, b: 34, alpha: 1 };

async function normalizeCard([sourceName, slug, crop, layout = "portrait"]) {
  const sourcePath = path.join(sourceRoot, sourceName);
  const outputPath = path.join(cardOutputRoot, `${slug}.webp`);
  let image = sharp(sourcePath, { failOn: "none" }).rotate();

  if (crop) {
    const [left, top, width, height] = crop;
    image = image.extract({ left, top, width, height });
  }

  const size = canvas[layout];
  await image
    .flatten({ background })
    .resize({ ...size, fit: "contain", background })
    .sharpen({ sigma: 0.45 })
    .webp({ quality: 92, smartSubsample: true })
    .toFile(outputPath);
  console.log(`Imported ${slug} (${size.width}x${size.height})`);
}

async function normalizePackaging() {
  const sourcePath = path.join(researchRoot, "official-gallery", "00.png");
  await sharp(sourcePath, { failOn: "none" })
    .rotate()
    .flatten({ background })
    .resize({ width: 1050, height: 750, fit: "contain", background })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputRoot, "packaging.png"));
  console.log("Imported official Topps Deco packaging (1050x750)");
}

await fs.access(sourceRoot);
await fs.mkdir(cardOutputRoot, { recursive: true });
await Promise.all(assets.map(normalizeCard));
await normalizePackaging();
