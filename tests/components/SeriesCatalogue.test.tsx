import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SeriesCatalogue } from "@/components/SeriesCatalogue";
import { getSeries } from "@/data/catalogue";

it("shows displayed faces and the complete variant total separately", () => {
  const series = getSeries("topps-forever-fc-barcelona-2025-26");
  expect(series).toBeDefined();
  if (!series) return;

  render(<LanguageProvider><SeriesCatalogue series={series} /></LanguageProvider>);

  expect(screen.getByText("8 DISPLAY CARDS / 57 COMPLETE VERSIONS")).toBeVisible();
});
