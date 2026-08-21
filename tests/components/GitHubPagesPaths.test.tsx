import { render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ProductHero } from "@/components/ProductHero";
import type { CardSeries } from "@/domain/catalogue";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

it("prefixes public images with the GitHub Pages repository path", () => {
  process.env.NEXT_PUBLIC_BASE_PATH = "/football-card-aesthetics";
  const series = {
    slug: "sample-series",
    manufacturer: "Topps",
    season: "2026",
    name: { "zh-CN": "示例", en: "Sample", es: "Ejemplo" },
    packaging: {
      path: "images/sample.webp",
      alt: { "zh-CN": "包装", en: "Packaging", es: "Embalaje" },
      verification: "verified",
    },
    cardDesigns: [],
  } as unknown as CardSeries;

  render(<ProductHero series={series} locale="en" />);

  expect(screen.getByRole("img", { name: "Packaging" }).getAttribute("src")).toContain(
    "url=%2Ffootball-card-aesthetics%2Fimages%2Fsample.webp",
  );
});
