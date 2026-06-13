# MiqStore Engineering Guidelines & Architecture

This document is the central context file for the MiqStore project. It provides AI assistants and developers with comprehensive details about the project's architecture, database schema, and strict coding rules. **Designed for prompt caching to maintain context across sessions.**

---

## 1. Project Context & Stack

- **Name**: MiqStore
- **Domain**: Professional Game Top-Up & Digital Goods Store
- **Goal**: Provide a fast, secure, and visually stunning top-up experience for gamers.
- **Framework**: Next.js 16.2.6 (App Router exclusively).
- **Language**: TypeScript 5 (Strict mode enabled, no `any` types).
- **Styling**: TailwindCSS v4 with CSS variables.
- **UI Components**: shadcn/ui + Radix UI primitives.
- **State/Fetching (Client)**: `@tanstack/react-query` v5 + Zustand v5.
- **Database**: PostgreSQL with Prisma ORM v6.
- **Auth**: NextAuth v4 with `@auth/prisma-adapter`.
- **Package Manager**: `pnpm`.
- **Media**: Cloudinary (via `next-cloudinary`).
- **Email**: Resend.
- **Cache / Rate Limiting**: Redis via `ioredis`.
- **Animation**: Framer Motion 12, GSAP 3, Lenis (smooth scroll).

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
- **Server Actions**: Keep them organized in `actions/` directory or co-located with features. All data mutations must use Server Actions.
- **Mobile First**: All layouts must be responsive, starting from mobile designs and scaling up to desktop.
- **Context7**: Always query Context7 for library documentation or API usage (e.g., Next.js 16+, Tailwind v4, Prisma v6) before generating code.
- **Never read `.env`**: Do NOT open the `.env` file directly. Reference `process.env.VARIABLE_NAME` in code and assume the file exists with correct values.
- **pnpm only**: Never use `npm` or `yarn`. Always `pnpm install` after modifying `package.json`.

### 2.4 Admin Operations
- **Audit Logging**: All admin mutations (create, update, delete) MUST call `createAuditLog()` from `lib/audit-log.ts` to write an `AdminAuditLog` record with `oldValues` and `newValues`.
- **Telemetry**: Use `lib/telemetry.ts` (`logger.info`, `logger.error`, `metrics.increment`) instead of raw `console.log` in service-layer code.

### 2.5 UX Philosophy
> **"A regular user only cares about 3 things: top up, check order status, logout."**

- Remove anything that is not directly actionable for those 3 goals.
- **No stats cards** showing numbers users don't care about (Total Transaksi bulan ini, Poin Member, dll).
- **No marketing widgets** with fake/static data.
- **Mobile bottom navigation** is the primary nav for the dashboard (4 tabs: Beranda, Transaksi, Profil, Keluar).
- **Desktop sidebar**: compact, logo + nav links + logout only. No upsell cards.
- **Max content width `max-w-3xl`** for user dashboard — readable on any screen size.
- **Features out of scope (Do NOT implement)**: Voucher/Coupon System, Wallet System, Loyalty Programs/XP, AI Integrations, Affiliate Systems, Multi-supplier Integrations, Complex Analytics, Chat Systems, Ranking Systems, Live Feed, Fake Notification bells.

---

## 3. Database Schema Overview (Prisma v6)

Database: PostgreSQL. ORM: Prisma v6. Schema: `prisma/schema.prisma`.

### Enums
| Enum | Values |
|---|---|
| `Role` | `USER`, `RESELLER`, `ADMIN`, `SUPER_ADMIN` |
| `TransactionStatus` | `PENDING`, `PAID`, `PROCESSING`, `SUCCESS`, `FAILED`, `REFUNDED`, `EXPIRED` |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `EXPIRED`, `REFUNDED` |
| `MembershipTier` | `BRONZE`, `SILVER`, `GOLD`, `DIAMOND` |
| `BalanceType` | `DEPOSIT`, `PURCHASE`, `REFUND`, `CASHBACK`, `BONUS`, `WITHDRAWAL` |
| `NotificationType` | `TRANSACTION`, `PROMO`, `SYSTEM`, `MEMBERSHIP` |

### Core Models

#### Auth & Users
- **`User`** (`users` table): Platform user. Fields: `id`, `email`, `name`, `image`, `phone`, `password`, `avatar`, `role` (Role enum), `membership` (MembershipTier enum), `rewardPoints`, `isVerified`, `isActive`, `referralCode`, `referredBy`. Relations: accounts, sessions, transactions, wallet, reviews, notifications, favoriteGames, apiKeys, auditLogs.
- **`Account`** / **`Session`** / **`VerificationToken`**: Standard NextAuth PrismaAdapter models (snake_case field names required by adapter).

#### Products
- **`Category`** (`categories`): Game/product categories. Fields: `name`, `slug`, `icon`, `color`, `gradient`, `order`, `isActive`.
- **`Product`** (`products`): A game or service (e.g., "Mobile Legends"). Fields: `name`, `slug`, `publisher`, `image`, `banner`, `gallery[]`, `fields` (JSON — custom input fields for the game), `gameType`, `tags[]`, `isPopular`, `order`. Belongs to `Category`.
- **`ProductItem`** (`product_items`): A denomination/SKU (e.g., "86 Diamonds"). Fields: `name`, `amount`, `price` (selling price IDR), `originalPrice`, `resellerPrice`, `isPopular`, `order`. Belongs to `Product`.

#### Providers
- **`Provider`** (`providers`): Top-up supplier (e.g., Apigames). Fields: `name`, `slug`, `apiUrl`, `apiKey`, `apiSecret`, `isActive`.
- **`ProviderProductMap`** (`provider_product_maps`): Maps a `ProductItem` to a provider's SKU. Fields: `providerProductCode`, `costPrice` (wholesale), `isAvailable`, `priority`. Unique on `[productItemId, providerId]`.

#### Transactions & Payments
- **`Transaction`** (`transactions`): Core order record. Fields: `invoiceId` (unique), `userId`, `productId`, `productItemId`, `providerId`, `quantity`, `price`, `costPrice`, `fee`, `discount`, `total`, `status` (TransactionStatus), `gameUserId`, `gameZoneId`, `gameNickname`, `providerRef`, `providerData` (JSON), `notes`.
- **`Payment`** (`payments`): Payment gateway record for a transaction. Fields: `gateway` (e.g., "midtrans"), `method` (e.g., "qris"), `externalId`, `amount`, `status` (PaymentStatus), `paymentUrl`, `paymentCode`, `paidAt`, `expiredAt`, `callbackData` (JSON).

#### Admin & Operations
- **`AdminAuditLog`** (`admin_audit_logs`): Admin action history. Fields: `adminId`, `action`, `entity`, `entityId`, `oldValues` (JSON), `newValues` (JSON).
- **`Setting`** (`settings`): Global key-value config. Fields: `key` (unique), `value`, `group`.
- **`ApiKey`** / **`ApiLog`**: Reseller API key management and request logging.

#### User Features
- **`Wallet`** / **`BalanceHistory`**: User balance tracking (schema exists; not active in MVP UI).
- **`Review`**: Product reviews (1–5 rating, comment, `isVisible`).
- **`Notification`**: System/transaction notifications (type, title, message, `isRead`).
- **`FavoriteGame`**: Many-to-many: User ↔ Product. Unique on `[userId, productId]`.

> **Deprecated (Schema Exists, Not in UI)**: `PromoCode`, `UserPromo` — vouchers are removed from MVP. The schema models were removed; discounts are applied inline on product pages if needed.

---

## 4. Important Gotchas & Workflows

- **Path Duplication**: Pay strict attention to file paths. NEVER accidentally create `src/src/` nested directories.
- **Middleware Conflicts**: Next.js crashes if both `middleware.ts` and `proxy.ts` exist. Use only one.
- **Dynamic Component Names in JSX**: When rendering dynamic components from a map, ALWAYS extract the reference to an uppercase variable: `const Icon = map[key].icon; <Icon />`.
- **Missing Shadcn Components**: Do not blindly import Shadcn components. Verify they exist or install via `pnpm dlx shadcn@latest add <component>`.
- **Environment Variables**: **Do NOT read the `.env` file directly.** Reference `process.env.VARIABLE_NAME`. Consult `.env.example` or `.env.production.example` for available keys.
- **Lockfile**: Always run `pnpm install` when modifying `package.json` to keep `pnpm-lock.yaml` synchronized.
- **Admin Role**: To promote a user to ADMIN, run the SQL in `ADMIN_SETUP.md` or use the `set-admin.ts` script at project root.
- **`Product.fields` (JSON)**: This field stores the dynamic form definition for each game's top-up form (e.g., `[{ name: "userId", label: "User ID", required: true }]`). It drives the top-up form UI dynamically — do not hardcode game input fields.
