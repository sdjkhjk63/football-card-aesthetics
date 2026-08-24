import Image from "next/image";
import type { CSSProperties } from "react";
import { publicAssetPath } from "@/lib/publicAssetPath";
import Link from "next/link";
import type { CardDesign, Locale } from "@/domain/catalogue";
import type { RatingRecord } from "@/domain/ratings";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";

export function CardDesignTile({ seriesSlug, design, locale, rating }: { seriesSlug: string; design: CardDesign; locale: Locale; rating?: RatingRecord }) {
  const imageIsVerified = design.image.verification !== "unverified";
  const unverifiedLabel = { "zh-CN": "实卡图待核实", en: "Card image pending verification", es: "Imagen pendiente de verificar" }[locale];
  const imageStyle = design.image.displayScale
    ? ({ "--image-display-scale": design.image.displayScale } as CSSProperties)
    : undefined;
  const displayedLabel = { "zh-CN": "当前展示", en: "Shown", es: "Mostrada" }[locale];
  const allParallelsLabel = { "zh-CN": "全部限编", en: "Numbered versions", es: "Versiones numeradas" }[locale];
  const countSuffix = { "zh-CN": "种", en: "", es: "" }[locale];
  return (
    <Link className={design.layout === "landscape" ? "card-tile landscape" : "card-tile"} href={`/series/${seriesSlug}/cards/${design.slug}`} aria-label={`${design.officialName} — ${localize(design.name, locale)}`}>
      <div className="card-image-frame">
        {imageIsVerified
          ? <Image src={publicAssetPath(design.image.path)} alt={localize(design.image.alt, locale)} width={520} height={720} style={imageStyle} />
          : <div className="card-image-unverified" role="status"><span>{unverifiedLabel}</span><small>{design.officialName}</small></div>}
        {design.serial && <span className="serial-badge">{design.serial}</span>}
      </div>
      <div className="card-tile-copy">
        <span className="card-category">{design.group === "base" ? translate("base", locale) : translate("insert", locale)}</span>
        <h3>{localize(design.name, locale)}</h3>
        <p>{design.officialName}</p>
        {design.parallels?.length ? (
          <div className="parallel-block">
            {design.displayParallelName && design.serial ? <strong className="displayed-parallel">{displayedLabel}：{design.displayParallelName} {design.serial}</strong> : null}
            <div className="parallel-summary">{allParallelsLabel} {design.parallels.length} {countSuffix}</div>
            <div className="parallel-strip" aria-label="Parallels">
              {design.parallels.map((parallel) => {
                const isCurrent = parallel.name === design.displayParallelName && parallel.serial === design.serial;
                return <span data-current={isCurrent ? "true" : undefined} key={`${parallel.name}-${parallel.serial ?? "base"}`}>{parallel.name}{parallel.serial ? ` ${parallel.serial}` : ""}</span>;
              })}
            </div>
          </div>
        ) : null}
        <span className={rating ? "rating-chip rated" : "rating-chip"}>{rating ? `${translate("myRating", locale)} ${rating.score.toFixed(1)}` : translate("notRated", locale)}</span>
      </div>
    </Link>
  );
}
