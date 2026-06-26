import { env } from "@/env";

type SendArgs = { to: string; subject: string; html: string; text: string };

/** Expéditeur par défaut (domaine de test Resend tant qu'aucun n'est configuré). */
const DEFAULT_FROM = "EpreuveBenin <onboarding@resend.dev>";

/**
 * Envoi d'e-mail. Utilise l'API Resend si `RESEND_API_KEY` est défini ;
 * sinon (développement), journalise le contenu dans la console au lieu d'envoyer.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendArgs): Promise<void> {
  const from = env.EMAIL_FROM ?? DEFAULT_FROM;

  if (!env.RESEND_API_KEY) {
    console.log(
      `\n[email:dev] (RESEND_API_KEY absent — non envoyé)\n  À      : ${to}\n  Sujet  : ${subject}\n  ${text}\n`,
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Échec de l'envoi de l'e-mail (${res.status}) : ${detail}`);
  }
}
