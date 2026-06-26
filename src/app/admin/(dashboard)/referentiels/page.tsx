import type { Metadata } from "next";

import {
  getAllExams,
  listSeriesAdmin,
  listSessionsAdmin,
  listSubjectsAdmin,
} from "@/db/queries";

import {
  deleteSeriesAction,
  deleteSessionAction,
  deleteSubjectAction,
} from "./actions";
import { DeleteButton, SeriesForm, SessionForm, SubjectForm } from "./forms";

export const metadata: Metadata = {
  title: "Référentiels — Administration",
  robots: { index: false, follow: false },
};

export default async function ReferentielsPage() {
  const [subjects, series, sessions, exams] = await Promise.all([
    listSubjectsAdmin(),
    listSeriesAdmin(),
    listSessionsAdmin(),
    getAllExams(),
  ]);

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Référentiels
      </h1>

      {/* Matières */}
      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Matières <span className="text-muted">({subjects.length})</span>
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <SubjectForm />
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Matière</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Épreuves</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.label}
                  </td>
                  <td className="px-4 py-3 text-muted">{s.code}</td>
                  <td className="px-4 py-3 text-muted">{s.papers}</td>
                  <td className="px-4 py-3">
                    <DeleteButton id={s.id} action={deleteSubjectAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Séries */}
      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Séries <span className="text-muted">({series.length})</span>
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <SeriesForm exams={exams} />
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Série</th>
                <th className="px-4 py-3 font-medium">Examen</th>
                <th className="px-4 py-3 font-medium">Épreuves</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.label}
                  </td>
                  <td className="px-4 py-3 text-muted">{s.examLabel}</td>
                  <td className="px-4 py-3 text-muted">{s.papers}</td>
                  <td className="px-4 py-3">
                    <DeleteButton id={s.id} action={deleteSeriesAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sessions */}
      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Sessions <span className="text-muted">({sessions.length})</span>
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <SessionForm />
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Année</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Épreuves</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.year}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {s.type === "remplacement" ? "Remplacement" : "Normale"}
                  </td>
                  <td className="px-4 py-3 text-muted">{s.papers}</td>
                  <td className="px-4 py-3">
                    <DeleteButton id={s.id} action={deleteSessionAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
