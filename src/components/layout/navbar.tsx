"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  User,
  ShoppingCart,
  Bell,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const {
    isMobileNavOpen,
    setMobileNavOpen,
    isScrolled,
    setIsScrolled,
    setSearchOpen,
  } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-strong py-2 shadow-lg shadow-black/10"
            : "bg-transparent py-4"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            id="nav-logo"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <Gamepad2 className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 opacity-0 blur-lg group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">{APP_NAME}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" id="nav-desktop">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              id="nav-search-btn"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              id="nav-theme-toggle"
              aria-label="Toggle theme"
            >
              <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              id="nav-notifications"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login" id="nav-login-btn">Masuk</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register" id="nav-register-btn">Daftar</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[hsl(var(--muted-foreground))]"
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              id="nav-mobile-toggle"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-[hsl(var(--background))] border-l border-[hsl(var(--border))] shadow-2xl lg:hidden"
              id="nav-mobile-menu"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-4">
                  <span className="text-lg font-bold gradient-text">
                    {APP_NAME}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="border-t border-[hsl(var(--border))] p-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login" onClick={() => setMobileNavOpen(false)}>
                      <User className="h-4 w-4" />
                      Masuk
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/register" onClick={() => setMobileNavOpen(false)}>
                      Daftar Sekarang
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
