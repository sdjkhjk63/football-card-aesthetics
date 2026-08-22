import Image from "next/image";
import Link from "next/link";
import type { CardSeries, Locale } from "@/domain/catalogue";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";
import { publicAssetPath } from "@/lib/publicAssetPath";

export function ProductHero({ series, locale, releaseNumber = 1 }: { series: CardSeries; locale: Locale; releaseNumber?: number }) {
  const designLabel = series.totalVariants
    ? {
      "zh-CN": `种展示卡面 · 完整收录 ${series.totalVariants} 个版本`,
      en: `display cards · ${series.totalVariants} complete variants`,
      es: `cartas mostradas · ${series.totalVariants} variantes completas`,
    }[locale]
    : translate("designs", locale);
  return (
    <section className="product-hero">
      <div className="product-visual">
        <span className="eyebrow">{series.manufacturer} · {series.season}</span>
        <Image src={publicAssetPath(series.packaging.path)} alt={localize(series.packaging.alt, locale)} width={1000} height={1000} priority />
      </div>
      <div className="product-copy">
        <span className="kicker">CURATED RELEASE · {String(releaseNumber).padStart(3, "0")}</span>
        <h1>{localize(series.name, locale)}</h1>
        <p>{translate("explore", locale)}</p>
        <div className="product-stats">
          <strong>{series.cardDesigns.length}</strong>
          <span>{designLabel}</span>
        </div>
        <Link className="primary-button" aria-label={translate("enterSeries", locale)} href={`/series/${series.slug}`}>{translate("enterSeries", locale)} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
