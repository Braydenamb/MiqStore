"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Gift, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Zap, label: "Proses 1-5 detik" },
  { icon: Shield, label: "Transaksi aman" },
  { icon: Gift, label: "Cashback setiap beli" },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-20" id="cta-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 p-8 sm:p-12 md:p-16 text-center"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Mulai Top Up Sekarang
            </motion.div>

            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
              Siap Top Up Game
              <br />
              <span className="text-cyan-300">Favoritmu?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base text-white/70 leading-relaxed">
              Daftar sekarang dan nikmati harga spesial, promo eksklusif, dan
              cashback untuk setiap transaksi pertama kamu!
            </p>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.label}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <benefit.icon className="h-3.5 w-3.5 text-cyan-300" />
                  </div>
                  {benefit.label}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="xl"
                className="bg-white text-gray-900 hover:bg-white/90 shadow-2xl shadow-black/20"
                asChild
              >
                <Link href="/auth/register">
                  Daftar Gratis
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="glass"
                className="text-white border-white/20 hover:bg-white/10"
                asChild
              >
                <Link href="/games">Mulai TopUp</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
