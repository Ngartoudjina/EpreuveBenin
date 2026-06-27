"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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

  // Vérification désactivée : connexion automatique (ancien comportement).
  if (!EMAIL_VERIFICATION_ENABLED) {
    try {
      await signIn("visitor", { email, password, redirectTo: next });
      return undefined;
    } catch (error) {
      if (error instanceof AuthError) {
        return "Compte créé. Veuillez vous connecter.";
      }
      throw error;
    }
  }

  // Vérification activée : on envoie l'e-mail de confirmation, on NE connecte PAS
  // automatiquement, et on redirige vers la page de connexion avec une
  // notification invitant à vérifier la boîte de réception (et les spams).
  try {
    await sendVerificationEmail({ id: created.id, name, email });
  } catch {
    // l'utilisateur pourra renvoyer l'e-mail depuis /verifier-email
  }

  const params = new URLSearchParams({ verifier: "1" });
  if (next !== "/") params.set("next", next);
  redirect(`/connexion?${params.toString()}`);
}
