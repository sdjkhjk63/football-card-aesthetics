import { notFound } from "next/navigation";
import { SeriesCatalogue } from "@/components/SeriesCatalogue";
import { getCatalogue, getSeries } from "@/data/catalogue";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getCatalogue().map((series) => ({ seriesSlug: series.slug }));
}

export default async function SeriesPage({ params }: { params: Promise<{ seriesSlug: string }> }) {
  const { seriesSlug } = await params;
  const series = getSeries(seriesSlug);
  if (!series) notFound();
  return <SeriesCatalogue series={series} />;
}
