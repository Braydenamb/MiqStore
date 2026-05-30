"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Gift, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/motion";

const benefits = [
  { icon: Zap, label: "Proses 1-5 detik" },
  { icon: Shield, label: "Transaksi aman" },
  { icon: Gift, label: "Cashback setiap beli" },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section ref={ref} className="py-16 sm:py-24" id="cta-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 text-center"
          style={{
            background: `linear-gradient(135deg, 
              rgba(192,132,252,0.15) 0%, 
              rgba(125,211,252,0.1) 50%, 
              rgba(103,232,249,0.12) 100%
            )`,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Aurora background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-purple h-72 w-72 -top-32 -right-32 animate-glow-pulse" />
            <div className="orb orb-blue h-56 w-56 -bottom-28 -left-28 animate-glow-pulse" style={{ animationDelay: "3s" }} />
            <div className="orb orb-cyan h-40 w-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
            <div className="absolute inset-0 bg-grid opacity-10" />
          </div>

          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10"
          >
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--liquid-purple)]" />
              Mulai Top Up Sekarang
            </motion.div>

            <motion.h2
              variants={staggerItem}
              className="text-3xl font-extrabold sm:text-4xl md:text-5xl tracking-tight"
            >
              Siap Top Up Game
              <br />
              <span className="gradient-text">Favoritmu?</span>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="mx-auto mt-5 max-w-xl text-base text-[hsl(var(--muted-foreground))] leading-relaxed"
            >
              Daftar sekarang dan nikmati harga spesial, promo eksklusif, dan
              cashback untuk setiap transaksi pertama kamu!
            </motion.p>

            {/* Benefits */}
            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit.label}
                  className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg glass">
                    <benefit.icon className="h-3.5 w-3.5 text-[var(--liquid-cyan)]" />
                  </div>
                  {benefit.label}
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button
                size="xl"
                asChild
                className="gap-1.5 shadow-lg shadow-purple-500/20"
              >
                <Link href="/auth/register">
                  <Sparkles className="h-4 w-4" />
                  Daftar Gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="glass"
                asChild
              >
                <Link href="/games">Mulai TopUp</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
