import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "public", "images");
const barcelonaSource = path.join(
  root,
  "scripts",
  "curated-assets",
  "barcelona-forever-2025-26",
  "packaging-source.jpg",
);

const studioBackdrop = (haloMarkup, { floor = true } = {}) => Buffer.from(`
  <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur"><feGaussianBlur stdDeviation="24" /></filter>
      <radialGradient id="floor" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#303030" stop-opacity="0.58" />
        <stop offset="1" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="halo" cx="50%" cy="48%" r="52%">
        <stop offset="0" stop-color="#303030" stop-opacity="0.55" />
        <stop offset="0.62" stop-color="#171717" stop-opacity="0.28" />
        <stop offset="1" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="1200" fill="#000000" />
    ${haloMarkup}
    ${floor ? '<ellipse cx="600" cy="1080" rx="300" ry="38" fill="url(#floor)" filter="url(#blur)" />' : ''}
  </svg>
`);

export async function renderManchesterUnitedPackaging(input, outputPath) {
  const box = await sharp(input, { failOn: "none" })
    .rotate()
    .extract({ left: 240, top: 165, width: 720, height: 865 })
    .ensureAlpha()
    .composite([{
      input: Buffer.from(`
        <svg width="720" height="865" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="10" width="704" height="845" rx="12" fill="#ffffff" />
        </svg>
      `),
      blend: "dest-in",
    }])
    .png()
    .toBuffer();

  const backdrop = studioBackdrop(`
    <ellipse cx="600" cy="590" rx="430" ry="540" fill="url(#halo)" />
  `);

  await sharp(backdrop)
    .composite([{ input: box, left: 240, top: 165 }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toFile(outputPath);
}

export async function renderBarcelonaForeverPackaging(inputPath, outputPath) {
  const cutout = await sharp(inputPath, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .composite([{
      input: Buffer.from(`
        <svg width="550" height="733" xmlns="http://www.w3.org/2000/svg">
          <polygon points="160,2 541,64 548,650 160,682 8,679 5,59" fill="#ffffff" />
        </svg>
      `),
      blend: "dest-in",
    }])
    .resize({ height: 980 })
    .png()
    .toBuffer();

  const metadata = await sharp(cutout).metadata();
  const left = Math.round((1200 - metadata.width) / 2);
  const backdrop = studioBackdrop(`
    <ellipse cx="600" cy="585" rx="455" ry="555" fill="url(#halo)" />
    <ellipse cx="585" cy="1018" rx="255" ry="34" fill="#242424" opacity="0.42" filter="url(#blur)" />
  `, { floor: false });

  await sharp(backdrop)
    .composite([{ input: cutout, left, top: 110 }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toFile(outputPath);
}

async function download(url) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const manchesterUnited = await download(
    "https://buysoccercardsonline.com/cdn/shop/files/MANU-TEAM-SET-1.jpg?v=1771357932",
  );
  await renderManchesterUnitedPackaging(
    manchesterUnited,
    path.join(outputRoot, "topps-manchester-united-team-set-2025-26", "packaging.jpg"),
  );
  await renderBarcelonaForeverPackaging(
    barcelonaSource,
    path.join(outputRoot, "topps-forever-fc-barcelona-2025-26", "packaging.jpg"),
  );
}

const invokedDirectly = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) await main();
