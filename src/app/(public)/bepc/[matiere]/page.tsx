import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogShell } from "@/components/catalog/catalog-shell";
import { TileGrid } from "@/components/catalog/tile-grid";
import {
  getExamByCode,
  getSubjectBySlug,
  listYearsWithPapers,
} from "@/db/queries";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/bepc/[matiere]">): Promise<Metadata> {
  const { matiere } = await params;
  const subject = await getSubjectBySlug(matiere);
  if (!subject) return {};
  return {
    title: `${subject.label} — BEPC`,
    description: `Annales de ${subject.label} (BEPC) au Bénin, par année.`,
  };
}

export default async function BepcYearsPage({
  params,
}: PageProps<"/bepc/[matiere]">) {
  const { matiere } = await params;
  const exam = await getExamByCode("bepc");
  if (!exam) notFound();

  const subject = await getSubjectBySlug(matiere);
  if (!subject) notFound();

  const years = await listYearsWithPapers(exam.id, subject.id, null);
  const tiles = years.map((y) => ({
    href: `/bepc/${matiere}/${y.year}`,
    title: String(y.year),
    subtitle:
      y.type === "remplacement" ? "Session de remplacement" : "Session normale",
  }));

  return (
    <CatalogShell
      crumbs={[
        { label: "Accueil", href: "/" },
        { label: "BEPC", href: "/bepc" },
        { label: subject.label },
      ]}
      title={`${subject.label} — BEPC`}
      intro="Choisissez une année."
    >
      <TileGrid tiles={tiles} />
    </CatalogShell>
  );
}
