import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public", "images", "topps-focus-liverpool-2025-26");
const researchRoot = path.resolve(projectRoot, "..", "..", "research", "topps-focus-liverpool-2025-26", "images");
const sourceRoot = "https://www.collectosk.com/wp-content/uploads/soccer/2025-26/2025-26-topps-focus-liverpool-fc";

const assets = [
  ["packaging", "2025-26-topps-focus-liverpool-fc-soccer-cards-box.avif", "packaging.png", "packaging"],
  ["snapshots", "2025-26-topps-focus-liverpool-fc-soccer-cards-snapshots-base-card-firmino.avif", "cards/snapshots.webp", "portrait"],
  ["full-bleed", "2025-26-topps-focus-liverpool-fc-soccer-cards-full-bleed-base-card-orange-anfield-starry-nights-parallel-van-dijk.avif", "cards/full-bleed.webp", "portrait"],
  ["moments-in-time", "2025-26-topps-focus-liverpool-fc-soccer-cards-moments-in-time-base-card-purple-parallel-becker.avif", "cards/moments-in-time.webp", "portrait"],
  ["golden-hour", "2025-26-topps-focus-liverpool-fc-soccer-cards-golden-hour-base-card-coutinho.avif", "cards/golden-hour.webp", "portrait"],
  ["motion-blur", "2025-26-topps-focus-liverpool-fc-soccer-cards-motion-blur-insert-szoboszlai.avif", "cards/motion-blur.webp", "portrait"],
  ["snapshots-autographs", "2025-26-topps-focus-liverpool-fc-soccer-cards-snapshots-autograph-blue-parallel-ngumoha.avif", "cards/snapshots-autographs.webp", "portrait"],
  ["viewfinder-autographs", "2025-26-topps-focus-liverpool-fc-soccer-cards-viewfinder-autograph-gold-parallel-mane.avif", "cards/viewfinder-autographs.webp", "portrait"],
  ["golden-hour-autographs", "2025-26-topps-focus-liverpool-fc-soccer-cards-golden-hour-autograph-gold-foilfractor-parallel-gerrard.avif", "cards/golden-hour-autographs.webp", "portrait"],
  ["synergy-dual-autographs", "2025-26-topps-focus-liverpool-fc-soccer-cards-synergy-dual-autograph-gold-foilfractor-parallel-ekitike-isak.avif", "cards/synergy-dual-autographs.webp", "landscape"],
  ["chromatic-distortion-autographs", "2025-26-topps-focus-liverpool-fc-soccer-cards-chromatic-distortion-autograph-gold-foilfractor-parallel-wirtz.avif", "cards/chromatic-distortion-autographs.webp", "portrait"],
  ["marks-of-excellence", "2025-26-topps-focus-liverpool-fc-soccer-cards-marks-of-excellence-autograph-black-parallel-salah.avif", "cards/marks-of-excellence.webp", "portrait"],
  ["cutaway-signatures", "2025-26-topps-focus-liverpool-fc-soccer-cards-cutaway-signature-relic-yeats.avif", "cards/cutaway-signatures.webp", "landscape"],
];

await fs.mkdir(path.join(publicRoot, "cards"), { recursive: true });
await fs.mkdir(researchRoot, { recursive: true });

for (const [slug, filename, publicPath, layout] of assets) {
  const response = await fetch(`${sourceRoot}/${filename}`);
  if (!response.ok) throw new Error(`${slug}: download failed with HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  const researchPath = path.join(researchRoot, filename);
  const target = path.join(publicRoot, publicPath);
  await fs.writeFile(researchPath, source);

  if (layout === "packaging") {
    await sharp(source)
      .resize({ width: 930, height: 690, fit: "contain", background: "#050505" })
      .extend({ top: 30, bottom: 30, left: 60, right: 60, background: "#050505" })
      .png({ compressionLevel: 9 })
      .toFile(target);
  } else {
    const size = layout === "landscape"
      ? { width: 1050, height: 750 }
      : { width: 750, height: 1050 };
    await sharp(source)
      .resize({ ...size, fit: "contain", background: "#050505" })
      .webp({ quality: 96, smartSubsample: true })
      .toFile(target);
  }
}

console.log(`Imported ${assets.length} Topps Focus Liverpool assets.`);
