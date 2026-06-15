"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X, Home, Gamepad2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MiqStoreLogo from "@/components/ui/logo";

// NAV_LINKS removed as per request to simplify header

export function Navbar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[hsl(var(--background))]/60 backdrop-blur-xl">
        <div className="mx-auto flex h-12 md:h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="MiqStore Logo" className="h-5 md:h-6 w-auto object-contain" />
            ) : (
              <MiqStoreLogo className="h-5 md:h-6 w-auto text-[hsl(var(--primary))]" />
            )}
            <span className="font-heading text-lg md:text-xl font-bold tracking-tight text-[hsl(var(--primary))]">
              MiqStore
            </span>
          </Link>

          {/* Center: Navigation Links (Removed) */}

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q")?.toString().trim();
                if (q) window.location.href = `/games?q=${encodeURIComponent(q)}`;
              }}
              className="hidden lg:flex relative"
            >
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="e.g. Mobile Legends, Free Fire..."
                className="h-8 md:h-9 w-56 md:w-64 rounded-full border border-[hsl(var(--border))] bg-white/5 pl-9 pr-4 text-xs md:text-sm text-[hsl(var(--foreground))] outline-none transition-all focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
              />
            </form>

            <Link href="/dashboard">
              <Button variant="ghost" size="icon" aria-label="Account" className="flex rounded-full text-[hsl(var(--foreground))]">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Open menu"
              className="md:hidden rounded-full text-[hsl(var(--foreground))]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[hsl(var(--secondary))]/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[hsl(var(--background))] border-l border-white/5 shadow-2xl z-[70] p-6 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  {logoUrl ? (
                    <img src={logoUrl} alt="MiqStore Logo" className="h-6 w-auto object-contain" />
                  ) : (
                    <MiqStoreLogo className="h-6 w-auto text-[hsl(var(--primary))]" />
                  )}
                  <span className="font-heading text-xl font-bold tracking-tight text-[hsl(var(--primary))]">
                    MiqStore
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full">
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              <div className="mb-6">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = formData.get("q")?.toString().trim();
                    if (q) window.location.href = `/games?q=${encodeURIComponent(q)}`;
                  }}
                  className="relative w-full"
                >
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="e.g. Mobile Legends, Free Fire..."
                    className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-white/5 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
                  />
                </form>
              </div>

              <nav className="flex flex-col gap-1 flex-1 mt-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Menu Utama</div>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Beranda
                </Link>
                {/* Removed Semua Game link as per request */}
                <Link
                  href="/dashboard/transactions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  <Receipt className="mr-3 h-5 w-5" />
                  Transaksi
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  <User className="mr-3 h-5 w-5" />
                  Akun Saya
                </Link>

                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-4">Informasi</div>
                <Link
                  href="/terms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  Syarat & Ketentuan
                </Link>
                <Link
                  href="/privacy-policy"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  Kebijakan Privasi
                </Link>
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
