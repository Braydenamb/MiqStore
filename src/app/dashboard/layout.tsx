"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  User,
  Crown,
  Ticket,
  Heart,
  Settings,
  LogOut,
  Sparkles,
  Terminal,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Riwayat Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  { label: "Membership", href: "/dashboard/membership", icon: Crown, badge: "Gold" },
  { label: "Voucher Saya", href: "/dashboard/vouchers", icon: Ticket },
  { label: "Game Favorit", href: "/dashboard/favorites", icon: Heart },
  { label: "Affiliate", href: "/dashboard/affiliate", icon: Megaphone, badge: "NEW" },
  { label: "Reseller API", href: "/dashboard/reseller", icon: Terminal, badge: "PRO" },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="glass-card rounded-2xl p-4 lg:sticky lg:top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-[hsl(var(--muted))]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                  MQ
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">Miq User</p>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[var(--liquid-amber)]" />
                    <span className="text-xs text-[var(--liquid-amber)] font-medium">Gold Member</span>
                  </div>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-0.5">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)]"
                          : link.label === "Membership" 
                            ? "text-[var(--liquid-amber)]/90 hover:bg-[var(--liquid-amber)]/10 hover:text-[var(--liquid-amber)] shadow-[0_0_10px_rgba(245,158,11,0.1)] border border-[var(--liquid-amber)]/20"
                            : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      <link.icon className={cn("h-4 w-4 shrink-0", link.label === "Membership" && !isActive && "animate-pulse")} />
                      <span className="flex-1">{link.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--liquid-purple)]" />
                      )}
                      {link.badge && !isActive && (
                        <Badge variant="glow" className="text-[9px] px-1.5 py-0">{link.badge}</Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/8 transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
