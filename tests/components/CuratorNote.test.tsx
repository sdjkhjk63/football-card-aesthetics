import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CuratorNote } from "@/components/CuratorNote";
import userEvent from "@testing-library/user-event";
import type { AuthorNoteRepository } from "@/lib/authorNoteRepository";

it("shows the curator note in the active language", () => {
  render(
    <CuratorNote
      locale="zh-CN"
      note={{ "zh-CN": "这张卡的折射层次很漂亮。", en: "Strong refractor depth.", es: "Buen efecto refractor." }}
    />,
  );
  expect(screen.getByRole("heading", { name: "作者评语" })).toBeVisible();
  expect(screen.getByText("这张卡的折射层次很漂亮。")).toBeVisible();
});

it("lets the author write and revise a public note in author mode", async () => {
  let saved = "";
  const repository: AuthorNoteRepository = {
    get: () => saved || null,
    save: (_cardSlug, note) => { saved = note; return note; },
  };
  const user = userEvent.setup();
  render(<CuratorNote cardSlug="blue" locale="zh-CN" repository={repository} editable />);

  await user.click(screen.getByRole("button", { name: "填写作者评语" }));
  await user.type(screen.getByLabelText("作者评语"), "银色折射很克制，人物与边框也很协调。" );
  await user.click(screen.getByRole("button", { name: "保存作者评语" }));

  expect(saved).toBe("银色折射很克制，人物与边框也很协调。");
  expect(screen.getByText(saved)).toBeVisible();
});
