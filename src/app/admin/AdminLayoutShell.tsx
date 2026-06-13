"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Client-side shell for the admin layout.
 * Extracted from layout.tsx so that child pages can remain Server Components.
 */
export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  if (isLoginPage) {
    return (
      <SessionProvider>
        <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay">{children}</div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <div className="flex h-screen bg-[hsl(var(--background))] texture-overlay overflow-hidden font-sans">
        
        {/* Desktop Sidebar */}
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[hsl(var(--secondary))]/40 backdrop-blur-sm z-40 md:hidden"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden"
              >
                <div className="w-64 h-full shadow-2xl">
                  <AdminSidebar collapsed={false} setCollapsed={() => {}} onNavigate={closeMobileMenu} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <AdminTopbar toggleMobileMenu={() => setMobileMenuOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
        
      </div>
    </SessionProvider>
  );
}
