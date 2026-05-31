"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  CreditCard,
  Percent,
  Server,
  Settings,
  FileText,
  Bell,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Gamepad2 } from "lucide-react";

const adminLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Promos", href: "/admin/promos", icon: Percent },
  { label: "Providers", href: "/admin/providers", icon: Server },
  { label: "AI Insights", href: "/admin/ai-insights", icon: BrainCircuit },
  { label: "Logs", href: "/admin/logs", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex pt-0">
      {/* Admin Sidebar - Full Height */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] hidden lg:block">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center gap-2.5 border-b border-[hsl(var(--sidebar-border))] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500">
            <Gamepad2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold gradient-text">{APP_NAME}</span>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-purple-600/10 text-purple-400"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Badge */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[hsl(var(--sidebar-border))] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[hsl(var(--muted))] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">Super Admin</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                admin@miqstore.com
              </p>
            </div>
            <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
              <Bell className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
