"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

const points = [
  "Sujets et corrigés classés par examen, série, matière et année.",
  "Parfaits pour réviser, s'entraîner et s'auto-évaluer.",
  "Une banque de sujets prête à l'emploi pour les enseignants et répétiteurs.",
  "Léger et consultable hors-ligne, même sur un petit forfait.",
];

export function ShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="overflow-hidden bg-surface py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Texte */}
        <div>
          <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Une ressource pour tous
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pour les élèves comme pour les enseignants
          </h2>
          <p data-reveal className="mt-4 max-w-md text-lg text-muted">
            Que tu prépares ton examen ou que tu encadres des élèves, EpreuveBenin
            centralise les annales officielles, prêtes à consulter et à
            télécharger.
          </p>

          <ul className="mt-8 space-y-3.5">
            {points.map((p) => (
              <li key={p} data-reveal className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-9">
            <Link
              href="/recherche"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Explorer les annales
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Visuels */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-brand-200/60 via-brand-300/30 to-transparent blur-3xl" />

          {/* Image principale : enseignante au tableau */}
          <div
            data-reveal
            className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5"
          >
            <Image
              src="/hero/hero5.jpg"
              alt="Enseignante écrivant au tableau"
              fill
              sizes="(min-width: 1024px) 38vw, 80vw"
              className="object-cover"
            />
          </div>

          {/* Image secondaire superposée : élève en train de lire */}
          <div
            data-reveal
            className="absolute -bottom-6 -left-3 w-28 overflow-hidden rounded-2xl shadow-lift ring-4 ring-background sm:-bottom-8 sm:-left-5 sm:w-44"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src="/hero/hero4.jpg"
                alt="Élève en train de réviser"
                fill
                sizes="(min-width: 1024px) 14vw, 35vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Badge flottant */}
          <div
            data-float-b
            className="absolute right-2 top-3 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 shadow-lift backdrop-blur sm:-right-3 sm:top-6 sm:px-3.5 sm:py-2.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-foreground">
              Annales officielles
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
