# AI Coding Assistant Rules

The following rules must be strictly adhered to by any AI coding assistant or agent working on this project.

---

## 1. Context7 Documentation Requirement
**Always use Context7 documentation before generating code.**

Whenever you are writing, refactoring, or debugging code that relies on external libraries, frameworks, SDKs, or APIs (e.g., Next.js 16, Prisma v6, Tailwind v4, shadcn/ui, etc.), you **must** first fetch and review the documentation using the Context7 MCP. Do not rely solely on pre-trained knowledge — it may be outdated or reflect older API versions.

---

## 2. Latest Stable APIs
**Use latest stable APIs only.**

Always ensure the code implements the most recent, stable API versions as confirmed by Context7. Avoid deprecated features, beta APIs, or legacy patterns.

The current version pinning for this project:
- Next.js: `16.2.6`
- React: `19.x`
- Prisma: `^6.19.3`
- Tailwind: `^4.x`
- `@tanstack/react-query`: `^5.75.x`
- NextAuth: `^4.24.x`

---

## 3. Workspace Security & Scoping
**Do not grant or attempt to access the full drive.**

The agent's workspace is strictly limited to: `/home/miq/Projects/Website/MiqStore`.

Never execute commands, read files, or write files outside this directory. All terminal commands and file operations MUST be contained strictly within the project directory.

**Do NOT read the `.env` file directly.** Assume it exists and contains correct values based on `.env.example`. Reference `process.env.VARIABLE_NAME` in code.

---

## 4. Structured Workflow Requirement
**Always follow a structured, phased roadmap for major tasks.**

When undertaking significant features or refactoring, strictly follow this phased approach:

- **Phase 1:** Understand Requirements & Context
- **Phase 2:** Research & Gather Documentation (via Context7)
- **Phase 3:** Plan Architecture & Design
- **Phase 4:** Implement Foundation (Types / Database schema)
- **Phase 5:** Build UI & Core Functionality
- **Phase 6:** Test & Refine (Playwright E2E + Vitest unit tests)
- **Phase 7:** Document & Finalize

---

## 5. Environment Variables Privacy
**Do NOT read the `.env` file directly.**

Never attempt to view or read the `.env` file using any tools (`view_file`, `cat`, etc.). Assume it exists and contains correct values. Reference `process.env.VARIABLE_NAME` in code. Consult `.env.example` or `.env.production.example` for the list of available keys.

---

## 6. Dependency Management & Deployment
**Ensure lockfile synchronization.**

Whenever dependencies are added, updated, or removed in `package.json`, ensure that `pnpm-lock.yaml` is correctly updated. This prevents deployment failures on Vercel. Always use `pnpm` exclusively — never `npm` or `yarn`.

---

## 7. State Management & Performance
**Strict separation of Server and Client fetching.**

- **Server Components:** Use `Promise.all` for parallel fetching. NEVER use serial DB queries or `for`-loops for data fetching. For data that changes rarely (like Categories or Games list), wrap Server Actions with `unstable_cache` and use `revalidateTag(tag, "default")` to invalidate.
- **Client Components:** NEVER use `useEffect` + `useState` for data fetching. ALWAYS use `@tanstack/react-query` (`useQuery`, `useMutation`).
- **Realtime Dashboards:** For pages requiring live data (like Admin Dashboard or User Dashboard), pass `initialData` from the Server Component to `useQuery`, and configure `refetchInterval` (e.g., 30 seconds) so data silently updates in the background.
- **Lists and Filters:** Use `placeholderData: (prev) => prev` in `useQuery` for tables/lists so the UI does not flash blank when users change search filters or pagination.

---

## 8. Admin Audit Logging
**All admin mutations must be logged.**

Every create, update, or delete operation performed by an admin MUST call `createAuditLog()` from `lib/audit-log.ts`. This writes an `AdminAuditLog` database record with:
- `adminId`: The authenticated admin's user ID.
- `action`: A descriptive string (e.g., `UPDATE_PRICE`, `CREATE_PRODUCT`, `DELETE_USER`).
- `entity`: The model name (e.g., `PRODUCT_ITEM`, `USER`).
- `entityId`: The affected record's ID.
- `oldValues`: JSON snapshot of the record before the change.
- `newValues`: JSON snapshot of the record after the change.

Failure to log admin actions is a security compliance violation.

---

## 9. Telemetry Over console.log
**Use the structured telemetry SDK in service-layer code.**

In `lib/services/` and server-side business logic, use `lib/telemetry.ts` instead of raw `console.log`:

```typescript
import { logger, metrics } from "@/lib/telemetry";

// ✅ Correct
logger.info("Transaction processed", { invoiceId, userId, total });
logger.error("Provider fulfillment failed", error, { invoiceId });
metrics.increment("topup_success_apigames");

// ❌ Incorrect
console.log("Transaction processed", invoiceId);
```

This ensures logs are structured JSON (digestible by Grafana Loki) and metrics are Prometheus-compatible.
