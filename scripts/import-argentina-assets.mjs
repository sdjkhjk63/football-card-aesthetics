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
  "first-team-red-icy": ebay("2aMAAeSwtxVqXZLR"),
  "first-team-red-rainbow": ebay("1SEAAeSwAUpqRcAZ"),
  "first-team-gold-foilfractor": official.firstTeam,
  "bona-fide-baller-base": official.bonaFide,
  "bona-fide-baller-halo": ebay("CNEAAeSw4VJqYGrk"),
  "bona-fide-baller-static": ebay("tKwAAeSwJ2dqeu40"),
  "bona-fide-baller-red-icy": ebay("RWoAAeSwdqlqUxWt"),
  "bona-fide-baller-red-rainbow": ebay("FVkAAeSw2OhqZ7B4"),
  "bona-fide-baller-gold-foilfractor": official.bonaFide,
  "block-base": official.block,
  "block-halo": ebay("kI8AAeSw2OBqZRsh"),
  "block-static": ebay("PkwAAeSwVnNqeu6o"),
  "block-red-icy": ebay("T3cAAeSw0DRqPuJV"),
  "block-red-rainbow": ebay("9SsAAeSwrWpqhwaS"),
  "block-gold-foilfractor": official.block,
  "toast-the-host-base": official.toast,
  "toast-the-host-halo": ebay("1i0AAeSwaYVqR0sT"),
  "toast-the-host-static": ebay("4tMAAeSwjRtqeu51"),
  "toast-the-host-red-icy": ebay("vFQAAeSwROhqbLKu"),
  "toast-the-host-red-rainbow": ebay("ZbwAAeSwKTRqdj2Z"),
  "toast-the-host-gold-foilfractor": official.toast,
  "afa-in-the-apple-base": official.apple,
  "afa-in-the-apple-halo": ebay("s7YAAeSwv-JqeYKe"),
  "afa-in-the-apple-static": ebay("7e0AAeSw9jhqeu24"),
  "afa-in-the-apple-red-icy": ebay("Af0AAeSwAfJqgkqh"),
  "afa-in-the-apple-red-rainbow": ebay("Rd4AAeSw7~BqNmbK"),
  "afa-in-the-apple-gold-foilfractor": ebay("FMkAAeSw3XhqOrtX"),
  "rainbow-flick": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/3fd646302374730ba94c5c6eb6d136215b923de6_ARG3_TS50_Rainbow_Flick_FR_PAZ.jpg?v=1781208651",
  "first-team-autograph-red-rainbow": ebay("gosAAeSwkAlqicWc"),
  "bona-fide-baller-autograph-red-rainbow": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/0402a075dd9b6c12b7d87ca453011da97f79afd5_Bona_Fide_Baller_Autograph_FR_TEVEZ.jpg?v=1781254289",
  "golden-sun-autograph-red-rainbow": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/639ef8fb7a6f6765d70ab532b5ec3e4e5c7d4839_Golden_Sun_Autograph_FR_MARTINEZ.jpg?v=1781208651",
  "vis10nary-autograph-gold-foilfractor": "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/a6ba73d64425f9cb1b67fcad73af1b580b24b049_Vis10nary_Autograph_FR_MESSI.jpg?v=1781208651",
};

async function download(url) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function renderCard(slug, url) {
  const input = await download(url);
  const image = sharp(input, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const ratio = (metadata.width ?? 1) / (metadata.height ?? 1);
  const fit = ratio > 0.9 ? "contain" : "cover";
  const buffer = await image
    .resize(750, 1050, { fit, position: "centre", background: "#eef5fb" })
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
