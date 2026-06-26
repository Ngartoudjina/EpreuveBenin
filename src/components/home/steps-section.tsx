"use client";

import { useRef } from "react";

import { GraduationIcon, SearchIcon, DownloadIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

const steps = [
  {
    n: 1,
    icon: GraduationIcon,
    label: "Choisissez votre examen",
    detail: "BEPC ou BAC, puis votre série.",
  },
  {
    n: 2,
    icon: SearchIcon,
    label: "Trouvez l'épreuve",
    detail: "Filtrez par matière, année et session.",
  },
  {
    n: 3,
    icon: DownloadIcon,
    label: "Consultez & téléchargez",
    detail: "Aperçu, puis sujet et corrigé en un clic.",
  },
];

export function StepsSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="bg-surface py-20 sm:py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          En 3 étapes
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Comment ça marche
        </h2>

        <div className="relative mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {/* Ligne de liaison (desktop) tracée au scroll. */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-border sm:block">
            <div
              data-line
              className="h-full w-full origin-left bg-gradient-to-r from-brand-500 to-brand-300"
            />
          </div>

          {steps.map((step) => (
            <div
              key={step.n}
              data-reveal
              className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <span className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft ring-8 ring-surface">
                <step.icon className="h-7 w-7" />
                <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-bold text-white">
                  {step.n}
                </span>
              </span>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {step.label}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-muted">{step.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
