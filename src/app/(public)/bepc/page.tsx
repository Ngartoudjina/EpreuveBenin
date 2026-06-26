import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogShell } from "@/components/catalog/catalog-shell";
import { TileGrid } from "@/components/catalog/tile-grid";
import { getExamByCode, listSubjectsWithPapers } from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "BEPC — Matières",
  description:
    "Annales du BEPC au Bénin. Choisissez une matière pour accéder aux sujets et corrigés par année.",
  alternates: { canonical: "/bepc" },
};

export default async function BepcSubjectsPage() {
  const exam = await getExamByCode("bepc");
  if (!exam) notFound();

  // Le BEPC n'a pas de série : on passe `null`.
  const subjectsList = await listSubjectsWithPapers(exam.id, null);
  const tiles = subjectsList.map((s) => ({
    href: `/bepc/${s.slug}`,
    title: s.label,
    subtitle: `${formatNumber(s.papers)} épreuve${s.papers > 1 ? "s" : ""}`,
  }));

  return (
    <CatalogShell
      crumbs={[{ label: "Accueil", href: "/" }, { label: "BEPC" }]}
      title="BEPC"
      intro="Choisissez une matière pour accéder aux épreuves par année."
    >
      <TileGrid tiles={tiles} />
    </CatalogShell>
  );
}
