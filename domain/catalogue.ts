export const locales = ["zh-CN", "en", "es"] as const;

export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type CardGroup = "base" | "insert";
export type CardSection =
  | "base-unnumbered"
  | "base-numbered"
  | "regular-insert"
  | "rare-insert";

export interface ImageSource {
  path: string;
  platform: "Topps" | "CardHobby" | "eBay";
  sourceUrl: string;
  authorization: "official" | "research-only" | "licensed";
  alt: LocalizedText;
}

export interface CardDesign {
  slug: string;
  officialName: string;
  name: LocalizedText;
  group: CardGroup;
  section: CardSection;
  serial: string | null;
  image: ImageSource;
}

export interface CardSeries {
  slug: string;
  manufacturer: "Topps" | "Panini";
  season: string;
  name: LocalizedText;
  packaging: ImageSource;
  cardDesigns: CardDesign[];
}

export function validateSeries(series: CardSeries): string[] {
  const errors: string[] = [];
  const cardSlugs = new Set<string>();
  const imagePaths = new Set([series.packaging.path]);

  for (const locale of locales) {
    if (!series.name[locale]?.trim()) errors.push(`Missing series name: ${locale}`);
    if (!series.packaging.alt[locale]?.trim()) {
      errors.push(`Missing packaging alt: ${locale}`);
    }
  }

  for (const card of series.cardDesigns) {
    if (cardSlugs.has(card.slug)) errors.push(`Duplicate card slug: ${card.slug}`);
    cardSlugs.add(card.slug);

    if (imagePaths.has(card.image.path)) {
      errors.push(`Duplicate image path: ${card.image.path}`);
    }
    imagePaths.add(card.image.path);

    if (!card.image.sourceUrl.startsWith("https://")) {
      errors.push(`Invalid source URL: ${card.slug}`);
    }
    for (const locale of locales) {
      if (!card.name[locale]?.trim()) errors.push(`Missing ${locale} name: ${card.slug}`);
      if (!card.image.alt[locale]?.trim()) errors.push(`Missing ${locale} alt: ${card.slug}`);
    }
  }

  return errors;
}
