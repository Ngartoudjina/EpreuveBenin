import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaperDetail } from "@/components/catalog/paper-detail";
import { getExamByCode, getPaper, getSubjectBySlug } from "@/db/queries";

export const revalidate = 3600;

/** Résout l'épreuve BEPC à partir des segments d'URL (sans série). */
async function resolve(matiere: string, annee: string) {
  const year = Number(annee);
  if (!Number.isInteger(year)) return null;

  const exam = await getExamByCode("bepc");
  if (!exam) return null;

  const subject = await getSubjectBySlug(matiere);
  if (!subject) return null;

  const paper = await getPaper(exam.id, subject.id, year, null);
  return paper ? { paper, subject } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/bepc/[matiere]/[annee]">): Promise<Metadata> {
  const { matiere, annee } = await params;
  const data = await resolve(matiere, annee);
  if (!data) return {};
  const description = `Télécharger gratuitement : ${data.paper.title} (sujet${
    data.paper.documents.some((d) => d.type === "corrige") ? " et corrigé" : ""
  }).`;
  return {
    title: data.paper.title,
    description,
    alternates: { canonical: `/bepc/${matiere}/${annee}` },
    openGraph: { title: data.paper.title, description, type: "article" },
  };
}

export default async function BepcPaperPage({
  params,
}: PageProps<"/bepc/[matiere]/[annee]">) {
  const { matiere, annee } = await params;
  const data = await resolve(matiere, annee);
  if (!data) notFound();

  const { paper, subject } = data;
  return (
    <PaperDetail
      paper={paper}
      crumbs={[
        { label: "Accueil", href: "/" },
        { label: "BEPC", href: "/bepc" },
        { label: subject.label, href: `/bepc/${matiere}` },
        { label: String(paper.session.year) },
      ]}
    />
  );
}
