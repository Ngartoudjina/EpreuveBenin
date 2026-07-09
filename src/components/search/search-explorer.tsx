"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { emptyFilters, filterDocs, type SearchDoc } from "@/lib/search";

const SELECT_CLASS =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";

/** Recherche et filtrage instantanés côté client (F-03, F-04). */
export function SearchExplorer({
  initialQuery = "",
  initialExam = "",
}: {
  initialQuery?: string;
  initialExam?: "" | "bepc" | "bac";
}) {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filters, setFilters] = useState({
    ...emptyFilters,
    query: initialQuery,
    examCode: initialExam,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch"))))
      .then((data: SearchDoc[]) => active && setDocs(data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  const { seriesOptions, subjectOptions, yearOptions } = useMemo(() => {
    const list = docs ?? [];
    const scope = filters.examCode
      ? list.filter((d) => d.examCode === filters.examCode)
      : list;

    const seriesMap = new Map<string, string>();
    const subjectMap = new Map<string, string>();
    const years = new Set<number>();
    for (const d of scope) {
      if (d.seriesCode && d.seriesLabel) seriesMap.set(d.seriesCode, d.seriesLabel);
      subjectMap.set(d.subjectSlug, d.subjectLabel);
      years.add(d.year);
    }

    return {
      seriesOptions: [...seriesMap.entries()]
        .map(([code, label]) => ({ code, label }))
        .sort((a, b) => a.label.localeCompare(b.label, "fr")),
      subjectOptions: [...subjectMap.entries()]
        .map(([slug, label]) => ({ slug, label }))
        .sort((a, b) => a.label.localeCompare(b.label, "fr")),
      yearOptions: [...years].sort((a, b) => b - a),
    };
  }, [docs, filters.examCode]);

  const results = useMemo(() => {
    if (!docs) return [];
    return filterDocs(docs, filters).sort(
      (a, b) => b.year - a.year || a.title.localeCompare(b.title, "fr"),
    );
  }, [docs, filters]);

  const update = (patch: Partial<typeof filters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  const reset = () => setFilters({ ...emptyFilters });
  const hasActiveFilters =
    filters.query !== "" ||
    filters.examCode !== "" ||
    filters.seriesCode !== "" ||
    filters.subjectSlug !== "" ||
    filters.year !== "" ||
    filters.withCorrige;

  return (
    <div>
      {/* Recherche texte */}
      <div role="search" className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2 shadow-soft">
        <SearchIcon className="ml-2 h-5 w-5 shrink-0 text-muted" />
        <label htmlFor="q" className="sr-only">
          Rechercher une épreuve
        </label>
        <input
          id="q"
          type="search"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Rechercher une matière, une année, un mot-clé…"
          className="w-full bg-transparent px-1 py-2 text-foreground placeholder:text-muted focus-visible:outline-none"
        />
      </div>

      {/* Filtres */}
      <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="f-exam" className="mb-1 block text-xs font-medium text-muted">
              Examen
            </label>
            <select
              id="f-exam"
              value={filters.examCode}
              onChange={(e) => {
                const examCode = e.target.value as typeof filters.examCode;
                update({
                  examCode,
                  seriesCode: examCode === "bepc" ? "" : filters.seriesCode,
                });
              }}
              className={SELECT_CLASS}
            >
              <option value="">Tous</option>
              <option value="bepc">BEPC</option>
              <option value="bac">BAC</option>
            </select>
          </div>

          {filters.examCode !== "bepc" && seriesOptions.length > 0 && (
            <div>
              <label htmlFor="f-serie" className="mb-1 block text-xs font-medium text-muted">
                Série
              </label>
              <select
                id="f-serie"
                value={filters.seriesCode}
                onChange={(e) => update({ seriesCode: e.target.value })}
                className={SELECT_CLASS}
              >
                <option value="">Toutes</option>
                {seriesOptions.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="f-matiere" className="mb-1 block text-xs font-medium text-muted">
              Matière
            </label>
            <select
              id="f-matiere"
              value={filters.subjectSlug}
              onChange={(e) => update({ subjectSlug: e.target.value })}
              className={SELECT_CLASS}
            >
              <option value="">Toutes</option>
              {subjectOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-annee" className="mb-1 block text-xs font-medium text-muted">
              Année
            </label>
            <select
              id="f-annee"
              value={filters.year}
              onChange={(e) => update({ year: e.target.value })}
              className={SELECT_CLASS}
            >
              <option value="">Toutes</option>
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={filters.withCorrige}
              onChange={(e) => update({ withCorrige: e.target.checked })}
              className="h-4 w-4 rounded border-border accent-brand-600"
            />
            Avec corrigé
          </label>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="mt-8">
        {failed ? (
          <p className="text-danger">
            Impossible de charger la liste des épreuves. Réessayez plus tard.
          </p>
        ) : docs === null ? (
          <p className="text-muted">Chargement…</p>
        ) : (
          <>
            <p aria-live="polite" className="text-sm text-muted">
              {results.length} épreuve{results.length > 1 ? "s" : ""} trouvée
              {results.length > 1 ? "s" : ""}
            </p>
            {results.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-muted">
                Aucune épreuve ne correspond à votre recherche.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {results.map((d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                    >
                      <span>
                        <span className="block font-semibold text-foreground group-hover:text-brand-700">
                          {d.title}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          <Badge tone="brand">{d.examLabel}</Badge>
                          {d.seriesCode && (
                            <Badge tone="outline">Série {d.seriesCode}</Badge>
                          )}
                          <Badge tone="outline">{d.year}</Badge>
                          {d.hasCorrige && <Badge tone="accent">Corrigé</Badge>}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-5 w-5 shrink-0 text-brand-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
