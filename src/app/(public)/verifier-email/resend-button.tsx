"use client";

import { useActionState } from "react";

import { resendAction, type ResendState } from "./actions";

export function ResendButton() {
  const [state, action, pending] = useActionState<ResendState, FormData>(
    resendAction,
    undefined,
  );

  return (
    <div>
      <form action={action}>
        <button
          type="submit"
          disabled={pending || state?.sent}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Envoi…" : state?.sent ? "E-mail envoyé" : "Renvoyer l'e-mail"}
        </button>
      </form>
      {state?.sent && (
        <p role="status" className="mt-2 text-sm text-brand-700">
          E-mail renvoyé — vérifiez votre boîte de réception (et les spams).
        </p>
      )}
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {state.error}
        </p>
      )}
    </div>
  );
}
