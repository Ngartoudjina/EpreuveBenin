import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { isEmailVerified } from "@/lib/auth/verification";

export const dynamic = "force-dynamic";

/**
 * Téléchargement protégé : connexion obligatoire. Si non connecté, redirige
 * vers /connexion (en mémorisant la cible). Sinon, incrémente le compteur
 * (F-07) puis sert le fichier.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const doc = await db.query.documents.findFirst({
    where: eq(documents.id, id),
  });
  if (!doc) {
    return new NextResponse("Document introuvable.", { status: 404 });
  }

  const session = await auth();
  if (!session?.user) {
    const url = new URL("/connexion", req.url);
    url.searchParams.set("next", `/api/download/${id}`);
    return NextResponse.redirect(url);
  }

  // Les visiteurs doivent avoir confirmé leur e-mail (les admins en sont exemptés).
  if (session.user.role === "visitor") {
    const verified = await isEmailVerified(session.user.id);
    if (!verified) {
      return NextResponse.redirect(new URL("/verifier-email", req.url));
    }
  }

  await db
    .update(documents)
    .set({ downloadCount: sql`${documents.downloadCount} + 1` })
    .where(eq(documents.id, id));

  return NextResponse.redirect(new URL(doc.url, req.url));
}
