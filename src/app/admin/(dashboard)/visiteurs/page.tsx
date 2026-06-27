import type { Metadata } from "next";
import Link from "next/link";

import { listUsers } from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Visiteurs — Administration",
  robots: { index: false, follow: false },
};

const PER_PAGE = 25;

const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function pageHref(page: number, q: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/admin/visiteurs?${qs}` : "/admin/visiteurs";
}

export default async function VisiteursPage({
  searchParams,
}: PageProps<"/admin/visiteurs">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const pageParam = Number.parseInt(
    typeof sp.page === "string" ? sp.page : "1",
    10,
  );
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { rows, total, pages } = await listUsers({ page, perPage: PER_PAGE, q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Visiteurs <span className="text-muted">({formatNumber(total)})</span>
        </h1>
        <form className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher (nom, e-mail)"
            className="w-56 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            Rechercher
          </button>
          {q && (
            <Link
              href="/admin/visiteurs"
              className="text-sm text-muted hover:text-foreground"
            >
              Réinitialiser
            </Link>
          )}
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted">
          {q ? "Aucun visiteur ne correspond à cette recherche." : "Aucun visiteur inscrit."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">E-mail vérifié</th>
                <th className="px-4 py-3 font-medium">Inscrit le</th>
                <th className="px-4 py-3 font-medium">Dernière connexion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.emailVerified ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        Vérifié
                      </span>
                    ) : (
                      <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                        Non vérifié
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {dateFmt.format(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {u.lastLoginAt ? dateTimeFmt.format(u.lastLoginAt) : "—"}
                  </td>
                </tr>
              ))}
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
                href={pageHref(page - 1, q)}
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
                href={pageHref(page + 1, q)}
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
