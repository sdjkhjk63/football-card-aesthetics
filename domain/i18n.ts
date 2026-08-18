import { locales, type Locale, type LocalizedText } from "@/domain/catalogue";

export const SUPPORTED_LOCALES = locales;

export function resolveLocale(value: unknown): Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : "zh-CN";
}

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale]?.trim() || text.en?.trim() || text["zh-CN"]?.trim() || "";
}
