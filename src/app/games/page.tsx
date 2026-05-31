"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Search, Gamepad2, Monitor, Smartphone, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { POPULAR_GAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem, fadeUp, viewportConfig } from "@/lib/motion";

const categories = [
  { id: "all", label: "Semua", icon: LayoutGrid },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "pc", label: "PC", icon: Monitor },
];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  const filtered = POPULAR_GAMES.filter((game) => {
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "all" || game.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-16" ref={ref}>
      {/* Aurora header bg */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple h-96 w-96 -top-48 left-1/4 opacity-20" />
          <div className="orb orb-blue h-72 w-72 -top-36 right-1/4 opacity-15" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Page Header */}
          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-8">
            <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Top Up <span className="gradient-text">Game</span>
            </h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Pilih game favoritmu dan top up dengan harga termurah
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Cari game..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 glass-card"
                id="games-search-input"
              />
            </div>

            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="gap-1.5"
                  id={`games-filter-${cat.id}`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {filtered.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4"
          >
            {filtered.map((game) => (
              <motion.div key={game.id} variants={staggerItem}>
                <Link
                  href={`/games/${game.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-500 hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1"
                  id={`game-${game.slug}`}
                >
                  {/* Game Image Area */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden"
                    style={{
                      background: `linear-gradient(160deg, ${game.color}12 0%, ${game.color}28 50%, ${game.color}08 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />

                    {/* Game Icon — Liquid Glass */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                        style={{
                          background: `rgba(255,255,255,0.06)`,
                          border: `1px solid rgba(255,255,255,0.08)`,
                          boxShadow: `0 8px 32px ${game.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                        }}
                      >
                        <Gamepad2
                          className="h-8 w-8 sm:h-9 sm:w-9 transition-colors duration-300"
                          style={{ color: game.color }}
                        />
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50"
                          style={{ background: game.color }}
                        />
                      </div>
                    </div>

                    {game.popular && (
                      <div className="absolute left-2 top-2">
                        <Badge variant="glow" className="text-[10px] px-2 py-0.5 backdrop-blur-md">
                          🔥 Populer
                        </Badge>
                      </div>
                    )}

                    {/* Shine on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, ${game.color}08 50%, transparent 70%)`,
                      }}
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-bold line-clamp-1 transition-colors duration-300 group-hover:text-[var(--liquid-purple)]">
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
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--muted))]">
              <Search className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Game tidak ditemukan</h3>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Coba kata kunci lain atau ubah filter kategori
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
