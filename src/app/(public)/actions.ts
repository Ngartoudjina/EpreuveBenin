"use server";

import { z } from "zod";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export type NewsletterState = { ok?: boolean; error?: string } | undefined;

const emailSchema = z
  .string()
  .trim()
  .email("Adresse e-mail invalide.")
  .max(254, "Adresse e-mail trop longue.");

/**
 * Inscription à la lettre d'information (bandeau de la page d'accueil).
 * Enregistrée comme message de contact : visible dans l'admin (A-08) sans
 * table dédiée ni migration.
 */
export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = emailSchema.safeParse(String(formData.get("email") ?? ""));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Adresse invalide." };
  }

  try {
    await db.insert(contactMessages).values({
      name: "Newsletter",
      email: parsed.data.toLowerCase(),
      message:
        "Souhaite être averti(e) lorsque de nouvelles épreuves sont ajoutées.",
    });
  } catch {
    return { error: "Impossible d'enregistrer votre adresse pour le moment." };
  }

  return { ok: true };
}
