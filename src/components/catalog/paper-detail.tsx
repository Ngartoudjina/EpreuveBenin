import { type Crumb } from "@/components/catalog/breadcrumb";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { DocumentCard } from "@/components/catalog/document-card";
import { JsonLd } from "@/components/seo/json-ld";
import type { PaperWithRelations } from "@/db/queries";
import { breadcrumbJsonLd, paperJsonLd } from "@/lib/seo";
import { getStorage } from "@/lib/storage";

/** Fiche épreuve (F-05) : métadonnées + documents (aperçu + téléchargement). */
export function PaperDetail({
  paper,
  crumbs,
}: {
  paper: PaperWithRelations;
  crumbs: Crumb[];
}) {
  const hasCorrige = paper.documents.some((d) => d.type === "corrige");
  const path =
    paper.exam.code === "bac" && paper.series
      ? `/bac/${paper.series.slug}/${paper.subject.slug}/${paper.session.year}`
      : `/bepc/${paper.subject.slug}/${paper.session.year}`;

  const meta: { label: string; value: string }[] = [
    { label: "Examen", value: paper.exam.label },
    ...(paper.series ? [{ label: "Série", value: paper.series.label }] : []),
    { label: "Matière", value: paper.subject.label },
    {
      label: "Session",
      value: `${paper.session.year}${
        paper.session.type === "remplacement" ? " (remplacement)" : ""
      }`,
    },
  ];

  return (
    <CatalogShell crumbs={crumbs} title={paper.title}>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          paperJsonLd({
            title: paper.title,
            description: `Télécharger gratuitement : ${paper.title} (sujet${
              hasCorrige ? " et corrigé" : ""
            }).`,
            path,
            hasCorrige,
            year: paper.session.year,
            subject: paper.subject.label,
            examLabel: paper.exam.label,
          }),
        ]}
      />
      <div data-reveal className="rounded-2xl border border-border bg-surface p-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                {m.label}
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 data-reveal className="mt-10 text-lg font-semibold text-foreground">
        Documents
      </h2>
      <ul className="mt-4 space-y-3">
        {paper.documents.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-surface p-6 text-muted">
            Aucun document disponible pour le moment.
          </li>
        )}
        {paper.documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            type={doc.type}
            url={getStorage().deliveryUrl({ key: doc.storageKey, url: doc.url })}
            fileSizeBytes={doc.fileSizeBytes}
            pageCount={doc.pageCount}
          />
        ))}
      </ul>
    </CatalogShell>
  );
}
