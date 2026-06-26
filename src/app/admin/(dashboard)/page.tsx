import type { Metadata } from "next";
import Link from "next/link";

import { DownloadIcon, FileIcon, UserIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  getAdminStats,
  getIncompletePapers,
  getRecentPapers,
  getRecentUsers,
  getTopDownloads,
} from "@/db/queries";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tableau de bord — Administration",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DOC_LABEL = { sujet: "Sujet", corrige: "Corrigé" } as const;

export default async function AdminDashboardPage() {
  const [stats, recent, incomplete, top, newUsers] = await Promise.all([
    getAdminStats(),
    getRecentPapers(6),
    getIncompletePapers(6),
    getTopDownloads(6),
    getRecentUsers(6),
  ]);

  const cards = [
    { label: "Épreuves", value: stats.examPapers },
    { label: "Documents", value: stats.documents },
    { label: "Matières", value: stats.subjects },
    { label: "Sessions", value: stats.sessions },
  ];

  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            data-reveal
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Tableau de bord
          </h1>
          <p data-reveal className="mt-1 text-muted">
            Vue d&apos;ensemble du catalogue et des visiteurs.
          </p>
        </div>
        <div data-reveal className="flex flex-wrap gap-2">
          <Link
            href="/admin/epreuves/nouvelle"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            + Nouvelle épreuve
          </Link>
          <Link
            href="/admin/referentiels"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            Référentiels
          </Link>
        </div>
      </div>

      {/* Métrique clé : visiteurs inscrits */}
      <div
        data-reveal
        className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white shadow-lift"
      >
        <div>
          <p className="text-sm font-medium text-white/80">Visiteurs inscrits</p>
          <p className="mt-1 text-4xl font-extrabold">
            {formatNumber(stats.users)}
          </p>
        </div>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
          <UserIcon className="h-7 w-7" />
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            data-reveal
            className="rounded-2xl border border-border bg-background p-5 shadow-soft"
          >
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-600">
              {formatNumber(c.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Épreuves récentes */}
        <section
          data-reveal
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <FileIcon className="h-5 w-5 text-brand-600" />
              Épreuves récentes
            </h2>
            <Link
              href="/admin/epreuves"
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              Tout voir
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucune épreuve.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/epreuves/${p.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {p.subjectLabel}
                      </span>
                      <span className="block text-xs text-muted">
                        {p.examLabel}
                        {p.seriesCode ? ` ${p.seriesCode}` : ""} · {p.year}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {dateFmt.format(p.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* À compléter */}
        <section
          data-reveal
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <h2 className="font-semibold text-foreground">À compléter</h2>
          <p className="mt-1 text-xs text-muted">
            Épreuves auxquelles il manque un sujet ou un corrigé.
          </p>
          {incomplete.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Tout est complet. Beau travail !
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {incomplete.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/epreuves/${p.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">
                      {p.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {p.missing}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Téléchargements */}
        <section
          data-reveal
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <DownloadIcon className="h-5 w-5 text-brand-600" />
            Téléchargements
          </h2>
          {top.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Aucun téléchargement pour l&apos;instant.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {top.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <Link
                    href={`/admin/epreuves/${d.paperId}`}
                    className="min-w-0 truncate text-sm font-medium text-foreground hover:text-brand-700"
                  >
                    {d.title}{" "}
                    <span className="text-muted">({DOC_LABEL[d.type]})</span>
                  </Link>
                  <span className="shrink-0 text-sm font-semibold text-brand-600">
                    {formatNumber(d.downloads)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Derniers inscrits */}
        <section
          data-reveal
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <UserIcon className="h-5 w-5 text-brand-600" />
            Derniers inscrits
          </h2>
          {newUsers.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucun inscrit.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {newUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {u.name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {u.email}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {dateFmt.format(u.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Reveal>
  );
}
