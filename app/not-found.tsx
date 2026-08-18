"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();
  return <main className="empty-page"><span>404</span><h1>{t("missing")}</h1><Link className="primary-button" href="/">{t("home")}</Link></main>;
}
