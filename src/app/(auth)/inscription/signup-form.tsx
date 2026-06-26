"use client";

import { useActionState, useState } from "react";

import { EyeIcon } from "@/components/icons";

import { registerAction } from "./actions";

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus-visible:outline-none";

export function SignupForm({ next }: { next: string }) {
  const [error, action, pending] = useActionState(registerAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={`mt-1 ${FIELD}`}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`mt-1 ${FIELD}`}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Mot de passe
        </label>
        <div className="relative mt-1">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            className={`${FIELD} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition-colors hover:text-foreground"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">6 caractères minimum.</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
