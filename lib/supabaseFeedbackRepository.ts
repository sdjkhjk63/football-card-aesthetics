import { normalizeFeedback, type FeedbackSubmission } from "@/domain/feedback";
import type { FeedbackRepository } from "@/lib/feedbackRepository";

type FeedbackRepositoryOptions = {
  url?: string;
  anonKey?: string;
  request?: typeof fetch;
};

export function createSupabaseFeedbackRepository(
  options: FeedbackRepositoryOptions = {},
): FeedbackRepository {
  const url = options.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = options.anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const request = options.request ?? fetch;
  const available = Boolean(url && anonKey);

  return {
    available,
    async submit(input: FeedbackSubmission) {
      if (!url || !anonKey) throw new Error("feedback_unavailable");
      const feedback = normalizeFeedback(input);
      const response = await request(`${url.replace(/\/$/, "")}/rest/v1/card_feedback`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          card_slug: feedback.cardSlug,
          message: feedback.message,
        }),
      });
      if (!response.ok) throw new Error("feedback_submit_failed");
    },
  };
}
