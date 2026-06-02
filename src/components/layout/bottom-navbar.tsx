"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Gamepad2,
  Receipt,
  Heart,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/dashboard/transactions", label: "Transaksi", icon: Receipt },
  { href: "/dashboard/favorites", label: "Favorit", icon: Heart },
  { href: "/dashboard", label: "Akun", icon: User },
];

export function BottomNavbar() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Glass backdrop */}
      <div
        className="mx-auto max-w-md px-3"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="bg-[hsl(var(--card))] border-t-4 border-[hsl(var(--border))] rounded-none mb-2 px-2 py-1.5 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                  isActive
                    ? "text-[var(--liquid-purple)]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-xl bg-[var(--liquid-purple)]/8"
                    transition={spring.soft}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                  transition={spring.snappy}
                  className="relative z-10"
                >
                  <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium relative z-10 transition-colors",
                    isActive && "font-semibold"
                  )}
                >
                  {tab.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute -top-0.5 h-[3px] w-3 rounded-none border-2 border-[hsl(var(--border))] bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)]"
                    transition={spring.soft}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
