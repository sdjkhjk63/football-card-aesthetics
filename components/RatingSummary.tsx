import type { Locale } from "@/domain/catalogue";
import type { RatingSummary as Summary } from "@/domain/ratings";
import { translate } from "@/data/messages";

export function RatingSummary({ summary, locale }: { summary: Summary; locale: Locale }) {
  if (summary.kind === "empty") return <div className="series-summary"><span>{translate("notRated", locale)}</span><strong>—</strong></div>;
  return (
    <div className="series-summary">
      <span>{translate(summary.kind === "full-series" ? "fullSeries" : "cardAverage", locale)}</span>
      <strong>{summary.score.toFixed(1)}</strong>
      <small>{summary.ratedCards} / 38</small>
    </div>
  );
}
