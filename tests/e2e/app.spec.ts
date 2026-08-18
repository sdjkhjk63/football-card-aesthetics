import { expect, test } from "@playwright/test";

test("user enters Merlin, rates Red Mojo, and keeps the score after reload", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto("/");
  await page.getByRole("button", { name: "语言" }).click();
  await page.getByRole("menuitemradio", { name: "English" }).click();
  await page.getByRole("link", { name: "Enter series" }).click();
  await expect(page.locator(".card-tile")).toHaveCount(38);
  await page.getByRole("searchbox").fill("Red Mojo");
  await page.getByRole("link", { name: /Red Mojo/i }).click();
  for (const label of ["Composition", "Color & finish", "Theme & identity", "Typography & details"]) {
    await page.getByRole("combobox", { name: new RegExp(label, "i") }).selectOption("8");
  }
  await page.getByRole("button", { name: "Save rating" }).click();
  await expect(page.getByText("My rating: 8.0")).toBeVisible();
  await page.reload();
  await expect(page.getByText("My rating: 8.0")).toBeVisible();
  await expect(page.getByRole("button", { name: "Language" })).toContainText("English");
  expect(consoleErrors).toEqual([]);
});

test("catalogue stays within the viewport", async ({ page }) => {
  await page.goto("/series/topps-merlin-premier-league-2026");
  const sizes = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  expect(sizes.scroll).toBe(sizes.client);
});
