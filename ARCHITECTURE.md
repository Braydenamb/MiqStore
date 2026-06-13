# MiqStore Architecture

This document is the technical blueprint for the MiqStore service layer. It documents implemented patterns and distinguishes between active MVP code and planned future architecture.

---

## Implemented Architecture

### Route & Layer Map

```
src/
├── app/                    # Next.js 16 App Router pages
│   ├── (legal)/            # Privacy/Terms pages
│   ├── admin/              # Admin panel (ADMIN+ role only)
│   │   ├── categories/     # Category CRUD
│   │   ├── gallery/        # Cloudinary media management
│   │   ├── games/          # Product CRUD
│   │   ├── orders/         # Transaction management
│   │   ├── products/       # Product items (SKU pricing)
│   │   ├── settings/       # Platform settings (key-value)
│   │   ├── system/         # Maintenance mode, health
│   │   └── users/          # User role management
│   ├── api/                # API route handlers (webhooks)
│   ├── auth/               # Login / Register pages
│   ├── checkout/           # Checkout flow
│   ├── dashboard/          # User dashboard (orders, profile, favorites)
│   ├── games/              # Public game listing / detail
│   ├── invoice/            # Order confirmation
│   └── top-up/             # Top-up selection flow
├── actions/                # Server Actions (all data mutations)
│   ├── admin-games.ts      # Admin game CRUD actions
│   ├── admin-items.ts      # Product item CRUD actions
│   ├── admin-orders.ts     # Order management actions
│   ├── admin-products.ts   # Product CRUD actions
│   ├── admin-settings.ts   # Settings actions
│   ├── admin-users.ts      # User management actions
│   ├── admin-gallery.ts    # Cloudinary gallery actions
│   └── public-games.ts     # Public catalog read actions
├── components/             # Reusable UI components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Auth forms
│   ├── dashboard/          # User dashboard components
│   ├── games/              # Game card/grid components
│   ├── home/               # Homepage components (preserved, not shown)
│   ├── layout/             # Navbar, sidebar, footer
│   ├── providers/          # React context providers
│   └── ui/                 # shadcn/ui base components
├── lib/                    # Business logic & utilities
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── cloudinary.ts       # Cloudinary SDK client
│   ├── telemetry.ts        # Structured logging & metrics
│   ├── rate-limit.ts       # Redis-based rate limiter
│   ├── audit-log.ts        # Admin audit log writer
│   ├── validators.ts       # Zod validation schemas
│   ├── utils.ts            # Shared utilities (cn, formatters)
│   ├── constants.ts        # Global constants (game IDs, etc.)
│   ├── settings.ts         # Settings DB reader
│   ├── motion.ts           # Framer Motion animation presets
│   ├── forecasting.ts      # Simple trend forecasting utility
│   ├── reliability.ts      # Service health/reliability utilities
│   └── services/           # Core business services (see below)
├── middleware.ts            # RBAC + security headers
├── store/                  # Zustand client state stores
├── types/                  # Global TypeScript type definitions
└── hooks/                  # Custom React hooks
```

---

## 1. Middleware & RBAC (`src/middleware.ts`)

The middleware is the first security layer. It uses `next-auth/middleware` (`withAuth`) to:

1. **Redirect authenticated users** away from `/auth/login` and `/auth/register` to `/dashboard`.
2. **Protect `/admin` routes**: If the JWT token's `role` is not `ADMIN` or `SUPER_ADMIN`, the user is redirected to `/dashboard`.
3. **Inject security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`.

Protected matchers: `/dashboard/:path*`, `/admin/:path*`, `/auth/login`, `/auth/register`.

---

## 2. Transaction Service (`lib/services/transaction.ts`)

The transaction service orchestrates the full order lifecycle.

### Flow: Intent → Payment → Delivery

```
User submits top-up form
        ↓
Rate Limiter check (Redis)
        ↓
Transaction record created (PENDING)
        ↓
Payment created via Midtrans → redirect to payment URL
        ↓
Midtrans webhook hits /api/... → verifies signature
        ↓
Transaction status updated: PENDING → PAID → PROCESSING
        ↓
Provider Router selects best provider (e.g., Apigames)
        ↓
Top-up fulfillment attempted
        ↓
Transaction status: SUCCESS / FAILED
        ↓
EventBus publishes TRANSACTION_COMPLETED (async workers)
```

### Event Bus (`lib/services/event-bus.ts`)
A lightweight pub/sub system for decoupling post-transaction side effects. Published events are handled by `lib/services/subscribers.ts`.

> **MVP Status**: The EventBus and subscribers are wired but post-transaction side effects (cashback, XP) are not active for MVP. See [Future Architecture](#future-planned-architecture) below.

---

## 3. Provider Router (`lib/services/provider-router.ts`)

Currently implements the **Apigames** adapter (`lib/services/apigames.ts`). The router is designed for multi-provider expansion.

### Algorithm (Current MVP)
1. Queries the `ProviderProductMap` table to find the mapped provider SKU for the ordered `ProductItem`.
2. Attempts fulfillment via the mapped provider.
3. Records `providerRef` and `providerData` on the `Transaction` for audit.

### Designed for Future Expansion
The `ProviderProductMap` schema supports multiple providers per `ProductItem` with `priority` and `costPrice` fields — ready for parallel stock checks and price-based routing when additional providers are added.

---

## 4. Telemetry (`lib/telemetry.ts`)

Centralized, structured observability SDK. All production code should use this instead of `console.log`.

- **`logger.info(message, context?)`** — Structured JSON log for Grafana Loki ingestion.
- **`logger.error(message, error?, context?)`** — Error log with stack trace.
- **`metrics.increment(counter, value?)`** — In-memory counter (e.g., `topup_success`, `fraud_blocks`) ready for Prometheus scraping.

---

## 5. Rate Limiting (`lib/rate-limit.ts`)

Redis-backed sliding window rate limiter using `ioredis`. Used to:
- Prevent transaction spam per user IP / user ID.
- Protect admin actions from bulk abuse.

Configuration via environment: `REDIS_URL`.

---

## 6. Admin Audit Log (`lib/audit-log.ts`)

Every admin mutation (create, update, delete on any entity) writes an `AdminAuditLog` record:
- `adminId`, `action` (e.g., `UPDATE_PRICE`), `entity` (e.g., `PRODUCT_ITEM`), `entityId`
- `oldValues` and `newValues` as JSON snapshots for full change tracking.

---

## 7. Cloudinary Integration (`lib/cloudinary.ts`)

Media assets are managed via Cloudinary. The `admin-gallery.ts` server action handles:
- Signed upload to Cloudinary folders.
- Deletion and re-ordering of gallery images.
- `CldImage` / `CldUploadWidget` components from `next-cloudinary` used in the UI.

---

## Future / Planned Architecture

The following systems exist as files in `lib/services/` but are **NOT active in MVP flows**. They are preserved for future enablement.

### Gamification (`lib/services/gamification.ts`)
- XP awards per spending amount (10,000 IDR = 10 XP).
- Membership tier progression: `BRONZE` → `SILVER` → `GOLD` → `DIAMOND`.
- Cashback calculation per tier.
- **Status**: Code exists, not wired to any active transaction flow.

### Affiliate Engine
- Unique `referralCode` per user.
- Commission calculation (% of `total`) credited via EventBus subscriber.
- **Status**: Schema fields (`referralCode`, `referredBy`) exist in `User` model. Calculation logic not implemented.

### AI / Heuristic Risk Engine
- Velocity-based fraud detection (transaction frequency per time window).
- Churn prediction + promo code minting.
- **Status**: NOT implemented. Out of scope for MVP per `AGENTS.md`.

### Multi-Supplier Smart Routing
- Parallel stock checks across multiple providers with price optimization and latency failover.
- **Status**: Architecture designed in `ProviderProductMap` schema. Single provider (Apigames) active in MVP.

---

## Database Model Summary

See [`engineering.md`](./engineering.md) for the full schema reference.

| Model | Purpose |
|---|---|
| `User` | Platform users (4 roles) |
| `Account` / `Session` | NextAuth OAuth adapter models |
| `Category` | Game/product categories |
| `Product` | Games/services (e.g., Mobile Legends) |
| `ProductItem` | Denominations/SKUs (e.g., 86 Diamonds) |
| `Provider` | Top-up suppliers (Apigames, etc.) |
| `ProviderProductMap` | Maps SKUs to provider codes + costs |
| `Transaction` | Core order record |
| `Payment` | Payment gateway record (Midtrans) |
| `Wallet` / `BalanceHistory` | User balance (future) |
| `Review` | Product reviews |
| `Notification` | System/transaction notifications |
| `FavoriteGame` | User's favorited products |
| `ApiKey` / `ApiLog` | Reseller API access |
| `AdminAuditLog` | Admin action history |
| `Setting` | Global key-value configuration |
