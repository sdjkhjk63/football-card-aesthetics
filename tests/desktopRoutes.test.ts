import { expect, it } from "vitest";
import { generateStaticParams as seriesParams } from "@/app/series/[seriesSlug]/page";
import { generateStaticParams as cardParams } from "@/app/series/[seriesSlug]/cards/[cardSlug]/page";

it("enumerates the complete desktop route set", async () => {
  expect(await seriesParams()).toEqual([
    { seriesSlug: "topps-merlin-premier-league-2026" },
    { seriesSlug: "topps-finest-premier-league-2026" },
    { seriesSlug: "topps-chrome-arsenal-2025-26" },
    { seriesSlug: "topps-chrome-sapphire-bundesliga-2025-26" },
    { seriesSlug: "topps-forever-fc-barcelona-2025-26" },
    { seriesSlug: "topps-argentina-team-set-2026" },
    { seriesSlug: "topps-focus-liverpool-2025-26" },
    { seriesSlug: "topps-lineage-bayern-2025-26" },
    { seriesSlug: "topps-inception-ucc-2025-26" },
    { seriesSlug: "topps-deco-ucc-2025-26" },
    { seriesSlug: "topps-real-madrid-team-set-2025-26" },
    { seriesSlug: "topps-manchester-united-team-set-2025-26" },
    { seriesSlug: "topps-fc-barcelona-team-set-2025-26" },
    { seriesSlug: "topps-juventus-team-set-2025-26" },
    { seriesSlug: "topps-manchester-city-team-set-2025-26" },
  ]);

  const cards = await cardParams();
  expect(cards).toHaveLength(346);
  expect(cards).toContainEqual({
    seriesSlug: "topps-merlin-premier-league-2026",
    cardSlug: "red-mojo",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-finest-premier-league-2026",
    cardSlug: "base-common-blue",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-finest-premier-league-2026",
    cardSlug: "base-rare-pearl",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-finest-premier-league-2026",
    cardSlug: "finest-partnerships",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-chrome-arsenal-2025-26",
    cardSlug: "red-vision",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-chrome-arsenal-2025-26",
    cardSlug: "marble-icons-autographs",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-chrome-arsenal-2025-26",
    cardSlug: "the-arsenal-away-autographs",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-chrome-sapphire-bundesliga-2025-26",
    cardSlug: "infinite-sapphire-padparadscha",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-forever-fc-barcelona-2025-26",
    cardSlug: "identity-respect",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-argentina-team-set-2026",
    cardSlug: "golden-sun-autograph-black",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-focus-liverpool-2025-26",
    cardSlug: "synergy-dual-autographs",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-lineage-bayern-2025-26",
    cardSlug: "historic-future-dual-autograph",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-inception-ucc-2025-26",
    cardSlug: "club-crest-autograph-patch-v2",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-deco-ucc-2025-26",
    cardSlug: "antiquity-autograph-relics",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-deco-ucc-2025-26",
    cardSlug: "only1-autographs",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-real-madrid-team-set-2025-26",
    cardSlug: "collectors-corner-static",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-manchester-united-team-set-2025-26",
    cardSlug: "collectors-corner-static",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-fc-barcelona-team-set-2025-26",
    cardSlug: "we-want-the-ball-static",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-juventus-team-set-2025-26",
    cardSlug: "bicolore-static",
  });
  expect(cards).toContainEqual({
    seriesSlug: "topps-manchester-city-team-set-2025-26",
    cardSlug: "1894-static",
  });
});
