import { writeFile } from "node:fs/promises";
import path from "node:path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "desktop", "assets");
const source = path.join(assets, "icon.svg");
const sizes = [16, 32, 48, 64, 128, 256, 512];
const buffers = await Promise.all(
  sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()),
);

await writeFile(path.join(assets, "icon-512.png"), buffers.at(-1));
await writeFile(path.join(assets, "icon.ico"), await pngToIco(buffers));
console.log("Generated desktop icon PNG and ICO assets.");
