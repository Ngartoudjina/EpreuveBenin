import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { documents } from "@/db/schema";
import {
  EMAIL_VERIFICATION_ENABLED,
  isEmailVerified,
} from "@/lib/auth/verification";
import { getStorage } from "@/lib/storage";

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
    with: { examPaper: true },
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

  // Vérification d'e-mail (désactivée pour le moment) : les visiteurs non
  // confirmés sont redirigés uniquement si le flux est réactivé.
  if (EMAIL_VERIFICATION_ENABLED && session.user.role === "visitor") {
    const verified = await isEmailVerified(session.user.id);
    if (!verified) {
      return NextResponse.redirect(new URL("/verifier-email", req.url));
    }
  }

  await db
    .update(documents)
    .set({ downloadCount: sql`${documents.downloadCount} + 1` })
    .where(eq(documents.id, id));

  // URL de diffusion résolue par le fournisseur de stockage (signée chez
  // Cloudinary, sinon la diffusion des PDF est bloquée par défaut).
  const target = getStorage().deliveryUrl(
    { key: doc.storageKey, url: doc.url },
    { attachment: `${doc.examPaper.slug}-${doc.type}` },
  );
  return NextResponse.redirect(new URL(target, req.url));
}
