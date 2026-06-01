"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  User,
  Bell,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
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

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "py-2"
            : "py-3"
        )}
      >
        {/* Floating Pill Container */}
        <div
          className={cn(
            "mx-auto max-w-6xl px-4 transition-all duration-500",
            isScrolled ? "px-3 sm:px-4" : "px-4 sm:px-6"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 sm:px-5 transition-all duration-500",
              isScrolled
                ? "glass-strong py-2.5 shadow-lg shadow-black/10"
                : "bg-transparent py-2"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              id="nav-logo"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-300">
                <Gamepad2 className="h-4 w-4 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-bold tracking-tight gradient-text">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-0.5 lg:flex" id="nav-desktop">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg group",
                      isActive
                        ? "text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {link.label}
                    {/* Active indicator — gradient underline */}
                    <span
                      className={cn(
                        "absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] transition-all duration-300",
                        isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                      )}
                    />
                    {/* Hover glow */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-[hsl(var(--muted))] -z-10"
                        transition={spring.soft}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                id="nav-search-btn"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                id="nav-theme-toggle"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                id="nav-notifications"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--liquid-pink)]">
                  <span className="absolute inset-0 rounded-full bg-[var(--liquid-pink)] animate-ping opacity-50" />
                </span>
              </Button>

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2 ml-1.5">
                {session ? (
                  <Button size="sm" asChild className="h-8 text-xs gap-1.5">
                    <Link href="/dashboard" id="nav-dashboard-btn">
                      <User className="h-3 w-3" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 text-xs"
                    >
                      <Link href="/auth/login" id="nav-login-btn">
                        Masuk
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="h-8 text-xs gap-1.5">
                      <Link href="/auth/register" id="nav-register-btn">
                        <Sparkles className="h-3 w-3" />
                        Daftar
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 text-[hsl(var(--muted-foreground))]"
                onClick={() => setMobileNavOpen(!isMobileNavOpen)}
                id="nav-mobile-toggle"
                aria-label="Toggle menu"
              >
                {isMobileNavOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Navigation */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={spring.medium}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-[hsl(var(--background))] border-l border-[hsl(var(--border))] shadow-2xl shadow-black/40 lg:hidden"
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
                    className="h-8 w-8"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {NAV_LINKS.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, ...spring.soft }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                          )}
                        >
                          {link.label}
                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--liquid-purple)]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Auth */}
                <div className="border-t border-[hsl(var(--border))] p-4 space-y-2">
                  <Button variant="outline" className="w-full h-10" asChild>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Masuk
                    </Link>
                  </Button>
                  <Button className="w-full h-10 gap-2" asChild>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
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
