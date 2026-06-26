"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { changeOwnPassword } from "@/lib/admin/admins";
import { logAction } from "@/lib/admin/audit";

export type State = { error?: string; success?: boolean } | undefined;

export async function changePasswordAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/connexion");

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next !== confirm) {
    return { error: "La confirmation ne correspond pas au nouveau mot de passe." };
  }

  try {
    await changeOwnPassword(session.user.id, current, next);
    await logAction("update", "mot de passe");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue.",
    };
  }

  return { success: true };
}
