"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/domain/catalogue";

const languages: Array<{ locale: Locale; label: string; short: string }> = [
  { locale: "zh-CN", label: "中文", short: "ZH" },
  { locale: "en", label: "English", short: "EN" },
  { locale: "es", label: "Español", short: "ES" },
];

export function AppHeader() {
  const { locale, ready, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = languages.find((language) => language.locale === locale) ?? languages[0];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [open]);

  const chooseLanguage = (next: Locale) => {
    setLocale(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="app-header">
      <Link className="brand" href="/" aria-label={t("brand")}>
        <span className="brand-mark">CA</span><span>{t("brand")}</span>
      </Link>
      <nav aria-label={t("catalogue")}>
        <Link href="/">{t("catalogue")}</Link>
        <Link href="/methodology">{t("methodology")}</Link>
      </nav>
      <div className="language-control" ref={controlRef}>
        <button
          ref={triggerRef}
          className="language-trigger"
          type="button"
          disabled={!ready}
          aria-label={t("language")}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="language-code" aria-hidden="true">{current.short}</span>
          <span>{current.label}</span>
          <span className="language-chevron" aria-hidden="true">⌄</span>
        </button>
        {open && (
          <div className="language-menu" role="menu" aria-label={t("language")}>
            <span className="language-menu-kicker" aria-hidden="true">LANGUAGE</span>
            {languages.map((language) => (
              <button
                key={language.locale}
                type="button"
                role="menuitemradio"
                aria-checked={locale === language.locale}
                onClick={() => chooseLanguage(language.locale)}
              >
                <span className="language-option-code" aria-hidden="true">{language.short}</span>
                <span>{language.label}</span>
                <span className="language-check" aria-hidden="true">{locale === language.locale ? "✓" : ""}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
