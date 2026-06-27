"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  BoltIcon,
  DownloadIcon,
  FileIcon,
  GraduationIcon,
  HomeIcon,
  MailIcon,
  SparkleIcon,
  UserIcon,
} from "@/components/icons";

type Item = { href: string; label: string; Icon: typeof HomeIcon; exact?: boolean };

const NAV: Item[] = [
  { href: "/admin", label: "Tableau de bord", Icon: HomeIcon, exact: true },
  { href: "/admin/epreuves", label: "Épreuves", Icon: FileIcon },
  { href: "/admin/import", label: "Import en masse", Icon: DownloadIcon },
  { href: "/admin/referentiels", label: "Référentiels", Icon: GraduationIcon },
  { href: "/admin/visiteurs", label: "Visiteurs", Icon: UserIcon },
  { href: "/admin/messages", label: "Messages", Icon: MailIcon },
  { href: "/admin/journal", label: "Journal", Icon: BoltIcon },
];

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super-admin",
  admin: "Administrateur",
};

function isActivePath(pathname: string, it: Item): boolean {
  return it.exact
    ? pathname === it.href
    : pathname === it.href || pathname.startsWith(`${it.href}/`);
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 ring-1 ring-brand-100">
        <Image
          src="/hero/logo.png"
          alt=""
          width={36}
          height={36}
          className="logo-tint h-5 w-5 object-contain"
        />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight text-foreground">
          Epreuve<span className="text-brand-600">Benin</span>
        </span>
        <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">
          Administration
        </span>
      </span>
    </Link>
  );
}

function NavList({
  items,
  pathname,
  variant,
  onNavigate,
}: {
  items: Item[];
  pathname: string;
  variant: "side" | "drawer";
  onNavigate?: () => void;
}) {
  return (
    <nav data-admin-nav className="flex flex-col gap-1">
      {items.map((it) => {
        const active = isActivePath(pathname, it);
        const attr =
          variant === "side" ? { "data-nav-item": "" } : { "data-drawer-item": "" };
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            {...attr}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-600 text-white shadow-soft"
                : "text-muted hover:bg-white/70 hover:text-foreground"
            }`}
          >
            <it.Icon className="h-5 w-5 shrink-0" />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Account({
  email,
  role,
  onNavigate,
}: {
  email: string;
  role: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/60 p-3 text-sm backdrop-blur-xl">
      <p className="truncate font-semibold text-foreground">{email}</p>
      <p className="mt-0.5 text-xs text-brand-700">{ROLE_LABEL[role] ?? role}</p>
      <div className="mt-3 flex flex-col gap-1.5">
        <Link
          href="/admin/compte"
          onClick={onNavigate}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-white hover:text-foreground"
        >
          Mon compte
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-white hover:text-foreground"
        >
          Voir le site public
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/connexion" })}
          className="rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-brand-600 transition-colors hover:bg-white hover:text-brand-700"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}

function ArrowOut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminShell({
  email,
  role,
  children,
}: {
  email: string;
  role: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  const items =
    role === "super_admin"
      ? [...NAV, { href: "/admin/comptes", label: "Comptes", Icon: SparkleIcon }]
      : NAV;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.from("[data-nav-item]", {
          x: -14,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
        });
      }
      if (drawerRef.current && backdropRef.current) {
        const tl = gsap.timeline({ paused: true });
        tl.set([backdropRef.current, drawerRef.current], { autoAlpha: 0 });
        tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0)
          .fromTo(
            drawerRef.current,
            { autoAlpha: 0, xPercent: -100 },
            { autoAlpha: 1, xPercent: 0, duration: 0.4, ease: "power3.out" },
            0,
          )
          .from(
            drawerRef.current.querySelectorAll("[data-drawer-item]"),
            { x: -12, autoAlpha: 0, duration: 0.35, stagger: 0.04, ease: "power3.out" },
            0.12,
          );
        tlRef.current = tl;
      }
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const tl = tlRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (tl) {
      if (open) {
        if (reduce) tl.progress(1).pause();
        else tl.play();
      } else if (reduce) tl.progress(0).pause();
      else tl.reverse();
    }
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-h-screen bg-surface">
      {/* Décor : halos diffus pour faire ressortir le verre */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-300/25 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />
      </div>

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-white/60 bg-white/55 p-4 backdrop-blur-2xl lg:flex">
        <div className="px-1 pt-1">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavList items={items} pathname={pathname} variant="side" />
        </div>
        <Account email={email} role={role} />
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/60 bg-white/70 px-4 backdrop-blur-2xl lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 text-foreground ring-1 ring-border"
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current" />
            <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
        <Brand />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/connexion" })}
          aria-label="Déconnexion"
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 text-brand-600 ring-1 ring-border"
        >
          <ArrowOut className="h-5 w-5" />
        </button>
      </header>

      {/* Drawer (mobile) */}
      <div
        ref={backdropRef}
        onClick={() => setOpen(false)}
        aria-hidden
        className="invisible fixed inset-0 z-40 bg-foreground/30 opacity-0 backdrop-blur-sm lg:hidden"
      />
      <aside
        ref={drawerRef}
        aria-label="Menu d'administration"
        className="invisible fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82%] flex-col gap-6 border-r border-white/60 bg-white/85 p-4 opacity-0 shadow-lift backdrop-blur-2xl lg:hidden"
      >
        <div className="flex items-center justify-between px-1 pt-1">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-x-0.5 -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-x-0.5 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavList
            items={items}
            pathname={pathname}
            variant="drawer"
            onNavigate={() => setOpen(false)}
          />
        </div>
        <div data-drawer-item>
          <Account email={email} role={role} onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* Contenu */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
