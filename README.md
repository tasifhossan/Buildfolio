# Buildfolio

A multi-tenant, scalable portfolio-builder web app where users can sign up, choose from pre-made templates (or start blank), and dynamically manage the sections, content, and settings of their public portfolio page — all from a personal admin dashboard, with instant live previews and real-time public updates.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **ORM:** Prisma 7 (driver adapters via `@prisma/adapter-pg`)
- **Database:** PostgreSQL via Supabase
- **Auth:** NextAuth v5 (Credentials provider, bcrypt password hashing)
- **Image storage:** Cloudinary
- **Validation:** Zod (shared between forms, API routes, and public rendering)
- **Styling:** Tailwind CSS
- **Drag & drop:** `@dnd-kit`

## Architecture Overview

Buildfolio is multi-tenant by design. Each user owns exactly one `Portfolio`, made up of ordered `Section` rows with flexible JSON content validated per section type with Zod. New users start with a blank portfolio and can apply a pre-built `Template` from the dashboard at any time — which clones its `TemplateSection` rows into their own `Section` rows — or build sections manually from scratch.

Public portfolios are served via **subdomain-based routing** (`username.domain.com`), resolved through Next.js middleware that rewrites subdomain requests to the underlying `[username]` dynamic route, while explicitly excluding auth and dashboard paths from the rewrite so those only ever resolve on the root domain. Public pages use Incremental Static Regeneration (ISR) with on-demand revalidation triggered on every content-changing API call, so edits reflect on the live page within seconds rather than waiting on the cache window.

## Data Model

| Model | Purpose |
|---|---|
| `User` | Account credentials (email, hashed password) |
| `Portfolio` | One per user; holds a unique public `slug` and optional `templateId` |
| `Section` | Ordered, toggleable content blocks (`type`, `order`, `isVisible`, `content` JSON) belonging to a portfolio |
| `Settings` | Per-portfolio theme color, font, and SEO metadata |
| `Template` | A named, selectable starting layout (e.g. "Minimal", "Developer") |
| `TemplateSection` | Starter section content belonging to a `Template`, cloned into `Section` rows on selection |

Foreign keys use cascading deletes, and indexes are set on `slug` and all foreign-key columns for query performance at scale.

## Progress

### ✅ Phase 1 — Foundation
- Scaffolded Next.js + TypeScript + Tailwind + ESLint project
- Designed and migrated the full Prisma schema
- Resolved Prisma 7 breaking changes (driver-adapter model, `directUrl` moved to `prisma.config.ts` for CLI/migrations, singleton client via `PrismaPg` adapter for runtime)
- Seeded two demo templates ("Minimal", "Developer") with starter sections

### ✅ Phase 2 — Auth & Multi-tenancy
- NextAuth v5 with Credentials provider, bcrypt-hashed passwords
- Signup creates a `User` and a blank `Portfolio` (auto-generated unique slug) in a single transaction
- Tenant-scoping helper ensures every dashboard/API query filters strictly by the authenticated user's ownership
- Middleware-protected `/dashboard` routes
- Template selection as an explicit dashboard action (not forced onboarding): list active templates, clone a template's sections into the user's portfolio inside a transaction, scoped by session — not client-supplied IDs

### ✅ Phase 3 — Public Portfolio Rendering
- Dynamic `[username]` route rendering only visible, ordered sections
- `SectionRenderer` dispatches each `Section.type` to its matching presentational component, with Zod-validated content
- Per-portfolio SEO metadata with sensible fallbacks
- ISR caching, graceful empty-state placeholder, clean 404 handling for unknown slugs
- **Subdomain routing**: middleware-based `Host` header detection and rewrite, with reserved app paths (`/api`, `/signup`, `/login`, `/dashboard`) explicitly excluded so auth/dashboard only ever resolve on the root domain — tested locally via `*.localhost`, ready to activate on a real domain via one env var (`NEXT_PUBLIC_ROOT_DOMAIN`) with no code changes

### ✅ Phase 4 — Admin Dashboard
- **Section management**: drag-and-drop reordering (`@dnd-kit`), visibility toggles, add-section (with warn-before-duplicate-type confirmation), delete with confirmation — all with strict per-user ownership checks on every endpoint
- **Content editing forms**, fully controlled (`value`/`onChange`) for live preview support:
  - **Hero** — title, subtitle
  - **About** — bio + interactive skill-tag chips
  - **Contact** — email, GitHub/LinkedIn as clickable links
  - **Projects** — array of project items (title, description, link, image), with Cloudinary upload per item and thumbnail preview
- **Settings panel** — theme color (presets + custom hex), font family, SEO title/description
- **On-demand revalidation** — every content-changing endpoint (section CRUD, reorder, apply-template, settings) triggers `revalidatePath`, verified to update the public page within seconds against an actual production build (`next build && next start`), not just dev mode
- **Live preview** — split-pane editor showing unsaved draft content rendered through the same public-facing components in real time, confirmed to never persist until "Save" is explicitly clicked


## Up Next

-Full-portfolio preview mode (view the entire live-styled portfolio without leaving the dashboard)