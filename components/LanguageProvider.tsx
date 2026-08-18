"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/domain/catalogue";
import { resolveLocale } from "@/domain/i18n";
import { translate, type MessageKey } from "@/data/messages";

const STORAGE_KEY = "card-aesthetics-locale";

type LanguageContextValue = {
  locale: Locale;
  ready: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("zh-CN");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      updateLocale(resolveLocale(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      updateLocale("zh-CN");
    }
    setReady(true);
  }, []);

  const setLocale = (next: Locale) => {
    updateLocale(next);
    document.documentElement.lang = next;
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* session state still works */ }
  };

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    ready,
    setLocale,
    t: (key) => translate(key, locale),
  }), [locale, ready]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
