"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

/** Action de connexion : tente l'authentification par identifiants. */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("admin", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou mot de passe incorrect.";
    }
    // Laisse passer la redirection interne de Next.js (succès).
    throw error;
  }
}
