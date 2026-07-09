"use client";

import Link from "next/link";
import { useRef } from "react";

import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileIcon,
} from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HomePaper } from "@/db/queries";
import { formatNumber } from "@/lib/format";

import { useScrollReveal } from "./use-scroll-reveal";

/** Palette d'accents des vignettes matière (rotation par carte). */
const ACCENTS = [
  "bg-rose-50 text-rose-600",
  "bg-sky-50 text-sky-600",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-brand-50 text-brand-700",
];

/** Dernières épreuves ajoutées (données réelles, liens vers les fiches). */
export function RecentPapersSection({ papers }: { papers: HomePaper[] }) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  if (papers.length === 0) return null;

  return (
    <section ref={ref} className="py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              data-reveal
              className="text-sm font-semibold uppercase tracking-widest text-brand-600"
            >
              Épreuves populaires
            </p>
            <h2
              data-reveal
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Explorez les épreuves récentes
            </h2>
          </div>
          <Link
            data-reveal
            href="/recherche"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            Voir toutes les épreuves
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {papers.slice(0, 5).map((p, i) => (
            <article
              key={p.id}
              data-reveal
              className="group flex flex-col rounded-2xl border border-border bg-background p-4 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${ACCENTS[i % ACCENTS.length]}`}
                >
                  <FileIcon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-foreground">
                  {p.year}
                </span>
              </div>

              <h3 className="mt-3 font-bold leading-snug text-foreground">
                {p.examLabel} {p.subjectLabel}
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                {p.seriesCode ? `Série ${p.seriesCode} · ` : ""}
                {p.year}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <span className="rounded-md bg-surface px-1.5 py-0.5 font-semibold uppercase">
                  PDF
                </span>
                {p.hasCorrige && (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Corrigé
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <DownloadIcon className="h-4 w-4" />
                  {formatNumber(p.downloads)}
                </span>
                <Link
                  href={p.href}
                  className={buttonVariants({
                    variant: "primary",
                    size: "sm",
                  })}
                >
                  Télécharger
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
