import AdminLayoutShell from "./AdminLayoutShell";

/**
 * Admin layout — Server Component wrapper.
 * All client-side logic (session, sidebar state, animations) is
 * encapsulated in AdminLayoutShell. This allows admin child pages
 * (e.g., /admin/games/page.tsx) to be Server Components.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
