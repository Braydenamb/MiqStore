"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ArrowRight, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: Zap, label: "Proses Instan", desc: "1-5 detik", color: "var(--foreground)" },
  { icon: Shield, label: "100% Aman", desc: "Terenkripsi", color: "var(--foreground)" },
  { icon: Clock, label: "24/7 Online", desc: "Non-stop", color: "var(--foreground)" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[hsl(var(--background))] border-b-2 border-[hsl(var(--border))]"
      id="hero-section"
    >
      {/* Background Decor (Brutalist Blocks) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-between items-start opacity-10 dark:opacity-20">
        <div className="w-64 h-64 bg-[hsl(var(--foreground))] border-4 border-[hsl(var(--background))] translate-x-[-20%] translate-y-[20%] rotate-12"></div>
        <div className="w-96 h-96 bg-[hsl(var(--foreground))] border-4 border-[hsl(var(--background))] translate-x-[20%] translate-y-[40%] -rotate-6"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 mt-16 pb-20">
        {/* Flash Sale Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="mb-8 px-5 py-2 text-sm font-bold border-2 border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] uppercase tracking-widest shadow-[var(--brutal-shadow-sm)] flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Neo-Brutalist Era
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-[1.1] uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)] dark:drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
        >
          <span className="block text-[hsl(var(--foreground))]">
            Top Up Game
          </span>
          <span className="block mt-2 text-[hsl(var(--background))] bg-[hsl(var(--foreground))] inline-block px-4 py-1 border-4 border-[hsl(var(--background))] transform -rotate-2 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.5)]">
            Tercepat
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl text-lg sm:text-xl font-bold text-[hsl(var(--foreground))] leading-relaxed border-2 border-[hsl(var(--border))] p-4 bg-[hsl(var(--background))] shadow-[var(--brutal-shadow-sm)]"
        >
          Masuk ke dimensi baru top-up digital. Beli diamond, UC, dan voucher dengan 
          kecepatan instan, keamanan berlapis, dan harga paling masuk akal.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center border-4 border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-[var(--brutal-shadow)]">
            <div className="flex-1 flex items-center px-4 w-full sm:w-auto">
              <Search className="h-6 w-6 text-[hsl(var(--foreground))]" />
              <Input
                placeholder="CARI GAME, VOUCHER..."
                className="flex-1 h-14 border-0 bg-transparent text-xl font-bold uppercase focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[hsl(var(--foreground))]/50 rounded-none"
              />
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 rounded-none border-t-4 sm:border-t-0 sm:border-l-4 border-[hsl(var(--border))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] text-lg font-black uppercase tracking-wider"
            >
              Cari
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-bold uppercase text-[hsl(var(--foreground))] mr-2 bg-[hsl(var(--muted))] px-2 py-1 border-2 border-[hsl(var(--border))]">
              Trending
            </span>
            {["Mobile Legends", "Free Fire", "Valorant"].map((tag) => (
              <Link
                key={tag}
                href={`/games/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="border-2 border-[hsl(var(--border))] px-4 py-1.5 text-sm font-bold uppercase text-[hsl(var(--foreground))] bg-[hsl(var(--background))] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
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
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6"
        >
          {features.map((feature, idx) => (
            <div
              key={feature.label}
              className="flex items-center gap-4 bg-[hsl(var(--background))] border-4 border-[hsl(var(--border))] p-4 shadow-[var(--brutal-shadow-sm)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[var(--brutal-shadow)] transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black uppercase text-[hsl(var(--foreground))]">
                  {feature.label}
                </p>
                <p className="text-sm font-bold uppercase text-[hsl(var(--foreground))]/70">
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
