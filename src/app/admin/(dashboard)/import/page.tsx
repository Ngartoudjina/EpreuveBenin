import type { Metadata } from "next";

import { getAllExams, getAllSeries, getAllSubjects } from "@/db/queries";

import { ImportForm } from "./import-form";

export const metadata: Metadata = {
  title: "Import en masse — Administration",
  robots: { index: false, follow: false },
};

export default async function AdminImportPage() {
  const [exams, series, subjects] = await Promise.all([
    getAllExams(),
    getAllSeries(),
    getAllSubjects(),
  ]);

  const seriesByExam = exams.map((e) => ({
    label: e.label,
    codes: series.filter((s) => s.examId === e.id).map((s) => s.code),
  }));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Import en masse
        </h1>
        <p className="mt-1 text-muted">
          Créez plusieurs épreuves d&apos;un coup à partir d&apos;un fichier CSV.
          Les épreuves sont créées sans documents ; téléversez ensuite les PDF
          depuis la page de gestion de chaque épreuve.
        </p>
      </div>

      {/* Guide de format */}
      <section className="rounded-2xl border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Format attendu
        </h2>
        <p className="mt-2 text-sm text-muted">
          Une ligne d&apos;en-tête puis une ligne par épreuve. Séparateur «&nbsp;,&nbsp;»
          ou «&nbsp;;&nbsp;». Colonnes :
        </p>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>
            <code className="text-foreground">examen</code> — bepc ou bac (requis)
          </li>
          <li>
            <code className="text-foreground">serie</code> — code de série, requis
            pour le BAC, vide pour le BEPC
          </li>
          <li>
            <code className="text-foreground">matiere</code> — libellé ou code de
            la matière (requis)
          </li>
          <li>
            <code className="text-foreground">annee</code> — année à 4 chiffres
            (requis)
          </li>
          <li>
            <code className="text-foreground">type</code> — normale ou
            remplacement (optionnel, défaut : normale)
          </li>
        </ul>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-surface p-3 text-xs text-foreground">
{`examen;serie;matiere;annee;type
bac;D;Mathématiques;2024;normale
bac;C;Physique-Chimie et Technologie;2023;
bepc;;Anglais;2023;normale`}
        </pre>
      </section>

      {/* Aide : valeurs valides */}
      <section className="rounded-2xl border border-border bg-background p-5 text-sm">
        <h2 className="font-semibold text-foreground">Valeurs disponibles</h2>
        <div className="mt-3 space-y-2 text-muted">
          {seriesByExam.map((e) => (
            <p key={e.label}>
              <span className="font-medium text-foreground">{e.label}</span> —{" "}
              {e.codes.length > 0 ? `séries : ${e.codes.join(", ")}` : "sans série"}
            </p>
          ))}
          <p>
            <span className="font-medium text-foreground">Matières</span> :{" "}
            {subjects.map((s) => s.label).join(", ")}
          </p>
        </div>
        <p className="mt-3 text-xs text-muted">
          Une série ou une matière absente doit d&apos;abord être ajoutée dans{" "}
          <span className="font-medium">Référentiels</span>.
        </p>
      </section>

      {/* Formulaire + rapport */}
      <ImportForm />
    </div>
  );
}
