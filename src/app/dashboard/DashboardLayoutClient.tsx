"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
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
  Bell,
  ChevronUp,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

type SidebarLink = {
  label: string;
  href: string;
  icon: any;
  badge?: string;
};

const sidebarLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Riwayat Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  // { label: "Membership", href: "/dashboard/membership", icon: Crown, badge: "Gold" }, // OUT OF SCOPE
  { label: "Voucher Saya", href: "/dashboard/vouchers", icon: Ticket },
  // { label: "Game Favorit", href: "/dashboard/favorites", icon: Heart },
  // { label: "Affiliate", href: "/dashboard/affiliate", icon: Megaphone, badge: "NEW" },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

const topNavLinks = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  // { label: "Voucher", href: "/voucher" },
  // { label: "Pulsa", href: "/pulsa" },
  // { label: "E-Wallet", href: "/e-wallet" },
  // { label: "PPOB", href: "/ppob" },
];

const MEMBERSHIP_TIERS = {
  BRONZE: { name: "Bronze", next: "Silver", pointsReq: 1000, color: "text-[#CD7F32]" },
  SILVER: { name: "Silver", next: "Gold", pointsReq: 2500, color: "text-slate-400" },
  GOLD: { name: "Gold", next: "Diamond", pointsReq: 5000, color: "text-[var(--color-gold)]" },
  DIAMOND: { name: "Diamond", next: "Max", pointsReq: 10000, color: "text-[hsl(var(--primary))]" }
};

export default function DashboardLayoutClient({
  children,
  logoUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const { data: statsData } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const membership = statsData?.stats?.membership || "BRONZE";
  const rewardPoints = statsData?.stats?.rewardPoints || 0;
  
  const currentTier = MEMBERSHIP_TIERS[membership as keyof typeof MEMBERSHIP_TIERS] || MEMBERSHIP_TIERS.BRONZE;
  const nextTierReq = currentTier.pointsReq;
  const progressPercent = Math.min(100, (rewardPoints / nextTierReq) * 100);

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] texture-overlay text-[hsl(var(--foreground))]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden lg:flex w-[280px] h-screen flex-col justify-between shrink-0 p-4 border-r border-[hsl(var(--border))]/50 overflow-y-auto no-scrollbar z-20 bg-white/40 backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 px-4 pt-2 group">
            <img 
              src={logoUrl || "/icons/logo.png"} 
              alt="MiqStore Logo" 
              className="h-8 w-auto object-contain transition-all group-hover:scale-105" 
            />
            <span className="font-heading text-2xl font-bold tracking-tight text-[var(--color-primary)]">
              {APP_NAME}
            </span>
          </Link>

          {/* User Info (Profile Card) */}
          <div className="flex flex-col p-4 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-white font-bold text-lg shadow-md">
                {session?.user?.name?.[0]?.toUpperCase() || "M"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{session?.user?.name || "Miq User"}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Crown className={cn("h-3.5 w-3.5", currentTier.color)} />
                  <span className={cn("text-xs font-bold", currentTier.color)}>{currentTier.name} Member</span>
                </div>
              </div>
            </div>
            {/* XP Bar */}
            {currentTier.next !== "Max" && (
              <div className="mt-4 pt-3 border-t border-[hsl(var(--border))]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-[hsl(var(--primary))]/70">XP {rewardPoints.toLocaleString("id-ID")} / {nextTierReq.toLocaleString("id-ID")}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[hsl(var(--primary))]/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300",
                    isActive
                      ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold shadow-sm"
                      : "text-[hsl(var(--foreground))]/70 font-medium hover:bg-[hsl(var(--primary))]/5 hover:text-[hsl(var(--primary))]"
                  )}
                >
                  <link.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]/60")} />
                  <span className="flex-1">{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[var(--color-gold)]/20 text-[var(--color-gold)]">{link.badge}</span>
                  )}
                  {isActive && link.badge === "Gold" && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[var(--color-gold)] text-white">Gold</span>
                  )}
                </Link>
              );
            })}
            
            {/* Admin Conditional Link */}
            {(session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPER_ADMIN" ? (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 mt-2",
                  pathname.startsWith("/admin")
                    ? "bg-red-50 text-red-600 font-bold"
                    : "text-red-500/70 hover:bg-red-50 hover:text-red-600"
                )}
              >
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1">Admin Panel</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600">PRO</span>
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {/* Top Up Lebih Cepat Card */}
          <div className="relative overflow-hidden rounded-2xl p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
              <Gamepad2 className="h-20 w-20 text-[hsl(var(--primary))]" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm text-[hsl(var(--foreground))] mb-1 flex items-center gap-1">
                Top Up Lebih Cepat <Sparkles className="h-3 w-3 text-[var(--color-gold)]" />
              </h4>
              <p className="text-xs text-[hsl(var(--foreground))]/60 mb-4 leading-relaxed font-medium">Simpan metode favoritmu untuk top up lebih cepat!</p>
              <Button size="sm" className="w-full text-xs font-bold bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--secondary))] rounded-xl h-9">
                Atur Sekarang &rarr;
              </Button>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="h-4.5 w-4.5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Navbar */}
        <header className="sticky top-0 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-[hsl(var(--border))]/50 shrink-0 bg-[hsl(var(--background))]/90 backdrop-blur-md z-30">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {topNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-bold transition-colors flex items-center gap-2",
                    isActive ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <img src={logoUrl || "/icons/logo.png"} alt="MiqStore Logo" className="h-8 w-auto object-contain" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q")?.toString().trim();
                if (q) window.location.href = `/games?q=${encodeURIComponent(q)}`;
              }}
              className="relative hidden md:flex items-center"
            >
              <Search className="absolute left-4 h-4 w-4 text-[hsl(var(--primary))]/50" />
              <input 
                type="text" 
                name="q"
                placeholder="e.g. Mobile Legends, Steam Wallet..." 
                className="h-11 w-72 rounded-full bg-white border border-[hsl(var(--border))] pl-11 pr-4 text-sm font-medium outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all shadow-sm"
              />
            </form>
            
            <Button variant="ghost" size="icon" className="rounded-full relative text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))]/50 h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden rounded-full relative text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))]/50 h-10 w-10">
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-[hsl(var(--primary))] text-white font-bold cursor-pointer hover:bg-[hsl(var(--secondary))] transition-colors shadow-sm">
              {session?.user?.name?.[0]?.toUpperCase() || "M"}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 z-20 relative">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
