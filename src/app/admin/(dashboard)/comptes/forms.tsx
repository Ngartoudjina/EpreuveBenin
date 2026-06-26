"use client";

import { useActionState } from "react";

import {
  createAdminAction,
  deleteAdminAction,
  setRoleAction,
  type State,
} from "./actions";

type ActionFn = (prev: State, formData: FormData) => Promise<State>;

const FIELD =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none";
const BTN =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60";

/** Formulaire de création d'un administrateur. */
export function CreateAdminForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    createAdminAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-44 flex-1">
        <label htmlFor="adm-name" className="text-xs font-medium text-muted">
          Nom
        </label>
        <input id="adm-name" name="name" required className={FIELD} />
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="adm-email" className="text-xs font-medium text-muted">
          E-mail
        </label>
        <input
          id="adm-email"
          name="email"
          type="email"
          required
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="adm-role" className="text-xs font-medium text-muted">
          Rôle
        </label>
        <select id="adm-role" name="role" defaultValue="admin" className={FIELD}>
          <option value="admin">Admin</option>
          <option value="super_admin">Super-admin</option>
        </select>
      </div>
      <div className="w-44">
        <label htmlFor="adm-pwd" className="text-xs font-medium text-muted">
          Mot de passe
        </label>
        <input
          id="adm-pwd"
          name="password"
          type="password"
          required
          minLength={8}
          className={FIELD}
        />
      </div>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "…" : "Créer"}
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Sélecteur de rôle en ligne (soumet au changement). */
export function RoleForm({
  id,
  role,
  disabled,
}: {
  id: string;
  role: "admin" | "super_admin";
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    setRoleAction,
    undefined,
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name="role"
        defaultValue={role}
        disabled={disabled || pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground disabled:opacity-50"
      >
        <option value="admin">Admin</option>
        <option value="super_admin">Super-admin</option>
      </select>
      {state?.error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Bouton de suppression d'un administrateur. */
export function DeleteAdminButton({
  id,
  action,
  disabled,
}: {
  id: string;
  action?: ActionFn;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    action ?? deleteAdminAction,
    undefined,
  );

  if (disabled) {
    return <span className="text-xs text-muted">— vous —</span>;
  }

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
