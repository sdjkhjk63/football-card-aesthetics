import { writeFile } from "node:fs/promises";
import path from "node:path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "desktop", "assets");
const source = path.join(assets, "icon.svg");
const icoSizes = [16, 32, 48, 64, 128, 256];
const buffers = await Promise.all(
  icoSizes.map((size) => sharp(source).resize(size, size).png().toBuffer()),
);
const largeIcon = await sharp(source).resize(512, 512).png().toBuffer();

await writeFile(path.join(assets, "icon-512.png"), largeIcon);
await writeFile(path.join(assets, "icon.ico"), await pngToIco(buffers));
console.log("Generated desktop icon PNG and ICO assets.");
