"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { createPaperAction, type CreatePaperState } from "../actions";

type Exam = { id: string; code: string; label: string };
type Serie = { id: string; examId: string; code: string; label: string };
type Subject = { id: string; label: string };

const FIELD =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";
const LABEL = "text-sm font-medium text-foreground";

export function PaperForm({
  exams,
  series,
  subjects,
}: {
  exams: Exam[];
  series: Serie[];
  subjects: Subject[];
}) {
  const [state, action, pending] = useActionState<CreatePaperState, FormData>(
    createPaperAction,
    undefined,
  );
  const [examId, setExamId] = useState(exams[0]?.id ?? "");
  const isBac = exams.find((e) => e.id === examId)?.code === "bac";
  const examSeries = series.filter((s) => s.examId === examId);
  const currentYear = new Date().getFullYear();

  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="examId" className={LABEL}>
          Examen
        </label>
        <select
          id="examId"
          name="examId"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className={FIELD}
        >
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {isBac && (
        <div>
          <label htmlFor="seriesId" className={LABEL}>
            Série
          </label>
          <select
            id="seriesId"
            name="seriesId"
            required
            defaultValue=""
            className={FIELD}
          >
            <option value="" disabled>
              Choisir une série…
            </option>
            {examSeries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="subjectId" className={LABEL}>
          Matière
        </label>
        <select
          id="subjectId"
          name="subjectId"
          required
          defaultValue=""
          className={FIELD}
        >
          <option value="" disabled>
            Choisir une matière…
          </option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="year" className={LABEL}>
            Année
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={1990}
            max={currentYear + 1}
            defaultValue={currentYear}
            required
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="type" className={LABEL}>
            Session
          </label>
          <select id="type" name="type" defaultValue="normale" className={FIELD}>
            <option value="normale">Normale</option>
            <option value="remplacement">Remplacement</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sujet" className={LABEL}>
          Sujet (PDF) *
        </label>
        <input
          id="sujet"
          name="sujet"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="mt-1 w-full text-sm text-muted"
        />
      </div>
      <div>
        <label htmlFor="corrige" className={LABEL}>
          Corrigé (PDF, optionnel)
        </label>
        <input
          id="corrige"
          name="corrige"
          type="file"
          accept="application/pdf,.pdf"
          className="mt-1 w-full text-sm text-muted"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Créer l'épreuve"}
        </button>
        <Link
          href="/admin/epreuves"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
