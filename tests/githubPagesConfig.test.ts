import { afterEach, describe, expect, it, vi } from "vitest";

describe("GitHub Pages build configuration", () => {
  afterEach(() => {
    delete process.env.GITHUB_PAGES;
    vi.resetModules();
  });

  it("exports a static site under the repository path", async () => {
    process.env.GITHUB_PAGES = "1";

    const { default: config } = await import("../next.config");

    expect(config).toMatchObject({
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      basePath: "/football-card-aesthetics",
    });
  });
});
