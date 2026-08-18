import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { RatingForm } from "@/components/RatingForm";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";

it("saves a transparent four-dimension rating", async () => {
  const repository = createLocalRatingRepository();
  const user = userEvent.setup();
  render(<RatingForm cardSlug="refractor-test" repository={repository} locale="en" />);
  for (const name of ["Composition", "Color & finish", "Theme & identity", "Typography & details"]) {
    await user.selectOptions(screen.getByRole("combobox", { name: new RegExp(name, "i") }), "8");
  }
  await user.click(screen.getByRole("button", { name: "Save rating" }));
  expect(screen.getByText("My rating: 8.0")).toBeVisible();
  expect(repository.get("refractor-test")?.score).toBe(8);
});
