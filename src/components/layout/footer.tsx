"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="bg-slate-950 text-slate-200 py-10 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-sky-400 mb-4">Kontak Support</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Email: support@miqstore.online</p>
              <p>WhatsApp: +62 812-3456-7890</p>
              <p>Alamat: Jl. Contoh Usaha No. 123, Jakarta, Indonesia</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-sky-400 mb-4">Tautan</h3>
            <div className="flex flex-col space-y-2 text-sm text-slate-300">
              <Link href="/terms" className="hover:text-sky-300 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-sky-400 rounded">Syarat dan Ketentuan</Link>
              <Link href="/privacy-policy" className="hover:text-sky-300 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-sky-400 rounded">Kebijakan Privasi</Link>
              <Link href="/refund-policy" className="hover:text-sky-300 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-sky-400 rounded">Kebijakan Pengembalian</Link>
              <Link href="/faq" className="hover:text-sky-300 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-sky-400 rounded">FAQ</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} MiqStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

