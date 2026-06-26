/**
 * Authentification (Auth.js / NextAuth v5).
 *
 * Deux fournisseurs « identifiants » distincts :
 *   - « admin »   : back-office, validé contre la table `admins`.
 *   - « visitor » : comptes candidats, validés contre la table `users`.
 *
 * Le rôle (`admin` | `super_admin` | `visitor`) est propagé dans la session.
 * Session JWT persistante (1 an) → l'utilisateur reste connecté entre visites.
 */
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { verifyPassword } from "@/lib/password";

import { admins, auditLogs, db, users } from "./db";

/** Met à jour la date de dernière connexion sans bloquer l'authentification. */
async function touchLastLogin(
  kind: "admin" | "visitor",
  id: string,
): Promise<void> {
  try {
    if (kind === "admin") {
      await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, id));
    } else {
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
    }
  } catch {
    // sans incidence sur la connexion
  }
}

function readCredentials(c: Partial<Record<"email" | "password", unknown>>) {
  return {
    email: String(c?.email ?? "").toLowerCase().trim(),
    password: String(c?.password ?? ""),
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 365 },
  pages: { signIn: "/connexion" },
  providers: [
    Credentials({
      id: "admin",
      name: "Administration",
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const { email, password } = readCredentials(raw);
        if (!email || !password) return null;
        const admin = await db.query.admins.findFirst({
          where: eq(admins.email, email),
        });
        if (!admin) return null;
        const valid = await verifyPassword(password, admin.passwordHash);
        if (!valid) return null;
        await touchLastLogin("admin", admin.id);
        try {
          await db.insert(auditLogs).values({
            actorId: admin.id,
            actorEmail: admin.email,
            action: "login",
            targetType: "admin",
          });
        } catch {
          // la journalisation ne bloque jamais la connexion
        }
        return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      },
    }),
    Credentials({
      id: "visitor",
      name: "Compte",
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const { email, password } = readCredentials(raw);
        if (!email || !password) return null;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;
        await touchLastLogin("visitor", user.id);
        return { id: user.id, name: user.name, email: user.email, role: "visitor" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (typeof token.role === "string") session.user.role = token.role;
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
