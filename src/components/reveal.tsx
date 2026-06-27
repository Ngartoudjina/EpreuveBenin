"use client";

import { useRef } from "react";

import { useScrollReveal } from "@/components/home/use-scroll-reveal";

/**
 * Conteneur générique qui révèle ses enfants marqués `data-reveal` au
 * défilement (apparition en cascade), en respectant `prefers-reduced-motion`.
 * Réutilisé sur les pages de contenu (catalogue, recherche, pages d'info).
 */
export function Reveal({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
