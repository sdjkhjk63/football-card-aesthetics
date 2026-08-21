import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { RatingForm } from "@/components/RatingForm";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";
import type { CommunityRatingRepository } from "@/lib/communityRatingRepository";

afterEach(cleanup);

it("saves a one-decimal quick rating from the slider", async () => {
  const repository = createLocalRatingRepository();
  const user = userEvent.setup();
  render(<RatingForm cardSlug="refractor-test" repository={repository} locale="en" />);

  const slider = screen.getByRole("slider", { name: "Overall score" });
  expect(slider).toHaveAttribute("min", "1");
  expect(slider).toHaveAttribute("max", "10");
  expect(slider).toHaveAttribute("step", "0.1");
  expect(screen.getByRole("button", { name: "Save rating" })).toBeDisabled();

  fireEvent.change(slider, { target: { value: "1.7" } });
  expect(screen.getByText("1.7")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Save rating" }));

  expect(screen.getByText("My rating: 1.7")).toBeVisible();
  expect(repository.get("refractor-test")?.score).toBe(1.7);
});

it("keeps the four detailed criteria optional", async () => {
  const repository = createLocalRatingRepository();
  const user = userEvent.setup();
  render(<RatingForm cardSlug="detail-test" repository={repository} locale="en" />);

  expect(screen.queryByRole("combobox", { name: /Composition/i })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /Detailed review/ }));
  await user.selectOptions(screen.getByRole("combobox", { name: /Composition/i }), "9");
  const slider = screen.getByRole("slider", { name: "Overall score" });
  fireEvent.change(slider, { target: { value: "10" } });
  await user.click(screen.getByRole("button", { name: "Save rating" }));

  expect(repository.get("detail-test")?.details).toEqual({ composition: 9 });
});

it("shows and updates the cumulative score without adding a second device vote", async () => {
  const repository = createLocalRatingRepository();
  const communityRepository: CommunityRatingRepository = {
    available: true,
    getSummary: vi.fn().mockResolvedValue({ averageScore: 6.5, ratingCount: 2, ownScore: 6 }),
    save: vi.fn().mockResolvedValue({ averageScore: 7.3, ratingCount: 2, ownScore: 8.5 }),
  };
  const user = userEvent.setup();
  render(<RatingForm cardSlug="community-card" repository={repository} communityRepository={communityRepository} deviceId="device-one" locale="zh-CN" />);

  expect(await screen.findByText("6.5")).toBeVisible();
  expect(screen.getByText("2 人评分")).toBeVisible();
  fireEvent.change(screen.getByRole("slider", { name: "总体评分" }), { target: { value: "8.5" } });
  await user.click(screen.getByRole("button", { name: "更新评分" }));

  expect(communityRepository.save).toHaveBeenCalledWith("community-card", "device-one", 8.5);
  expect(await screen.findByText("7.3")).toBeVisible();
  expect(screen.getByText("2 人评分")).toBeVisible();
});
