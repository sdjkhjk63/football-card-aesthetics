import { expect, it } from "vitest";
import { generateStaticParams as seriesParams } from "@/app/series/[seriesSlug]/page";
import { generateStaticParams as cardParams } from "@/app/series/[seriesSlug]/cards/[cardSlug]/page";

it("enumerates the complete desktop route set", async () => {
  expect(await seriesParams()).toEqual([
    { seriesSlug: "topps-merlin-premier-league-2026" },
  ]);

  const cards = await cardParams();
  expect(cards).toHaveLength(38);
  expect(cards).toContainEqual({
    seriesSlug: "topps-merlin-premier-league-2026",
    cardSlug: "red-mojo",
  });
});
