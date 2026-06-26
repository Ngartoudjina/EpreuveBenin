import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogShell } from "@/components/catalog/catalog-shell";
import { TileGrid } from "@/components/catalog/tile-grid";
import {
  getExamByCode,
  getSeriesBySlug,
  getSubjectBySlug,
  listYearsWithPapers,
} from "@/db/queries";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/bac/[serie]/[matiere]">): Promise<Metadata> {
  const { serie, matiere } = await params;
  const exam = await getExamByCode("bac");
  const serieRow = exam ? await getSeriesBySlug(exam.id, serie) : undefined;
  const subject = await getSubjectBySlug(matiere);
  if (!serieRow || !subject) return {};
  return {
    title: `${subject.label} — BAC ${serieRow.code}`,
    description: `Annales de ${subject.label} (BAC ${serieRow.code}) au Bénin, par année.`,
  };
}

export default async function BacYearsPage({
  params,
}: PageProps<"/bac/[serie]/[matiere]">) {
  const { serie, matiere } = await params;
  const exam = await getExamByCode("bac");
  if (!exam) notFound();

  const serieRow = await getSeriesBySlug(exam.id, serie);
  const subject = await getSubjectBySlug(matiere);
  if (!serieRow || !subject) notFound();

  const years = await listYearsWithPapers(exam.id, subject.id, serieRow.id);
  const tiles = years.map((y) => ({
    href: `/bac/${serie}/${matiere}/${y.year}`,
    title: String(y.year),
    subtitle: y.type === "remplacement" ? "Session de remplacement" : "Session normale",
  }));

  return (
    <CatalogShell
      crumbs={[
        { label: "Accueil", href: "/" },
        { label: "BAC", href: "/bac" },
        { label: `Série ${serieRow.code}`, href: `/bac/${serie}` },
        { label: subject.label },
      ]}
      title={`${subject.label} — BAC ${serieRow.code}`}
      intro="Choisissez une année."
    >
      <TileGrid tiles={tiles} />
    </CatalogShell>
  );
}
