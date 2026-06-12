"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  User,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const navLinks = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayoutClient({
  children,
  logoUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin =
    (session?.user as { role?: string })?.role === "ADMIN" ||
    (session?.user as { role?: string })?.role === "SUPER_ADMIN";

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Skip to content — keyboard/screen-reader accessibility */}
      <a
        href="#dashboard-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-[hsl(var(--primary))] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[hsl(var(--primary-foreground))] focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* ── Sidebar (desktop only) ───────────────────────────────── */}
      <aside
        className="sticky top-0 hidden lg:flex w-[200px] h-screen flex-col shrink-0 border-r border-[hsl(var(--border))]/50 bg-[hsl(var(--background))] overflow-y-auto"
        aria-label="Dashboard sidebar"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-[hsl(var(--border))]/50">
          <img
            src={logoUrl || "/icons/logo.png"}
            alt="MiqStore Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-heading text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {APP_NAME}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1" aria-label="Dashboard navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <link.icon className="h-6 w-6 shrink-0" />
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors mt-2",
                pathname.startsWith("/admin")
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-red-400 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <ShieldAlert className="h-6 w-6 shrink-0" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[hsl(var(--border))]/50">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium text-[hsl(var(--muted-foreground))] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-6 w-6 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-20 border-b border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/95 backdrop-blur-md shrink-0">
          {/* Mobile: Logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <img
              src={logoUrl || "/icons/logo.png"}
              alt="MiqStore Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-heading font-bold text-[hsl(var(--foreground))]">{APP_NAME}</span>
          </Link>

          {/* Desktop: breadcrumb-style current page indicator (subtle) */}
          <div className="hidden lg:block" />

          {/* Right: avatar */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[hsl(var(--primary))] text-white font-bold text-lg flex items-center justify-center">
              {session?.user?.name?.[0]?.toUpperCase() || "M"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="dashboard-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-4 lg:pb-12 max-w-5xl w-full mx-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
