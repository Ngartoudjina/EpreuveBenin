import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogShell } from "@/components/catalog/catalog-shell";
import { TileGrid } from "@/components/catalog/tile-grid";
import {
  getExamByCode,
  getSeriesBySlug,
  listSubjectsWithPapers,
} from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/bac/[serie]">): Promise<Metadata> {
  const { serie } = await params;
  const exam = await getExamByCode("bac");
  const serieRow = exam ? await getSeriesBySlug(exam.id, serie) : undefined;
  if (!serieRow) return {};
  return {
    title: `BAC ${serieRow.code} — Matières`,
    description: `Sujets et corrigés du BAC ${serieRow.code} au Bénin, classés par matière et par année.`,
  };
}

export default async function BacSubjectsPage({
  params,
}: PageProps<"/bac/[serie]">) {
  const { serie } = await params;
  const exam = await getExamByCode("bac");
  if (!exam) notFound();

  const serieRow = await getSeriesBySlug(exam.id, serie);
  if (!serieRow) notFound();

  const subjectsList = await listSubjectsWithPapers(exam.id, serieRow.id);
  const tiles = subjectsList.map((s) => ({
    href: `/bac/${serie}/${s.slug}`,
    title: s.label,
    subtitle: `${formatNumber(s.papers)} épreuve${s.papers > 1 ? "s" : ""}`,
  }));

  return (
    <CatalogShell
      crumbs={[
        { label: "Accueil", href: "/" },
        { label: "BAC", href: "/bac" },
        { label: `Série ${serieRow.code}` },
      ]}
      title={serieRow.label}
      intro="Choisissez une matière."
    >
      <TileGrid tiles={tiles} />
    </CatalogShell>
  );
}
