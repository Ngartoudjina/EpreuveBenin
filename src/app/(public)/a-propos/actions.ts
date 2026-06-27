"use server";

import { z } from "zod";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export type MessageState = { ok?: boolean; error?: string } | undefined;

const schema = z.object({
  name: z.string().trim().min(2, "Votre nom est trop court.").max(80),
  email: z.string().trim().email("Adresse e-mail invalide."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est trop court (10 caractères minimum).")
    .max(2000, "Votre message est trop long."),
});

/** Adresse de réception des messages (configurable, sinon contact public). */
const OWNER_EMAIL = process.env.CONTACT_EMAIL ?? "abelbeingar@gmail.com";

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendMessageAction(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }
  const { name, email, message } = parsed.data;

  // 1) Persistance (fiable, jamais perdue même si l'e-mail échoue).
  try {
    await db
      .insert(contactMessages)
      .values({ name, email: email.toLowerCase(), message });
  } catch {
    return { error: "Impossible d'envoyer le message pour le moment." };
  }

  // 2) Notification e-mail au propriétaire (best-effort).
  try {
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `Nouveau message — ${siteConfig.name}`,
      text: `De : ${name} <${email}>\n\n${message}`,
      html: `<p><strong>De :</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p style="white-space:pre-line">${esc(message)}</p>`,
    });
  } catch {
    // sans incidence : le message est déjà enregistré
  }

  return { ok: true };
}
