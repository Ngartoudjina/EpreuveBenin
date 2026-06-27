"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { logAction } from "@/lib/admin/audit";

const PATH = "/admin/messages";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");
}

export async function toggleHandledAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (!id) return;
  await db
    .update(contactMessages)
    .set({ handled: !handled })
    .where(eq(contactMessages.id, id));
  revalidatePath(PATH);
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  await logAction("delete", "message");
  revalidatePath(PATH);
}
