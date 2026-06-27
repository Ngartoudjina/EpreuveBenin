import type { Metadata } from "next";
import Link from "next/link";

import { CountUp } from "@/components/admin/count-up";
import { BoltIcon, DownloadIcon, FileIcon, GraduationIcon, UserIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  getAdminStats,
  getIncompletePapers,
  getRecentPapers,
  getRecentUsers,
  getTopDownloads,
} from "@/db/queries";

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
const GLASS = "rounded-2xl border border-white/60 bg-white/60 shadow-soft backdrop-blur-xl";

export default async function AdminDashboardPage() {
  const [stats, recent, incomplete, top, newUsers] = await Promise.all([
    getAdminStats(),
    getRecentPapers(6),
    getIncompletePapers(6),
    getTopDownloads(6),
    getRecentUsers(6),
  ]);

  const cards = [
    { label: "Épreuves", value: stats.examPapers, Icon: FileIcon },
    { label: "Documents", value: stats.documents, Icon: DownloadIcon },
    { label: "Matières", value: stats.subjects, Icon: GraduationIcon },
    { label: "Sessions", value: stats.sessions, Icon: BoltIcon },
  ];

  return (
    <Reveal>
      {/* En-tête */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 data-reveal className="text-3xl font-extrabold tracking-tight text-foreground">
            Tableau de bord
          </h1>
          <p data-reveal className="mt-1 text-muted">
            Vue d&apos;ensemble du catalogue et des visiteurs.
          </p>
        </div>
        <div data-reveal className="flex flex-wrap gap-2">
          <Link
            href="/admin/epreuves/nouvelle"
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            + Nouvelle épreuve
          </Link>
          <Link
            href="/admin/import"
            className="rounded-xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white"
          >
            Import en masse
          </Link>
        </div>
      </div>

      {/* Hero visiteurs + compteurs */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 p-6 text-white shadow-lift lg:col-span-1"
        >
          <div className="bg-dots pointer-events-none absolute inset-0 text-white/10" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Visiteurs inscrits</p>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                <UserIcon className="h-6 w-6" />
              </span>
            </div>
            <CountUp value={stats.users} className="mt-3 block text-5xl font-extrabold" />
            <p className="mt-2 text-sm text-white/80">comptes créés au total</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {cards.map((c) => (
            <div key={c.label} data-reveal className={`${GLASS} p-5`}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{c.label}</p>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <c.Icon className="h-5 w-5" />
                </span>
              </div>
              <CountUp value={c.value} className="mt-2 block text-3xl font-bold text-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Panneaux */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Épreuves récentes */}
        <section data-reveal className={`${GLASS} p-5`}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <FileIcon className="h-5 w-5 text-brand-600" />
              Épreuves récentes
            </h2>
            <Link href="/admin/epreuves" className="text-sm font-medium text-brand-700 hover:text-brand-800">
              Tout voir
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucune épreuve.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/70">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/epreuves/${p.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/70"
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
                    <span className="shrink-0 text-xs text-muted">{dateFmt.format(p.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* À compléter */}
        <section data-reveal className={`${GLASS} p-5`}>
          <h2 className="font-semibold text-foreground">À compléter</h2>
          <p className="mt-1 text-xs text-muted">Épreuves auxquelles il manque un sujet ou un corrigé.</p>
          {incomplete.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Tout est complet. Beau travail !</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/70">
              {incomplete.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/epreuves/${p.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/70"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">{p.title}</span>
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
        <section data-reveal className={`${GLASS} p-5`}>
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <DownloadIcon className="h-5 w-5 text-brand-600" />
            Téléchargements
          </h2>
          {top.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucun téléchargement pour l&apos;instant.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/70">
              {top.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link
                    href={`/admin/epreuves/${d.paperId}`}
                    className="min-w-0 truncate text-sm font-medium text-foreground hover:text-brand-700"
                  >
                    {d.title} <span className="text-muted">({DOC_LABEL[d.type]})</span>
                  </Link>
                  <span className="shrink-0 text-sm font-semibold text-brand-600">
                    <CountUp value={d.downloads} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Derniers inscrits */}
        <section data-reveal className={`${GLASS} p-5`}>
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <UserIcon className="h-5 w-5 text-brand-600" />
            Derniers inscrits
          </h2>
          {newUsers.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucun inscrit.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/70">
              {newUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{u.name}</span>
                    <span className="block truncate text-xs text-muted">{u.email}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{dateFmt.format(u.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Reveal>
  );
}
