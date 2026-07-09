"use client";

import { useRef } from "react";

import { DownloadIcon, GraduationIcon, SearchIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";

import { PhoneMockup } from "./phone-mockup";
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

/** Badges « stores » (l'application mobile n'existe pas encore). */
const storeBadges = [
  {
    store: "Google Play",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M4 2.7v18.6c0 .4.5.7.8.4l10-9.3c.2-.2.2-.5 0-.7l-10-9.3c-.3-.3-.8 0-.8.3Zm12.6 7.2-2.3 2.1 2.3 2.1 3.4-1.6c.6-.3.6-.8 0-1.1l-3.4-1.5Z" />
      </svg>
    ),
  },
  {
    store: "App Store",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M16.6 12.9c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2 1 0 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.1ZM14.6 6c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.3-1.1Z" />
      </svg>
    ),
  },
];

export function StepsSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="bg-surface py-20 sm:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-16">
        {/* Étapes */}
        <div>
          <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            En 3 étapes
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comment ça marche
          </h2>

          <div className="relative mt-12 grid gap-12 sm:grid-cols-3 sm:gap-8">
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
        </div>

        {/* Emportez-le partout */}
        <div
          data-reveal
          className="mx-auto flex max-w-md flex-col items-center gap-8 sm:flex-row lg:max-w-none"
        >
          <PhoneMockup />
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Emportez-le partout
            </h3>
            <p className="mt-2 max-w-[16rem] text-muted">
              Étudiez à tout moment, où que vous soyez, avec EpreuveBenin.
            </p>
            <div className="mt-5 flex flex-col items-center gap-2.5 sm:items-start">
              {storeBadges.map((b) => (
                <span
                  key={b.store}
                  title="Bientôt disponible"
                  className="inline-flex w-44 cursor-default items-center gap-3 rounded-xl bg-foreground px-4 py-2 text-white opacity-90"
                >
                  {b.glyph}
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] uppercase tracking-wide text-white/70">
                      Bientôt sur
                    </span>
                    <span className="block text-sm font-semibold">{b.store}</span>
                  </span>
                </span>
              ))}
              <p className="mt-1 text-xs text-muted">
                En attendant, le site fonctionne déjà hors-ligne.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
