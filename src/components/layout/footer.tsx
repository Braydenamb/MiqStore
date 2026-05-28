import Link from "next/link";
import {
  Gamepad2,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Instagram,
  MessageCircle,
  Send,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const footerLinks = {
  product: {
    title: "Produk",
    links: [
      { label: "Game TopUp", href: "/games" },
      { label: "Voucher Digital", href: "/voucher" },
      { label: "Pulsa & Data", href: "/pulsa" },
      { label: "E-Wallet", href: "/e-wallet" },
      { label: "Token Listrik", href: "/ppob" },
      { label: "PPOB", href: "/ppob" },
    ],
  },
  support: {
    title: "Bantuan",
    links: [
      { label: "Cara Pesan", href: "/help/cara-pesan" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Hubungi Kami", href: "/contact" },
      { label: "Status Layanan", href: "/status" },
      { label: "Lacak Pesanan", href: "/track" },
    ],
  },
  company: {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Karir", href: "/careers" },
      { label: "Program Reseller", href: "/reseller" },
      { label: "API Documentation", href: "/api-docs" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Syarat & Ketentuan", href: "/terms" },
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Kebijakan Refund", href: "/refund-policy" },
    ],
  },
};

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "Discord", href: "https://discord.gg", icon: MessageCircle },
  { label: "Telegram", href: "https://t.me", icon: Send },
];

const paymentIcons = [
  "QRIS",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
];

export function Footer() {
  return (
    <footer className="relative border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      {/* Subtle gradient top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">{APP_NAME}</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              Platform top up game, voucher digital, dan pembayaran online
              terpercaya. Transaksi cepat, aman, dan otomatis 24 jam.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Mail className="h-4 w-4 text-purple-400" />
                <span>support@miqstore.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Phone className="h-4 w-4 text-purple-400" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-all hover:border-purple-500/50 hover:text-purple-400 hover:shadow-sm hover:shadow-purple-500/10"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-[hsl(var(--foreground))]">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-purple-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-[hsl(var(--border))] py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Dapatkan Promo Terbaru
              </h3>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Subscribe newsletter untuk info promo dan diskon eksklusif.
              </p>
            </div>
            <div className="flex w-full max-w-sm gap-2">
              <Input
                type="email"
                placeholder="Email kamu..."
                className="flex-1"
                id="footer-newsletter-input"
              />
              <Button size="default" id="footer-newsletter-btn">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-[hsl(var(--border))] py-6">
          <p className="mb-3 text-xs font-medium text-[hsl(var(--muted-foreground))] text-center">
            Metode Pembayaran
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {paymentIcons.map((payment) => (
              <div
                key={payment}
                className="flex h-8 items-center justify-center rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                {payment}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Made with 💜 in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
