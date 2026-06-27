import { randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { verificationEmail } from "@/lib/email/templates";
import { absoluteUrl } from "@/lib/seo";

/**
 * Interrupteur global de la vérification d'e-mail.
 * `false` = désactivée : inscription immédiate, aucun e-mail envoyé, et le
 * téléchargement n'est pas bloqué. Repasser à `true` réactive tout le flux
 * (la logique, la page /verifier-email et le module e-mail restent en place).
 */
export const EMAIL_VERIFICATION_ENABLED = false;

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

/** Crée un jeton (unique par utilisateur) et envoie l'e-mail de confirmation. */
export async function sendVerificationEmail(user: {
  id: string;
  name: string;
  email: string;
}): Promise<void> {
  // Un seul jeton actif à la fois.
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, user.id));

  const token = randomBytes(32).toString("hex");
  await db.insert(verificationTokens).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  const url = absoluteUrl(`/verifier-email?token=${token}`);
  const { subject, html, text } = verificationEmail({ name: user.name, url });
  await sendEmail({ to: user.email, subject, html, text });
}

export type VerifyResult = "verified" | "already" | "invalid" | "expired";

/** Valide un jeton : marque l'e-mail comme vérifié puis consomme le jeton. */
export async function verifyEmailToken(token: string): Promise<VerifyResult> {
  if (!token) return "invalid";

  const [row] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token));
  if (!row) return "invalid";

  if (row.expiresAt.getTime() < Date.now()) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, row.id));
    return "expired";
  }

  const [u] = await db
    .select({ emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, row.userId));

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, row.userId));
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, row.userId));

  return u?.emailVerified ? "already" : "verified";
}

/** Indique si l'adresse d'un utilisateur (visiteur) est vérifiée. */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const [u] = await db
    .select({ emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId));
  return Boolean(u?.emailVerified);
}

/** Renvoie un e-mail de confirmation (si le compte existe et n'est pas vérifié). */
export async function resendVerification(userId: string): Promise<boolean> {
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  if (!u || u.emailVerified) return false;
  await sendVerificationEmail({ id: u.id, name: u.name, email: u.email });
  return true;
}
