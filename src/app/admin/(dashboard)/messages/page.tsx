import type { Metadata } from "next";

import { listMessages } from "@/db/queries";

import { deleteMessageAction, toggleHandledAction } from "./actions";

export const metadata: Metadata = {
  title: "Messages — Administration",
  robots: { index: false, follow: false },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const GLASS = "rounded-2xl border border-white/60 bg-white/60 shadow-soft backdrop-blur-xl";

export default async function MessagesPage() {
  const messages = await listMessages();
  const pending = messages.filter((m) => !m.handled).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Messages{" "}
          <span className="text-muted">({messages.length})</span>
        </h1>
        <p className="mt-1 text-muted">
          Messages laissés depuis la page « À propos ».
          {pending > 0 && (
            <span className="ml-1 font-medium text-brand-700">
              {pending} non traité{pending > 1 ? "s" : ""}.
            </span>
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <p className={`${GLASS} p-6 text-muted`}>Aucun message pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`${GLASS} p-5 ${m.handled ? "opacity-70" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <a
                    href={`mailto:${m.email}?subject=Re:%20votre%20message`}
                    className="text-sm text-brand-700 hover:text-brand-800"
                  >
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  {m.handled ? (
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                      Traité
                    </span>
                  ) : (
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                      Nouveau
                    </span>
                  )}
                  <span className="text-xs text-muted">
                    {dateFmt.format(m.createdAt)}
                  </span>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {m.message}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
                <form action={toggleHandledAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="handled" value={String(m.handled)} />
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-white hover:text-foreground"
                  >
                    {m.handled ? "Marquer non traité" : "Marquer comme traité"}
                  </button>
                </form>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-white"
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
