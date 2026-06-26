# EpreuveBenin — Annales BEPC & BAC

**EpreuveBenin** est une plateforme web (PWA) de diffusion **gratuite** des
épreuves d'examen (sujets et corrigés) des sessions antérieures du **BEPC** et du
**BAC** en République du Bénin. Conçue pour être **rapide même en connexion
mobile dégradée (2G/3G)** et **consultable hors-ligne**.

## Pile technique

| Couche                | Choix                                              |
| --------------------- | -------------------------------------------------- |
| Framework             | **Next.js 16** (App Router, RSC, Turbopack)        |
| Langage               | TypeScript (strict)                                |
| Styles                | Tailwind CSS v4 (configuration CSS-first)          |
| Base de données       | PostgreSQL (prod) · **PGlite** embarqué (local)    |
| ORM / accès données   | Drizzle ORM (même schéma pour les deux pilotes)    |
| Authentification      | Auth.js (NextAuth v5) — visiteurs + back-office    |
| Validation env / data | Zod + `@t3-oss/env-nextjs`                          |
| Stockage des PDF      | **Cloudinary** (prod) · disque local (dev)         |
| Animations            | GSAP (`@gsap/react`) — respecte `prefers-reduced-motion` |
| SEO                   | Métadonnées, sitemap, robots, Open Graph, JSON-LD  |

## Démarrage rapide

Aucune base à installer en local : une base PostgreSQL **embarquée** (PGlite) est
créée dans `./.pglite`.

```bash
npm install
cp .env.example .env        # garder DB_DRIVER="pglite"
npm run db:local            # crée la base, applique les migrations, amorce
npm run dev                 # http://localhost:3000
```

### Administration (back-office)

Accès : `/admin`. Identifiants de démonstration créés par le seed :

- **E-mail** : `admin@beingar.bj`
- **Mot de passe** : `Beingar2026!`

> À changer impérativement en production, et régénérer `AUTH_SECRET`.

## Scripts

| Script                | Rôle                                                        |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | Serveur de développement                                    |
| `npm run build` / `start` | Build et démarrage production                           |
| `npm run lint` / `typecheck` | ESLint / vérification des types                      |
| `npm run db:generate` | Génère une migration SQL à partir du schéma Drizzle         |
| `npm run db:migrate`  | Applique les migrations (PostgreSQL)                        |
| `npm run db:local`    | Initialise la base **PGlite** locale (migre + amorce)       |
| `npm run db:studio`   | Drizzle Studio                                              |

## Modèle de données

`Examen → Série (optionnelle) → Matière → Session (année) → Épreuve → Document(s)`

- Le **BEPC** n'a pas de série ; `exam_papers.series_id` est nullable.
- URLs structurées : `/bac/serie-d/mathematiques/2024`, `/bepc/mathematiques/2024`.

## Production

En production : `DB_DRIVER=postgres`, `DATABASE_URL` (PostgreSQL managé),
`AUTH_SECRET`, `STORAGE_DRIVER=cloudinary` + clés Cloudinary, et
`NEXT_PUBLIC_SITE_URL` (domaine public, lu au build). Voir `src/env.ts`.
