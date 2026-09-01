import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import HomePage from "@/app/page";
import { LanguageProvider } from "@/components/LanguageProvider";

afterEach(cleanup);

it("renders the catalogue heading", () => {
  render(<LanguageProvider><HomePage /></LanguageProvider>);
  expect(screen.getByRole("heading", { name: /2026 Topps 梅林英超/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /2026 Topps Finest 英超/i })).toHaveAttribute(
    "href",
    "/series/topps-finest-premier-league-2026",
  );
});

it("previews a series in the hero when its rail card is hovered", async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><HomePage /></LanguageProvider>);

  await user.hover(screen.getByRole("link", { name: /2025-26 Topps Chrome 阿森纳/i }));

  expect(screen.getByRole("heading", { name: "2025-26 Topps Chrome 阿森纳" })).toBeVisible();
  expect(screen.getByRole("link", { name: "进入系列" })).toHaveAttribute(
    "href",
    "/series/topps-chrome-arsenal-2025-26",
  );
  expect(screen.getByText("CURATED RELEASE · 004")).toBeVisible();
});

it("previews a series in the hero when its rail card receives keyboard focus", () => {
  render(<LanguageProvider><HomePage /></LanguageProvider>);

  fireEvent.focus(screen.getByRole("link", { name: /2026 Topps Finest 英超/i }));

  expect(screen.getByRole("heading", { name: "2026 Topps Finest 英超" })).toBeVisible();
  expect(screen.getByRole("link", { name: "进入系列" })).toHaveAttribute(
    "href",
    "/series/topps-finest-premier-league-2026",
  );
});
