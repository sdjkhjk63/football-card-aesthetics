import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { FeedbackForm } from "@/components/FeedbackForm";
import type { FeedbackRepository } from "@/lib/feedbackRepository";

afterEach(cleanup);

it("submits private player feedback without rendering a public feedback list", async () => {
  const submit = vi.fn().mockResolvedValue(undefined);
  const repository: FeedbackRepository = { available: true, submit };
  const user = userEvent.setup();

  render(<FeedbackForm cardSlug="arsenal-blue-refractor" locale="zh-CN" repository={repository} />);

  await user.type(screen.getByLabelText("留下评语"), "这张卡的银色折射层次特别漂亮。" );
  await user.click(screen.getByRole("button", { name: "提交反馈" }));

  expect(submit).toHaveBeenCalledWith({
    cardSlug: "arsenal-blue-refractor",
    message: "这张卡的银色折射层次特别漂亮。",
  });
  expect(await screen.findByText("反馈已提交，感谢你的意见。" )).toBeVisible();
  expect(screen.queryByRole("list", { name: /玩家反馈/ })).not.toBeInTheDocument();
});

it("explains when the private feedback channel is not configured", () => {
  const repository: FeedbackRepository = { available: false, submit: vi.fn() };
  render(<FeedbackForm cardSlug="test-card" locale="zh-CN" repository={repository} />);

  expect(screen.getByText("反馈通道将在网页版上线后开放。" )).toBeVisible();
  expect(screen.getByRole("button", { name: "提交反馈" })).toBeDisabled();
});
