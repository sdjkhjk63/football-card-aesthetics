import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "@/app/page";

it("renders the catalogue heading", () => {
  render(<HomePage />);
  expect(
    screen.getByRole("heading", { name: /card aesthetics/i }),
  ).toBeInTheDocument();
});
