# Buildfolio

A multi-tenant, scalable portfolio-builder web app where users can sign up, choose from pre-made templates (or start blank), and dynamically manage the sections, content, and settings of their public portfolio page — all from a personal admin dashboard.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **ORM:** Prisma 7 (using driver adapters, `@prisma/adapter-pg`)
- **Database:** PostgreSQL via Supabase
- **Auth:** NextAuth v5 (Credentials provider, bcrypt password hashing)
- **Image storage:** Cloudinary
- **Validation:** Zod
- **Styling:** Tailwind CSS


## Architecture Overview

Buildfolio is multi-tenant by design. Each user owns exactly one `Portfolio`, made up of ordered `Section` rows with flexible JSON content (validated per section type with Zod). New users can apply a pre-built `Template` — which clones its `TemplateSection` rows into their own `Section` rows — or start from a blank portfolio and build sections manually later.

Public portfolios are served under their own subdomains (e.g., `username.localhost:3000` in dev or `username.buildfolio.com` in prod) using Next.js Middleware to internally rewrite the incoming request to the dynamic `/[username]` page route. This allows `app/[username]/page.tsx` to handle the portfolio rendering seamlessly without any route changes.

## Data Model

| Model | Purpose |
|---|---|
| `User` | Account credentials (email, hashed password) |
| `Portfolio` | One per user; holds a unique public `slug` and optional `templateId` |
| `Section` | Ordered, toggleable content blocks (`type`, `order`, `isVisible`, `content` JSON) belonging to a portfolio |
| `Settings` | Per-portfolio theme color, font, and SEO metadata |
| `Template` | A named, selectable starting layout (e.g. "Minimal", "Developer") |
| `TemplateSection` | Starter section content belonging to a `Template`, cloned into `Section` rows on selection |

Foreign keys use cascading deletes, and indexes are set on `slug` and all foreign-key columns to keep lookups fast as data grows.

## Progress

### ✅ Phase 1 — Foundation
- Scaffolded Next.js + TypeScript + Tailwind + ESLint project
- Designed and migrated the full Prisma schema (`User`, `Portfolio`, `Section`, `Settings`, `Template`, `TemplateSection`)
- Resolved Prisma 7 breaking changes: moved `directUrl` handling into `prisma.config.ts` for CLI/migrations, kept pooled `DATABASE_URL` for the runtime client
- Built a hot-reload-safe Prisma singleton client using the `PrismaPg` driver adapter
- Seeded two demo templates ("Minimal", "Developer"), each with 4 starter sections (hero, about, projects, contact)

### ✅ Phase 2 — Auth & Multi-tenancy
- NextAuth v5 with a Credentials provider backed by the Prisma `User` model, passwords hashed with bcrypt
- Signup flow creates a `User` and a blank `Portfolio` (auto-generated unique slug) in a single transaction
- Tenant-scoping helper ensures every dashboard query is filtered by the authenticated user's ownership
- Middleware protects all `/dashboard` routes, redirecting unauthenticated visitors to `/login`
- Subdomain Routing: Added middleware subdomain detection for `localhost:3000` and configurable `NEXT_PUBLIC_ROOT_DOMAIN` to rewrite requests to user portfolios.
- Portfolio URL Helper: Created `getPortfolioUrl` utility to generate public subdomain URLs dynamically in all environments, and updated the Dashboard's "View Site" button.
- Template selection built as a dashboard action (not forced onboarding):
  - `GET /api/templates` — lists active templates
  - `POST /api/portfolio/apply-template` — clones a template's sections into the user's portfolio inside a transaction, scoped strictly by session user ID
  - Dashboard empty-state UI lets users pick a template or start blank

### ✅ Phase 3 — Public Portfolio Rendering
- Dynamic `[username]` route resolves a portfolio by slug and renders only visible, ordered sections
- `SectionRenderer` dispatches each `Section.type` to its matching component (`HeroSection`, `AboutSection`, `ProjectsSection`, `ContactSection`), with Zod validation on JSON content
- Per-portfolio SEO metadata (`generateMetadata`) with sensible fallbacks
- ISR caching (`revalidate = 60`) balances freshness with performance
- Graceful "Portfolio Under Construction" placeholder for portfolios with no sections yet
- Clean 404 handling for nonexistent slugs

## Up Next — Phase 4

Building the admin panel for full section/content editing: drag-and-drop reordering, per-section-type content forms, visibility toggles, live preview, and on-demand revalidation so edits reflect on the public page instantly instead of waiting on the ISR cache window.