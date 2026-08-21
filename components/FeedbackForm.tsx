"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/domain/catalogue";
import type { FeedbackRepository } from "@/lib/feedbackRepository";
import { translate } from "@/data/messages";

export function FeedbackForm({
  cardSlug,
  locale,
  repository,
}: {
  cardSlug: string;
  locale: Locale;
  repository: FeedbackRepository;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const valid = message.trim().length >= 5 && message.trim().length <= 500;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repository.available || !valid || status === "sending") return;
    setStatus("sending");
    try {
      await repository.submit({ cardSlug, message });
      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="feedback-panel">
      <h2>{translate("playerFeedback", locale)}</h2>
      <form onSubmit={submit}>
        <label>
          <span>{translate("feedbackMessage", locale)}</span>
          <textarea
            value={message}
            minLength={5}
            maxLength={500}
            rows={5}
            onChange={(event) => { setMessage(event.target.value); setStatus("idle"); }}
            disabled={!repository.available || status === "sending"}
          />
        </label>
        <div className="feedback-actions">
          <button className="secondary-button" type="submit" disabled={!repository.available || !valid || status === "sending"}>
            {status === "sending" ? translate("feedbackSending", locale) : translate("feedbackSubmit", locale)}
          </button>
        </div>
      </form>
      {!repository.available ? <p className="feedback-status">{translate("feedbackUnavailable", locale)}</p> : null}
      {status === "sent" ? <p className="feedback-status success">{translate("feedbackSent", locale)}</p> : null}
      {status === "error" ? <p className="feedback-status error">{translate("feedbackError", locale)}</p> : null}
    </section>
  );
}
