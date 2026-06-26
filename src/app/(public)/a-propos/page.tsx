import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "EpreuveBenin centralise gratuitement les annales officielles du BEPC et du BAC au Bénin, pour donner à chaque candidat les mêmes chances de réussite.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Reveal className="mx-auto max-w-2xl">
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Le projet
        </p>
        <h1 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          À propos d&apos;EpreuveBenin
        </h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          <p data-reveal>
            Chaque année, des dizaines de milliers de candidats préparent le BEPC
            et le BAC au Bénin. L&apos;accès aux épreuves des années antérieures —
            les « annales » — reste pourtant inégal : documents dispersés, de
            qualité variable, et souvent payants.
          </p>
          <p data-reveal>
            <strong className="text-foreground">EpreuveBenin</strong> corrige cette
            inégalité : une plateforme{" "}
            <strong className="text-foreground">100 % gratuite</strong> qui
            centralise les sujets et corrigés officiels, organisés par examen,
            série, matière et année.
          </p>
          <p data-reveal>
            Conçue « mobile-first », EpreuveBenin reste rapide même sur une connexion
            limitée (2G/3G) et fonctionne hors-ligne : une fois une épreuve
            consultée, elle reste accessible sans réseau.
          </p>
        </div>
      </Reveal>
    </Container>
  );
}
