"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
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
  Megaphone,
  Gamepad2,
  Search,
  Moon,
  Sun,
  Bell,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Riwayat Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  { label: "Membership", href: "/dashboard/membership", icon: Crown, badge: "Gold" },
  { label: "Voucher Saya", href: "/dashboard/vouchers", icon: Ticket },
  { label: "Game Favorit", href: "/dashboard/favorites", icon: Heart },
  { label: "Affiliate", href: "/dashboard/affiliate", icon: Megaphone, badge: "NEW" },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between shrink-0 p-4 border-r border-[hsl(var(--border))] overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 px-4 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white shadow-lg shadow-purple-500/20">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {APP_NAME}
            </span>
          </Link>

          {/* User Info (Profile Card like mock) */}
          <div className="flex flex-col p-4 rounded-2xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white font-bold text-lg shadow-lg">
                MQ
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">Miq User</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-[var(--liquid-amber)]" />
                  <span className="text-xs text-[var(--liquid-amber)] font-medium">Gold Member</span>
                </div>
              </div>
            </div>
            {/* XP Bar */}
            <div className="mt-4 pt-3 border-t border-[hsl(var(--border))]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">XP 3.250 / 5.000</span>
                <ChevronUp className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] w-[65%]" />
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)] font-semibold"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  <link.icon className={cn("h-4 w-4 shrink-0", isActive && "text-[var(--liquid-purple)]")} />
                  <span className="flex-1">{link.label}</span>
                  {link.badge && !isActive && (
                    <Badge variant="glow" className="text-[9px] px-1.5 py-0 bg-[var(--liquid-amber)]/10 text-[var(--liquid-amber)] border-none">{link.badge}</Badge>
                  )}
                  {isActive && link.badge === "Gold" && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-gradient-to-r from-[var(--liquid-amber)] to-yellow-300 text-[hsl(var(--background))] border-none">Gold</Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {/* Promo Card */}
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white shadow-lg shadow-purple-500/20">
            <div className="absolute -right-6 -bottom-6 opacity-30 rotate-12">
              <Gamepad2 className="h-28 w-28" />
            </div>
            <div className="absolute top-2 right-2 opacity-50">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm mb-1 text-white">Top Up Lebih Cepat</h4>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">Simpan metode favoritmu untuk top up lebih cepat!</p>
              <Button size="sm" variant="secondary" className="text-xs font-bold bg-white text-[var(--liquid-purple)] hover:bg-white/90 rounded-xl px-4">
                Atur Sekarang →
              </Button>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-[hsl(var(--border))] shrink-0 bg-[hsl(var(--background))]/80 backdrop-blur-md z-10">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--liquid-purple)] text-white">
              <Gamepad2 className="h-4 w-4" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input 
                type="text" 
                placeholder="Cari game, voucher, dll..." 
                className="h-11 w-72 rounded-full bg-[hsl(var(--muted))]/50 pl-11 pr-4 text-sm font-medium outline-none border border-[hsl(var(--border))] focus:border-[var(--liquid-purple)] focus:bg-[hsl(var(--background))] transition-all shadow-sm hover:border-[var(--liquid-purple)]/50"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] h-10 w-10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full relative text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] h-10 w-10">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--liquid-purple)] border-2 border-[hsl(var(--background))]" />
            </Button>
            
            <Button className="hidden sm:flex rounded-xl bg-[var(--liquid-purple)] hover:bg-[var(--liquid-purple)]/90 text-white font-semibold px-5 h-10 gap-2 shadow-lg shadow-purple-500/20">
              <User className="h-4 w-4" /> Dashboard
            </Button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-24 bg-[hsl(var(--muted))]/10">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
