"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

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
  const redirectTo = safeNext(formData.get("next"));
  try {
    await signIn("visitor", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou mot de passe incorrect.";
    }
    throw error;
  }
}
