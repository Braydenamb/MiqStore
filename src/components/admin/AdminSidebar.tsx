"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gamepad2,
  Package,
  LayoutGrid,
  Receipt,
  Wallet,
  Users,
  Images,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Shield,
  Activity,
  Tag,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Catalog",
    icon: Layers,
    items: [
      { label: "Games", href: "/admin/games", icon: Gamepad2 },
      { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
    ],
  },
  {
    label: "Transactions",
    icon: Receipt,
    items: [
      { label: "Orders", href: "/admin/orders", icon: Receipt },
      { label: "Payments", href: "/admin/payments", icon: Wallet },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Content",
    icon: Images,
    items: [
      { label: "Gallery & Media", href: "/admin/gallery", icon: Images },
    ],
  },
  {
    label: "System",
    icon: Shield,
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Activity Logs", href: "/admin/system/logs", icon: Activity },
    ],
  },
];

function NavGroupSection({
  group,
  collapsed,
  pathname,
  defaultOpen,
}: {
  group: NavGroup;
  collapsed: boolean;
  pathname: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const GroupIcon = group.icon;

  const isGroupActive = group.items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  if (collapsed) {
    // In collapsed mode, render items directly without section labels
    return (
      <div className="space-y-1">
        {group.items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex items-center justify-center h-10 w-10 mx-auto rounded-xl transition-colors group",
                isActive
                  ? "text-[hsl(var(--foreground))]"
                  : "text-gray-400 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[hsl(var(--primary))]/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 relative z-10 transition-colors",
                  isActive
                    ? "text-[hsl(var(--primary))]"
                    : "text-gray-400 group-hover:text-[hsl(var(--primary))]"
                )}
              />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* Group Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest mb-1",
          isGroupActive
            ? "text-[hsl(var(--primary))]"
            : "text-gray-500 hover:text-gray-300"
        )}
      >
        <div className="flex items-center gap-2">
          <GroupIcon className="h-3.5 w-3.5" />
          {group.label}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 ml-2 mb-3">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2 rounded-xl transition-colors group",
                      isActive
                        ? "text-[hsl(var(--foreground))]"
                        : "text-gray-400 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-[hsl(var(--primary))]/10 rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 relative z-10 transition-colors",
                        isActive
                          ? "text-[hsl(var(--primary))]"
                          : "text-gray-400 group-hover:text-[hsl(var(--primary))]"
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10 text-sm",
                        isActive ? "font-bold" : "font-medium"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-auto relative z-10 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  // Determine which groups should be open by default
  const defaultOpenGroups = navGroups.map((group) =>
    group.items.some(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href))
    )
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] h-screen transition-all duration-300 z-40 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm z-50 text-[hsl(var(--foreground))]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </Button>

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-[hsl(var(--border))] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-[hsl(var(--foreground))] block leading-none">
                MiqAdmin
              </span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                Operation System
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/admin"
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group",
            collapsed ? "justify-center" : "",
            pathname === "/admin"
              ? "text-[hsl(var(--foreground))]"
              : "text-gray-400 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          {pathname === "/admin" && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-[hsl(var(--primary))]/10 rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <LayoutDashboard
            className={cn(
              "h-5 w-5 shrink-0 relative z-10 transition-colors",
              pathname === "/admin"
                ? "text-[hsl(var(--primary))]"
                : "text-gray-400 group-hover:text-[hsl(var(--primary))]"
            )}
          />
          {!collapsed && (
            <span
              className={cn(
                "relative z-10 text-sm",
                pathname === "/admin" ? "font-bold" : "font-medium"
              )}
            >
              Dashboard
            </span>
          )}
        </Link>
      </div>

      {/* Divider */}
      {!collapsed && (
        <div className="mx-4 border-t border-[hsl(var(--border))] mb-2" />
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 scrollbar-thin">
        {navGroups.map((group, index) => (
          <NavGroupSection
            key={group.label}
            group={group}
            collapsed={collapsed}
            pathname={pathname}
            defaultOpen={defaultOpenGroups[index] || index === 0}
          />
        ))}
      </div>

      {/* Bottom: Logout */}
      <div className="p-3 border-t border-[hsl(var(--border))] shrink-0">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-gray-400 hover:bg-red-500/10 hover:text-red-500",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
