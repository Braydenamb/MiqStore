# MiqStore 🎮

**Professional Game Top-Up & Digital Goods Store**

MiqStore is a modern, scalable e-commerce platform dedicated to digital game top-ups. Built with the **"Liquid Glass & Pastel Blue"** design language, it delivers a premium, mobile-first experience backed by a clean, maintainable architecture.

![MiqStore Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.x-teal.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)

---

## ✨ Implemented Features

### 1. Liquid Glass Aesthetics
A cutting-edge UI featuring glassmorphism (`backdrop-blur`, semi-transparent backgrounds), dynamic gradients, smooth micro-animations (Framer Motion), and hyper-responsive layouts. Built with shadcn/ui on top of Tailwind v4.

### 2. Role-Based Access Control (RBAC) 🔐
A four-tier RBAC system: `USER` → `RESELLER` → `ADMIN` → `SUPER_ADMIN`. Middleware strictly protects `/admin` routes, redirecting unauthorized users to their dashboard.

### 3. Admin Panel 🛠️
A full-featured admin dashboard at `/admin` including:
- **Games & Categories**: Create, edit, reorder game listings with Cloudinary image management.
- **Product Items**: Manage denominations, pricing, and reseller pricing per SKU.
- **Orders**: View and update transaction statuses.
- **Users**: Manage user roles and accounts.
- **Gallery**: Cloudinary-powered media management.
- **Settings**: Key-value store for global platform configuration.
- **System**: Maintenance mode and health controls.

### 4. Cloudinary Asset Management 🖼️
All images are hosted on Cloudinary via `next-cloudinary`. Admin gallery management, upload, and optimization are handled server-side.

### 5. Midtrans Payment Gateway 💳
Transaction lifecycle: `PENDING` → `PAID` → `PROCESSING` → `SUCCESS`/`FAILED`/`REFUNDED`/`EXPIRED`. Webhook-based payment confirmation integrated via Midtrans.

### 6. Transaction Engine
An event-driven transaction service (`lib/services/transaction.ts`) with:
- Provider routing (`lib/services/provider-router.ts`) via `Apigames` adapter
- EventBus (`lib/services/event-bus.ts`) for decoupled post-transaction workflows
- Rate limiting (`lib/rate-limit.ts`) via `ioredis` (Redis)

### 7. Enterprise Telemetry 📊
Centralized structured logging via `lib/telemetry.ts`. JSON-structured output replaces raw `console.log` for production observability.

### 8. Admin Audit Logging
All admin mutations are recorded in `AdminAuditLog` for full accountability and compliance traceability.

### 9. SEO & PWA Ready
Dynamic metadata, sitemaps (`/sitemap.xml`), robots (`/robots.txt`), and PWA service worker registration.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.2.6](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + Framer Motion |
| UI Components | shadcn/ui + Radix UI |
| Image Management | Cloudinary (`next-cloudinary`) |
| Package Manager | `pnpm` |
| Database | PostgreSQL (via Neon) + Prisma ORM v6 |
| Auth | NextAuth v4 (`@auth/prisma-adapter`) |
| Client State | Zustand + TanStack Query v5 |
| Email | Resend |
| Cache / Rate Limit | Redis (`ioredis`) |
| Containerization | Docker (local dev databases) |
| Testing | Playwright (E2E) + Vitest (Unit) |
| Animations | Framer Motion + GSAP + Lenis |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- Docker (for local PostgreSQL & Redis)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Braydenamb/MiqStore.git
   cd MiqStore
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in all required keys.

4. **Start local services (PostgreSQL + Redis):**
   ```bash
   docker compose up -d
   ```

5. **Initialize Database:**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

6. **Run the Development Server:**
   ```bash
   pnpm dev
   ```

### Useful Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Generate Prisma client + production build |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed the database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Run Vitest unit tests |

---

## 🤖 Developer & Agent Workflow

AI coding agents and human developers must follow the **7-Phase Structured Workflow** for major features or refactoring:

1. **Understand Requirements & Context**
2. **Research & Gather Documentation** (via Context7 MCP)
3. **Plan Architecture & Design**
4. **Implement Foundation** (Types / Database schema)
5. **Build UI & Core Functionality**
6. **Test & Refine** (Playwright E2E + Vitest unit tests)
7. **Document & Finalize**

For full agent configuration, coding standards, and UX philosophy, see:
- [`AGENTS.md`](./AGENTS.md) — Agent rules, stack details, and design system
- [`RULES.md`](./RULES.md) — Strict coding rules for all contributors
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Technical architecture and service layer
- [`engineering.md`](./engineering.md) — Database schema, gotchas, and patterns
- [`ADMIN_SETUP.md`](./ADMIN_SETUP.md) — How to provision an admin account
- [`ASSET_GOVERNANCE.md`](./ASSET_GOVERNANCE.md) — Image asset standards

---

## 🗺 Route Map

| Route | Description |
|---|---|
| `/` | Homepage (game catalog) |
| `/games/[slug]` | Game top-up page |
| `/top-up/[slug]` | Top-up flow |
| `/checkout` | Order checkout |
| `/invoice/[id]` | Invoice / order confirmation |
| `/dashboard` | User dashboard (orders, profile, favorites) |
| `/auth/login` | Login page |
| `/admin` | Admin panel (ADMIN+ only) |

---

## 📖 Documentation

| File | Purpose |
|---|---|
| `AGENTS.md` | AI agent rules and coding standards |
| `RULES.md` | Strict development rules |
| `ARCHITECTURE.md` | Service layer architecture |
| `engineering.md` | DB schema, gotchas, performance patterns |
| `ADMIN_SETUP.md` | Provisioning admin accounts via SQL |
| `ASSET_GOVERNANCE.md` | Image format, naming, and size standards |
| `UPDATES.md` | Deferred features and update log |
