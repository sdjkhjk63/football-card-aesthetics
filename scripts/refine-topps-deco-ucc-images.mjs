import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const cardRoot = path.join(projectRoot, "public", "images", "topps-deco-ucc-2025-26", "cards");
const researchRoot = path.resolve(projectRoot, "..", "..", "research", "topps-deco-ucc-2025-26", "images");

async function refineExisting(slug, layout) {
  const target = path.join(cardRoot, `${slug}.webp`);
  const temporary = path.join(cardRoot, `${slug}.refined.webp`);
  const size = layout === "landscape"
    ? { width: 1050, height: 750 }
    : { width: 750, height: 1050 };

  await sharp(target)
    .removeAlpha()
    .linear(1.07, -7)
    .sharpen({ sigma: 0.9 })
    .resize({ ...size, fit: "fill" })
    .webp({ quality: 96, smartSubsample: true })
    .toFile(temporary);
  await fs.rename(temporary, target);
}

async function recropOneClubAutographs() {
  const source = path.join(researchRoot, "16-one-club-auto-joao-pedro-lauren-james.webp");
  const target = path.join(cardRoot, "one-club-autographs.webp");
  const temporary = path.join(cardRoot, "one-club-autographs.refined.webp");

  await sharp(source)
    .extract({ left: 235, top: 82, width: 740, height: 1032 })
    .resize({ width: 750, height: 1050, fit: "fill" })
    .linear(1.04, -4)
    .sharpen({ sigma: 0.7 })
    .webp({ quality: 96, smartSubsample: true })
    .toFile(temporary);
  await fs.rename(temporary, target);
}

await Promise.all([
  refineExisting("cubist", "portrait"),
  refineExisting("prodigy-autographs", "portrait"),
  refineExisting("dual-autographs", "landscape"),
  recropOneClubAutographs(),
]);

console.log("Refined four Topps Deco card images without altering their printed content.");
