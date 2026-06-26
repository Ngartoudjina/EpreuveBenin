import type { DefaultSession } from "next-auth";

/** Ajoute le rôle de l'administrateur à la session et au token. */
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
