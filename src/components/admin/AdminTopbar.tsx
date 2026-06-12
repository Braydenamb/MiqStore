"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function AdminTopbar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  const { data: session } = useSession();

  const displayName = session?.user?.name || "Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden text-[hsl(var(--foreground))]" onClick={toggleMobileMenu}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">{displayName}</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[hsl(var(--primary))]">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
