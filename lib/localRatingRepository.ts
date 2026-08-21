import { assertScore, type DetailedRating, type RatingInput, type RatingRecord } from "@/domain/ratings";
import type { RatingRepository } from "@/lib/ratingRepository";

const STORAGE_KEY = "card-aesthetics-ratings-v1";
type Store = { records: Record<string, RatingRecord>; selections: Record<string, number> };
type LegacyRatingRecord = RatingRecord & { input?: RatingInput };
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
      if (!raw) return emptyStore();
      const parsed = JSON.parse(raw) as { records?: Record<string, LegacyRatingRecord>; selections?: Record<string, number> };
      const records = Object.fromEntries(
        Object.entries(parsed.records ?? {}).map(([slug, record]) => [
          slug,
          {
            cardSlug: record.cardSlug,
            score: record.score,
            updatedAt: record.updatedAt,
            ...(record.details || record.input ? { details: record.details ?? record.input } : {}),
          } satisfies RatingRecord,
        ]),
      );
      return { records, selections: parsed.selections ?? {} };
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
    save(cardSlug, score, details?: DetailedRating) {
      assertScore(score);
      const state = read();
      const record: RatingRecord = {
        cardSlug,
        score: Math.round(score * 10) / 10,
        updatedAt: new Date().toISOString(),
        ...(details && Object.keys(details).length ? { details } : {}),
      };
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
