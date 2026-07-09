"use client";

import { useRef } from "react";

import { StarIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";

import { useScrollReveal } from "./use-scroll-reveal";

const testimonials = [
  {
    name: "Armel H.",
    role: "Candidat au BEPC",
    quote:
      "EpreuveBenin m'a beaucoup aidé à préparer mon BEPC. Les sujets sont exactement ceux que l'on retrouve aux examens !",
  },
  {
    name: "Estelle A.",
    role: "Candidate au BAC",
    quote:
      "Une plateforme très utile pour les élèves du Bénin. Je peux télécharger et réviser même sans connexion internet.",
  },
  {
    name: "M. Koffi",
    role: "Enseignant",
    quote:
      "En tant qu'enseignant, je m'en sers pour préparer mes élèves. Simple, rapide et 100 % gratuit !",
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Ce que disent les élèves
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          La confiance de milliers d&apos;apprenants
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              data-reveal
              className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-soft"
            >
              <div className="flex gap-1 text-amber-400" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-foreground">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
