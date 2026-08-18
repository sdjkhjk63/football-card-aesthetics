"use client";

import { useMemo, useState } from "react";
import type { CardSeries } from "@/domain/catalogue";
import { calculateSeriesSummary } from "@/domain/ratings";
import { localize } from "@/domain/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import { CardDesignGrid } from "@/components/CardDesignGrid";
import { RatingSummary } from "@/components/RatingSummary";
import { SeriesSelectionRating } from "@/components/SeriesSelectionRating";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";

export function SeriesCatalogue({ series }: { series: CardSeries }) {
  const { locale } = useLanguage();
  const repository = useMemo(() => createLocalRatingRepository(), []);
  const [, refresh] = useState(0);
  const ratings = repository.list().filter((record) => series.cardDesigns.some((design) => design.slug === record.cardSlug));
  const summary = calculateSeriesSummary(ratings, repository.getSeriesSelection(series.slug));
  return (
    <main>
      <header className="series-masthead"><div><span className="eyebrow">{series.manufacturer} · {series.season}</span><h1>{localize(series.name, locale)}</h1><p>38 INDEPENDENT DESIGNS / 25 BASE + 13 INSERTS</p></div><RatingSummary summary={summary} locale={locale} /></header>
      <SeriesSelectionRating seriesSlug={series.slug} repository={repository} locale={locale} onSaved={() => refresh((value) => value + 1)} />
      <CardDesignGrid seriesSlug={series.slug} designs={series.cardDesigns} locale={locale} ratings={ratings} />
    </main>
  );
}
