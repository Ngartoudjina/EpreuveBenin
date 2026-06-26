"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
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
  const redirectTo = safeNext(formData.get("next"));
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await createUser({ name, email, password });
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "Erreur lors de l'inscription.";
  }

  // Connexion automatique après création du compte.
  try {
    await signIn("visitor", { email, password, redirectTo });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Compte créé. Veuillez vous connecter.";
    }
    throw error;
  }
}
