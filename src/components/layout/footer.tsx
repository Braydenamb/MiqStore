import Link from "next/link";
import { Gamepad2, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] text-white pt-16 pb-8 border-t border-[var(--color-teal)]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="font-heading text-2xl font-bold tracking-tight text-[var(--color-gold)]">
                MiqStore
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              The premium gaming top-up marketplace. Instant game top ups, memberships, and vouchers delivered in seconds.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-teal)] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-teal)] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-teal)] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-[var(--color-cream)]">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-[var(--color-cream)]">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-[var(--color-cream)]">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {['QRIS', 'OVO', 'GoPay', 'DANA', 'BCA', 'Mandiri'].map((method) => (
                <span key={method} className="px-3 py-1 bg-white/10 text-xs font-medium rounded-full text-gray-300">
                  {method}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MiqStore. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <span className="text-[var(--color-gold)]">♥</span> for Gamers
          </p>
        </div>
      </div>
    </footer>
  );
}
