"use client";

import { useRef } from "react";

import {
  BookOpenIcon,
  DownloadIcon,
  FileIcon,
  GiftIcon,
} from "@/components/icons";
import { Container } from "@/components/ui/container";
import { formatNumber } from "@/lib/format";

import { useScrollReveal } from "./use-scroll-reveal";

type Stats = {
  papers: number;
  documents: number;
  subjects: number;
  downloads: number;
};

/** Bandeau de chiffres clés (fond de marque), alimenté par la base. */
export function StatsBand({ stats }: { stats: Stats }) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  const items = [
    {
      Icon: FileIcon,
      value: formatNumber(stats.papers + stats.documents),
      label: "Épreuves & documents",
    },
    {
      Icon: DownloadIcon,
      value: formatNumber(stats.downloads),
      label: "Téléchargements",
    },
    {
      Icon: BookOpenIcon,
      value: formatNumber(stats.subjects),
      label: "Matières couvertes",
    },
    { Icon: GiftIcon, value: "100 %", label: "Gratuit, pour toujours" },
  ];

  return (
    <section ref={ref} className="py-6 sm:py-8">
      <Container>
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-6 py-8 sm:px-10 sm:py-10"
        >
          <div className="bg-dots pointer-events-none absolute inset-0 text-white/10" />
          <dl className="relative grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {items.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-4 ${
                  i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""
                }`}
              >
                <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white sm:grid">
                  <s.Icon className="h-6 w-6" />
                </span>
                <div>
                  <dd className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {s.value}
                  </dd>
                  <dt className="mt-0.5 text-sm text-white/70">{s.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
