"use client";

import { useActionState } from "react";

import {
  createSeriesAction,
  createSessionAction,
  createSubjectAction,
} from "./actions";

type ActionFn = (
  prev: { error?: string } | undefined,
  formData: FormData,
) => Promise<{ error?: string } | undefined>;

const FIELD =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";
const BTN =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60";

/** Formulaire d'ajout d'une matière. */
export function SubjectForm() {
  const [state, action, pending] = useActionState(createSubjectAction, undefined);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-56 flex-1">
        <label htmlFor="subj-label" className="text-xs font-medium text-muted">
          Nouvelle matière
        </label>
        <input
          id="subj-label"
          name="label"
          required
          placeholder="Ex. Comptabilité"
          className={FIELD}
        />
      </div>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "…" : "Ajouter"}
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Formulaire d'ajout d'une série (rattachée à un examen). */
export function SeriesForm({
  exams,
}: {
  exams: { id: string; code: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(createSeriesAction, undefined);
  const defaultExam = exams.find((e) => e.code === "bac")?.id ?? exams[0]?.id;

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="serie-exam" className="text-xs font-medium text-muted">
          Examen
        </label>
        <select
          id="serie-exam"
          name="examId"
          defaultValue={defaultExam}
          className={FIELD}
        >
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-24">
        <label htmlFor="serie-code" className="text-xs font-medium text-muted">
          Code
        </label>
        <input
          id="serie-code"
          name="code"
          required
          placeholder="F1"
          className={FIELD}
        />
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="serie-label" className="text-xs font-medium text-muted">
          Libellé
        </label>
        <input
          id="serie-label"
          name="label"
          required
          placeholder="Série F1 — Fabrication mécanique"
          className={FIELD}
        />
      </div>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "…" : "Ajouter"}
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Formulaire d'ajout d'une session (année + type). */
export function SessionForm() {
  const [state, action, pending] = useActionState(
    createSessionAction,
    undefined,
  );
  const currentYear = new Date().getFullYear();

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="w-32">
        <label htmlFor="sess-year" className="text-xs font-medium text-muted">
          Année
        </label>
        <input
          id="sess-year"
          name="year"
          type="number"
          required
          min={1990}
          max={currentYear + 1}
          defaultValue={currentYear}
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="sess-type" className="text-xs font-medium text-muted">
          Type
        </label>
        <select id="sess-type" name="type" defaultValue="normale" className={FIELD}>
          <option value="normale">Normale</option>
          <option value="remplacement">Remplacement</option>
        </select>
      </div>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "…" : "Ajouter"}
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Bouton de suppression réutilisable, affichant l'erreur éventuelle. */
export function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: ActionFn;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="text-right">
      <input type="hidden" name="id" value={id} />
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
