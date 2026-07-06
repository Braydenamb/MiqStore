"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="bg-[hsl(var(--secondary))] text-white py-10 border-t border-[hsl(var(--primary))]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-[hsl(var(--primary))] mb-4">Kontak Support</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: support@miqstore.online</p>
              <p>WhatsApp: +62 812-3456-7890</p>
              <p>Alamat: Jl. Contoh Usaha No. 123, Jakarta, Indonesia</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[hsl(var(--primary))] mb-4">Tautan</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-[var(--color-gold)] transition-colors w-fit">Syarat dan Ketentuan</Link>
              <Link href="/privacy-policy" className="hover:text-[var(--color-gold)] transition-colors w-fit">Kebijakan Privasi</Link>
              <Link href="/refund-policy" className="hover:text-[var(--color-gold)] transition-colors w-fit">Kebijakan Pengembalian</Link>
              <Link href="/faq" className="hover:text-[var(--color-gold)] transition-colors w-fit">FAQ</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MiqStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
