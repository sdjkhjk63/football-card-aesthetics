export const ratingWeights = {
  composition: 0.3,
  colorFinish: 0.3,
  themeIdentity: 0.25,
  typographyDetails: 0.15,
} as const;

export type RatingInput = Record<keyof typeof ratingWeights, number>;

export interface RatingRecord {
  cardSlug: string;
  input: RatingInput;
  score: number;
  updatedAt: string;
}

export type RatingSummary =
  | { kind: "empty"; score: null; ratedCards: 0 }
  | { kind: "card-average"; score: number; ratedCards: number }
  | { kind: "full-series"; score: number; ratedCards: number; selectionScore: number };

const round = (value: number) => Math.round(value * 10) / 10;

export function assertScore(value: number) {
  if (!Number.isFinite(value) || value < 1 || value > 10) {
    throw new RangeError("Ratings must be between 1 and 10.");
  }
}

export function calculateWeightedScore(input: RatingInput): number {
  for (const value of Object.values(input)) assertScore(value);
  return round(
    input.composition * ratingWeights.composition +
    input.colorFinish * ratingWeights.colorFinish +
    input.themeIdentity * ratingWeights.themeIdentity +
    input.typographyDetails * ratingWeights.typographyDetails,
  );
}

export function calculateSeriesSummary(records: RatingRecord[], selectionScore?: number | null): RatingSummary {
  if (records.length === 0) return { kind: "empty", score: null, ratedCards: 0 };
  const average = round(records.reduce((sum, record) => sum + record.score, 0) / records.length);
  if (selectionScore == null) return { kind: "card-average", score: average, ratedCards: records.length };
  assertScore(selectionScore);
  return { kind: "full-series", score: round(average * 0.8 + selectionScore * 0.2), ratedCards: records.length, selectionScore };
}
