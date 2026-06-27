"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import {
  EMAIL_VERIFICATION_ENABLED,
  sendVerificationEmail,
} from "@/lib/auth/verification";
import { createUser } from "@/lib/users";

type State = string | undefined;

function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export async function registerAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const next = safeNext(formData.get("next"));
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let created: { id: string };
  try {
    created = await createUser({ name, email, password });
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "Erreur lors de l'inscription.";
  }

  // Vérification d'e-mail (désactivée pour le moment, cf. EMAIL_VERIFICATION_ENABLED).
  if (EMAIL_VERIFICATION_ENABLED) {
    try {
      await sendVerificationEmail({ id: created.id, name, email });
    } catch {
      // l'utilisateur pourra le renvoyer depuis la page de vérification
    }
  }

  // Connexion automatique après création du compte.
  try {
    await signIn("visitor", {
      email,
      password,
      redirectTo: EMAIL_VERIFICATION_ENABLED ? "/verifier-email" : next,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Compte créé. Veuillez vous connecter.";
    }
    throw error;
  }
}
