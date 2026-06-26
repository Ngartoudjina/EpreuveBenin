import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(80),
  email: z.string().trim().email("Adresse e-mail invalide."),
  role: z.enum(["admin", "super_admin"]).default("admin"),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères.")
    .max(200),
});

export type CreateAdminInput = z.input<typeof createAdminSchema>;

/** Nombre de super-administrateurs (en excluant éventuellement un id). */
async function countSuperAdmins(excludeId?: string): Promise<number> {
  const rows = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.role, "super_admin"));
  return excludeId ? rows.filter((r) => r.id !== excludeId).length : rows.length;
}

/** Crée un compte administrateur (e-mail unique, mot de passe haché). */
export async function createAdminAccount(raw: CreateAdminInput): Promise<void> {
  const parsed = createAdminSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Données invalides.");
  }
  const email = parsed.data.email.toLowerCase();

  const existing = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.email, email));
  if (existing.length > 0) {
    throw new Error("Un administrateur existe déjà avec cet e-mail.");
  }

  await db.insert(admins).values({
    name: parsed.data.name,
    email,
    role: parsed.data.role,
    passwordHash: await hashPassword(parsed.data.password),
  });
}

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis."),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit faire au moins 8 caractères.")
    .max(200),
});

/** Permet à un administrateur de changer son propre mot de passe. */
export async function changeOwnPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Données invalides.");
  }

  const [admin] = await db.select().from(admins).where(eq(admins.id, id));
  if (!admin) throw new Error("Compte introuvable.");

  const ok = await verifyPassword(currentPassword, admin.passwordHash);
  if (!ok) throw new Error("Mot de passe actuel incorrect.");

  await db
    .update(admins)
    .set({ passwordHash: await hashPassword(newPassword) })
    .where(eq(admins.id, id));
}

/** Change le rôle d'un administrateur (protège le dernier super-admin). */
export async function setAdminRole(
  id: string,
  role: "admin" | "super_admin",
  currentAdminId: string,
): Promise<void> {
  const [target] = await db.select().from(admins).where(eq(admins.id, id));
  if (!target) throw new Error("Administrateur introuvable.");
  if (target.role === role) return;

  if (target.role === "super_admin" && role !== "super_admin") {
    if (id === currentAdminId) {
      throw new Error("Vous ne pouvez pas retirer votre propre rôle super-admin.");
    }
    if ((await countSuperAdmins(id)) === 0) {
      throw new Error(
        "Impossible : il doit rester au moins un super-administrateur.",
      );
    }
  }

  await db.update(admins).set({ role }).where(eq(admins.id, id));
}

/** Supprime un administrateur (jamais soi-même ni le dernier super-admin). */
export async function deleteAdminAccount(
  id: string,
  currentAdminId: string,
): Promise<void> {
  if (id === currentAdminId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }
  const [target] = await db.select().from(admins).where(eq(admins.id, id));
  if (!target) return;

  if (target.role === "super_admin" && (await countSuperAdmins(id)) === 0) {
    throw new Error(
      "Impossible : il doit rester au moins un super-administrateur.",
    );
  }

  await db.delete(admins).where(eq(admins.id, id));
}
