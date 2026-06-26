import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { listAdmins } from "@/db/queries";

import { CreateAdminForm, DeleteAdminButton, RoleForm } from "./forms";

export const metadata: Metadata = {
  title: "Comptes administrateurs — Administration",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function ComptesPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");
  const currentId = session.user.id;

  const admins = await listAdmins();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Comptes administrateurs{" "}
          <span className="text-muted">({admins.length})</span>
        </h1>
        <p className="mt-1 text-muted">
          Réservé aux super-administrateurs. Il doit toujours rester au moins un
          super-admin.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <p className="mb-3 text-sm font-medium text-foreground">
          Nouvel administrateur
        </p>
        <CreateAdminForm />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Dernière connexion</th>
              <th className="px-4 py-3 font-medium">Créé le</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => {
              const isSelf = a.id === currentId;
              return (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {a.name}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                        vous
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{a.email}</td>
                  <td className="px-4 py-3">
                    <RoleForm
                      id={a.id}
                      role={a.role}
                      disabled={isSelf}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {a.lastLoginAt ? dateFmt.format(a.lastLoginAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {dateFmt.format(a.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteAdminButton id={a.id} disabled={isSelf} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
