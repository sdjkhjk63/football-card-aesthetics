import Image from "next/image";
import Link from "next/link";
import type { CardSeries, Locale } from "@/domain/catalogue";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";

export function ProductHero({ series, locale }: { series: CardSeries; locale: Locale }) {
  return (
    <section className="product-hero">
      <div className="product-visual">
        <span className="eyebrow">{series.manufacturer} · {series.season}</span>
        <Image src={`/${series.packaging.path}`} alt={localize(series.packaging.alt, locale)} width={1000} height={1000} priority />
      </div>
      <div className="product-copy">
        <span className="kicker">CURATED RELEASE · 001</span>
        <h1>{localize(series.name, locale)}</h1>
        <p>{translate("explore", locale)}</p>
        <div className="product-stats">
          <strong>{series.cardDesigns.length}</strong>
          <span>{translate("designs", locale)}</span>
        </div>
        <Link className="primary-button" aria-label={translate("enterSeries", locale)} href={`/series/${series.slug}`}>{translate("enterSeries", locale)} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
