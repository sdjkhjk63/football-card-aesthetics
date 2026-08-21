"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductHero } from "@/components/ProductHero";
import { useLanguage } from "@/components/LanguageProvider";
import { getCatalogue, merlinPremierLeague2026 } from "@/data/catalogue";
import { localize } from "@/domain/i18n";

export default function HomePage() {
  const { locale } = useLanguage();
  const series = getCatalogue();
  const [activeSeries, setActiveSeries] = useState(merlinPremierLeague2026);
  const activeReleaseNumber = series.findIndex((item) => item.slug === activeSeries.slug) + 1;

  return (
    <main>
      <ProductHero series={activeSeries} locale={locale} releaseNumber={activeReleaseNumber} />
      <section className="series-rail" aria-label="Series">
        {series.map((item) => (
          <Link
            key={item.slug}
            className={`series-link${item.slug === activeSeries.slug ? " is-active" : ""}`}
            href={`/series/${item.slug}`}
            aria-current={item.slug === activeSeries.slug ? "true" : undefined}
            onMouseEnter={() => setActiveSeries(item)}
            onFocus={() => setActiveSeries(item)}
          >
            <Image src={`/${item.packaging.path}`} alt={localize(item.packaging.alt, locale)} width={220} height={220} />
            <span>
              <small>{item.manufacturer} · {item.season}</small>
              <strong>{localize(item.name, locale)}</strong>
              <em>{item.cardDesigns.length}</em>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
