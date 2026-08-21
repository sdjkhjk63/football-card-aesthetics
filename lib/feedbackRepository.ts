import type { FeedbackSubmission } from "@/domain/feedback";

export interface FeedbackRepository {
  readonly available: boolean;
  submit(feedback: FeedbackSubmission): Promise<void>;
}
