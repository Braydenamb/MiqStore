"use client";

import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="h-20 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden text-[hsl(var(--foreground))]" onClick={toggleMobileMenu}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden sm:flex relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders, users, or games..." 
            className="w-full h-10 pl-10 pr-4 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-full text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground))]/40 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] rounded-full">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>

        <div className="h-6 w-px bg-[hsl(var(--border))] mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">Admin Store</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Superadmin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[hsl(var(--primary))]">AS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
