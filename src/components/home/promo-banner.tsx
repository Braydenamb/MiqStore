"use client";

import { CheckCircle2, Gamepad2, Gift, Zap, Crown } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Zap,
    name: "Proses Instan",
    description: "Top up masuk dalam hitungan detik setelah pembayaran berhasil dikonfirmasi.",
    href: "/games",
    cta: "Top Up Sekarang",
    background: <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent" />,
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: Crown,
    name: "Promo Member VIP",
    description: "Dapatkan harga khusus dan cashback spesial untuk member VIP aktif.",
    href: "/register",
    cta: "Daftar Member",
    background: <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-gold)]/20 to-transparent" />,
    className: "col-span-3 lg:col-span-2",
  },
  {
    Icon: Gift,
    name: "Event Spesial",
    description: "Ikuti event mingguan dan dapatkan ribuan diamond gratis.",
    href: "/promo",
    cta: "Lihat Event",
    background: <div className="absolute inset-0 bg-[hsl(var(--secondary))]/50" />,
    className: "col-span-3 lg:col-span-3",
  },
];

export function PromoBanner() {
  return (
    <section className="py-12 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center lg:text-left font-heading text-[hsl(var(--foreground))]">
          Mengapa <span className="text-[var(--color-gold)]">MiqStore?</span>
        </h2>
        <BentoGrid className="lg:grid-rows-2">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
