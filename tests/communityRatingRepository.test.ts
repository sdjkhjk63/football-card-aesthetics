import { expect, it, vi } from "vitest";
import { createSupabaseCommunityRatingRepository } from "@/lib/supabaseCommunityRatingRepository";

it("loads a public average and the current device score", async () => {
  const request = vi.fn().mockResolvedValue(new Response(JSON.stringify([
    { average_score: 6.5, rating_count: 2, own_score: 6 },
  ]), { status: 200 }));
  const repository = createSupabaseCommunityRatingRepository({ url: "https://example.supabase.co", anonKey: "anon", request });

  await expect(repository.getSummary("blue", "device-id")).resolves.toEqual({ averageScore: 6.5, ratingCount: 2, ownScore: 6 });
});

it("upserts one score for a device and card", async () => {
  const request = vi.fn().mockResolvedValue(new Response(JSON.stringify([
    { average_score: 7.2, rating_count: 3, own_score: 8.5 },
  ]), { status: 200 }));
  const repository = createSupabaseCommunityRatingRepository({ url: "https://example.supabase.co", anonKey: "anon", request });

  const result = await repository.save("blue", "device-id", 8.5);

  expect(result.averageScore).toBe(7.2);
  expect(request).toHaveBeenCalledWith(
    "https://example.supabase.co/rest/v1/rpc/upsert_card_rating",
    expect.objectContaining({ body: JSON.stringify({ p_card_slug: "blue", p_device_token: "device-id", p_score: 8.5 }) }),
  );
});
