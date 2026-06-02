"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gamepad2,
  Receipt,
  Users,
  Wallet,
  LineChart,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Gamepad2 },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  // { label: "Analytics", href: "/admin/analytics", icon: LineChart }, // OUT OF SCOPE FOR MVP
];

export function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-100 h-screen transition-all duration-300 z-40 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border-gray-200 bg-white shadow-sm z-50 text-[var(--color-navy)]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </Button>

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-navy)] flex items-center justify-center shrink-0">
            <Gamepad2 className="h-5 w-5 text-[var(--color-gold)]" />
          </div>
          {!collapsed && (
            <span className="font-heading text-xl font-bold tracking-tight text-[var(--color-navy)]">
              MiqAdmin
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group",
                isActive
                  ? "text-[var(--color-navy)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[var(--color-teal)]/5 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 relative z-10 transition-colors",
                  isActive ? "text-[var(--color-teal)]" : "text-gray-400 group-hover:text-[var(--color-teal)]"
                )}
              />
              {!collapsed && (
                <span className={cn("relative z-10 text-sm font-medium", isActive && "font-bold")}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-50 space-y-1">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)]",
            pathname.startsWith("/admin/settings") && "bg-[var(--color-teal)]/5 text-[var(--color-navy)] font-bold"
          )}
        >
          <Settings className={cn("h-5 w-5 shrink-0", pathname.startsWith("/admin/settings") ? "text-[var(--color-teal)]" : "text-gray-400")} />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-gray-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
