import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { Container } from "@/components/ui/container";

/**
 * Mise en page protégée de l'administration. Toute page sous ce groupe exige
 * une session valide ; sinon redirection vers la page de connexion.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Seuls les administrateurs accèdent au back-office (pas les comptes visiteurs).
  if (
    !session?.user ||
    (session.user.role !== "admin" && session.user.role !== "super_admin")
  ) {
    redirect("/admin/connexion");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-foreground">
              EpreuveBenin · Administration
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Tableau de bord
              </Link>
              <Link
                href="/admin/epreuves"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Épreuves
              </Link>
              <Link
                href="/admin/import"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Import
              </Link>
              <Link
                href="/admin/referentiels"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Référentiels
              </Link>
              <Link
                href="/admin/visiteurs"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Visiteurs
              </Link>
              <Link
                href="/admin/journal"
                className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Journal
              </Link>
              {session.user.role === "super_admin" && (
                <Link
                  href="/admin/comptes"
                  className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  Comptes
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/admin/compte"
              className="hidden text-muted transition-colors hover:text-foreground sm:inline"
            >
              {session.user.email}
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/connexion" });
              }}
            >
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 font-medium text-brand-600 transition-colors hover:bg-surface hover:text-brand-700"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
