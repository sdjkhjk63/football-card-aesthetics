import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public", "images", "topps-lineage-bayern-2025-26");
const researchRoot = path.resolve(projectRoot, "..", "..", "research", "topps-lineage-bayern-2025-26", "images");
const collectoskRoot = "https://www.collectosk.com/wp-content/uploads/soccer/2025-26/2025-26-topps-lineage-fc-bayern-munchen";

const assets = [
  ["packaging", "https://cdn.shopify.com/s/files/1/0739/2015/1805/files/a96d158e7adff4b0b711463074e4db4f73dad1a5_BAYERN_LINEAGE_FRONT_ECOM_SIZE.png?v=1780673681", "packaging.png", "packaging"],
  ["fc-bayern-munchen-icons", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-icons-base-card-bavarian-blue-parallel-diaz.avif`, "cards/fc-bayern-munchen-icons.webp", "portrait"],
  ["fc-bayern-munchen-legends", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-legends-base-card-orange-parallel-beckenbauer.avif`, "cards/fc-bayern-munchen-legends.webp", "portrait"],
  ["mia-san-mia", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-mia-san-mia-insert-card-karl.avif`, "cards/mia-san-mia.webp", "portrait"],
  ["badges-of-bavaria", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-badges-of-the-bavaria-insert-ucl-champion-blue-parallel-1975.avif`, "cards/badges-of-bavaria.webp", "portrait"],
  ["icons-autograph-variations", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-icon-autograph-foilfractor-parallel-olise.avif`, "cards/icons-autograph-variations.webp", "portrait"],
  ["legends-autographs", "https://i.ebayimg.com/images/g/JO8AAeSwlv5qORe4/s-l1600.webp", "cards/legends-autographs.webp", "portrait"],
  ["autogramm-karten", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-autogrammkarten-autograph-gold-parallel-kimmich.avif`, "cards/autogramm-karten.webp", "portrait"],
  ["es-mullert-autograph", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-es-mullert-autograph-foilfractor-parallel-muller.avif`, "cards/es-mullert-autograph.webp", "portrait"],
  ["meister-kane-autograph", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-meister-kane-autograph-red-parallel-kane.avif`, "cards/meister-kane-autograph.webp", "portrait"],
  ["triple-red-autographs", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-triple-red-autograph-black-parallel-breitner-scholl-matthaus.avif`, "cards/triple-red-autographs.webp", "portrait"],
  ["historic-future-dual-autograph", "https://i.ebayimg.com/images/g/VeUAAeSwIwJqMIQU/s-l1600.webp", "cards/historic-future-dual-autograph.webp", "landscape-crop"],
  ["triple-winner-autographs", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-triple-winner-autograph-foilfractor-parallel-neuer-lahm-kroos.avif`, "cards/triple-winner-autographs.webp", "portrait"],
  ["nameplate-autograph-relics", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-nameplate-autograph-relic-foilfractor-parallel-pavlovic.avif`, "cards/nameplate-autograph-relics.webp", "portrait"],
  ["fc-bayern-autograph-relics", "https://i.ebayimg.com/images/g/2P8AAeSwFN5qePKx/s-l1600.jpg", "cards/fc-bayern-autograph-relics.webp", "portrait-front-crop"],
  ["the-500th-autograph-relic", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-the-500-autograph-relic-red-parallel-muller.avif`, "cards/the-500th-autograph-relic.webp", "portrait"],
  ["the-karl-relic", `${collectoskRoot}/2025-26-topps-lineage-fc-bayern-munchen-the-karl-relic-foilfractor-parallel-karl.avif`, "cards/the-karl-relic.webp", "portrait"],
];

await fs.mkdir(path.join(publicRoot, "cards"), { recursive: true });
await fs.mkdir(researchRoot, { recursive: true });

for (const [slug, sourceUrl, publicPath, layout] of assets) {
  const response = await fetch(sourceUrl, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${slug}: download failed with HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  const extension = new URL(sourceUrl).pathname.split(".").pop() || "bin";
  const researchPath = path.join(researchRoot, `${slug}.${extension}`);
  const target = path.join(publicRoot, publicPath);
  await fs.writeFile(researchPath, source);

  if (layout === "packaging") {
    await sharp(source)
      .resize({ width: 930, height: 690, fit: "contain", background: "#050505" })
      .extend({ top: 30, bottom: 30, left: 60, right: 60, background: "#050505" })
      .png({ compressionLevel: 9 })
      .toFile(target);
  } else if (layout === "landscape-crop") {
    await sharp(source)
      .extract({ left: 110, top: 690, width: 930, height: 630 })
      .resize({ width: 1050, height: 750, fit: "fill" })
      .webp({ quality: 96, smartSubsample: true })
      .toFile(target);
  } else if (layout === "portrait-front-crop") {
    await sharp(source)
      .extract({ left: 135, top: 95, width: 680, height: 960 })
      .resize({ width: 750, height: 1050, fit: "contain", background: "#050505" })
      .webp({ quality: 96, smartSubsample: true })
      .toFile(target);
  } else {
    await sharp(source)
      .resize({ width: 750, height: 1050, fit: "contain", background: "#050505" })
      .webp({ quality: 96, smartSubsample: true })
      .toFile(target);
  }
}

console.log(`Imported ${assets.length} Topps Lineage Bayern assets.`);
