// @vitest-environment node

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { expect, it } from "vitest";

it("has a landscape cover and installable icons", async () => {
  const cover = path.resolve("desktop/assets/cover.png");
  const icon = path.resolve("desktop/assets/icon-512.png");

  expect(fs.existsSync(cover)).toBe(true);
  expect(fs.existsSync(path.resolve("desktop/assets/icon.ico"))).toBe(true);

  const coverMeta = await sharp(cover).metadata();
  const iconMeta = await sharp(icon).metadata();
  expect((coverMeta.width ?? 0) / (coverMeta.height ?? 1)).toBeGreaterThan(1.4);
  expect(iconMeta.width).toBe(512);
  expect(iconMeta.height).toBe(512);
});
