import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "public/images/topps-argentina-team-set-2026");

const official = {
  packaging: "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/96af91a7b50b6fe3b88d8ba9ba5c42ef1566c830_Argentina_Product_Shot_Front_Facing.png?v=1781208652",
  firstTeam: "https://i.ebayimg.com/images/g/bREAAeSw-~pqYGrl/s-l1600.jpg",
  bonaFide: "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/a9ec090ebffa9d2e24b9610044e528879bcdcaff_Bona_Fide_Baller_Base_HIGUAIN.jpg?v=1781208651",
  block: "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/62637f69b3c8a8b99228aadc09015dab6bfa0282_BLOCK_ALVAREZ.jpg?v=1781208651",
  toast: "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/fa000189629b605f8d60db9e38738f04ba38d7b1_ARG3_TS40_Toast_the_Host_FR.jpg?v=1781208651",
  apple: "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/3520a1dfbb02d807c21f485c1c2780575f78a9b8_AFA_in_the_Apple_FR_MARADONA.jpg?v=1781208651",
};

const ebay = (id) => `https://i.ebayimg.com/images/g/${id}/s-l1600.jpg`;

const assets = {
  "first-team-base": official.firstTeam,
  "first-team-halo": ebay("Z5UAAeSwYexqYGri"),
  "first-team-static": ebay("OYcAAeSwL8lqeu6o"),
  "bona-fide-baller-base": official.bonaFide,
  "bona-fide-baller-halo": ebay("CNEAAeSw4VJqYGrk"),
  "bona-fide-baller-static": ebay("tKwAAeSwJ2dqeu40"),
  "block-base": official.block,
  "block-halo": ebay("vpAAAeSwK~Zqe-wc"),
  "block-static": ebay("jNgAAeSw3bRqSH~q"),
  "toast-the-host-base": official.toast,
  "toast-the-host-halo": ebay("1i0AAeSwaYVqR0sT"),
  "toast-the-host-static": ebay("4tMAAeSwjRtqeu51"),
  "afa-in-the-apple-base": official.apple,
  "afa-in-the-apple-halo": ebay("s7YAAeSwv-JqeYKe"),
  "afa-in-the-apple-static": ebay("7e0AAeSw9jhqeu24"),
  "rainbow-flick": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/3fd646302374730ba94c5c6eb6d136215b923de6_ARG3_TS50_Rainbow_Flick_FR_PAZ.jpg?v=1781208651",
  "first-team-autograph-red": ebay("gosAAeSwkAlqicWc"),
  "bona-fide-baller-autograph-red": ebay("qn0AAeSwVopqdzAg"),
  "golden-sun-autograph-black": ebay("YXkAAeSwR-FqgjlC"),
  "vis10nary-autograph-gold-foilfractor": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/a6ba73d64425f9cb1b67fcad73af1b580b24b049_Vis10nary_Autograph_FR_MESSI.jpg?v=1781208651",
};

const crops = {
  "block-static": { left: 130, top: 70, width: 900, height: 1260 },
  "toast-the-host-halo": { left: 90, top: 50, width: 1360, height: 971 },
  "toast-the-host-static": { left: 65, top: 355, width: 840, height: 600 },
};

const curatedSources = {
  "bona-fide-baller-autograph-red": path.join(
    root,
    "scripts/curated-assets/argentina-team-set-2026/bona-fide-baller-autograph-red.jpg",
  ),
  "golden-sun-autograph-black": path.join(
    root,
    "scripts/curated-assets/argentina-team-set-2026/golden-sun-autograph-black.jpg",
  ),
};

const landscapeSlugs = new Set([
  "toast-the-host-base",
  "toast-the-host-halo",
  "toast-the-host-static",
  "rainbow-flick",
]);

async function download(url) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function renderCard(slug, url) {
  const input = curatedSources[slug]
    ? await fs.readFile(curatedSources[slug])
    : await download(url);
  const crop = crops[slug];
  const image = sharp(input, { failOn: "none" }).rotate();
  if (crop) image.extract(crop);
  const metadata = await image.metadata();
  const ratio = (metadata.width ?? 1) / (metadata.height ?? 1);
  const landscape = landscapeSlugs.has(slug);
  const width = landscape ? 1050 : 750;
  const height = landscape ? 750 : 1050;
  const fit = landscape || ratio < 0.9 ? "cover" : "contain";
  const buffer = await image
    .resize(width, height, { fit, position: "centre", background: "#eef5fb" })
    .sharpen({ sigma: 0.55 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await fs.writeFile(path.join(outputRoot, "cards", `${slug}.jpg`), buffer);
}

await fs.mkdir(path.join(outputRoot, "cards"), { recursive: true });
const packaging = await download(official.packaging);
await sharp(packaging).rotate().resize(1200, 1200, { fit: "contain", background: "#eef5fb" }).jpeg({ quality: 92 }).toFile(path.join(outputRoot, "packaging.jpg"));

for (const [slug, url] of Object.entries(assets)) {
  await renderCard(slug, url);
  process.stdout.write(`Imported ${slug}\n`);
}
