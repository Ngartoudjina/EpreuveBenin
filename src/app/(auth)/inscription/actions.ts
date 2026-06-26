"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/auth/verification";
import { createUser } from "@/lib/users";

type State = string | undefined;

export async function registerAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
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

  // Envoi de l'e-mail de confirmation (sans bloquer l'inscription si échec).
  try {
    await sendVerificationEmail({ id: created.id, name, email });
  } catch {
    // l'utilisateur pourra le renvoyer depuis la page de vérification
  }

  // Connexion automatique, puis redirection vers la page « vérifiez votre e-mail ».
  try {
    await signIn("visitor", {
      email,
      password,
      redirectTo: "/verifier-email",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Compte créé. Veuillez vous connecter.";
    }
    throw error;
  }
}
