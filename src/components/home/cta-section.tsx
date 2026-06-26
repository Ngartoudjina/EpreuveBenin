"use client";

import Link from "next/link";
import { useRef } from "react";

import { ArrowRightIcon, GraduationIcon, SparkleIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { exams } from "@/lib/site";

import { useScrollReveal } from "./use-scroll-reveal";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section ref={ref} className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          {/* Décor */}
          <div className="bg-dots pointer-events-none absolute inset-0 text-white/10" />
          <div
            data-float-a
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <div
            data-float-b
            className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-brand-900/30 blur-3xl"
          />
          <span
            data-float-a
            className="pointer-events-none absolute left-10 top-10 text-white/40"
          >
            <SparkleIcon className="h-8 w-8" />
          </span>
          <GraduationIcon className="pointer-events-none absolute -bottom-4 right-6 h-28 w-28 text-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <h2 data-reveal className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à réviser ?
            </h2>
            <p data-reveal className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Accédez aux annales officielles du BEPC et du BAC. Téléchargement
              gratuit, après création d&apos;un compte en quelques secondes.
            </p>
            <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
              {exams.map((exam) => (
                <Link
                  key={exam.code}
                  href={exam.href}
                  className={buttonVariants({ variant: "accent", size: "lg" })}
                >
                  Annales du {exam.name}
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
