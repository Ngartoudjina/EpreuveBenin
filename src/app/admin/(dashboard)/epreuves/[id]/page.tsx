import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPaperForAdmin } from "@/db/queries";
import { formatFileSize, formatNumber } from "@/lib/format";

import { AddDocumentForm, DeleteDocumentButton } from "./documents";

export const metadata: Metadata = {
  title: "Gérer l'épreuve — Administration",
  robots: { index: false, follow: false },
};

const DOC_LABEL = { sujet: "Sujet", corrige: "Corrigé" } as const;

export default async function AdminPaperPage({
  params,
}: PageProps<"/admin/epreuves/[id]">) {
  const { id } = await params;
  const paper = await getPaperForAdmin(id);
  if (!paper) notFound();

  const present = new Set(paper.documents.map((d) => d.type));
  const missingTypes = (["sujet", "corrige"] as const).filter(
    (t) => !present.has(t),
  );

  const meta: [string, string][] = [
    [
      "Examen",
      paper.exam.label + (paper.series ? ` ${paper.series.code}` : ""),
    ],
    ["Matière", paper.subject.label],
    [
      "Session",
      `${paper.session.year}${paper.session.type === "remplacement" ? " (remplacement)" : ""}`,
    ],
    ["Slug", paper.slug],
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/epreuves"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Retour aux épreuves
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          {paper.title}
        </h1>
      </div>

      {/* Métadonnées (clé naturelle, non modifiable) */}
      <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border text-sm sm:grid-cols-2 lg:grid-cols-4">
        {meta.map(([k, v]) => (
          <div key={k} className="bg-background px-4 py-3">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-0.5 font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Documents */}
      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Documents <span className="text-muted">({paper.documents.length})</span>
        </h2>

        {paper.documents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Aucun document. Ajoutez au moins le sujet ci-dessous.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Taille</th>
                  <th className="px-4 py-3 font-medium">Pages</th>
                  <th className="px-4 py-3 font-medium">Téléchargements</th>
                  <th className="px-4 py-3 font-medium">Aperçu</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paper.documents.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {DOC_LABEL[d.type]}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatFileSize(d.fileSizeBytes)}
                    </td>
                    <td className="px-4 py-3 text-muted">{d.pageCount ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatNumber(d.downloadCount)}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-700 hover:text-brand-800"
                      >
                        Ouvrir
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <DeleteDocumentButton id={d.id} paperId={paper.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {missingTypes.length > 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="mb-3 text-sm font-medium text-foreground">
              Ajouter un document
            </p>
            <AddDocumentForm paperId={paper.id} types={[...missingTypes]} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Sujet et corrigé sont présents. Supprimez un document pour le
            remplacer.
          </p>
        )}
      </section>
    </div>
  );
}
