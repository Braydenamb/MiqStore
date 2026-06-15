"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Receipt, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Riwayat Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { label: "Profil Saya", href: "/dashboard/profile", icon: User },
  { label: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[70vh] bg-[hsl(var(--background))] py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-heading font-bold text-[hsl(var(--foreground))]">Akun Saya</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex overflow-x-auto hide-scrollbar gap-2 border-b border-[hsl(var(--border))]/30 pb-2">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border border-[hsl(var(--border))]/30">
          {children}
        </div>
      </div>
    </div>
  );
}
