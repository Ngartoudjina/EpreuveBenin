"use client";

import { useRef } from "react";

import {
  BoltIcon,
  GiftIcon,
  RefreshIcon,
  SparkleIcon,
  UsersIcon,
  WifiOffIcon,
} from "@/components/icons";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

const features = [
  {
    Icon: GiftIcon,
    accent: "bg-emerald-50 text-emerald-600",
    title: "100 % gratuit",
    desc: "Tous les sujets et corrigés officiels, à télécharger librement.",
  },
  {
    Icon: WifiOffIcon,
    accent: "bg-rose-50 text-rose-600",
    title: "Disponible hors-ligne",
    desc: "Consultez vos épreuves sans connexion, où que vous soyez.",
  },
  {
    Icon: BoltIcon,
    accent: "bg-amber-50 text-amber-600",
    title: "Rapide, même en 2G/3G",
    desc: "Des pages légères qui s'ouvrent vite, même en réseau limité.",
  },
  {
    Icon: SparkleIcon,
    accent: "bg-brand-50 text-brand-700",
    title: "Facile à utiliser",
    desc: "Une interface simple et claire pour trouver vite ce qu'il vous faut.",
  },
  {
    Icon: RefreshIcon,
    accent: "bg-lime-50 text-lime-600",
    title: "Contenu à jour",
    desc: "De nouvelles épreuves et corrigés ajoutés régulièrement.",
  },
  {
    Icon: UsersIcon,
    accent: "bg-sky-50 text-sky-600",
    title: "Pour tous",
    desc: "Élèves, enseignants et répétiteurs, partout au Bénin.",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="border-t border-border py-16 sm:py-20">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Pourquoi EpreuveBenin
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Pensé pour les candidats du Bénin
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {features.map((f) => (
            <div
              key={f.title}
              data-reveal
              className="rounded-2xl border border-border bg-background p-5 shadow-soft transition-colors hover:border-brand-200"
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${f.accent}`}
              >
                <f.Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold leading-snug text-foreground">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
