// @vitest-environment node

import path from "node:path";
import { expect, it } from "vitest";
import { resolveStaticFile } from "@/desktop/staticServer.mjs";

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
