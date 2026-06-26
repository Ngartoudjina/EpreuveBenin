import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { PasswordForm } from "./password-form";

export const metadata: Metadata = {
  title: "Mon compte — Administration",
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super-administrateur",
  admin: "Administrateur",
};

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Mon compte
        </h1>
        <p className="mt-1 text-muted">
          Vos informations et la modification de votre mot de passe.
        </p>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border text-sm sm:grid-cols-2">
        <div className="bg-background px-4 py-3">
          <dt className="text-xs text-muted">E-mail</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {session.user.email}
          </dd>
        </div>
        <div className="bg-background px-4 py-3">
          <dt className="text-xs text-muted">Rôle</dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {ROLE_LABEL[session.user.role] ?? session.user.role}
          </dd>
        </div>
      </dl>

      <section className="rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Changer mon mot de passe
        </h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          Saisissez votre mot de passe actuel puis le nouveau.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
