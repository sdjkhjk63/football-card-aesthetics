import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProductHero } from "@/components/ProductHero";
import { getSeries, merlinPremierLeague2026 } from "@/data/catalogue";

it("presents official packaging as the series entry point", () => {
  render(<ProductHero series={merlinPremierLeague2026} locale="en" />);
  expect(screen.getByRole("img", { name: /2026 Topps Merlin Premier League hobby box/i })).toBeVisible();
  expect(screen.getByRole("link", { name: "Enter series" })).toHaveAttribute("href", "/series/topps-merlin-premier-league-2026");
});

it("distinguishes displayed card faces from the complete variant count", () => {
  const series = getSeries("topps-forever-fc-barcelona-2025-26");
  expect(series).toBeDefined();
  if (!series) return;

  render(<ProductHero series={series} locale="zh-CN" />);

  expect(screen.getByText("8")).toBeVisible();
  expect(screen.getByText("种展示卡面 · 完整收录 57 个版本")).toBeVisible();
});
