import type { Metadata } from "next";

import { AboutHero } from "@/components/about/about-hero";
import { Faq, type QA } from "@/components/about/faq";
import { BoltIcon, CheckIcon, GiftIcon, WifiOffIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";

import { MessageForm } from "./message-form";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "EpreuveBenin centralise gratuitement les annales officielles du BEPC et du BAC au Bénin, pour donner à chaque candidat les mêmes chances de réussite.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  {
    Icon: GiftIcon,
    title: "100 % gratuit",
    text: "Aucun paiement, aucun abonnement — les mêmes chances pour tous.",
  },
  {
    Icon: BoltIcon,
    title: "Rapide",
    text: "Optimisé pour les connexions limitées (2G/3G).",
  },
  {
    Icon: WifiOffIcon,
    title: "Hors-ligne",
    text: "Les épreuves consultées restent accessibles sans réseau.",
  },
  {
    Icon: CheckIcon,
    title: "Officiel",
    text: "Sujets et corrigés officiels, classés rigoureusement.",
  },
];

const FAQ: QA[] = [
  {
    q: "EpreuveBenin est-il vraiment gratuit ?",
    a: "Oui, à 100 %. Aucun paiement ni abonnement : la consultation et le téléchargement des annales sont entièrement gratuits.",
  },
  {
    q: "Quels examens et séries sont couverts ?",
    a: "Le BEPC et le BAC (séries A1, A2, B, C, D, E), classés par matière, session et année.",
  },
  {
    q: "Dois-je créer un compte ?",
    a: "La consultation est libre. Un compte gratuit, en quelques secondes, est demandé uniquement pour télécharger les fichiers.",
  },
  {
    q: "Les corrigés sont-ils disponibles ?",
    a: "Lorsqu'un corrigé officiel existe, il est proposé à côté du sujet. Sinon, seul le sujet est disponible pour le moment.",
  },
  {
    q: "Le site fonctionne-t-il avec une connexion lente ou hors-ligne ?",
    a: "Oui. EpreuveBenin est conçu « mobile-first », reste rapide en 2G/3G, et les pages déjà consultées restent accessibles hors connexion.",
  },
  {
    q: "Comment signaler une erreur ou proposer une épreuve ?",
    a: "Écrivez-nous via le formulaire ci-dessous : toute correction ou contribution est la bienvenue.",
  },
];

export default function AProposPage() {
  return (
    <>
      <AboutHero />

      <Container className="py-16 sm:py-24">
        {/* Mission + valeurs */}
        <Reveal className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Notre mission
            </p>
            <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              L&apos;accès aux annales ne devrait pas être un privilège
            </h2>
            <p data-reveal className="mt-5 leading-relaxed text-muted">
              Chaque année, des dizaines de milliers de candidats préparent le
              BEPC et le BAC au Bénin. L&apos;accès aux épreuves des années
              antérieures reste pourtant inégal : documents dispersés, de qualité
              variable, et souvent payants. <strong className="text-foreground">EpreuveBenin</strong> corrige
              cette inégalité — une plateforme gratuite qui centralise les sujets
              et corrigés officiels, pensée pour fonctionner partout.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                data-reveal
                className="rounded-2xl border border-white/60 bg-white/60 p-6 shadow-soft backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <v.Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal className="mx-auto mt-20 max-w-2xl sm:mt-28">
          <div className="text-center">
            <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Questions fréquentes
            </p>
            <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tout ce qu&apos;il faut savoir
            </h2>
          </div>
          <div className="mt-8">
            <Faq items={FAQ} />
          </div>
        </Reveal>

        {/* Message */}
        <Reveal className="mx-auto mt-20 max-w-2xl scroll-mt-24 sm:mt-28" id="message">
          <div className="text-center">
            <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Une question ?
            </p>
            <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Laissez-nous un message
            </h2>
            <p data-reveal className="mx-auto mt-4 max-w-md text-muted">
              Une suggestion, une erreur à signaler, une épreuve à proposer ?
              Écrivez-nous, nous lisons tout.
            </p>
          </div>
          <div data-reveal className="mt-8">
            <MessageForm />
          </div>
        </Reveal>
      </Container>
    </>
  );
}
