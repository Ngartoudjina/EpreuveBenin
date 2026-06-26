import type { Metadata } from "next";
import Link from "next/link";

import { listPapersForAdmin } from "@/db/queries";

import { deletePaperAction } from "./actions";

export const metadata: Metadata = {
  title: "Épreuves — Administration",
  robots: { index: false, follow: false },
};

export default async function AdminEpreuvesPage() {
  const papers = await listPapersForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Épreuves <span className="text-muted">({papers.length})</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/import"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            Import en masse
          </Link>
          <Link
            href="/admin/epreuves/nouvelle"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            + Nouvelle épreuve
          </Link>
        </div>
      </div>

      {papers.length === 0 ? (
        <p className="mt-8 text-muted">Aucune épreuve pour le moment.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Examen</th>
                <th className="px-4 py-3 font-medium">Matière</th>
                <th className="px-4 py-3 font-medium">Année</th>
                <th className="px-4 py-3 font-medium">Documents</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {papers.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.examLabel}
                    {p.seriesCode ? ` ${p.seriesCode}` : ""}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.subjectLabel}</td>
                  <td className="px-4 py-3 text-muted">
                    {p.year}
                    {p.type === "remplacement" ? " (rempl.)" : ""}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.hasSujet ? "Sujet" : "—"}
                    {p.hasCorrige ? " + Corrigé" : ""}
                    {!p.hasCorrige && (
                      <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        à compléter
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/epreuves/${p.id}`}
                        className="rounded-md px-3 py-1.5 font-medium text-brand-700 transition-colors hover:bg-surface"
                      >
                        Gérer
                      </Link>
                      <form action={deletePaperAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-md px-3 py-1.5 font-medium text-danger transition-colors hover:bg-surface"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
