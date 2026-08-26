# Buildfolio 🚀
A multi-tenant, highly customizable portfolio builder web application designed for developers and creators. Users can sign up, select starter templates, dynamically arrange section layouts, and publish their personal portfolio pages with automatic theme preferences and custom search engine optimizations.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Installation️ & Setup](#installation--setup)
- [Folder Structure](#folder-structure)
- [Contributions](#contributions)
- [How to Contribute](#how-to-contribute)
- [License](#license)
- [Contact](#contact)

---

## About the Project

Buildfolio is built from the ground up to solve the complexity of showcasing developer accomplishments. Instead of hosting separate repositories or manually writing CSS templates, creators can manage all elements of their digital identity in one dedicated dashboard.

Every user gets their own live public portfolio link. The frontend dynamically pulls structured data, verifies content formats using modern schema parsers, and updates public page instances automatically with instant cache revalidation.

---

## Project Overview

> Buildfolio is a multi-tenant platform. Portfolios are served via customizable path slugs (or custom domain mappings) driven by Next.js middleware. By rewriting domain and host headers in the background, users have their projects served directly at the root level while administrative dashboard tasks are securely separated on root application paths.

---

## Key Features

- 📂 **Resume PDF Hosting:** Direct-upload CV hosting with integrated header download buttons.
- 🌓 **Dark / Light Mode Toggle:** Seamless client-side theme switching with `localStorage` memory and automatic system preference detection.
- 📊 **Platform & Custom Analytics:** Integrated platform-wide visitor logs alongside optional user-configured Google Analytics 4 Measurement properties.
- 🔄 **Split-Pane Live Preview:** Real-time preview panels inside the editor showing draft layout changes before publishing.
- 🎨 **Accent Customization:** Presets and custom HEX palette options matched with typography selectors.
- 🛡️ **Identity Management:** Adjustable portfolio URLs (slugs) protected by unique availability checking and 30-day change cooldown limits.
- 🚀 **Dynamic Section Editor:** Simple `@dnd-kit` drag-and-drop mechanics to reorder, add, remove, and hide sections.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | React application structure |
| **Language** | TypeScript | Strong typing and compilation security |
| **Database** | PostgreSQL (Neon) | Relational database hosting |
| **ORM** | Prisma 7 | Schema modeling and migration client |
| **Auth** | NextAuth v5 (Beta) | Hashed credential authentication |
| **Hosting** | Vercel | Dynamic edge-rendering hosting platform |
| **Storage** | Cloudinary | Asset delivery pipeline for images and PDFs |

---

## Dependencies

### Core Production Dependencies
- **Authentication:** `next-auth` (Credentials provider), `bcryptjs`
- **Asset Uploads:** `cloudinary`
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Validation:** `zod`
- **Database Connection:** `@prisma/adapter-pg`, `@prisma/client`, `pg`
- **Icons:** `lucide-react`

### Development Tools
- **Linter:** `eslint`, `eslint-config-next`
- **Compiler:** `typescript`
- **ORM CLI:** `prisma`
- **Styles:** `tailwindcss` (v4), `@tailwindcss/postcss`

---

## Installation️ & Setup

### Prerequisites
- Node.js (v18.x or higher)
- A PostgreSQL database instance (Supabase or Neon)
- A Cloudinary account for file storage

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tasifhossan/Buildfolio.git
   cd Buildfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying the example template:
   ```bash
   cp .env.example .env
   ```
   Provide your local credentials:
   - `DATABASE_URL` / `DIRECT_URL` (PostgreSQL connection strings)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `AUTH_SECRET` (Unique secret key for auth tokens)
   - `NEXT_PUBLIC_ROOT_DOMAIN` (Your local host domain, e.g., `localhost:3000`)

4. **Sync the Database Schema:**
   Generate the Prisma client and apply migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## Folder Structure

```
Buildfolio/
├── prisma/               # Schema configuration and migrations
├── public/               # Static assets and icons
└── src/
    ├── app/              # Next.js pages, API endpoints, and layouts
    ├── components/       # Shared UI components and edit forms
    ├── lib/              # Client loaders, Auth helpers, and databases
    └── middleware.ts     # Path routing and subdomain rewrites
```

---

## Contributions

We welcome contributions of all types! Whether you are fixing bugs, creating new section templates, styling components, or updating technical docs, your help is highly appreciated.

---

## How to Contribute

1. Fork this Repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add support for awesome new feature"
   ```
4. Push your branch to the remote origin:
   ```bash
   git push origin feature/your-awesome-feature
   ```
5. Submit a Pull Request targeting the `develop` branch.

---

## License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.

---

## Contact

- **Author:** Tasif Hossan
- **GitHub:** [@tasifhossan](https://github.com/tasifhossan)
- **Project URL:** [https://github.com/tasifhossan/Buildfolio](https://github.com/tasifhossan/Buildfolio)