"use server";

import { auth } from "@/auth";
import { resendVerification } from "@/lib/auth/verification";

export type ResendState = { sent?: boolean; error?: string } | undefined;

export async function resendAction(
  _prev: ResendState,
  _formData: FormData,
): Promise<ResendState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "visitor") {
    return { error: "Connectez-vous pour renvoyer l'e-mail de confirmation." };
  }
  try {
    const ok = await resendVerification(session.user.id);
    if (!ok) {
      return { error: "Adresse déjà confirmée ou compte introuvable." };
    }
    return { sent: true };
  } catch {
    return { error: "Échec de l'envoi. Réessayez dans un instant." };
  }
}
