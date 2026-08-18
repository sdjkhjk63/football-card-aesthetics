import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { AppHeader } from "@/components/AppHeader";
import { LanguageProvider } from "@/components/LanguageProvider";

beforeEach(() => window.localStorage.clear());

it("opens a custom language menu and switches locale", async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><AppHeader /></LanguageProvider>);

  const trigger = await screen.findByRole("button", { name: "语言" });
  expect(trigger).toHaveTextContent("中文");
  await user.click(trigger);

  const menu = screen.getByRole("menu", { name: "语言" });
  expect(menu).toBeVisible();
  await user.click(screen.getByRole("menuitemradio", { name: "English" }));

  expect(screen.getByRole("button", { name: "Language" })).toHaveTextContent("English");
  expect(menu).not.toBeInTheDocument();
  expect(document.documentElement.lang).toBe("en");
});
