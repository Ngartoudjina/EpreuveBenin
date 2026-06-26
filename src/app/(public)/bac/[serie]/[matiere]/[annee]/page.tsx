import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaperDetail } from "@/components/catalog/paper-detail";
import {
  getExamByCode,
  getPaper,
  getSeriesBySlug,
  getSubjectBySlug,
} from "@/db/queries";

export const revalidate = 3600;

/** Résout l'épreuve BAC à partir des segments d'URL (mémoïsé via les requêtes). */
async function resolve(serie: string, matiere: string, annee: string) {
  const year = Number(annee);
  if (!Number.isInteger(year)) return null;

  const exam = await getExamByCode("bac");
  if (!exam) return null;

  const [serieRow, subject] = await Promise.all([
    getSeriesBySlug(exam.id, serie),
    getSubjectBySlug(matiere),
  ]);
  if (!serieRow || !subject) return null;

  const paper = await getPaper(exam.id, subject.id, year, serieRow.id);
  return paper ? { paper, serieRow, subject } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/bac/[serie]/[matiere]/[annee]">): Promise<Metadata> {
  const { serie, matiere, annee } = await params;
  const data = await resolve(serie, matiere, annee);
  if (!data) return {};
  const description = `Télécharger gratuitement : ${data.paper.title} (sujet${
    data.paper.documents.some((d) => d.type === "corrige") ? " et corrigé" : ""
  }).`;
  return {
    title: data.paper.title,
    description,
    alternates: { canonical: `/bac/${serie}/${matiere}/${annee}` },
    openGraph: { title: data.paper.title, description, type: "article" },
  };
}

export default async function BacPaperPage({
  params,
}: PageProps<"/bac/[serie]/[matiere]/[annee]">) {
  const { serie, matiere, annee } = await params;
  const data = await resolve(serie, matiere, annee);
  if (!data) notFound();

  const { paper, serieRow, subject } = data;
  return (
    <PaperDetail
      paper={paper}
      crumbs={[
        { label: "Accueil", href: "/" },
        { label: "BAC", href: "/bac" },
        { label: `Série ${serieRow.code}`, href: `/bac/${serie}` },
        { label: subject.label, href: `/bac/${serie}/${matiere}` },
        { label: String(paper.session.year) },
      ]}
    />
  );
}
