"use client";

import Image from "next/image";
import { publicAssetPath } from "@/lib/publicAssetPath";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { CardDesign, CardSeries } from "@/domain/catalogue";
import { localize } from "@/domain/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import { RatingForm } from "@/components/RatingForm";
import { CuratorNote } from "@/components/CuratorNote";
import { FeedbackForm } from "@/components/FeedbackForm";
import { createLocalRatingRepository } from "@/lib/localRatingRepository";
import { createSupabaseFeedbackRepository } from "@/lib/supabaseFeedbackRepository";
import { createSupabaseCommunityRatingRepository } from "@/lib/supabaseCommunityRatingRepository";
import { getOrCreateDeviceId } from "@/lib/deviceIdentity";
import { createLocalAuthorNoteRepository } from "@/lib/authorNoteRepository";

export function CardDetailView({ series, design }: { series: CardSeries; design: CardDesign }) {
  const { locale, t } = useLanguage();
  const repository = useMemo(() => createLocalRatingRepository(), []);
  const feedbackRepository = useMemo(() => createSupabaseFeedbackRepository(), []);
  const communityRepository = useMemo(() => createSupabaseCommunityRatingRepository(), []);
  const authorNoteRepository = useMemo(() => createLocalAuthorNoteRepository(), []);
  const [deviceId, setDeviceId] = useState<string>();
  const authorMode = process.env.NEXT_PUBLIC_AUTHOR_MODE === "1";
  const imageIsVerified = design.image.verification !== "unverified";
  const unverifiedLabel = { "zh-CN": "实卡图待核实", en: "Card image pending verification", es: "Imagen pendiente de verificar" }[locale];
  const imageStyle = design.image.displayScale
    ? ({ "--image-display-scale": design.image.displayScale } as CSSProperties)
    : undefined;
  const displayedLabel = { "zh-CN": "当前展示", en: "Shown", es: "Mostrada" }[locale];
  const allParallelsLabel = { "zh-CN": "全部限编", en: "Numbered versions", es: "Versiones numeradas" }[locale];
  useEffect(() => { setDeviceId(getOrCreateDeviceId()); }, []);
  return (
    <main className="detail-page">
      <Link className="back-link" href={`/series/${series.slug}`}>← {t("backToSeries")}</Link>
      <div className="detail-layout">
        <div className="detail-media"><div className={design.layout === "landscape" ? "detail-visual landscape" : "detail-visual"}>{imageIsVerified ? <Image src={publicAssetPath(design.image.path)} alt={localize(design.image.alt, locale)} width={900} height={1200} priority style={imageStyle} /> : <div className="card-image-unverified" role="status"><span>{unverifiedLabel}</span><small>{design.officialName}</small></div>}{design.serial && <span className="serial-badge large">{design.serial}</span>}</div><CuratorNote note={design.curatorNote} locale={locale} cardSlug={design.slug} repository={authorNoteRepository} editable={authorMode} /></div>
        <div className="detail-copy"><span className="eyebrow">{design.group.toUpperCase()} · {design.section.replaceAll("-", " ").toUpperCase()}</span><h1>{localize(design.name, locale)}</h1><p className="official-name">{design.officialName}</p>{design.parallels?.length ? <div className="parallel-panel"><span>{allParallelsLabel} · {design.parallels.length}</span>{design.displayParallelName && design.serial ? <strong>{displayedLabel}：{design.displayParallelName} {design.serial}</strong> : null}{design.parallels.map((parallel) => { const isCurrent = parallel.name === design.displayParallelName && parallel.serial === design.serial; return <small data-current={isCurrent ? "true" : undefined} key={`${parallel.name}-${parallel.serial ?? "base"}`}>{parallel.name}{parallel.serial ? ` ${parallel.serial}` : ""}</small>; })}</div> : null}<RatingForm cardSlug={design.slug} repository={repository} locale={locale} communityRepository={communityRepository} deviceId={deviceId} /><FeedbackForm cardSlug={design.slug} locale={locale} repository={feedbackRepository} /></div>
      </div>
    </main>
  );
}
