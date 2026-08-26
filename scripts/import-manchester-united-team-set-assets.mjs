import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputRoot = path.join(root, "public/images/topps-manchester-united-team-set-2025-26");
const ebay = (id) => `https://i.ebayimg.com/images/g/${id}/s-l1600.webp`;

const assets = {
  "first-team-base": ebay("1owAAeSwxGxpyE5F"),
  "first-team-halo": ebay("YN8AAeSwCc1pvuQx"),
  "first-team-static": ebay("cVEAAeSwSNBpnfkd"),
  "bona-fide-baller-base": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/a59770e19f38657ae0dd88a274b4eadfba8ef51d_2507___Manchester_United_Team_Set_25_26___BONAFIDE_BALLER___Beckham.png?v=1770896543",
  "bona-fide-baller-halo": ebay("NPYAAeSwH3JqRSe0"),
  "bona-fide-baller-static": ebay("rZwAAeSwhFFp0jOl"),
  "pitch-pursuits-base": ebay("6-0AAeSwFqRpyFCV"),
  "pitch-pursuits-halo": ebay("D6QAAeSwLM5p0sRz"),
  "pitch-pursuits-static": ebay("ebQAAeSwiX1qhNCi"),
  "collectors-corner-base": "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Manchester-United-Team-Set-Soccer-Collectors-Corner-Ryan-Giggs.jpg",
  "collectors-corner-halo": ebay("9n4AAeSwQdhqDv8I"),
  "collectors-corner-static": ebay("zlsAAeSwsDBpk5xM"),
  "united-road-base": "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Manchester-United-Team-Set-Soccer-United-Road-Berbatov.jpg",
  "united-road-halo": ebay("8BkAAeSw6Z5qcwQZ"),
  "united-road-static": ebay("4rsAAeSwdJ9p0NI1"),
  "rainbow-flick": "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Manchester-United-Team-Set-Soccer-Rainbow-Flick-Cunha-SSP.jpg",
  "base-autograph": "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Manchester-United-Team-Set-Soccer-Base-Auto-Sir-Alex-Ferguson.jpg",
  "bona-fide-baller-autograph": "https://xcdn.checklistinsider.com/public/2026/02/2025-26-Topps-Manchester-United-Team-Set-Soccer-Bona-Fide-Baller-Auto-Wayne-Rooney.jpg",
};

const crops = {
  "first-team-halo": { left: 168, top: 249, width: 829, height: 1164 },
  "first-team-static": { left: 190, top: 300, width: 720, height: 1010 },
  "bona-fide-baller-static": { left: 211, top: 262, width: 452, height: 633 },
  "pitch-pursuits-halo": { left: 110, top: 143, width: 1010, height: 1384 },
  "pitch-pursuits-static": { left: 29, top: 28, width: 1103, height: 1539 },
  "collectors-corner-halo": { left: 50, top: 405, width: 1150, height: 820 },
  "collectors-corner-static": { left: 50, top: 395, width: 1120, height: 800 },
  "united-road-halo": { left: 68, top: 94, width: 999, height: 1393 },
  "united-road-static": { left: 306, top: 367, width: 677, height: 936 },
};

const landscapeSlugs = new Set([
  "collectors-corner-base",
  "collectors-corner-halo",
  "collectors-corner-static",
  "rainbow-flick",
]);

async function download(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
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
  let image = sharp(input, { failOn: "none" }).rotate();
  const crop = crops[slug];
  if (crop) image = image.extract(crop);
  await image
    .resize(width, height, { fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.5 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputRoot, "cards", `${slug}.jpg`));
}

await fs.mkdir(path.join(outputRoot, "cards"), { recursive: true });
const packaging = await download("https://buysoccercardsonline.com/cdn/shop/files/MANU-TEAM-SET-2_2048x.jpg?v=1771357933");
await sharp(packaging, { failOn: "none" })
  .rotate()
  .resize(1200, 1200, { fit: "contain", background: "#eef5fb" })
  .jpeg({ quality: 92 })
  .toFile(path.join(outputRoot, "packaging.jpg"));

for (const [slug, url] of Object.entries(assets)) {
  await renderCard(slug, url);
  process.stdout.write(`Imported ${slug}\n`);
}
