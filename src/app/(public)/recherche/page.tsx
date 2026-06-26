import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { SearchExplorer } from "@/components/search/search-explorer";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Recherche",
  description:
    "Recherchez une épreuve du BEPC ou du BAC au Bénin par matière, série, année ou mot-clé.",
  alternates: { canonical: "/recherche" },
};

export default async function RecherchePage({
  searchParams,
}: PageProps<"/recherche">) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q : "";

  return (
    <Container className="py-12 sm:py-16">
      <Reveal>
        <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Catalogue
        </p>
        <h1 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Rechercher une épreuve
        </h1>
        <p data-reveal className="mt-3 max-w-2xl text-muted">
          Filtrez les annales par examen, série, matière, année et présence de
          corrigé. Les résultats s&apos;affichent instantanément.
        </p>
        <div data-reveal className="mt-8">
          <SearchExplorer initialQuery={initialQuery} />
        </div>
      </Reveal>
    </Container>
  );
}
