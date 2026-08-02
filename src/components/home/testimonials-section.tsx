"use client";

import { Star, MessageSquareQuote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { Typography } from "@/components/typography";
import { Marquee } from "@/components/ui/marquee";

export function TestimonialsSection() {
  return (
    <section className="py-12 bg-[hsl(var(--background))] border-t border-white/5 relative z-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(var(--primary))] mb-3 border border-[hsl(var(--primary))]/20">
          <MessageSquareQuote className="h-4 w-4 text-[var(--color-gold)]" />
          Testimoni Pelanggan
        </div>
        <Typography.Heading level="h2">
          Apa Kata <span className="text-[hsl(var(--primary))]">Gamers</span>
        </Typography.Heading>
        <Typography.Body size="sm" color="muted" className="mt-2 max-w-md mx-auto">
          Lebih dari 2.500.000+ transaksi sukses dengan kepuasan pelanggan 99.9%
        </Typography.Body>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:35s]">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="mx-3 w-80 p-5 rounded-2xl glass-card flex flex-col justify-between border border-white/10 shrink-0"
            >
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[hsl(var(--foreground))]/90 leading-relaxed italic mb-4">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div>
                  <p className="font-bold text-[hsl(var(--foreground))]">{item.name}</p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{item.date}</p>
                </div>
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold text-[10px] px-2 py-0.5 rounded-full border border-[hsl(var(--primary))]/20">
                  {item.game}
                </span>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[hsl(var(--background))] dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[hsl(var(--background))] dark:from-background"></div>
      </div>
    </section>
  );
}
