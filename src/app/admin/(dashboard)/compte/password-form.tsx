"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { EyeIcon } from "@/components/icons";

import { changePasswordAction, type State } from "./actions";

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none";

export function PasswordForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    changePasswordAction,
    undefined,
  );
  const [show, setShow] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Réinitialise le formulaire après un succès.
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <form ref={formRef} action={action} className="max-w-sm space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-foreground"
        >
          Mot de passe actuel
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          className={`mt-1 ${FIELD}`}
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-foreground"
        >
          Nouveau mot de passe
        </label>
        <div className="relative mt-1">
          <input
            id="newPassword"
            name="newPassword"
            type={show ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            className={`${FIELD} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Masquer" : "Afficher"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition-colors hover:text-foreground"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">8 caractères minimum.</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground"
        >
          Confirmer le nouveau mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={show ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          className={`mt-1 ${FIELD}`}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="text-sm font-medium text-brand-700">
          Mot de passe mis à jour.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
