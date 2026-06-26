import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion — Administration",
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return (
    <Container className="flex min-h-screen max-w-md flex-col justify-center py-16">
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lift">
        <div className="brand-bar h-1.5" />
        <div className="p-8">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-bold text-white"
            >
              {siteConfig.name.charAt(0)}
            </span>
            <span className="font-bold text-foreground">{siteConfig.name}</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Administration
          </h1>
          <p className="mt-1 text-sm text-muted">
            Connectez-vous pour gérer le catalogue des annales.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
