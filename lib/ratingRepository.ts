import type { RatingInput, RatingRecord } from "@/domain/ratings";

export interface RatingRepository {
  readonly persistence: "local" | "session";
  get(cardSlug: string): RatingRecord | null;
  list(): RatingRecord[];
  save(cardSlug: string, input: RatingInput): RatingRecord;
  getSeriesSelection(seriesSlug: string): number | null;
  saveSeriesSelection(seriesSlug: string, score: number): number;
}
