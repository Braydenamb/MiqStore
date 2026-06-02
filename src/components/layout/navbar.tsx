"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, Bell, X, PackageOpen, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Games", href: "/games" },
  // { label: "Top Up", href: "/top-up" },
  // { label: "Membership", href: "/membership" },
  // { label: "Vouchers", href: "/vouchers" },
  // { label: "Deals", href: "/deals" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Hide on dashboard and admin pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <>
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Search games..."
                className="h-10 w-64 rounded-full border border-gray-200 bg-white/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
              />
            </form>

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("relative rounded-full text-[hsl(var(--foreground))]", isNotificationsOpen && "bg-black/5")}
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsCartOpen(false);
                }}
              >
                <Bell className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(7,59,76,0.15)] z-50 p-6 flex flex-col items-center justify-center text-center origin-top-right"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--color-navy)]/5 flex items-center justify-center mb-4">
                        <BellOff className="h-6 w-6 text-[var(--color-navy)]/40" />
                      </div>
                      <h3 className="font-bold text-[var(--color-navy)] mb-1">Belum Ada Notifikasi</h3>
                      <p className="text-xs text-[var(--color-navy)]/60">Notifikasi tentang pesanan dan promo akan muncul di sini.</p>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("relative rounded-full text-[hsl(var(--foreground))]", isCartOpen && "bg-black/5")}
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsNotificationsOpen(false);
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-[hsl(var(--primary))]">
                  0
                </span>
              </Button>

              <AnimatePresence>
                {isCartOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCartOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(7,59,76,0.15)] z-50 p-6 flex flex-col items-center justify-center text-center origin-top-right"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center mb-4">
                        <PackageOpen className="h-6 w-6 text-[var(--color-teal)]" />
                      </div>
                      <h3 className="font-bold text-[var(--color-navy)] mb-1">Keranjang Kosong</h3>
                      <p className="text-xs text-[var(--color-navy)]/60 mb-4">Kamu belum menambahkan produk apa pun ke keranjang.</p>
                      <Button className="w-full bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white rounded-xl h-10 text-xs font-bold" onClick={() => setIsCartOpen(false)}>
                        Mulai Belanja
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link href="/dashboard" tabIndex={-1}>
              <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full text-[hsl(var(--foreground))]">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
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
              className="fixed inset-0 bg-[var(--color-navy)]/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[70] p-6 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img src="/icons/logo.png" alt="MiqStore Logo" className="h-6 w-auto object-contain" />
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
                    placeholder="Search games..."
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
                  />
                </form>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-4">Menu Lainnya</div>
                <Link
                  href="/help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  Pusat Bantuan
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors text-[hsl(var(--muted-foreground))] hover:bg-gray-100 hover:text-[hsl(var(--primary))]"
                >
                  Syarat & Ketentuan
                </Link>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-[var(--color-teal)] text-[var(--color-teal)]">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold bg-[var(--color-navy)] text-white hover:bg-[var(--color-teal)]">
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
