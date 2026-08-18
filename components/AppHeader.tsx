"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/domain/catalogue";

export function AppHeader() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <header className="app-header">
      <Link className="brand" href="/" aria-label={t("brand")}>
        <span className="brand-mark">CA</span><span>{t("brand")}</span>
      </Link>
      <nav aria-label={t("catalogue")}>
        <Link href="/">{t("catalogue")}</Link>
        <Link href="/methodology">{t("methodology")}</Link>
      </nav>
      <label className="language-control">
        <span className="sr-only">{t("language")}</span>
        <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={t("language")}>
          <option value="zh-CN">中文</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </label>
    </header>
  );
}
