import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { CardDesignTile } from "@/components/CardDesignTile";
import { CardDetailView } from "@/components/CardDetailView";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getSeries } from "@/data/catalogue";
import type { CardDesign, CardSeries } from "@/domain/catalogue";

it("does not present an unverified reference photo as the exact card version", () => {
  const design = {
    slug: "base-black-sapphire",
    officialName: "Black Sapphire",
    name: { "zh-CN": "基础黑色蓝宝石", en: "Base Black Sapphire", es: "Base Sapphire negra" },
    group: "base",
    section: "base-numbered",
    serial: "/10",
    image: {
      path: "images/reference-card.jpg",
      alt: { "zh-CN": "参考图", en: "Reference", es: "Referencia" },
      verification: "unverified",
    },
  } as CardDesign;

  render(<CardDesignTile seriesSlug="series" design={design} locale="zh-CN" />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("实卡图待核实")).toBeVisible();
});

it("does not show an unverified reference photo on the card detail page", () => {
  const design = {
    slug: "base-black-sapphire",
    officialName: "Black Sapphire",
    name: { "zh-CN": "基础黑色蓝宝石", en: "Base Black Sapphire", es: "Base Sapphire negra" },
    group: "base",
    section: "base-numbered",
    serial: "/10",
    image: {
      path: "images/reference-card.jpg",
      alt: { "zh-CN": "参考图", en: "Reference", es: "Referencia" },
      verification: "unverified",
    },
  } as CardDesign;
  const series = {
    slug: "series",
    manufacturer: "Topps",
    season: "2025-26",
    name: { "zh-CN": "系列", en: "Series", es: "Serie" },
    packaging: design.image,
    cardDesigns: [design],
  } as CardSeries;

  const { container } = render(<LanguageProvider><CardDetailView series={series} design={design} /></LanguageProvider>);

  expect(within(container).queryByRole("img")).not.toBeInTheDocument();
  expect(within(container).getByText("实卡图待核实")).toBeVisible();
});

it("names each listed parallel instead of showing only its serial number", () => {
  const design = {
    slug: "forever-kit",
    officialName: "Forever Kit Autographs",
    name: { "zh-CN": "永恒球衣签名", en: "Forever Kit Autographs", es: "Autógrafos Forever Kit" },
    group: "insert",
    section: "regular-insert",
    serial: null,
    parallels: [{ name: "Orange", serial: "/25" }],
    image: {
      path: "images/forever-kit.jpg",
      alt: { "zh-CN": "永恒球衣签名", en: "Forever Kit", es: "Forever Kit" },
      verification: "exact",
    },
  } as CardDesign;

  render(<CardDesignTile seriesSlug="series" design={design} locale="zh-CN" />);

  expect(screen.getByText("Orange /25")).toBeVisible();
});

it("distinguishes the displayed parallel from the complete numbered ladder", () => {
  const design = {
    slug: "first-xi",
    officialName: "First XI",
    name: { "zh-CN": "首发十一人", en: "First XI", es: "Once inicial" },
    group: "base",
    section: "base-numbered",
    serial: "/25",
    displayParallelName: "Purple Foil",
    parallels: [
      { name: "Foil", serial: "/199" },
      { name: "Purple Foil", serial: "/25" },
      { name: "Gold Foil", serial: "1/1" },
    ],
    image: {
      path: "images/first-xi.jpg",
      alt: { "zh-CN": "首发十一人", en: "First XI", es: "Once inicial" },
      verification: "exact",
    },
  } as CardDesign;

  const { container } = render(<CardDesignTile seriesSlug="series" design={design} locale="zh-CN" />);

  expect(screen.getByText("当前展示：Purple Foil /25")).toBeVisible();
  expect(screen.getByText("全部限编 3 种")).toBeVisible();
  expect(container.querySelector('[data-current="true"]')).toHaveTextContent("Purple Foil /25");
});

it("labels an incomplete parallel list as confirmed-only on tiles and details", () => {
  const design = {
    slug: "cubist",
    officialName: "Cubist",
    name: { "zh-CN": "立体主义", en: "Cubist", es: "Cubista" },
    group: "insert",
    section: "regular-insert",
    serial: "/50",
    displayParallelName: "Purple",
    parallelCoverage: "confirmed",
    parallels: [{ name: "Purple", serial: "/50" }],
    image: {
      path: "images/cubist.webp",
      alt: { "zh-CN": "立体主义", en: "Cubist", es: "Cubista" },
      verification: "exact",
    },
  } as CardDesign;
  const series = {
    slug: "series",
    manufacturer: "Topps",
    season: "2025-26",
    name: { "zh-CN": "系列", en: "Series", es: "Serie" },
    packaging: design.image,
    cardDesigns: [design],
  } as CardSeries;

  const tile = render(<CardDesignTile seriesSlug="series" design={design} locale="zh-CN" />);
  expect(within(tile.container).getByText("已确认限编 1 种")).toBeVisible();
  expect(within(tile.container).queryByText("全部限编 1 种")).not.toBeInTheDocument();
  tile.unmount();

  const detail = render(<LanguageProvider><CardDetailView series={series} design={design} /></LanguageProvider>);
  expect(within(detail.container).getByText("已确认限编 · 1")).toBeVisible();
  expect(within(detail.container).queryByText("全部限编 · 1")).not.toBeInTheDocument();
});

it("shows the generic family title and keeps the representative serial in the parallel labels", () => {
  const series = getSeries("topps-forever-fc-barcelona-2025-26");
  const design = series?.cardDesigns.find((card) => card.slug === "century-club-gold-foilfractor");
  expect(design).toBeDefined();
  if (!design) return;

  render(<CardDesignTile seriesSlug="topps-forever-fc-barcelona-2025-26" design={design} locale="zh-CN" />);

  expect(screen.getByRole("heading", { name: "百场纪念：亚马尔签名比赛球网实物" })).toBeVisible();
  expect(screen.getByText("Black /10")).toBeVisible();
});

it("applies the catalogue image scale while preserving object-fit containment", () => {
  const series = getSeries("topps-forever-fc-barcelona-2025-26");
  expect(series).toBeDefined();
  if (!series) return;
  const design = series?.cardDesigns.find((card) => card.slug === "forever-womens-orange");
  expect(design).toBeDefined();
  if (!design) return;

  const { container } = render(<CardDesignTile seriesSlug={series.slug} design={design} locale="zh-CN" />);

  expect(within(container).getByRole("img")).toHaveStyle({ "--image-display-scale": "1.85" });
});
