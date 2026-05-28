"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { POPULAR_GAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PopularGames() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-20" id="popular-games">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <Badge variant="glow" className="mb-3">
              <Gamepad2 className="mr-1 h-3 w-3" />
              Game Populer
            </Badge>
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] sm:text-3xl">
              Top Up Game{" "}
              <span className="gradient-text">Favorit</span>
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Pilih game favoritmu dan top up sekarang dengan harga termurah
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex group" asChild>
            <Link href="/games">
              Lihat Semua
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
          {POPULAR_GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/games/${game.slug}`}
                className="group relative block overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                id={`game-card-${game.slug}`}
              >
                {/* Game Image Placeholder */}
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${game.color}22, ${game.color}44)`,
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />

                  {/* Game icon placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${game.color}33` }}
                    >
                      <Gamepad2
                        className="h-10 w-10"
                        style={{ color: game.color }}
                      />
                    </div>
                  </div>

                  {/* Popular badge */}
                  {game.popular && (
                    <div className="absolute left-2 top-2">
                      <Badge variant="glow" className="text-[10px] px-2 py-0.5">
                        🔥 Populer
                      </Badge>
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, ${game.color}20, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Game Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {game.publisher}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-[10px] capitalize"
                    >
                      {game.category}
                    </Badge>
                    <span className="text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                      TopUp →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile "See All" */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/games">
              Lihat Semua Game
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
