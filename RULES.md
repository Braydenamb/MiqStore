# AI Coding Assistant Rules

The following rules must be strictly adhered to by any AI coding assistant or agent working on this project:

## 1. Context7 Documentation Requirement
**Always use Context7 documentation before generating code.**
Whenever you are writing, refactoring, or debugging code that relies on external libraries, frameworks, SDKs, or APIs (e.g., Next.js, Prisma, Tailwind, Aceternity UI, Magic UI, etc.), you must first fetch and review the documentation using the Context7 MCP. Do not rely solely on your pre-trained knowledge, as it may be outdated.

## 2. Latest Stable APIs
**Use latest stable APIs only.**
Always ensure that the code you generate implements the most recent, stable versions of the APIs as confirmed by the Context7 documentation. Avoid using deprecated features, beta APIs, or legacy patterns.

## 3. Workspace Security & Scoping
**Do not grant or attempt to access the full drive.**
To prevent accidental data loss or vulnerabilities from prompt injections, the agent's workspace is strictly limited to the project folder (`/home/miq/Projects/Website/MiqStore`).
Never execute commands, read files, or write files in root directories like `/home/` or root drives. All terminal commands and file operations MUST be contained strictly within the project directory.

## 4. Structured Workflow Requirement
**Always follow a structured, phased roadmap for major tasks.**
Modern agents perform best with structured roadmaps rather than vague instructions (e.g., "make dashboard better"). When undertaking significant features or refactoring, strictly follow this phased approach:
- **Phase 1:** Analyze project structure.
- **Phase 2:** Generate improvement roadmap.
- **Phase 3:** Redesign / Implement UI and Logic.
- **Phase 4:** Improve performance.
- **Phase 5:** Add tests.
- **Phase 6:** Prepare Vercel deployment.
- **Phase 7:** Generate documentation.

## 5. Environment Variables Privacy
**Do NOT read the `.env` file directly.**
You must never attempt to view or read the `.env` file using any tools (e.g., `view_file`, `cat`, etc.). You should assume the `.env` file exists and contains the correct values based on the `.env.example` file. When you need to link environment variables to the project, simply write the code to reference `process.env.VARIABLE_NAME` and trust that the runtime environment will provide the values.

## 6. Dependency Management & Deployment
**Ensure lockfile synchronization.**
Whenever dependencies are added, updated, or removed in `package.json`, ensure that `pnpm-lock.yaml` is correctly updated. This prevents deployment failures on platforms like Vercel. Always use `pnpm` exclusively for this project.

## 7. State Management & Performance
**Strict separation of Server and Client fetching.**
- **Server Components:** Use `Promise.all` for parallel fetching. NEVER use serial DB queries or `for`-loops for data fetching. For data that changes rarely (like Categories or Games list), wrap Server Actions with `unstable_cache` and use `revalidateTag(tag, "default")` to invalidate.
- **Client Components:** NEVER use `useEffect` + `useState` for data fetching. ALWAYS use `@tanstack/react-query` (`useQuery`, `useMutation`).
- **Realtime Dashboards:** For pages requiring live data (like Admin Dashboard or User Dashboard), pass `initialData` from the Server Component to `useQuery`, and configure `refetchInterval` (e.g. 30 seconds) so data silently updates in the background.
- **Lists and Filters:** Use `placeholderData: (prev) => prev` in `useQuery` for tables/lists so the UI does not flash blank when users change search filters or pagination.
