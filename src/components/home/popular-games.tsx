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
    <section ref={ref} className="py-16 sm:py-24" id="popular-games">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <Badge variant="glow" className="mb-3 gap-1">
              <TrendingUp className="h-3 w-3" />
              Paling Populer
            </Badge>
            <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))] sm:text-3xl tracking-tight">
              Top Up Game{" "}
              <span className="gradient-text">Favorit</span>
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Pilih game favoritmu dan top up sekarang
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex group gap-1" asChild>
            <Link href="/games">
              Lihat Semua
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>

        {/* Games Grid — Liquid Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
        >
          {POPULAR_GAMES.map((game) => (
            <motion.div key={game.id} variants={staggerItem}>
              <Link
                href={`/games/${game.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-500 hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1"
                id={`game-card-${game.slug}`}
              >
                {/* Image Area */}
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(160deg, ${game.color}15 0%, ${game.color}30 50%, ${game.color}10 100%)`,
                  }}
                >
                  {/* Gradient bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />

                  {/* Game Icon — Liquid Glass */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative flex h-20 w-20 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                      style={{
                        background: `rgba(255,255,255,0.06)`,
                        border: `1px solid rgba(255,255,255,0.08)`,
                        boxShadow: `0 8px 32px ${game.color}25, inset 0 1px 0 rgba(255,255,255,0.1)`,
                      }}
                    >
                      <Gamepad2
                        className="h-9 w-9 transition-colors duration-300"
                        style={{ color: game.color }}
                      />
                      {/* Glow behind icon */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                        style={{ background: game.color }}
                      />
                    </div>
                  </div>

                  {/* Popular badge */}
                  {game.popular && (
                    <div className="absolute left-2 top-2">
                      <Badge
                        variant="glow"
                        className="text-[10px] px-2 py-0.5 backdrop-blur-md"
                      >
                        🔥 Populer
                      </Badge>
                    </div>
                  )}

                  {/* Shine sweep on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, transparent 30%, ${game.color}08 50%, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Game Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] line-clamp-1 transition-colors duration-300 group-hover:text-[var(--liquid-purple)]">
                    {game.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {game.publisher}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {game.category}
                    </Badge>
                    <span className="text-[11px] font-medium text-[var(--liquid-purple)] opacity-0 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
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
          <Button variant="outline" asChild className="rounded-xl gap-1">
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
