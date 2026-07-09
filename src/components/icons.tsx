/**
 * Jeu d'icônes SVG en ligne (style « trait », 24×24). Aucune dépendance ni
 * police d'icônes : empreinte minimale, idéal pour les connexions lentes.
 */
type IconProps = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v12" />
      <path d="m7 12 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

export function WifiOffIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 2 22 22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M5 13a10 10 0 0 1 4-2.5" />
      <path d="M19 13a10 10 0 0 0-7-3" />
      <path d="M2 8.8A15 15 0 0 1 7 6" />
      <path d="M22 8.8a15 15 0 0 0-6-3.2" />
      <path d="M12 20h.01" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
    </svg>
  );
}

export function GraduationIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M22 9 12 5 2 9l10 4 10-4Z" />
      <path d="M6 11v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
      <path d="M22 9v6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 2c.6 5.2 2.6 7.2 8 8-5.4.8-7.4 2.8-8 8-.6-5.2-2.6-7.2-8-8 5.4-.8 7.4-2.8 8-8Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V5.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V10H8.2v3h2.7v8h2.6Z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.8 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4.1.6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookOpenIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 6.5C10.5 4.9 8.4 4 6 4c-1.1 0-2.1.2-3 .5V19c.9-.3 1.9-.5 3-.5 2.4 0 4.5.9 6 2.5 1.5-1.6 3.6-2.5 6-2.5 1.1 0 2.1.2 3 .5V4.5c-.9-.3-1.9-.5-3-.5-2.4 0-4.5.9-6 2.5Z" />
      <path d="M12 6.5V21" />
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a1 1 0 0 0-1 1c0 2.2 1.8 4 4 4" />
      <path d="M17 6h3a1 1 0 0 1 1 1c0 2.2-1.8 4-4 4" />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21h18" />
      <path d="M12 3 4 8v13" />
      <path d="M12 3l8 5v13" />
      <path d="M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.7-3 3.3-5 6.5-5s5.8 2 6.5 5" />
      <path d="M16 5.1a3.5 3.5 0 0 1 0 5.8" />
      <path d="M18.5 15.4c1.6.8 2.7 2.1 3 4.1" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 11a8 8 0 0 0-14.9-3" />
      <path d="M5 3v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 3" />
      <path d="M19 21v-5h-5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9 2.9-6Z" />
    </svg>
  );
}
