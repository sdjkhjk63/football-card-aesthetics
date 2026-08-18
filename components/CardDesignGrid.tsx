"use client";

import { useMemo, useState } from "react";
import { CardDesignTile } from "@/components/CardDesignTile";
import type { CardDesign, CardGroup, Locale } from "@/domain/catalogue";
import type { RatingRecord } from "@/domain/ratings";
import { localize } from "@/domain/i18n";
import { translate } from "@/data/messages";

export function CardDesignGrid({ seriesSlug, designs, locale, ratings }: { seriesSlug: string; designs: CardDesign[]; locale: Locale; ratings: RatingRecord[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | CardGroup>("all");
  const shown = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    return designs.filter((design) =>
      (group === "all" || design.group === group) &&
      (!needle || `${design.officialName} ${localize(design.name, locale)}`.toLocaleLowerCase(locale).includes(needle)),
    );
  }, [designs, group, locale, query]);

  const ratingMap = new Map(ratings.map((rating) => [rating.cardSlug, rating]));
  return (
    <section className="catalogue-section">
      <div className="catalogue-toolbar">
        <label className="search-field">
          <span>{translate("search", locale)}</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translate("searchPlaceholder", locale)} />
        </label>
        <div className="filter-tabs" aria-label={translate("catalogue", locale)}>
          {(["all", "base", "insert"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={group === value} onClick={() => setGroup(value)}>{translate(value, locale)}</button>
          ))}
        </div>
      </div>
      <div className="result-count"><strong>{shown.length}</strong> / {designs.length}</div>
      {shown.length ? (
        <div className="card-grid">
          {shown.map((design) => <CardDesignTile key={design.slug} seriesSlug={seriesSlug} design={design} locale={locale} rating={ratingMap.get(design.slug)} />)}
        </div>
      ) : <div className="empty-state">{translate("noResults", locale)}</div>}
    </section>
  );
}
