import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { CheckIcon, MailIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { isEmailVerified, verifyEmailToken } from "@/lib/auth/verification";

import { ResendButton } from "./resend-button";

export const metadata: Metadata = {
  title: "Vérification de l'e-mail",
  description: "Confirmez votre adresse e-mail pour activer le téléchargement.",
  robots: { index: false, follow: false },
};

function Shell({
  tone,
  icon,
  title,
  children,
}: {
  tone: "success" | "info" | "error";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const ring =
    tone === "success"
      ? "bg-brand-600 text-white"
      : tone === "error"
        ? "bg-danger/10 text-danger"
        : "bg-brand-50 text-brand-700";
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-soft">
        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${ring}`}>
          {icon}
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <div className="mt-3 text-muted">{children}</div>
      </div>
    </Container>
  );
}

export default async function VerifierEmailPage({
  searchParams,
}: PageProps<"/verifier-email">) {
  const { token } = await searchParams;
  const rawToken = typeof token === "string" ? token : "";
  const session = await auth();
  const isVisitor = session?.user?.role === "visitor";

  /* --------- Cas 1 : lien de confirmation cliqué (token présent) --------- */
  if (rawToken) {
    const result = await verifyEmailToken(rawToken);

    if (result === "verified" || result === "already") {
      return (
        <Shell tone="success" icon={<CheckIcon className="h-7 w-7" />} title="Adresse confirmée">
          <p>
            {result === "already"
              ? "Votre adresse était déjà confirmée."
              : "Merci ! Votre adresse e-mail est confirmée."}{" "}
            Vous pouvez maintenant télécharger les annales.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={session?.user ? "/" : "/connexion"}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {session?.user ? "Aller à l'accueil" : "Se connecter"}
            </Link>
          </div>
        </Shell>
      );
    }

    return (
      <Shell
        tone="error"
        icon={<MailIcon className="h-7 w-7" />}
        title={result === "expired" ? "Lien expiré" : "Lien invalide"}
      >
        <p>
          {result === "expired"
            ? "Ce lien de confirmation a expiré (24 h)."
            : "Ce lien de confirmation est invalide ou a déjà été utilisé."}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {isVisitor ? (
            <ResendButton />
          ) : (
            <Link
              href="/connexion"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Se connecter pour renvoyer
            </Link>
          )}
        </div>
      </Shell>
    );
  }

  /* --------- Cas 2 : pas de token (page « vérifiez votre boîte ») --------- */
  if (isVisitor && session?.user?.id) {
    if (await isEmailVerified(session.user.id)) {
      return (
        <Shell tone="success" icon={<CheckIcon className="h-7 w-7" />} title="Adresse déjà confirmée">
          <p>Votre compte est vérifié. Bonne révision !</p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Aller à l&apos;accueil
            </Link>
          </div>
        </Shell>
      );
    }

    return (
      <Shell tone="info" icon={<MailIcon className="h-7 w-7" />} title="Confirmez votre e-mail">
        <p>
          Un e-mail de confirmation a été envoyé à{" "}
          <span className="font-semibold text-foreground">{session.user.email}</span>.
          Cliquez sur le lien qu&apos;il contient pour activer le téléchargement
          des annales.
        </p>
        <p className="mt-2 text-sm">
          Pensez à vérifier vos spams. Vous n&apos;avez rien reçu ?
        </p>
        <div className="mt-6 flex justify-center">
          <ResendButton />
        </div>
      </Shell>
    );
  }

  // Non connecté.
  return (
    <Shell tone="info" icon={<MailIcon className="h-7 w-7" />} title="Confirmez votre e-mail">
      <p>
        Après votre inscription, un e-mail de confirmation vous est envoyé.
        Ouvrez-le et cliquez sur le lien pour activer votre compte.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/connexion"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Se connecter
        </Link>
      </div>
    </Shell>
  );
}
