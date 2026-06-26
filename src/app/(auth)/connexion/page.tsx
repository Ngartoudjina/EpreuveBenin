import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte EpreuveBenin pour télécharger les annales.",
  robots: { index: false, follow: false },
};

function cleanNext(value: string | string[] | undefined): string {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export default async function ConnexionPage({
  searchParams,
}: PageProps<"/connexion">) {
  const { next } = await searchParams;
  const nextPath = cleanNext(next);

  const session = await auth();
  if (session?.user) redirect(nextPath);

  const inscriptionHref =
    nextPath === "/"
      ? "/inscription"
      : `/inscription?next=${encodeURIComponent(nextPath)}`;

  return (
    <AuthShell
      title="Content de vous revoir"
      subtitle="Connectez-vous pour télécharger les épreuves."
      topRight={{ label: "Inscription", href: inscriptionHref }}
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href={inscriptionHref}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm next={nextPath} />
    </AuthShell>
  );
}
