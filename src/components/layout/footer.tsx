"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="bg-[hsl(var(--secondary))] text-white py-6 border-t border-[hsl(var(--primary))]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} MiqStore. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/faq" className="hover:text-[var(--color-gold)] transition-colors">FAQ</Link>
            <Link href="/help" className="hover:text-[var(--color-gold)] transition-colors">Pusat Bantuan</Link>
            <Link href="/terms" className="hover:text-[var(--color-gold)] transition-colors">Syarat dan Ketentuan</Link>
            <Link href="/privacy" className="hover:text-[var(--color-gold)] transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
