"use client";

import { useActionState } from "react";

import { addDocumentAction, deleteDocumentAction } from "./actions";

type State = { error?: string } | undefined;

const FIELD =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";
const BTN =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60";

const LABEL = { sujet: "Sujet", corrige: "Corrigé" } as const;

/** Formulaire d'ajout d'un document (types restants uniquement). */
export function AddDocumentForm({
  paperId,
  types,
}: {
  paperId: string;
  types: ("sujet" | "corrige")[];
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    addDocumentAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="paperId" value={paperId} />
      <div>
        <label htmlFor="doc-type" className="text-xs font-medium text-muted">
          Type
        </label>
        <select id="doc-type" name="type" defaultValue={types[0]} className={FIELD}>
          {types.map((t) => (
            <option key={t} value={t}>
              {LABEL[t]}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="doc-file" className="text-xs font-medium text-muted">
          Fichier PDF
        </label>
        <input
          id="doc-file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className={FIELD}
        />
      </div>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "Téléversement…" : "Ajouter le document"}
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Bouton de suppression d'un document. */
export function DeleteDocumentButton({
  id,
  paperId,
}: {
  id: string;
  paperId: string;
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    deleteDocumentAction,
    undefined,
  );

  return (
    <form action={action} className="text-right">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="paperId" value={paperId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-surface disabled:opacity-60"
      >
        {pending ? "…" : "Supprimer"}
      </button>
      {state?.error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
