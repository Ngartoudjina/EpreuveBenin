import type { Metadata } from "next";

import { MailIcon, XIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe EpreuveBenin : suggestions, signalement d'erreur ou contribution d'annales.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    Icon: MailIcon,
    label: "E-mail",
    value: "abelbeingar@gmail.com",
    href: "mailto:abelbeingar@gmail.com",
  },
  {
    Icon: XIcon,
    label: "X (Twitter)",
    value: "@ABeingar84308",
    href: "https://x.com/ABeingar84308",
  },
];

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Reveal className="mx-auto max-w-2xl">
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Nous écrire
        </p>
        <h1 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact
        </h1>
        <p data-reveal className="mt-4 leading-relaxed text-muted">
          Une suggestion, une erreur à signaler, ou des annales à partager ?
          Écrivez-nous — chaque contribution aide les futurs candidats.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              data-reveal
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <c.Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm text-muted">{c.label}</span>
                <span className="block font-semibold text-foreground">
                  {c.value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
