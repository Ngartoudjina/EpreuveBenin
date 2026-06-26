import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité d'EpreuveBenin.",
  alternates: { canonical: "/mentions-legales" },
};

const sections = [
  {
    title: "Éditeur",
    body: "EpreuveBenin — plateforme de diffusion gratuite des annales du BEPC et du BAC en République du Bénin.",
  },
  {
    title: "Hébergement",
    body: "Le site est diffusé via un réseau de distribution de contenu (CDN). Les fichiers PDF sont hébergés sur un service de stockage objet dédié.",
  },
  {
    title: "Gratuité",
    body: "L'accès aux contenus est entièrement gratuit, sans aucun paiement. La consultation des fiches est libre ; seul le téléchargement des épreuves nécessite la création d'un compte gratuit.",
  },
  {
    title: "Données personnelles",
    body: "La création d'un compte (requise pour télécharger) collecte un nom et une adresse e-mail, conservés de façon sécurisée (mot de passe haché) et jamais cédés à des tiers. Ces données servent uniquement à l'accès au service et à la mesure du nombre d'inscrits.",
  },
  {
    title: "Propriété des contenus",
    body: "Les sujets d'examen demeurent la propriété de leurs détenteurs officiels. EpreuveBenin en facilite l'accès à des fins pédagogiques. Toute erreur ou demande peut être signalée via la page Contact.",
  },
];

export default function MentionsLegalesPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Reveal className="mx-auto max-w-2xl">
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Informations légales
        </p>
        <h1 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mentions légales
        </h1>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title} data-reveal>
              <h2 className="text-lg font-semibold text-foreground">
                {s.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
