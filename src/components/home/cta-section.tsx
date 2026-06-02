"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-[hsl(var(--background))] border-y-4 border-[hsl(var(--border))]" id="cta-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-8 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-10 sm:p-16 shadow-[12px_12px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_rgba(255,255,255,1)] relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pattern-dots-sm opacity-10 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-20 w-20 border-4 border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] mb-8 shadow-[var(--brutal-shadow-sm)] rotate-12">
              <Rocket className="h-10 w-10" />
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-[hsl(var(--foreground))] mb-6 tracking-tighter">
              SIAP UNTUK <span className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 inline-block -rotate-2">MABAR?</span>
            </h2>
            
            <p className="text-lg sm:text-xl font-bold uppercase text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto border-y-4 border-[hsl(var(--border))] py-4">
              Daftar sekarang dan nikmati kemudahan top-up dengan harga termurah di seluruh galaksi.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-16 px-8 rounded-none border-4 border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] text-xl font-black uppercase tracking-widest shadow-[var(--brutal-shadow)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none" asChild>
                <Link href="/auth/register">
                  Daftar Sekarang
                  <ArrowRight className="h-6 w-6 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
