"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="py-8 bg-[hsl(var(--background))] border-y-4 border-[hsl(var(--border))]" id="promo-banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border-4 border-[hsl(var(--border))] bg-[hsl(var(--primary))] p-8 sm:p-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row items-center justify-between"
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary-foreground)) 0, hsl(var(--primary-foreground)) 2px, transparent 2px, transparent 8px)' }}></div>
          
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 border-2 border-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] px-3 py-1 text-sm font-black uppercase text-[hsl(var(--primary-foreground))] mb-4 shadow-[4px_4px_0px_hsl(var(--primary-foreground))]">
              <Sparkles className="h-4 w-4" />
              Promo Spesial
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-[hsl(var(--primary-foreground))] leading-none">
              Diskon <span className="bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] px-2 inline-block transform -rotate-2">50%</span> Untuk
              <br /> Pengguna Baru
            </h2>
            <p className="mt-4 text-lg font-bold text-[hsl(var(--primary-foreground))]/80 uppercase tracking-wide">
              Gunakan kode promo: NEOBRUTAL24
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Button size="lg" className="rounded-none border-4 border-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_hsl(var(--primary-foreground))] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_hsl(var(--primary-foreground))] h-16 px-8">
              Klaim Sekarang
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
