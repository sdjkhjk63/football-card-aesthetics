import Image from "next/image";
import Link from "next/link";
import type { CardDesign, Locale } from "@/domain/catalogue";
import type { RatingRecord } from "@/domain/ratings";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";

export function CardDesignTile({ seriesSlug, design, locale, rating }: { seriesSlug: string; design: CardDesign; locale: Locale; rating?: RatingRecord }) {
  const imageIsVerified = design.image.verification !== "unverified";
  const unverifiedLabel = { "zh-CN": "实卡图待核实", en: "Card image pending verification", es: "Imagen pendiente de verificar" }[locale];
  return (
    <Link className={design.layout === "landscape" ? "card-tile landscape" : "card-tile"} href={`/series/${seriesSlug}/cards/${design.slug}`} aria-label={`${design.officialName} — ${localize(design.name, locale)}`}>
      <div className="card-image-frame">
        {imageIsVerified
          ? <Image src={`/${design.image.path}`} alt={localize(design.image.alt, locale)} width={520} height={720} />
          : <div className="card-image-unverified" role="status"><span>{unverifiedLabel}</span><small>{design.officialName}</small></div>}
        {design.serial && <span className="serial-badge">{design.serial}</span>}
      </div>
      <div className="card-tile-copy">
        <span className="card-category">{design.group === "base" ? translate("base", locale) : translate("insert", locale)}</span>
        <h3>{localize(design.name, locale)}</h3>
        <p>{design.officialName}</p>
        {design.parallels?.length ? (
          <div className="parallel-strip" aria-label="Parallels">
            {design.parallels.map((parallel) => (
              <span key={`${parallel.name}-${parallel.serial ?? "base"}`}>{parallel.serial ?? parallel.name}</span>
            ))}
          </div>
        ) : null}
        <span className={rating ? "rating-chip rated" : "rating-chip"}>{rating ? `${translate("myRating", locale)} ${rating.score.toFixed(1)}` : translate("notRated", locale)}</span>
      </div>
    </Link>
  );
}
