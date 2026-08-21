"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "@/domain/catalogue";
import type { DetailedRating, RatingInput } from "@/domain/ratings";
import type { RatingRepository } from "@/lib/ratingRepository";
import type { CommunityRatingRepository, CommunityRatingSummary } from "@/lib/communityRatingRepository";
import { translate, type MessageKey } from "@/data/messages";

const fields: { key: keyof RatingInput; label: MessageKey; weight: string }[] = [
  { key: "composition", label: "composition", weight: "30%" },
  { key: "colorFinish", label: "colorFinish", weight: "30%" },
  { key: "themeIdentity", label: "themeIdentity", weight: "25%" },
  { key: "typographyDetails", label: "typographyDetails", weight: "15%" },
];

export function RatingForm({
  cardSlug,
  repository,
  locale,
  communityRepository,
  deviceId,
}: {
  cardSlug: string;
  repository: RatingRepository;
  locale: Locale;
  communityRepository?: CommunityRatingRepository;
  deviceId?: string;
}) {
  const [details, setDetails] = useState<DetailedRating>({});
  const [draftScore, setDraftScore] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [persistence, setPersistence] = useState<"local" | "session">("session");
  const [community, setCommunity] = useState<CommunityRatingSummary | null>(null);
  const [communityError, setCommunityError] = useState(false);

  useEffect(() => {
    const existing = repository.get(cardSlug);
    setPersistence(repository.persistence);
    if (existing) {
      setDetails(existing.details ?? {});
      setDraftScore(existing.score);
      setSavedScore(existing.score);
      setHasExisting(true);
    }
  }, [cardSlug, repository]);

  useEffect(() => {
    if (!communityRepository?.available || !deviceId) return;
    let active = true;
    const refresh = async () => {
      try {
        const summary = await communityRepository.getSummary(cardSlug, deviceId);
        if (!active) return;
        setCommunity(summary);
        setCommunityError(false);
        if (summary.ownScore != null) {
          setDraftScore(summary.ownScore);
          setSavedScore(summary.ownScore);
          setHasExisting(true);
        }
      } catch {
        if (active) setCommunityError(true);
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, [cardSlug, communityRepository, deviceId]);

  const sliderValue = draftScore ?? 5.5;
  const position = ((sliderValue - 1) / 9) * 100;
  const save = async () => {
    if (draftScore == null) return;
    const record = repository.save(cardSlug, draftScore, details);
    setSavedScore(record.score);
    setHasExisting(true);
    if (communityRepository?.available && deviceId) {
      try {
        setCommunity(await communityRepository.save(cardSlug, deviceId, record.score));
        setCommunityError(false);
      } catch {
        setCommunityError(true);
      }
    }
  };

  return (
    <section className="rating-form panel">
      <div className="rating-form-heading">
        <div><span className="kicker">1.0—10.0</span><h2>{translate("rateDesign", locale)}</h2></div>
        {savedScore != null && <output>{translate("myRating", locale)}: {savedScore.toFixed(1)}</output>}
      </div>

      <div className="community-score" aria-live="polite">
        <span>{translate("communityScore", locale)}</span>
        <strong>{community?.averageScore == null ? "—" : community.averageScore.toFixed(1)}</strong>
        <small>{community ? translate("ratingCount", locale).replace("{count}", String(community.ratingCount)) : translate("communityPending", locale)}</small>
      </div>

      <div className="score-slider">
        <label htmlFor={`overall-score-${cardSlug}`}>{translate("overallScore", locale)}</label>
        <div className="score-slider-track" style={{ "--score-position": `${position}%`, "--fill-position": draftScore == null ? "0%" : `${position}%` } as CSSProperties}>
          <output className={draftScore == null ? "score-bubble empty" : "score-bubble"}>{draftScore == null ? "—" : draftScore.toFixed(1)}</output>
          <input
            id={`overall-score-${cardSlug}`}
            aria-label={translate("overallScore", locale)}
            aria-valuetext={draftScore == null ? translate("notRated", locale) : draftScore.toFixed(1)}
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={sliderValue}
            onChange={(event) => setDraftScore(Number(event.target.value))}
          />
        </div>
        <div className="score-scale" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <span key={index + 1}>{index + 1}</span>)}
        </div>
      </div>

      <button
        className="detail-toggle"
        type="button"
        aria-expanded={showDetails}
        onClick={() => setShowDetails((current) => !current)}
      >
        <span>{showDetails ? "−" : "+"}</span>
        {translate(showDetails ? "closeDetailedReview" : "detailedReview", locale)}
        <small>{translate("optional", locale)}</small>
      </button>

      {showDetails && (
        <div className="rating-fields">
          {fields.map(({ key, label, weight }) => (
            <label key={key}>
              <span>{translate(label, locale)} <em>{weight}</em></span>
              <select
                aria-label={`${translate(label, locale)} ${weight}`}
                value={details[key] ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setDetails((current) => {
                    const next = { ...current };
                    if (value) next[key] = Number(value);
                    else delete next[key];
                    return next;
                  });
                }}
              >
                <option value="">—</option>
                {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}

      <button className="primary-button" type="button" disabled={draftScore == null} onClick={save}>
        {translate(hasExisting ? "updateRating" : "saveRating", locale)}
      </button>
      <p className="storage-note">{translate(persistence === "local" ? "savedLocally" : "sessionOnly", locale)}</p>
      {communityError ? <p className="storage-note error">{translate("communitySyncError", locale)}</p> : null}
    </section>
  );
}
