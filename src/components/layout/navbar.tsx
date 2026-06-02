"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Games", href: "/games" },
  // { label: "Top Up", href: "/top-up" },
  // { label: "Membership", href: "/membership" },
  // { label: "Vouchers", href: "/vouchers" },
  // { label: "Deals", href: "/deals" },
];

export function Navbar() {
  const pathname = usePathname();

  // Hide on dashboard and admin pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))]/50 glass-panel">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/logo.png" alt="MiqStore Logo" className="h-8 w-auto object-contain" />
          <span className="font-heading text-2xl font-bold tracking-tight text-[hsl(var(--primary))]">
            MiqStore
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[hsl(var(--primary))]",
                  isActive ? "text-[hsl(var(--primary))] font-semibold" : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("q")?.toString().trim();
              if (q) window.location.href = `/games?q=${encodeURIComponent(q)}`;
            }}
            className="hidden lg:flex relative"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="q"
              placeholder="Search games..."
              className="h-10 w-64 rounded-full border border-gray-200 bg-white/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
            />
          </form>

          <Button variant="ghost" size="icon" className="relative rounded-full text-[hsl(var(--foreground))]">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-[hsl(var(--primary))]">
              3
            </span>
          </Button>

          <Link href="/dashboard" tabIndex={-1}>
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full text-[hsl(var(--foreground))]">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden rounded-full text-[hsl(var(--foreground))]">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
