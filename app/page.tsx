"use client";

import { ProductHero } from "@/components/ProductHero";
import { useLanguage } from "@/components/LanguageProvider";
import { merlinPremierLeague2026 } from "@/data/catalogue";

export default function HomePage() {
  const { locale } = useLanguage();
  return <main><ProductHero series={merlinPremierLeague2026} locale={locale} /></main>;
}
