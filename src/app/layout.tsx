import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";

import { env } from "@/env";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const titleDefault = `${siteConfig.name} — Annales BEPC & BAC du Bénin`;

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: titleDefault,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  category: "education",
  alternates: { canonical: "/" },
  keywords: [
    "BEPC",
    "BAC",
    "Bénin",
    "annales",
    "annales BEPC",
    "annales BAC",
    "sujets d'examen",
    "corrigés",
    "épreuves",
    "baccalauréat",
    "brevet",
    "révisions",
  ],
  authors: [{ name: "Abel Beingar", url: "https://abelbeingar.me" }],
  creator: "Abel Beingar",
  publisher: siteConfig.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: titleDefault,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: siteConfig.description,
    creator: siteConfig.twitter,
    site: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
