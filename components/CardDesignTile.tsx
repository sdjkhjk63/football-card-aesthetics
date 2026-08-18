import Image from "next/image";
import Link from "next/link";
import type { CardDesign, Locale } from "@/domain/catalogue";
import type { RatingRecord } from "@/domain/ratings";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";

export function CardDesignTile({ seriesSlug, design, locale, rating }: { seriesSlug: string; design: CardDesign; locale: Locale; rating?: RatingRecord }) {
  return (
    <Link className="card-tile" href={`/series/${seriesSlug}/cards/${design.slug}`} aria-label={`${design.officialName} — ${localize(design.name, locale)}`}>
      <div className="card-image-frame">
        <Image src={`/${design.image.path}`} alt={localize(design.image.alt, locale)} width={520} height={720} />
        {design.serial && <span className="serial-badge">{design.serial}</span>}
      </div>
      <div className="card-tile-copy">
        <span className="card-category">{design.group === "base" ? translate("base", locale) : translate("insert", locale)}</span>
        <h3>{localize(design.name, locale)}</h3>
        <p>{design.officialName}</p>
        <span className={rating ? "rating-chip rated" : "rating-chip"}>{rating ? `${translate("myRating", locale)} ${rating.score.toFixed(1)}` : translate("notRated", locale)}</span>
      </div>
    </Link>
  );
}
