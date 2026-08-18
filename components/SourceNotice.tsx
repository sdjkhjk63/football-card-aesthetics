import type { ImageSource, Locale } from "@/domain/catalogue";
import { translate } from "@/data/messages";

export function SourceNotice({ source, locale }: { source: ImageSource; locale: Locale }) {
  return <p className="source-notice"><span>{translate("source", locale)}</span><a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.platform} ↗</a><small>{translate(source.authorization === "official" ? "official" : "researchOnly", locale)}</small></p>;
}
