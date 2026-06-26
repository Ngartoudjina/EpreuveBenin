import { NextResponse } from "next/server";

import { getSearchIndex } from "@/db/queries";

// Index quasi statique : régénéré au plus toutes les heures (ISR) et mis en
// cache par le CDN et le navigateur (clé pour la recherche instantanée / hors-ligne).
export const revalidate = 3600;

export async function GET() {
  const docs = await getSearchIndex();
  return NextResponse.json(docs, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
