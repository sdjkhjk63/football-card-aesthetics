import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "@/app/page";
import { LanguageProvider } from "@/components/LanguageProvider";

it("renders the catalogue heading", () => {
  render(<LanguageProvider><HomePage /></LanguageProvider>);
  expect(screen.getByRole("heading", { name: /2026 Topps 梅林英超/i })).toBeInTheDocument();
});
