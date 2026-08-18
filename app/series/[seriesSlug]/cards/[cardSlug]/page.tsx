import { notFound } from "next/navigation";
import { CardDetailView } from "@/components/CardDetailView";
import { getCardDesign, getSeries } from "@/data/catalogue";

export default async function CardPage({ params }: { params: Promise<{ seriesSlug: string; cardSlug: string }> }) {
  const { seriesSlug, cardSlug } = await params;
  const series = getSeries(seriesSlug);
  const design = getCardDesign(cardSlug);
  if (!series || !design || !series.cardDesigns.some((card) => card.slug === cardSlug)) notFound();
  return <CardDetailView series={series} design={design} />;
}
