"use client";

import { useRef } from "react";

import { Breadcrumb, type Crumb } from "@/components/catalog/breadcrumb";
import { useScrollReveal } from "@/components/home/use-scroll-reveal";
import { Container } from "@/components/ui/container";

/** Mise en page commune des pages du catalogue : fil d'Ariane + titre + contenu,
 *  avec révélation en cascade au défilement. */
export function CatalogShell({
  crumbs,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <Container className="py-8 sm:py-12">
      <div ref={ref}>
        <div data-reveal>
          <Breadcrumb items={crumbs} />
        </div>
        <h1 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p data-reveal className="mt-2 max-w-2xl text-muted">
            {intro}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </Container>
  );
}
