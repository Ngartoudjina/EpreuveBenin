"use client";

import { useActionState } from "react";

import { CheckIcon } from "@/components/icons";

import { sendMessageAction, type MessageState } from "./actions";

const FIELD =
  "mt-1 w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground backdrop-blur transition-colors focus-visible:border-brand-400 focus-visible:outline-none";

export function MessageForm() {
  const [state, action, pending] = useActionState<MessageState, FormData>(
    sendMessageAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-brand-200 bg-brand-50/60 p-8 text-center backdrop-blur-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-xl font-bold text-foreground">
          Message envoyé !
        </h3>
        <p className="mt-2 text-muted">
          Merci, nous avons bien reçu votre message et reviendrons vers vous dès
          que possible.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-soft backdrop-blur-xl sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="msg-name" className="text-sm font-medium text-foreground">
            Nom
          </label>
          <input
            id="msg-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Votre nom"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="msg-email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="msg-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={FIELD}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="msg-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="msg-message"
          name="message"
          required
          rows={5}
          placeholder="Votre question ou suggestion…"
          className={`${FIELD} resize-y`}
        />
      </div>

      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
