import { notFound } from "next/navigation";
import { SeriesCatalogue } from "@/components/SeriesCatalogue";
import { getSeries } from "@/data/catalogue";

export default async function SeriesPage({ params }: { params: Promise<{ seriesSlug: string }> }) {
  const { seriesSlug } = await params;
  const series = getSeries(seriesSlug);
  if (!series) notFound();
  return <SeriesCatalogue series={series} />;
}
