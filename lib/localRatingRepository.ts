import { assertScore, calculateWeightedScore, type RatingInput, type RatingRecord } from "@/domain/ratings";
import type { RatingRepository } from "@/lib/ratingRepository";

const STORAGE_KEY = "card-aesthetics-ratings-v1";
type Store = { records: Record<string, RatingRecord>; selections: Record<string, number> };
const fallback: Store = { records: {}, selections: {} };

const emptyStore = (): Store => ({ records: {}, selections: {} });

export function createLocalRatingRepository(providedStorage?: Storage): RatingRepository {
  let storage = providedStorage;
  if (!storage && typeof window !== "undefined") {
    try { storage = window.localStorage; } catch { storage = undefined; }
  }
  let persistence: "local" | "session" = storage ? "local" : "session";

  const read = (): Store => {
    if (!storage) return fallback;
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Store : emptyStore();
    } catch {
      persistence = "session";
      storage = undefined;
      return fallback;
    }
  };

  const write = (state: Store) => {
    if (!storage) {
      fallback.records = state.records;
      fallback.selections = state.selections;
      return;
    }
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch {
      persistence = "session";
      storage = undefined;
      fallback.records = state.records;
      fallback.selections = state.selections;
    }
  };

  return {
    get persistence() { return persistence; },
    get(cardSlug) { return read().records[cardSlug] ?? null; },
    list() { return Object.values(read().records); },
    save(cardSlug, input) {
      const state = read();
      const record = { cardSlug, input, score: calculateWeightedScore(input), updatedAt: new Date().toISOString() };
      state.records[cardSlug] = record;
      write(state);
      return record;
    },
    getSeriesSelection(seriesSlug) { return read().selections[seriesSlug] ?? null; },
    saveSeriesSelection(seriesSlug, score) {
      assertScore(score);
      const state = read();
      state.selections[seriesSlug] = score;
      write(state);
      return score;
    },
  };
}
