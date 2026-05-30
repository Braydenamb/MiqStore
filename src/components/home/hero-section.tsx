"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Search, ArrowRight, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/motion";

const features = [
  { icon: Zap, label: "Proses Instan", desc: "1-5 detik", color: "var(--liquid-amber)" },
  { icon: Shield, label: "100% Aman", desc: "Terenkripsi", color: "var(--liquid-blue)" },
  { icon: Clock, label: "24/7 Online", desc: "Non-stop", color: "var(--liquid-cyan)" },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden aurora-bg noise-overlay"
      id="hero-section"
    >
      {/* Aurora Orbs — Liquid Pastel */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple h-[600px] w-[600px] top-[10%] left-[15%] animate-glow-pulse" />
        <div
          className="orb orb-blue h-[500px] w-[500px] bottom-[15%] right-[10%] animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="orb orb-pink h-[400px] w-[400px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="orb orb-cyan h-[300px] w-[300px] bottom-[5%] left-[25%] animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />
      </div>

      {/* Floating Elements — Reduced, elegant */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {[
          { char: "💎", x: "12%", y: "22%", delay: 0 },
          { char: "⚡", x: "82%", y: "18%", delay: 0.8 },
          { char: "🎯", x: "88%", y: "65%", delay: 1.2 },
          { char: "🏆", x: "8%", y: "68%", delay: 1.6 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10 select-none"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
            transition={{ delay: item.delay, duration: 0.6 }}
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="block"
            >
              {item.char}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        {/* Flash Sale Badge */}
        <motion.div variants={staggerItem}>
          <Badge
            variant="glow"
            className="mb-8 px-4 py-1.5 text-sm gap-1.5 animate-shine"
          >
            <Sparkles className="h-3 w-3" />
            Flash Sale — Diskon hingga 20%
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
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
          variants={staggerItem}
          className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed"
        >
          Beli diamond, UC, voucher game, pulsa, dan produk digital
          lainnya dengan harga terbaik. Proses otomatis, aman, dan cepat.
        </motion.p>

        {/* Search Bar */}
        <motion.div variants={staggerItem} className="mx-auto mt-8 max-w-lg">
          <div className="glass-card relative flex items-center rounded-2xl p-1.5">
            <Search className="absolute left-4 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <Input
              placeholder="Cari game, voucher, atau produk digital..."
              className="flex-1 border-0 bg-transparent pl-11 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[hsl(var(--muted-foreground))]"
              id="hero-search-input"
            />
            <Button
              size="default"
              className="ml-2 shrink-0 rounded-xl gap-1"
              id="hero-search-btn"
            >
              Cari
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Populer:
            </span>
            {["Mobile Legends", "Free Fire", "Genshin Impact", "Valorant"].map(
              (tag) => (
                <Link
                  key={tag}
                  href={`/games/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))] transition-all hover:border-[var(--liquid-purple)] hover:text-[var(--liquid-purple)] hover:bg-[rgba(192,132,252,0.05)]"
                >
                  {tag}
                </Link>
              )
            )}
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2.5 glass-card rounded-2xl px-4 py-2.5"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                }}
              >
                <feature.icon
                  className="h-4 w-4"
                  style={{ color: feature.color }}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {feature.label}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
