import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(80),
  email: z.string().trim().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères.")
    .max(200),
});

export type RegisterInput = z.input<typeof registerSchema>;

/** Crée un compte visiteur (e-mail unique, mot de passe haché). */
export async function createUser(raw: RegisterInput): Promise<{ id: string }> {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Données invalides.");
  }
  const email = parsed.data.email.toLowerCase();

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    throw new Error("Un compte existe déjà avec cet e-mail.");
  }

  const [user] = await db
    .insert(users)
    .values({
      name: parsed.data.name,
      email,
      passwordHash: await hashPassword(parsed.data.password),
    })
    .returning({ id: users.id });

  return user;
}
