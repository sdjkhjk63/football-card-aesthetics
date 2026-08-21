"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const ratings = hydrated ? repository.list().filter((record) => series.cardDesigns.some((design) => design.slug === record.cardSlug)) : [];
  const baseCount = series.cardDesigns.filter((design) => design.group === "base").length;
  const insertCount = series.cardDesigns.filter((design) => design.group === "insert").length;
  const summary = calculateSeriesSummary(ratings, hydrated ? repository.getSeriesSelection(series.slug) : null);
  return (
    <main>
      <header className="series-masthead"><div><span className="eyebrow">{series.manufacturer} · {series.season}</span><h1>{localize(series.name, locale)}</h1><p>{series.cardDesigns.length} INDEPENDENT DESIGNS / {baseCount} BASE + {insertCount} INSERTS</p></div><RatingSummary summary={summary} locale={locale} /></header>
      <SeriesSelectionRating seriesSlug={series.slug} repository={repository} locale={locale} onSaved={() => refresh((value) => value + 1)} />
      <CardDesignGrid seriesSlug={series.slug} designs={series.cardDesigns} locale={locale} ratings={ratings} />
    </main>
  );
}
