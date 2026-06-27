import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Mise en page protégée de l'administration. Toute page sous ce groupe exige
 * une session d'administrateur ; sinon redirection vers la page de connexion.
 * Le « shell » (sidebar verre + tiroir mobile + animations) est un composant client.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "admin" && session.user.role !== "super_admin")
  ) {
    redirect("/admin/connexion");
  }

  return (
    <AdminShell email={session.user.email ?? "—"} role={session.user.role}>
      {children}
    </AdminShell>
  );
}
