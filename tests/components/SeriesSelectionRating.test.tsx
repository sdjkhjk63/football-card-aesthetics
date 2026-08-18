import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { SeriesSelectionRating } from "@/components/SeriesSelectionRating";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";

it("saves one player-photo selection rating", async () => {
  const repository = createLocalRatingRepository();
  const user = userEvent.setup();
  render(<SeriesSelectionRating seriesSlug="series-test" repository={repository} locale="en" />);
  await user.selectOptions(screen.getByRole("combobox", { name: "Player photo selection" }), "9");
  await user.click(screen.getByRole("button", { name: "Save series rating" }));
  expect(repository.getSeriesSelection("series-test")).toBe(9);
});
