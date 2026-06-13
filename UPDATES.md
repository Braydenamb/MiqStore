# MiqStore — Updates, Deferrals & Roadmap

This file tracks deferred features, removed components, and future roadmap items. Update this file whenever a feature is temporarily skipped, removed from scope, or re-added.

---

## Active Deferrals (Temporarily Skipped)

### AI Insights Component
- **Status:** Temporarily Skipped
- **Component:** `src/components/dashboard/ai-insights.tsx`
- **Description:** The `AiInsights` component (Spending Insights, Savings Tracker, Behavioral Recommendation Targeting) was fully designed and built but has been temporarily removed from the main dashboard layout per user request.
- **To Re-enable:** Re-import `AiInsights` into `src/app/dashboard/page.tsx` and place it below the `StatsGrid`.

### Homepage Marketing Components
- **Status:** Temporarily Skipped
- **Components:** `src/components/home/FeatureStrip`, `PromoBanner`, `StatsSection`
- **Description:** Removed from the homepage (`/`) to prioritize user focus on actionable goals (Top Up). The components are preserved in `src/components/home/`.
- **To Re-enable:** Import and add them back to `src/app/page.tsx`.

---

## Permanently Removed (Out of Scope for MVP)

### Voucher / Coupon System
- **Status:** Removed — Out of Scope
- **Description:** No voucher input fields, no voucher management page. Discounts are applied directly on product pages as inline price differences (e.g., `originalPrice` vs `price` on `ProductItem`).
- **Note:** The `PromoCode` and `UserPromo` Prisma models were removed from the schema. Do not re-add without a scope change approval.

### Wallet / Balance Top-Up
- **Status:** Schema exists, UI not implemented
- **Description:** `Wallet` and `BalanceHistory` models exist in the database schema for future use. No wallet top-up, deposit, or withdrawal UI is exposed in the current MVP.
- **Note:** `BalanceHistory` is used internally for cashback/refund tracking when those features activate.

### Loyalty Programs / XP / Membership Tiers
- **Status:** Schema exists (`MembershipTier` enum, `rewardPoints` on `User`), logic in `lib/services/gamification.ts`. Not wired to any active UI or flow.
- **Note:** Do not surface membership tiers, XP, or level-up notifications to users until this is re-scoped.

### Affiliate / Referral Commission Engine
- **Status:** Schema fields exist (`referralCode`, `referredBy` on `User`). Commission logic not implemented.
- **Note:** Referral code display can be shown in profile, but commission payouts should NOT be implemented.

### Notification Bell / Notification Center
- **Status:** `Notification` model exists in DB. No bell icon shown in UI (per UX philosophy).
- **Note:** Do not show a notification bell unless there are real, unread notifications to display.

### Multi-Supplier Smart Routing
- **Status:** Architecture designed (`ProviderProductMap` schema), single provider (Apigames) active.
- **Note:** `provider-router.ts` is written for multi-provider expansion. Do not add additional provider adapters without validating API credentials.

### AI Risk / Fraud Engine
- **Status:** Not implemented. Out of scope for MVP.
- **Description:** Rate limiting (`lib/rate-limit.ts`) is the only active fraud prevention mechanism.

---

## Roadmap — Planned for Post-MVP

| Feature | Priority | Notes |
|---|---|---|
| Payment Gateway — Tripay / Xendit | High | Midtrans is the current active gateway |
| Transaction Retry Logic | High | Auto-retry on PROCESSING timeout |
| Email Notifications (Resend) | High | Order confirmation emails via `resend` (package installed, not wired) |
| Multi-Provider Support | Medium | Digiflazz / VIP Reseller adapters |
| Wallet System | Medium | User balance top-up + in-app payment |
| Loyalty / XP Gamification | Low | Activate `gamification.ts` + UI |
| Affiliate Commission | Low | Wire `referredBy` to commission payouts |
| Advanced Analytics (Admin) | Low | Revenue charts, conversion funnels |
| Customer Chat / Support | Low | Out of scope unless integrated with external tool |

---

## Admin Production Readiness Notes (as of 2026-06-13)

Issues identified in the admin dashboard production audit:
1. **Query Performance**: Admin dashboard uses `findMany` without pagination on some lists — add `take`/`skip` pagination.
2. **Audit Log Coverage**: Not all admin Server Actions currently call `createAuditLog()` — audit and patch missing calls.
3. **Settings Cache**: `admin-settings.ts` does not yet use `unstable_cache` — add caching with `revalidateTag("settings")`.
4. **Maintenance Mode**: `system/` route controls a `MAINTENANCE_MODE` setting key — verify middleware checks this setting before allowing non-admin traffic.
