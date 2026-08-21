import { notFound } from "next/navigation";
import { CardDetailView } from "@/components/CardDetailView";
import { getCardDesign, getCatalogue, getSeries } from "@/data/catalogue";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getCatalogue().flatMap((series) =>
    series.cardDesigns.map((design) => ({
      seriesSlug: series.slug,
      cardSlug: design.slug,
    })),
  );
}

export default async function CardPage({ params }: { params: Promise<{ seriesSlug: string; cardSlug: string }> }) {
  const { seriesSlug, cardSlug } = await params;
  const series = getSeries(seriesSlug);
  const design = getCardDesign(cardSlug, seriesSlug);
  if (!series || !design) notFound();
  return <CardDetailView series={series} design={design} />;
}
