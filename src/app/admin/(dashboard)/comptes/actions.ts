"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createAdminAccount,
  deleteAdminAccount,
  setAdminRole,
} from "@/lib/admin/admins";
import { logAction } from "@/lib/admin/audit";

export type State = { error?: string } | undefined;
const PATH = "/admin/comptes";

/** Réservé au super-admin. Renvoie l'id de l'admin courant (pour l'auto-garde). */
async function requireSuperAdmin(): Promise<string> {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "super_admin") redirect("/admin");
  return user.id;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function createAdminAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  await requireSuperAdmin();
  const email = String(formData.get("email") ?? "");
  const roleRaw = String(formData.get("role") ?? "admin");
  const role = roleRaw === "super_admin" ? "super_admin" : "admin";
  try {
    await createAdminAccount({
      name: String(formData.get("name") ?? ""),
      email,
      role,
      password: String(formData.get("password") ?? ""),
    });
    await logAction("create", "administrateur", email);
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function setRoleAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const currentId = await requireSuperAdmin();
  const id = String(formData.get("id") ?? "");
  const roleRaw = String(formData.get("role") ?? "admin");
  const role = roleRaw === "super_admin" ? "super_admin" : "admin";
  try {
    await setAdminRole(id, role, currentId);
    await logAction(
      "update",
      "administrateur",
      role === "super_admin" ? "→ super-admin" : "→ admin",
    );
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}

export async function deleteAdminAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const currentId = await requireSuperAdmin();
  try {
    await deleteAdminAccount(String(formData.get("id") ?? ""), currentId);
    await logAction("delete", "administrateur");
  } catch (error) {
    return { error: message(error) };
  }
  revalidatePath(PATH);
  return undefined;
}
