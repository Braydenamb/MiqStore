"use client";

import { CheckCircle2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

export function PromoBanner() {
  return (
    <section className="py-12 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-navy)] px-6 py-12 sm:px-12 sm:py-16 shadow-lg">
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left Content */}
            <div className="max-w-xl text-center md:text-left">
              <Typography.Heading level="h2" className="text-white mb-6">
                Top Up Praktis. <br />
                <span className="text-[var(--color-gold)]">Harga Ekonomis.</span>
              </Typography.Heading>
              
              <ul className="text-lg space-y-4 mb-8 text-white/90 text-left mx-auto md:mx-0 max-w-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Proses Instan
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Pembayaran Aman
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Terpercaya
                </li>
              </ul>

              <Button size="lg" className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/80 rounded-full h-14 px-8 text-lg font-semibold shadow-md transition-all w-full sm:w-auto">
                Lihat Promo
              </Button>
            </div>

            {/* Right Illustration */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[var(--color-teal)]/30 blur-2xl" />
              <div className="relative z-10 w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                <Gamepad2 className="h-16 w-16 text-[var(--color-navy)]" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
