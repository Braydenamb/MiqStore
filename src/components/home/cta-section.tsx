"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

export function CTASection() {
  return (
    <section className="py-24 bg-[hsl(var(--background))]" id="cta-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] bg-gradient-to-br from-[hsl(var(--foreground))] to-[hsl(var(--primary))] p-10 sm:p-16 shadow-2xl relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pattern-dots-sm opacity-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white/10 text-white mb-8 shadow-lg backdrop-blur-md">
              <Rocket className="h-10 w-10 text-[var(--color-gold)]" />
            </div>
            
            <Typography.Heading level="h2" className="text-white mb-6">
              Siap Untuk <span className="text-[var(--color-gold)]">Mabar?</span>
            </Typography.Heading>
            
            <Typography.Body size="lg" className="text-white/90 mb-10 max-w-2xl text-center">
              Daftar sekarang dan nikmati kemudahan top-up dengan harga termurah di seluruh galaksi.
            </Typography.Body>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-[var(--color-gold)] text-[hsl(var(--foreground))] hover:bg-white hover:text-[hsl(var(--foreground))] text-lg font-bold shadow-lg transition-all" asChild>
                <Link href="/auth/register">
                  Daftar Sekarang
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
