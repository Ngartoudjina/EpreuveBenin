import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte EpreuveBenin gratuit pour télécharger les annales du BEPC et du BAC.",
  robots: { index: false, follow: false },
};

function cleanNext(value: string | string[] | undefined): string {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export default async function InscriptionPage({
  searchParams,
}: PageProps<"/inscription">) {
  const { next } = await searchParams;
  const nextPath = cleanNext(next);

  const session = await auth();
  if (session?.user) redirect(nextPath);

  const connexionHref =
    nextPath === "/"
      ? "/connexion"
      : `/connexion?next=${encodeURIComponent(nextPath)}`;

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Gratuit — pour accéder au téléchargement des épreuves."
      topRight={{ label: "Connexion", href: connexionHref }}
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            href={connexionHref}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm next={nextPath} />
    </AuthShell>
  );
}
