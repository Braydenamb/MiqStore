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
      {/* ── Sidebar (desktop only) ───────────────────────────────── */}
      <aside className="sticky top-0 hidden lg:flex w-[200px] h-screen flex-col shrink-0 border-r border-[hsl(var(--border))]/50 bg-[hsl(var(--background))] overflow-y-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-[hsl(var(--border))]/50">
          <img
            src={logoUrl || "/icons/logo.png"}
            alt="MiqStore Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="font-heading text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {APP_NAME}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors mt-2",
                pathname.startsWith("/admin")
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-red-400 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[hsl(var(--border))]/50">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/95 backdrop-blur-md shrink-0">
          {/* Mobile: Logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <img
              src={logoUrl || "/icons/logo.png"}
              alt="MiqStore Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-heading font-bold text-[hsl(var(--foreground))]">{APP_NAME}</span>
          </Link>

          {/* Desktop: breadcrumb-style current page indicator (subtle) */}
          <div className="hidden lg:block" />

          {/* Right: avatar */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white font-bold text-sm flex items-center justify-center">
              {session?.user?.name?.[0]?.toUpperCase() || "M"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 max-w-3xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ── Bottom Navigation (mobile only) ─────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[hsl(var(--background))]/95 backdrop-blur-md border-t border-[hsl(var(--border))]/60 flex items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive && "text-[hsl(var(--primary))]")} />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </button>
      </nav>
    </div>
  );
}
