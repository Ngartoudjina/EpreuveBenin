"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { siteConfig } from "@/lib/site";

/**
 * Mise en page d'authentification en deux colonnes : visuel immersif à gauche,
 * formulaire à droite. Entrée animée avec GSAP (respect de prefers-reduced-motion).
 */
export function AuthShell({
  title,
  subtitle,
  topRight,
  footer,
  image = "/hero/sign.jpg",
  children,
}: {
  title: string;
  subtitle: string;
  topRight: { label: string; href: string };
  footer: React.ReactNode;
  image?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".auth-img", { scale: 1.12, duration: 1.3, ease: "power2.out" })
          .from(".auth-overlay", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.8")
          .from(".auth-rise", { y: 18, opacity: 0, duration: 0.6, stagger: 0.09 }, "-=0.6");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="min-h-screen bg-surface-2 sm:p-6">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl overflow-hidden bg-background sm:min-h-[calc(100vh-3rem)] sm:rounded-3xl sm:shadow-lift">
        <div className="grid w-full lg:grid-cols-2">
          {/* Colonne visuelle */}
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0px"
              className="auth-img object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/15 to-brand-900/30" />

            <Link
              href="/"
              className="auth-overlay absolute left-7 top-7 flex items-center gap-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white font-bold text-brand-700">
                {siteConfig.name.charAt(0)}
              </span>
              <span className="font-bold text-white">{siteConfig.name}</span>
            </Link>

            <div className="auth-overlay absolute inset-x-0 bottom-0 p-8 text-white">
              <h2 className="text-3xl font-bold leading-tight">
                Réussis tes examens
              </h2>
              <p className="mt-2 max-w-sm text-white/85">
                Sujets et corrigés officiels du BEPC et du BAC, gratuitement.
              </p>
              <div className="mt-5 flex gap-1.5" aria-hidden>
                <span className="h-1.5 w-6 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              </div>
            </div>
          </div>

          {/* Colonne formulaire */}
          <div className="flex flex-col p-6 sm:p-10">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="auth-rise flex items-center gap-2 lg:invisible"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  {siteConfig.name.charAt(0)}
                </span>
                <span className="font-bold text-foreground">
                  {siteConfig.name}
                </span>
              </Link>
              <Link
                href={topRight.href}
                className="auth-rise rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-foreground/90"
              >
                {topRight.label}
              </Link>
            </div>

            <div className="flex flex-1 flex-col justify-center py-10">
              <div className="mx-auto w-full max-w-sm">
                <h1 className="auth-rise text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
                <p className="auth-rise mt-1.5 text-muted">{subtitle}</p>
                <div className="auth-rise mt-8">{children}</div>
                <p className="auth-rise mt-6 text-center text-sm text-muted">
                  {footer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
