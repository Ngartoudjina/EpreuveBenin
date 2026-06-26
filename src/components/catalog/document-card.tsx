"use client";

import { useState } from "react";

import { DownloadIcon, EyeIcon, FileIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { formatFileSize } from "@/lib/format";

const DOC_LABEL: Record<string, string> = {
  sujet: "Sujet",
  corrige: "Corrigé",
};

/**
 * Carte d'un document (sujet / corrigé) avec aperçu PDF à la demande (F-06).
 * L'aperçu n'est chargé que sur action de l'utilisateur, pour économiser les
 * données mobiles. Le téléchargement reste accessible directement.
 */
export function DocumentCard({
  id,
  type,
  url,
  fileSizeBytes,
  pageCount,
}: {
  id: string;
  type: string;
  url: string;
  fileSizeBytes: number;
  pageCount: number | null;
}) {
  const [open, setOpen] = useState(false);
  const label = DOC_LABEL[type] ?? type;

  return (
    <li
      data-reveal
      className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <FileIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted">
              {pageCount ? `${pageCount} pages · ` : ""}
              {formatFileSize(fileSizeBytes)} · PDF
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <EyeIcon className="h-4 w-4" />
            {open ? "Masquer" : "Aperçu"}
          </button>
          <a
            href={`/api/download/${id}`}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            <DownloadIcon className="h-4 w-4" />
            Télécharger
          </a>
        </div>
      </div>

      {open && (
        <div className="border-t border-border p-4">
          <iframe
            src={`${url}#view=FitH`}
            title={`Aperçu — ${label}`}
            loading="lazy"
            className="h-[70vh] w-full rounded-xl border border-border bg-surface"
          />
          <p className="mt-2 text-xs text-muted">
            L&apos;aperçu n&apos;est chargé qu&apos;à la demande, pour économiser
            vos données.
          </p>
        </div>
      )}
    </li>
  );
}
