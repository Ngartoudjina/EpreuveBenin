import type { Metadata } from "next";

import { getAllExams, getAllSeries, getAllSubjects } from "@/db/queries";

import { PaperForm } from "./paper-form";

export const metadata: Metadata = {
  title: "Nouvelle épreuve — Administration",
  robots: { index: false, follow: false },
};

export default async function NouvelleEpreuvePage() {
  const [exams, series, subjects] = await Promise.all([
    getAllExams(),
    getAllSeries(),
    getAllSubjects(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Nouvelle épreuve
      </h1>
      <p className="mt-1 text-muted">
        Renseignez les informations puis téléversez le sujet (et le corrigé).
      </p>
      <div className="mt-8">
        <PaperForm exams={exams} series={series} subjects={subjects} />
      </div>
    </div>
  );
}
