export interface FeedbackSubmission {
  cardSlug: string;
  message: string;
}

export function normalizeFeedback(input: FeedbackSubmission): FeedbackSubmission {
  const cardSlug = input.cardSlug.trim();
  const message = input.message.trim();

  if (!cardSlug || message.length < 5 || message.length > 500) {
    throw new Error("invalid_feedback");
  }

  return { cardSlug, message };
}
