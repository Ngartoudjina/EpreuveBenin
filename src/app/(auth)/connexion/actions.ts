"use server";

import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { admins, db } from "@/db";

type State = string | undefined;

/** N'autorise que des chemins internes pour la redirection après connexion. */
function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export async function loginAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = formData.get("password");
  const next = safeNext(formData.get("next"));

  // On vérifie d'abord si l'e-mail correspond à un compte administrateur :
  // si oui, on l'authentifie via le fournisseur « admin » (rôle admin propagé
  // → la section Administration apparaît dans la navbar). Sinon, visiteur.
  const adminRow = email
    ? await db.select({ id: admins.id }).from(admins).where(eq(admins.email, email))
    : [];
  const isAdmin = adminRow.length > 0;

  try {
    await signIn(isAdmin ? "admin" : "visitor", {
      email,
      password,
      redirectTo: next,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou mot de passe incorrect.";
    }
    throw error;
  }
}
