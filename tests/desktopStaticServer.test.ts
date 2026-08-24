// @vitest-environment node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { createStaticServer, resolveStaticFile } from "@/desktop/staticServer.mjs";

const root = path.resolve("out");

it("maps exported routes to index files", () => {
  expect(resolveStaticFile(root, "/")).toBe(path.join(root, "index.html"));
  expect(resolveStaticFile(root, "/series/demo/")).toBe(
    path.join(root, "series", "demo", "index.html"),
  );
  expect(resolveStaticFile(root, "/_next/static/app.js")).toBe(
    path.join(root, "_next", "static", "app.js"),
  );
});

it("rejects path traversal and invalid encodings", () => {
  expect(resolveStaticFile(root, "/../../package.json")).toBeNull();
  expect(resolveStaticFile(root, "/%2e%2e/%2e%2e/package.json")).toBeNull();
  expect(resolveStaticFile(root, "/%E0%A4%A")).toBeNull();
});

it("revalidates stable public asset URLs while keeping hashed Next assets immutable", async () => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "card-aesthetics-static-"));
  const imagePath = path.join(temporaryRoot, "images", "card.webp");
  const hashedAssetPath = path.join(temporaryRoot, "_next", "static", "asset.js");
  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.mkdir(path.dirname(hashedAssetPath), { recursive: true });
  await fs.writeFile(imagePath, "card-image-v2");
  await fs.writeFile(hashedAssetPath, "console.log('hashed')");
  const server = await createStaticServer(temporaryRoot);

  try {
    const imageResponse = await fetch(`${server.origin}/images/card.webp`);
    const hashedResponse = await fetch(`${server.origin}/_next/static/asset.js`);

    expect(imageResponse.headers.get("cache-control")).toBe("no-cache");
    expect(hashedResponse.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
  } finally {
    await server.close();
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
});
