"use client";

import Link from "next/link";
import { useRef } from "react";

import {
  BookOpenIcon,
  BuildingIcon,
  GraduationIcon,
  GridIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/icons";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

type Category = {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  sub: string;
  href?: string;
};

const categories: Category[] = [
  { Icon: BookOpenIcon, label: "BEPC", sub: "Parcourir les épreuves", href: "/bepc" },
  { Icon: GraduationIcon, label: "BAC", sub: "Parcourir les épreuves", href: "/bac" },
  { Icon: TrophyIcon, label: "Concours", sub: "Bientôt disponible" },
  { Icon: BuildingIcon, label: "Université", sub: "Bientôt disponible" },
  { Icon: UsersIcon, label: "Enseignants", sub: "Bientôt disponible" },
  { Icon: GridIcon, label: "Toutes les matières", sub: "Tout explorer", href: "/recherche" },
];

/** Rangée de catégories sous le hero (accès rapide au catalogue). */
export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="pb-4 pt-2 sm:pb-8">
      <Container>
        <div
          data-reveal
          className="grid grid-cols-2 gap-2.5 rounded-3xl border border-border bg-background p-3 shadow-soft sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-6"
        >
          {categories.map((c) => {
            const inner = (
              <>
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl border ${
                    c.href
                      ? "border-brand-100 bg-brand-50 text-brand-700 transition-colors group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  <c.Icon className="h-6 w-6" />
                </span>
                <span className="mt-3 block text-sm font-bold text-foreground">
                  {c.label}
                </span>
                <span className={`mt-0.5 block text-xs ${c.href ? "text-muted" : "text-muted/70 italic"}`}>
                  {c.sub}
                </span>
              </>
            );

            return c.href ? (
              <Link
                key={c.label}
                href={c.href}
                className="group flex flex-col items-center rounded-2xl px-3 py-5 text-center transition-colors hover:bg-brand-50/60"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={c.label}
                aria-disabled
                className="flex flex-col items-center rounded-2xl px-3 py-5 text-center opacity-75"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
