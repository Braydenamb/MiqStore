"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Filter,
  Gamepad2,
  Monitor,
  Smartphone,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { POPULAR_GAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Semua", icon: LayoutGrid },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "pc", label: "PC", icon: Monitor },
];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const filtered = POPULAR_GAMES.filter((game) => {
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "all" || game.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-16" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] sm:text-4xl">
            Top Up <span className="gradient-text">Game</span>
          </h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            Pilih game favoritmu dan top up dengan harga termurah
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input
              placeholder="Cari game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
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

        {/* Games Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
            {filtered.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={`/games/${game.slug}`}
                  className="group relative block overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                  id={`game-${game.slug}`}
                >
                  {/* Game Image Area */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${game.color}15, ${game.color}35)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl text-4xl shadow-2xl transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${game.color}25` }}
                      >
                        <Gamepad2
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          style={{ color: game.color }}
                        />
                      </div>
                    </div>

                    {game.popular && (
                      <div className="absolute left-2 top-2">
                        <Badge variant="glow" className="text-[10px] px-2 py-0.5">
                          🔥 Populer
                        </Badge>
                      </div>
                    )}

                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 80%, ${game.color}15, transparent 70%)`,
                      }}
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-bold text-[hsl(var(--foreground))] line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {game.publisher}
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {game.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
              <Search className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[hsl(var(--foreground))]">
              Game tidak ditemukan
            </h3>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Coba kata kunci lain atau ubah filter kategori
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
