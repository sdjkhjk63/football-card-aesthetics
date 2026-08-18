"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/domain/catalogue";
import type { RatingRepository } from "@/lib/ratingRepository";
import { translate } from "@/data/messages";

export function SeriesSelectionRating({ seriesSlug, repository, locale, onSaved }: { seriesSlug: string; repository: RatingRepository; locale: Locale; onSaved?: () => void }) {
  const [score, setScore] = useState("");
  useEffect(() => {
    const existing = repository.getSeriesSelection(seriesSlug);
    if (existing != null) setScore(existing.toString());
  }, [repository, seriesSlug]);
  const save = () => {
    if (!score) return;
    repository.saveSeriesSelection(seriesSlug, Number(score));
    onSaved?.();
  };
  return (
    <section className="selection-rating panel">
      <div><span className="kicker">SERIES · 20%</span><h2>{translate("playerSelection", locale)}</h2></div>
      <label><span>{translate("playerSelection", locale)}</span><select aria-label={translate("playerSelection", locale)} value={score} onChange={(event) => setScore(event.target.value)}><option value="">—</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
      <button className="secondary-button" type="button" disabled={!score} onClick={save}>{translate("saveSeriesRating", locale)}</button>
    </section>
  );
}
