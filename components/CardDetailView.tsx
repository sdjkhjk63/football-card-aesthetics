"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { CardDesign, CardSeries } from "@/domain/catalogue";
import { localize } from "@/domain/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import { RatingForm } from "@/components/RatingForm";
import { SourceNotice } from "@/components/SourceNotice";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";

export function CardDetailView({ series, design }: { series: CardSeries; design: CardDesign }) {
  const { locale, t } = useLanguage();
  const repository = useMemo(() => createLocalRatingRepository(), []);
  return (
    <main className="detail-page">
      <Link className="back-link" href={`/series/${series.slug}`}>← {t("backToSeries")}</Link>
      <div className="detail-layout">
        <div className="detail-visual"><Image src={`/${design.image.path}`} alt={localize(design.image.alt, locale)} width={900} height={1200} priority />{design.serial && <span className="serial-badge large">{design.serial}</span>}</div>
        <div className="detail-copy"><span className="eyebrow">{design.group.toUpperCase()} · {design.section.replaceAll("-", " ").toUpperCase()}</span><h1>{localize(design.name, locale)}</h1><p className="official-name">{design.officialName}</p><RatingForm cardSlug={design.slug} repository={repository} locale={locale} /><SourceNotice source={design.image} locale={locale} /></div>
      </div>
    </main>
  );
}
