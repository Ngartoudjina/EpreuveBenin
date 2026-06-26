import type { Metadata } from "next";
import Link from "next/link";

import { listAuditLogs } from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal d'activité — Administration",
  robots: { index: false, follow: false },
};

const PER_PAGE = 30;

const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const ACTION: Record<string, { label: string; cls: string }> = {
  create: { label: "Création", cls: "bg-brand-50 text-brand-700" },
  update: { label: "Modification", cls: "bg-surface text-foreground" },
  delete: { label: "Suppression", cls: "bg-danger/10 text-danger" },
  import: { label: "Import", cls: "bg-brand-50 text-brand-700" },
  login: { label: "Connexion", cls: "bg-surface text-muted" },
};

function pageHref(page: number): string {
  return page > 1 ? `/admin/journal?page=${page}` : "/admin/journal";
}

export default async function JournalPage({
  searchParams,
}: PageProps<"/admin/journal">) {
  const sp = await searchParams;
  const pageParam = Number.parseInt(
    typeof sp.page === "string" ? sp.page : "1",
    10,
  );
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { rows, total, pages } = await listAuditLogs({ page, perPage: PER_PAGE });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Journal d&apos;activité{" "}
          <span className="text-muted">({formatNumber(total)})</span>
        </h1>
        <p className="mt-1 text-muted">
          Historique des actions effectuées dans le back-office.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted">Aucune action enregistrée pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Acteur</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Objet</th>
                <th className="px-4 py-3 font-medium">Détail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const a = ACTION[r.action] ?? {
                  label: r.action,
                  cls: "bg-surface text-muted",
                };
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {dateTimeFmt.format(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-muted">{r.actorEmail}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.cls}`}
                      >
                        {a.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.targetType}</td>
                    <td className="px-4 py-3 text-muted">
                      {r.targetLabel ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {page} sur {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground transition-colors hover:bg-surface"
              >
                ← Précédent
              </Link>
            ) : (
              <span className="rounded-lg border border-border px-3 py-2 text-muted opacity-50">
                ← Précédent
              </span>
            )}
            {page < pages ? (
              <Link
                href={pageHref(page + 1)}
                className="rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground transition-colors hover:bg-surface"
              >
                Suivant →
              </Link>
            ) : (
              <span className="rounded-lg border border-border px-3 py-2 text-muted opacity-50">
                Suivant →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
