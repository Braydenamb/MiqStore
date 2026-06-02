"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Gamepad2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { POPULAR_GAMES } from "@/lib/constants";
import {
  staggerContainer,
  staggerItem,
  viewportConfig,
  fadeUp,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PopularGames() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-[hsl(var(--background))]" id="popular-games">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-1 border-2 border-[hsl(var(--border))] bg-[hsl(var(--primary))] px-3 py-1 text-xs font-bold uppercase text-[hsl(var(--primary-foreground))] shadow-[var(--brutal-shadow-sm)]">
              <TrendingUp className="h-3 w-3" />
              Paling Populer
            </div>
            <h2 className="text-3xl font-black uppercase text-[hsl(var(--foreground))] sm:text-5xl tracking-tighter">
              Top Up Game <span className="text-[hsl(var(--background))] bg-[hsl(var(--foreground))] inline-block px-2 border-4 border-[hsl(var(--background))] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.5)] transform -rotate-2">Favorit</span>
            </h2>
          </div>
          <Button variant="outline" className="hidden sm:flex group gap-1 border-2 border-[hsl(var(--border))] rounded-none shadow-[var(--brutal-shadow-sm)] font-bold uppercase hover:-translate-y-1 hover:shadow-[var(--brutal-shadow)] transition-all" asChild>
            <Link href="/games">
              Lihat Semua
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Games Grid — Brutalist Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
        >
          {POPULAR_GAMES.map((game) => (
            <motion.div key={game.id} variants={staggerItem}>
              <Link
                href={`/games/${game.slug}`}
                className="group relative block overflow-hidden border-4 border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[var(--brutal-shadow-lg)]"
                id={`game-card-${game.slug}`}
              >
                {/* Image Area */}
                <div
                  className="relative aspect-[4/5] w-full border-b-4 border-[hsl(var(--border))] flex items-center justify-center bg-[hsl(var(--muted))] pattern-dots-sm"
                >
                  <Gamepad2 className="h-16 w-16 text-[hsl(var(--foreground))] transition-transform group-hover:scale-110" />

                  {/* Popular badge */}
                  {game.popular && (
                    <div className="absolute left-2 top-2">
                      <div className="border-2 border-[hsl(var(--border))] bg-[hsl(var(--primary))] px-2 py-0.5 text-[10px] font-black uppercase text-[hsl(var(--primary-foreground))] shadow-[var(--brutal-shadow-sm)]">
                        POPULER
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-4 bg-[hsl(var(--background))]">
                  <h3 className="text-base font-black uppercase text-[hsl(var(--foreground))] line-clamp-1 transition-colors">
                    {game.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase text-[hsl(var(--foreground))]/60">
                    {game.publisher}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="border-2 border-[hsl(var(--border))] px-2 py-0.5 text-[10px] font-black uppercase bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
                      {game.category}
                    </div>
                    <span className="text-[11px] font-black uppercase text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] px-2 py-1 border-2 border-[hsl(var(--border))] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]">
                      Top Up →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild className="rounded-none border-2 border-[hsl(var(--border))] shadow-[var(--brutal-shadow-sm)] font-bold uppercase gap-1">
            <Link href="/games">
              Lihat Semua Game
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
