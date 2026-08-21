import { assertScore } from "@/domain/ratings";
import type { CommunityRatingRepository, CommunityRatingSummary } from "@/lib/communityRatingRepository";

type Options = { url?: string; anonKey?: string; request?: typeof fetch };
type SummaryRow = { average_score: number | string | null; rating_count: number | string; own_score: number | string | null };

function parseSummary(payload: unknown): CommunityRatingSummary {
  const row = (Array.isArray(payload) ? payload[0] : payload) as SummaryRow | undefined;
  if (!row) return { averageScore: null, ratingCount: 0, ownScore: null };
  return {
    averageScore: row.average_score == null ? null : Number(row.average_score),
    ratingCount: Number(row.rating_count),
    ownScore: row.own_score == null ? null : Number(row.own_score),
  };
}

export function createSupabaseCommunityRatingRepository(options: Options = {}): CommunityRatingRepository {
  const url = options.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = options.anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const request = options.request ?? fetch;
  const available = Boolean(url && anonKey);

  const call = async (functionName: string, body: Record<string, unknown>) => {
    if (!url || !anonKey) throw new Error("community_rating_unavailable");
    const response = await request(`${url.replace(/\/$/, "")}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("community_rating_failed");
    return parseSummary(await response.json());
  };

  return {
    available,
    getSummary(cardSlug, deviceId) {
      return call("get_card_rating_summary", { p_card_slug: cardSlug, p_device_token: deviceId });
    },
    save(cardSlug, deviceId, score) {
      assertScore(score);
      return call("upsert_card_rating", { p_card_slug: cardSlug, p_device_token: deviceId, p_score: score });
    },
  };
}
