"use client";

import { useActionState } from "react";

import { importAction, type ImportState } from "./actions";

const FIELD =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";

const STATUS = {
  created: { dot: "bg-brand-600", text: "text-foreground" },
  skipped: { dot: "bg-muted", text: "text-muted" },
  error: { dot: "bg-danger", text: "text-danger" },
} as const;

export function ImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(
    importAction,
    undefined,
  );
  const report = state?.report;

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="csv-file" className="text-sm font-medium text-foreground">
            Fichier CSV
          </label>
          <input
            id="csv-file"
            name="file"
            type="file"
            accept=".csv,text/csv"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="csv-text" className="text-sm font-medium text-foreground">
            …ou coller le contenu
          </label>
          <textarea
            id="csv-text"
            name="csv"
            rows={6}
            spellCheck={false}
            placeholder={"examen;serie;matiere;annee;type\nbac;D;Mathématiques;2024;normale\nbepc;;Anglais;2023;normale"}
            className={`${FIELD} font-mono`}
          />
          <p className="mt-1 text-xs text-muted">
            Si un fichier et du texte sont fournis, le texte collé est prioritaire.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="dryRun"
            value="on"
            disabled={pending}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface disabled:opacity-60"
          >
            {pending ? "…" : "Analyser (sans enregistrer)"}
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Import…" : "Importer"}
          </button>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}
      </form>

      {report && (
        <div>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <span className="font-semibold text-foreground">
              {report.dryRun ? "Analyse" : "Import terminé"} —
            </span>
            <span className="text-foreground">
              {report.total} ligne{report.total > 1 ? "s" : ""}
            </span>
            <span className="text-brand-700">
              {report.created} {report.dryRun ? "à créer" : "créée(s)"}
            </span>
            <span className="text-muted">{report.skipped} ignorée(s)</span>
            <span className={report.errors > 0 ? "text-danger" : "text-muted"}>
              {report.errors} erreur(s)
            </span>
          </div>

          {report.rows.length > 0 && (
            <div className="mt-3 max-h-96 overflow-auto rounded-xl border border-border bg-background">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border text-left text-muted">
                    <th className="px-4 py-2 font-medium">Ligne</th>
                    <th className="px-4 py-2 font-medium">Statut</th>
                    <th className="px-4 py-2 font-medium">Détail</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row, i) => (
                    <tr
                      key={`${row.line}-${i}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-2 text-muted">{row.line}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${STATUS[row.status].dot}`}
                          />
                          <span className={STATUS[row.status].text}>
                            {row.status === "created"
                              ? report.dryRun
                                ? "À créer"
                                : "Créée"
                              : row.status === "skipped"
                                ? "Ignorée"
                                : "Erreur"}
                          </span>
                        </span>
                      </td>
                      <td className={`px-4 py-2 ${STATUS[row.status].text}`}>
                        {row.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.dryRun && report.created > 0 && report.errors === 0 && (
            <p className="mt-3 text-sm text-muted">
              Analyse sans erreur. Cliquez sur « Importer » pour enregistrer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
