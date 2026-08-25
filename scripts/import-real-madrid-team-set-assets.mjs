import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "public/images/topps-real-madrid-team-set-2025-26");

const official = {
  packaging: "https://tffbreaks.com/cdn/shop/files/f19acc37a9a3d20607e261627f6c47646b5dbb6b_Real_Madrid_Product_Shot_Front_Facing.webp?v=1772807835&width=2000",
  firstTeam: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Base-First-Team-Arda-Guler.jpeg",
  bonaFideBaller: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Base-Bona-Fide-Baller-Joselu.jpeg",
  pitchPursuits: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Base-Pitch-Pursuits-Kylian-Mbappe.jpeg",
  collectorsCorner: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Base-Collectors-Corner-Luka-Modric.jpeg",
  kingReal: "https://i.ebayimg.com/images/g/m88AAeSwYelqV19C/s-l1600.webp",
  rainbowFlick: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Rainbow-Flick-Angel-Di-Maria-SSP.jpeg",
  baseAutograph: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Base-Autograph-Jude-Belllingham.jpeg",
  bonaFideBallerAutograph: "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Real-Madrid-Team-Set-Soccer-Bona-Fide-Baller-Auto-Vini-jr.jpeg",
};

const ebay = (id) => `https://i.ebayimg.com/images/g/${id}/s-l1600.webp`;

const assets = {
  "first-team-base": official.firstTeam,
  "first-team-halo": ebay("jOAAAeSw4GNp4fpp"),
  "first-team-static": ebay("cjQAAeSwJSpp4fqA"),
  "bona-fide-baller-base": official.bonaFideBaller,
  "bona-fide-baller-halo": ebay("iosAAeSw-cBp0kne"),
  "bona-fide-baller-static": ebay("cmoAAeSwrdVp0kna"),
  "pitch-pursuits-base": official.pitchPursuits,
  "pitch-pursuits-halo": ebay("1wAAAeSwXBJp09Ir"),
  "pitch-pursuits-static": ebay("qQIAAeSwn1dp0knp"),
  "collectors-corner-base": official.collectorsCorner,
  "collectors-corner-halo": ebay("lHgAAeSwrclp4fqK"),
  "collectors-corner-static": ebay("WCUAAeSwA4Fp09Jx"),
  "king-real-base": official.kingReal,
  "king-real-halo": ebay("eBUAAeSwANdp4fqM"),
  "king-real-static": ebay("7TsAAeSwvmNqgXVg"),
  "rainbow-flick": official.rainbowFlick,
  "base-autograph": official.baseAutograph,
  "bona-fide-baller-autograph": official.bonaFideBallerAutograph,
};

const landscapeSlugs = new Set([
  "collectors-corner-base",
  "collectors-corner-halo",
  "collectors-corner-static",
  "rainbow-flick",
]);

// Marketplace photos are normalized once, then cropped to the card edge in that
// standard frame so the catalogue never displays the seller's pitch-mat backdrop.
const postCrops = {
  "first-team-halo": { left: 104, top: 331, width: 437, height: 607 },
  "first-team-static": { left: 126, top: 275, width: 470, height: 653 },
  "bona-fide-baller-halo": { left: 39, top: 31, width: 700, height: 998 },
  "bona-fide-baller-static": { left: 33, top: 47, width: 676, height: 955 },
  "pitch-pursuits-halo": { left: 131, top: 264, width: 439, height: 615 },
  "pitch-pursuits-static": { left: 53, top: 19, width: 670, height: 962 },
  "collectors-corner-halo": { left: 136, top: 233, width: 670, height: 475 },
  "collectors-corner-static": { left: 164, top: 188, width: 726, height: 519 },
  "king-real-halo": { left: 117, top: 309, width: 467, height: 652 },
};

async function download(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      referer: "https://uk.topps.com/",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function renderCard(slug, url) {
  const input = await download(url);
  const landscape = landscapeSlugs.has(slug);
  const width = landscape ? 1050 : 750;
  const height = landscape ? 750 : 1050;
  const normalized = await sharp(input, { failOn: "none" })
    .rotate()
    .resize(width, height, {
      fit: "cover",
      position: "centre",
    })
    .toBuffer();
  const crop = postCrops[slug];
  const image = sharp(normalized);
  if (crop) image.extract(crop).resize(width, height, { fit: "fill" });
  await image
    .sharpen({ sigma: 0.5 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputRoot, "cards", `${slug}.jpg`));
}

await fs.mkdir(path.join(outputRoot, "cards"), { recursive: true });
const packaging = await download(official.packaging);
await sharp(packaging, { failOn: "none" })
  .rotate()
  .resize(1200, 1200, { fit: "contain", background: "#eef5fb" })
  .jpeg({ quality: 92 })
  .toFile(path.join(outputRoot, "packaging.jpg"));

for (const [slug, url] of Object.entries(assets)) {
  await renderCard(slug, url);
  process.stdout.write(`Imported ${slug}\n`);
}
