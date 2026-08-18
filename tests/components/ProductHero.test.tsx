import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProductHero } from "@/components/ProductHero";
import { merlinPremierLeague2026 } from "@/data/catalogue";

it("presents official packaging as the series entry point", () => {
  render(<ProductHero series={merlinPremierLeague2026} locale="en" />);
  expect(screen.getByRole("img", { name: /2026 Topps Merlin Premier League hobby box/i })).toBeVisible();
  expect(screen.getByRole("link", { name: "Enter series" })).toHaveAttribute("href", "/series/topps-merlin-premier-league-2026");
});
