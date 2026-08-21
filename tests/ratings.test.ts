import { describe, expect, it } from "vitest";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";
import { calculateSeriesSummary, calculateWeightedScore } from "@/domain/ratings";

const perfect = {
  composition: 10,
  colorFinish: 10,
  themeIdentity: 10,
  typographyDetails: 10,
};

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => { data.set(key, value); },
  };
}

describe("ratings", () => {
  it("calculates the public weighted score to one decimal", () => {
    expect(calculateWeightedScore(perfect)).toBe(10);
    expect(calculateWeightedScore({ composition: 8, colorFinish: 9, themeIdentity: 7, typographyDetails: 6 })).toBe(7.8);
  });

  it("rejects values outside the public 1-10 scale", () => {
    expect(() => calculateWeightedScore({ ...perfect, composition: 0 })).toThrow();
    expect(() => calculateWeightedScore({ ...perfect, colorFinish: 11 })).toThrow();
  });

  it("updates one local record instead of duplicating it", () => {
    const repository = createLocalRatingRepository(memoryStorage());
    repository.save("refractor", 10, perfect);
    repository.save("refractor", 8.7, { composition: 8 });
    expect(repository.list()).toHaveLength(1);
    expect(repository.get("refractor")?.score).toBe(8.7);
    expect(repository.get("refractor")?.details).toEqual({ composition: 8 });
  });

  it("migrates a legacy weighted record without losing its score", () => {
    const storage = memoryStorage();
    storage.setItem("card-aesthetics-ratings-v1", JSON.stringify({
      records: {
        refractor: { cardSlug: "refractor", input: perfect, score: 10, updatedAt: "then" },
      },
      selections: {},
    }));
    const record = createLocalRatingRepository(storage).get("refractor");
    expect(record?.score).toBe(10);
    expect(record?.details).toEqual(perfect);
  });

  it("stores one player-photo selection score per series", () => {
    const repository = createLocalRatingRepository(memoryStorage());
    repository.saveSeriesSelection("topps-merlin-premier-league-2026", 7);
    repository.saveSeriesSelection("topps-merlin-premier-league-2026", 9);
    expect(repository.getSeriesSelection("topps-merlin-premier-league-2026")).toBe(9);
  });

  it("labels a card-only average differently from a full series score", () => {
    const records = [{ cardSlug: "base", details: perfect, score: 10, updatedAt: "now" }];
    expect(calculateSeriesSummary(records)).toEqual({ kind: "card-average", score: 10, ratedCards: 1 });
    expect(calculateSeriesSummary(records, 5)).toEqual({ kind: "full-series", score: 9, ratedCards: 1, selectionScore: 5 });
  });
});
