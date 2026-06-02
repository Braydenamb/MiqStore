<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Context
- **Name**: MiqStore
- **Domain**: Professional Game Top-Up & Digital Goods Store
- **Goal**: Provide a fast, secure, and visually stunning top-up experience for gamers.

## Stack Details
- **Next.js 15**: Use App Router exclusively. Leverage Server Components by default; only use Client Components (`"use client"`) when interactivity or hooks are strictly required.
- **TypeScript**: Strict mode enabled. No `any` types allowed. Define explicit interfaces for all data models and API responses.
- **Tailwind v4**: Use the new utility classes and configuration patterns. Avoid inline styles.
- **shadcn/ui**: Use for base components. Customize to match the "Liquid glass" and "Pastel blue" aesthetic.
- **pnpm**: Always use `pnpm` for package management. Do not use `npm` or `yarn`.
- **Docker**: Used for local development databases (e.g., PostgreSQL, Redis) to ensure environment consistency.
- **Playwright**: Write E2E tests for critical flows like checkout, authentication, and top-up processing.

## Development Rules
- **No `any`**: Strictly enforce TypeScript types. Use `unknown` if the type is truly dynamic, and narrow it down with type guards.
- **Mobile First**: All layouts must be responsive, starting from mobile designs and scaling up to desktop. The majority of top-up users will be on mobile devices.
- **Server Actions**: Use Server Actions for all form submissions and data mutations. Keep them organized in a dedicated `actions/` directory or co-located with their features.
- **SEO Optimized**: Implement dynamic metadata, proper heading hierarchies, semantic HTML, and generate sitemaps/robots.txt.
- **Clean Architecture**: Separate concerns into clear layers:
  - `components/`: Pure, reusable UI components.
  - `lib/`: Business logic, domain models, and utilities.
  - `services/` or `actions/`: External API calls and database interactions.

## Design System (Aesthetic)
- **Liquid Glass**: Implement glassmorphism using Tailwind's `backdrop-blur`, semi-transparent backgrounds (e.g., `bg-white/10` or `bg-slate-900/40`), and subtle borders (`border-white/20`).
- **Pastel Blue Theme**: Use a calming, modern pastel blue as the primary accent color. Contrast with deep dark backgrounds for a premium, sleek feel.
- **Modern Dashboard**: Clean, grid-based layouts with clear typography (e.g., Inter, Outfit) and ample whitespace.
- **Smooth Animation**: Use CSS transitions or `framer-motion` for micro-interactions (hover states, dialog reveals, page transitions). Keep animations quick and subtle (150ms-300ms).

## Common Errors to Avoid
- **Path Duplication (`src/src/`)**: Pay strict attention to file paths when creating or modifying files. NEVER accidentally create nested directories like `src/src/middleware.ts` instead of `src/middleware.ts`.
- **Middleware & Proxy Conflicts**: Next.js will throw a build error if both `middleware.ts` and `proxy.ts` exist. Only use one (or combine their logic appropriately) to avoid the `Both middleware file and proxy file are detected` build crash.
- **JSX Dynamic Component Names**: When rendering components dynamically from an object map (e.g., icons), ALWAYS extract the component reference to an uppercase variable before rendering. Never use lowercase property access directly in JSX as it will crash the Turbopack build. Example: `const Icon = map[key].icon; <Icon />` (Correct) vs `<map[key].icon />` (Incorrect).

## Agent Workflow (Always)
- **Use Context7**: Query Context7 for any library documentation or API usage (e.g., Next.js 15, Tailwind v4, Prisma) before guessing or assuming based on old training data.
- **Generate Tests**: Write Playwright tests for new UI flows and unit tests for complex pure functions before considering a task complete.
- **Generate Documentation**: Keep project documentation (`README.md`, `ADMIN_SETUP.md`) updated. Add TSDoc comments to complex functions and types.
- **Follow the 7-Phase Workflow**:
  1. Understand Requirements & Context
  2. Research & Gather Documentation (via Context7)
  3. Plan Architecture & Design
  4. Implement Foundation (Types/Database schema)
  5. Build UI & Core Functionality
  6. Test & Refine (E2E & Unit tests)
  7. Document & Finalize
