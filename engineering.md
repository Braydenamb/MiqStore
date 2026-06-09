# MiqStore Engineering Guidelines & Architecture

This document serves as the central context file for the MiqStore project, providing AI assistants and developers with comprehensive details about the project's architecture, database schema, and strict coding rules. **It is designed to be used for prompt caching to maintain context across sessions.**

---

## 1. Project Context & Stack

- **Name**: MiqStore
- **Domain**: Professional Game Top-Up & Digital Goods Store
- **Goal**: Provide a fast, secure, and visually stunning top-up experience for gamers.
- **Framework**: Next.js 16 (App Router exclusively).
- **Language**: TypeScript (Strict mode enabled, no `any` types).
- **Styling**: TailwindCSS v4 with CSS variables.
- **UI Components**: shadcn/ui.
- **State/Fetching (Client)**: `@tanstack/react-query`.
- **Database**: PostgreSQL with Prisma ORM.
- **Package Manager**: `pnpm`.
- **Media**: Cloudinary (via `next-cloudinary`).

---

## 2. Strict Coding Rules

### 2.1 State Management & Performance
- **Server Components:**
  - Use `Promise.all` for parallel fetching.
  - **NEVER** use serial DB queries or `for`-loops for data fetching.
  - Wrap read Actions with `unstable_cache` for rarely changing data (e.g., Categories, Games list) to prevent excessive DB hits.
  - Invalidate cache using `revalidateTag(tag, "default")`.
- **Client Components:**
  - **NEVER** use raw `useEffect` + `useState` for data fetching.
  - **ALWAYS** use `@tanstack/react-query` (`useQuery`, `useMutation`).
  - Use `placeholderData: (prev) => prev` in `useQuery` for tables/lists so the UI does not flash blank during transitions (e.g., search/filter changes).
- **Realtime Dashboards:** For pages requiring live data (e.g., Admin Dashboard, User Dashboard), pass `initialData` from the Server Component to `useQuery`, and configure `refetchInterval` (e.g. 30 seconds) for silent background updates.

### 2.2 Clean Architecture
Separate concerns into clear layers:
- `components/`: Pure, reusable UI components.
- `lib/`: Business logic, domain models, and utilities.
- `actions/`: External API calls, Database interactions, and Server Actions.

### 2.3 General Development
- **No `any`**: Strictly enforce TypeScript types. Use `unknown` with type guards if necessary.
- **Server Actions**: Keep them organized in a dedicated `actions/` directory or co-located with their features. All data mutations must use Server Actions.
- **Mobile First**: All layouts must be responsive, starting from mobile designs and scaling up to desktop.
- **Context7**: Always query Context7 for library documentation or API usage (e.g., Next.js 15+, Tailwind v4, Prisma) before generating code.

### 2.4 UX Philosophy
> **"A regular user only cares about 3 things: top up, check order status, logout."**

- Remove anything that is not directly actionable for those 3 goals.
- **No stats cards** showing numbers users don't care about (Total Transaksi bulan ini, Poin Member, dll).
- **No marketing widgets** with fake/static data.
- **Mobile bottom navigation** is the primary nav for the dashboard (4 tabs: Beranda, Transaksi, Profil, Keluar).
- **Desktop sidebar**: compact, logo + nav links + logout only. No upsell cards.
- **Max content width `max-w-3xl`** for user dashboard—readable on any screen size.
- **Features out of scope (Do NOT implement)**: Voucher/Coupon System, Wallet System, Loyalty Programs/XP, AI Integrations, Affiliate Systems, Multi-supplier Integrations, Complex Analytics, Chat Systems, Ranking Systems, Live Feed, Fake Notification bells.

---

## 3. Database Schema Overview (Prisma)

The database uses PostgreSQL. Below is a high-level summary of the core models and their relations:

### Core Models
- **User**: Represents a platform user (Role: USER, RESELLER, ADMIN, SUPER_ADMIN). Holds balances, membership tiers, and relations to transactions and accounts.
- **Account** & **Session**: NextAuth standard models for authentication.

### Product Models
- **Category**: Groups products (e.g., "Mobile Games", "PC Games").
- **Product**: Represents a specific game or service (e.g., "Mobile Legends"). Belongs to a Category and optionally a Provider.
- **ProductItem**: Represents a specific denomination/item for a Product (e.g., "86 Diamonds"). Has base price, original price, and reseller price.

### Transaction & Payment
- **Transaction**: The core order record. Links User, Product, and ProductItem. Tracks quantity, price, total amount, and status (`PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`).
- **Payment**: Tracks the payment gateway status for a Transaction. Has an `externalId` to map to the provider (e.g., Midtrans, Xendit).

### Other Models (Features)
- **Wallet** & **BalanceHistory**: For tracking user balances (if implemented).
- **PromoCode** & **UserPromo**: (Note: Vouchers are deprecated in UI, but schema exists).
- **Review**: User reviews for Products.
- **Notification**: System or transaction notifications.
- **FavoriteGame**: Tracks user's favorite products.
- **Provider**, **ApiKey**, **ApiLog**: For reseller API and upstream supplier configurations.
- **Setting**: Global key-value configuration.

---

## 4. Important Gotchas & Workflows

- **Path Duplication**: Pay strict attention to file paths. NEVER accidentally create nested directories like `src/src/`.
- **Middleware Conflicts**: Next.js will crash if both `middleware.ts` and `proxy.ts` exist. Use only one.
- **Dynamic Component Names in JSX**: When rendering dynamic components from a map, ALWAYS extract the reference to an uppercase variable first (`const Icon = map[key].icon; <Icon />`).
- **Missing Shadcn Components**: Do not blindly import Shadcn components. Verify they exist or install them via `pnpm dlx shadcn@latest add`.
- **Environment Variables**: **Do NOT read the `.env` file directly.** Assume it exists and contains correct values. Reference `process.env.VARIABLE_NAME` in code.
- **Lockfile**: Always run `pnpm install` when modifying `package.json` to keep `pnpm-lock.yaml` synchronized for Vercel deployments.
