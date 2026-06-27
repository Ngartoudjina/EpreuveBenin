import { siteConfig } from "@/lib/site";

/** Échappe le HTML (les valeurs proviennent de saisies utilisateur). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** E-mail de confirmation d'adresse (vérification de compte). */
export function verificationEmail({
  name,
  url,
}: {
  name: string;
  url: string;
}): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(name);
  const subject = `Confirmez votre adresse e-mail — ${siteConfig.name}`;

  const text = `Bonjour ${name},

Confirmez votre adresse e-mail pour activer le téléchargement des annales sur ${siteConfig.name} :
${url}

Ce lien expire dans 24 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`;

  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#fdf8f4;font-family:Arial,Helvetica,sans-serif;color:#1c1410">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px">
    <div style="font-weight:800;font-size:20px;color:#1b5b57;margin-bottom:24px">${siteConfig.name}</div>
    <div style="background:#ffffff;border-radius:16px;padding:28px;border:1px solid #f0e6dd">
      <h1 style="font-size:20px;margin:0 0 12px">Confirmez votre e-mail</h1>
      <p style="margin:0 0 8px;line-height:1.6">Bonjour ${safeName},</p>
      <p style="margin:0 0 20px;line-height:1.6;color:#6b5d52">Cliquez sur le bouton ci-dessous pour confirmer votre adresse et activer le téléchargement des annales.</p>
      <a href="${url}" style="display:inline-block;background:#226d68;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px">Confirmer mon e-mail</a>
      <p style="margin:20px 0 0;font-size:13px;color:#9a8c80;line-height:1.6">Ou copiez ce lien dans votre navigateur :<br><span style="word-break:break-all">${url}</span></p>
    </div>
    <p style="font-size:12px;color:#9a8c80;margin-top:20px">Ce lien expire dans 24 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
  </div></body></html>`;

  return { subject, html, text };
}
