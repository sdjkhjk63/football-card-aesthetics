import { expect, it, vi } from "vitest";
import { createSupabaseFeedbackRepository } from "@/lib/supabaseFeedbackRepository";

it("writes feedback to Supabase without exposing a read API", async () => {
  const request = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
  const repository = createSupabaseFeedbackRepository({
    url: "https://example.supabase.co",
    anonKey: "public-anon-key",
    request,
  });

  expect(repository.available).toBe(true);
  expect("list" in repository).toBe(false);
  await repository.submit({ cardSlug: "blue-refractor", message: "很喜欢这个设计" });

  expect(request).toHaveBeenCalledWith(
    "https://example.supabase.co/rest/v1/card_feedback",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ apikey: "public-anon-key", Prefer: "return=minimal" }),
      body: JSON.stringify({ card_slug: "blue-refractor", message: "很喜欢这个设计" }),
    }),
  );
});

it("reports a failed Supabase write", async () => {
  const repository = createSupabaseFeedbackRepository({
    url: "https://example.supabase.co",
    anonKey: "public-anon-key",
    request: vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
  });

  await expect(repository.submit({ cardSlug: "card", message: "反馈内容足够长" })).rejects.toThrow("feedback_submit_failed");
});
