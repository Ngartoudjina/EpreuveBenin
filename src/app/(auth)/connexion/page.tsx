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
  const { next, verifier } = await searchParams;
  const nextPath = cleanNext(next);
  const justRegistered = verifier === "1";

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
      {justRegistered && (
        <div className="mb-5 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
          <p className="font-semibold text-brand-800">Compte créé avec succès ✅</p>
          <p className="mt-1 leading-relaxed">
            Un e-mail de confirmation vous a été envoyé. Ouvrez votre{" "}
            <strong>boîte de réception</strong> (pensez à regarder dans les{" "}
            <strong>spams / courriers indésirables</strong>) et cliquez sur le
            lien pour <strong>vérifier votre adresse</strong>, puis connectez-vous.
          </p>
        </div>
      )}
      <LoginForm next={nextPath} />
    </AuthShell>
  );
}
