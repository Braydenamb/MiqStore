"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Receipt,
  Heart,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/dashboard/transactions", label: "Transaksi", icon: Receipt },
  { href: "/dashboard/favorites", label: "Favorit", icon: Heart },
  { href: "/dashboard", label: "Akun", icon: User },
];

export function BottomNavbar() {
  const pathname = usePathname();

  // Hide on admin and dashboard pages (except when the user is explicitly on a dashboard subpage handled by bottom nav)
  // Wait, if it's hidden on dashboard, they can't see the bottom nav on transactions/favorites/account!
  // Let's modify the hide logic so it shows on specific mobile dashboard pages.
  const isHidden = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  
  if (isHidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Floating Glass backdrop */}
      <div
        className="mx-auto max-w-md px-4 pb-4"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] px-2 py-2 flex items-center justify-around">
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
                  "relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-[var(--color-teal)]"
                    : "text-gray-400 hover:text-[var(--color-teal)]/70"
                )}
              >
                {/* Active background */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-[var(--color-teal)]/10" />
                )}

                {/* Icon */}
                <div className={cn("relative z-10 transition-transform duration-300", isActive && "-translate-y-0.5 scale-110")}>
                  <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium relative z-10 transition-colors",
                    isActive && "font-bold text-[var(--color-teal)]"
                  )}
                >
                  {tab.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <div className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-[var(--color-teal)] shadow-[0_0_8px_var(--color-teal)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
