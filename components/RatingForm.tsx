"use client";

import { useState } from "react";
import type { Locale } from "@/domain/catalogue";
import type { RatingInput } from "@/domain/ratings";
import type { RatingRepository } from "@/lib/ratingRepository";
import { translate, type MessageKey } from "@/data/messages";

const fields: { key: keyof RatingInput; label: MessageKey; weight: string }[] = [
  { key: "composition", label: "composition", weight: "30%" },
  { key: "colorFinish", label: "colorFinish", weight: "30%" },
  { key: "themeIdentity", label: "themeIdentity", weight: "25%" },
  { key: "typographyDetails", label: "typographyDetails", weight: "15%" },
];

export function RatingForm({ cardSlug, repository, locale }: { cardSlug: string; repository: RatingRepository; locale: Locale }) {
  const existing = repository.get(cardSlug);
  const [values, setValues] = useState<Partial<Record<keyof RatingInput, number>>>(existing?.input ?? {});
  const [score, setScore] = useState<number | null>(existing?.score ?? null);
  const complete = fields.every(({ key }) => values[key] != null);
  const save = () => {
    if (!complete) return;
    const record = repository.save(cardSlug, values as RatingInput);
    setScore(record.score);
  };
  return (
    <section className="rating-form panel">
      <div className="rating-form-heading"><div><span className="kicker">1—10 · WEIGHTED</span><h2>{translate("rateDesign", locale)}</h2></div>{score != null && <output>{translate("myRating", locale)}: {score.toFixed(1)}</output>}</div>
      <div className="rating-fields">
        {fields.map(({ key, label, weight }) => (
          <label key={key}><span>{translate(label, locale)} <em>{weight}</em></span><select aria-label={`${translate(label, locale)} ${weight}`} value={values[key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [key]: Number(event.target.value) }))}><option value="">—</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
        ))}
      </div>
      <button className="primary-button" type="button" disabled={!complete} onClick={save}>{translate(existing ? "updateRating" : "saveRating", locale)}</button>
      <p className="storage-note">{translate(repository.persistence === "local" ? "savedLocally" : "sessionOnly", locale)}</p>
    </section>
  );
}
