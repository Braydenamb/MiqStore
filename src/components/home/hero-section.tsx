"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Search, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const floatingIcons = [
  { emoji: "💎", delay: 0, x: "10%", y: "20%" },
  { emoji: "🎮", delay: 0.5, x: "85%", y: "15%" },
  { emoji: "⚡", delay: 1, x: "75%", y: "70%" },
  { emoji: "🏆", delay: 1.5, x: "15%", y: "75%" },
  { emoji: "🎯", delay: 0.8, x: "90%", y: "45%" },
  { emoji: "🔥", delay: 1.2, x: "5%", y: "50%" },
];

const features = [
  { icon: Zap, label: "Proses Instan", desc: "1-5 detik" },
  { icon: Shield, label: "100% Aman", desc: "Terenkripsi" },
  { icon: Clock, label: "24/7 Online", desc: "Non-stop" },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      id="hero-section"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />
      </div>

      {/* Floating Game Icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl sm:text-4xl opacity-20 pointer-events-none select-none hidden sm:block"
          style={{ left: icon.x, top: icon.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 0.2, scale: 1 } : {}}
          transition={{ delay: icon.delay, duration: 0.5 }}
        >
          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="block"
          >
            {icon.emoji}
          </motion.span>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="glow" className="mb-6 px-4 py-1.5 text-sm">
            🔥 Flash Sale — Diskon hingga 20%
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-[hsl(var(--foreground))]">
            Top Up Game
          </span>
          <span className="block mt-2 gradient-text">
            Tercepat & Termurah
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed"
        >
          Beli diamond, UC, voucher game, pulsa, dan produk digital lainnya
          dengan harga terbaik. Proses otomatis, aman, dan cepat.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 max-w-xl"
        >
          <div className="glass relative flex items-center rounded-xl p-1.5">
            <Search className="absolute left-4 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <Input
              placeholder="Cari game, voucher, atau produk digital..."
              className="flex-1 border-0 bg-transparent pl-11 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              id="hero-search-input"
            />
            <Button size="default" className="ml-2 shrink-0" id="hero-search-btn">
              Cari
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Popular Search Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Populer:
            </span>
            {["Mobile Legends", "Free Fire", "Genshin Impact", "Valorant"].map(
              (tag) => (
                <Link
                  key={tag}
                  href={`/games/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:border-purple-500/50 hover:text-purple-400"
                >
                  {tag}
                </Link>
              )
            )}
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2.5 rounded-full glass px-5 py-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20">
                <feature.icon className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {feature.label}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
