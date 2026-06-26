import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogShell } from "@/components/catalog/catalog-shell";
import { TileGrid } from "@/components/catalog/tile-grid";
import { getExamByCode, listSeriesWithPapers } from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "BAC — Séries",
  description:
    "Annales du Baccalauréat au Bénin. Choisissez votre série (A1, A2, B, C, D, E) pour accéder aux sujets et corrigés.",
  alternates: { canonical: "/bac" },
};

export default async function BacSeriesPage() {
  const exam = await getExamByCode("bac");
  if (!exam) notFound();

  const seriesList = await listSeriesWithPapers(exam.id);
  const tiles = seriesList.map((s) => ({
    href: `/bac/${s.slug}`,
    title: s.label,
    subtitle: `${formatNumber(s.papers)} épreuve${s.papers > 1 ? "s" : ""}`,
  }));

  return (
    <CatalogShell
      crumbs={[{ label: "Accueil", href: "/" }, { label: "BAC" }]}
      title="Baccalauréat (BAC)"
      intro="Choisissez votre série pour accéder aux épreuves par matière et par année."
    >
      <TileGrid tiles={tiles} />
    </CatalogShell>
  );
}
