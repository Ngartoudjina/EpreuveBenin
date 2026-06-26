import { auth } from "@/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "import"
  | "login";

/**
 * Enregistre une action du back-office (A-07).
 *
 * L'acteur est déduit de la session courante. La journalisation est
 * « best-effort » : toute erreur est avalée pour ne jamais faire échouer
 * l'action métier sous-jacente.
 */
export async function logAction(
  action: AuditAction,
  targetType: string,
  targetLabel?: string | null,
): Promise<void> {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.email) return;
    await db.insert(auditLogs).values({
      actorId: user.id || null,
      actorEmail: user.email,
      action,
      targetType,
      targetLabel: targetLabel ?? null,
    });
  } catch {
    // sans incidence sur l'action métier
  }
}
