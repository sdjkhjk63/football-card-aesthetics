export interface CommunityRatingSummary {
  averageScore: number | null;
  ratingCount: number;
  ownScore: number | null;
}

export interface CommunityRatingRepository {
  readonly available: boolean;
  getSummary(cardSlug: string, deviceId: string): Promise<CommunityRatingSummary>;
  save(cardSlug: string, deviceId: string, score: number): Promise<CommunityRatingSummary>;
}
