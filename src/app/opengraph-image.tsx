import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Annales BEPC & BAC du Bénin`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image Open Graph générée à la volée (cartes de partage social). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#ffffff",
          background: "linear-gradient(135deg, #2d827b 0%, #1b5b57 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "84px",
              height: "84px",
              borderRadius: "20px",
              background: "#ffffff",
              color: "#1b5b57",
              fontSize: "52px",
              fontWeight: 800,
            }}
          >
            E
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05 }}>
            Annales BEPC &amp; BAC
          </div>
          <div style={{ fontSize: "40px", fontWeight: 600, opacity: 0.92 }}>
            Sujets et corrigés officiels du Bénin — gratuit
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "30px" }}>
          {["BEPC", "BAC", "Bénin", "Gratuit"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.18)",
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
