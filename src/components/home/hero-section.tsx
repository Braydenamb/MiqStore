"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Search, ArrowRight, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

const features = [
  { icon: Zap, label: "Proses Instan", desc: "1-5 detik", color: "var(--liquid-amber)" },
  { icon: Shield, label: "100% Aman", desc: "Terenkripsi", color: "var(--liquid-blue)" },
  { icon: Clock, label: "24/7 Online", desc: "Non-stop", color: "var(--liquid-cyan)" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[hsl(var(--background))]"
      id="hero-section"
    >
      {/* Spline 3D Background - TEMPORARILY DISABLED FOR DEBUGGING */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black/40" />
        {/* Liquid Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/10 via-[hsl(var(--background))]/40 to-[hsl(var(--background))] backdrop-blur-[1px] pointer-events-none" />
      </motion.div>

      {/* Floating Holographic Cards */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block perspective-1000">
        {[
          { icon: "💎", delay: 0, x: "10%", y: "20%", rotate: -12, scale: 1.1 },
          { icon: "⚡", delay: 0.2, x: "85%", y: "15%", rotate: 15, scale: 0.9 },
          { icon: "🎯", delay: 0.4, x: "80%", y: "70%", rotate: -8, scale: 1.2 },
          { icon: "🎮", delay: 0.6, x: "15%", y: "65%", rotate: 10, scale: 1 },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="absolute glass-card border border-[hsl(var(--border))]/50 rounded-2xl p-4 flex items-center justify-center bg-[hsl(var(--background))]/40 backdrop-blur-md shadow-[0_0_30px_rgba(192,132,252,0.15)]"
            style={{ left: card.x, top: card.y }}
            initial={{ opacity: 0, scale: 0, rotateX: 45, rotateY: 45 }}
            animate={{ opacity: 1, scale: card.scale, rotateX: 0, rotateY: card.rotate }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: card.delay,
            }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl filter drop-shadow-lg"
            >
              {card.icon}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 mt-16">
        {/* Flash Sale Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Badge
            variant="outline"
            className="mb-8 px-5 py-2 text-sm gap-2 animate-pulse border-[var(--liquid-purple)]/50 bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)] backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            Liquid Cyber Pastel Era
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] filter drop-shadow-sm"
        >
          <span className="block text-[hsl(var(--foreground))]">
            Top Up Game
          </span>
          <span className="block mt-2 bg-gradient-to-r from-[#b184fc] via-[#84b5fc] to-[#fc84c5] bg-clip-text text-transparent animate-gradient">
            Tercepat & Termurah
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed"
        >
          Masuk ke dimensi baru top-up digital. Beli diamond, UC, dan voucher dengan 
          kecepatan instan, keamanan berlapis, dan harga paling masuk akal.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="group relative flex items-center rounded-2xl p-1.5 bg-[hsl(var(--background))]/60 backdrop-blur-xl border border-[hsl(var(--border))]/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:border-[var(--liquid-purple)]/50 hover:shadow-[0_8px_30px_rgba(177,132,252,0.2)]">
            <Search className="absolute left-5 h-5 w-5 text-[hsl(var(--muted-foreground))] transition-colors group-hover:text-[var(--liquid-purple)]" />
            <Input
              placeholder="Cari game, voucher..."
              className="flex-1 h-12 border-0 bg-transparent pl-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[hsl(var(--muted-foreground))]/70"
            />
            <Button
              size="lg"
              className="ml-2 shrink-0 rounded-xl gap-2 bg-gradient-to-r from-[#b184fc] to-[#84b5fc] text-white hover:opacity-90 shadow-[0_0_20px_rgba(177,132,252,0.4)]"
            >
              Cari Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))] mr-1">
              Trending:
            </span>
            {["Mobile Legends", "Free Fire", "Valorant"].map((tag) => (
              <Link
                key={tag}
                href={`/games/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border border-[hsl(var(--border))] px-4 py-1.5 text-sm text-[hsl(var(--muted-foreground))] transition-all hover:border-[var(--liquid-purple)] hover:text-[var(--liquid-purple)] hover:bg-[rgba(192,132,252,0.1)] hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex items-center gap-3 bg-[hsl(var(--background))]/50 backdrop-blur-lg border border-[hsl(var(--border))]/50 rounded-2xl px-5 py-3 shadow-lg"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                  boxShadow: `0 0 15px color-mix(in srgb, ${feature.color} 30%, transparent)`,
                }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: feature.color }}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[hsl(var(--foreground))]">
                  {feature.label}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
