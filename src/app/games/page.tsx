"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Gamepad2, Sword, Shield, Crosshair, Zap, Coins } from "lucide-react";
import { GameCard } from "@/components/games/game-card";

import { POPULAR_GAMES } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GamesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  
  const [filter, setFilter] = useState("All Platforms");
  const [sort, setSort] = useState("Popular");

  const filteredGames = POPULAR_GAMES.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(q) || g.publisher.toLowerCase().includes(q);
    const matchesPlatform = filter === "All Platforms" || g.category.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesPlatform;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sort === "A-Z") return a.name.localeCompare(b.name);
    if (sort === "Popular") return (a.popular === b.popular) ? 0 : a.popular ? -1 : 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[hsl(var(--primary))]/20 pb-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl font-bold text-[hsl(var(--foreground))] mb-2"
          >
            {q ? `Search: ${searchParams.get("q")}` : "All Games"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[hsl(var(--primary))]/80"
          >
            {q ? `Found ${sortedGames.length} games matching your search.` : "Top up your favorite games instantly."}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {/* Filters */}
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-[hsl(var(--primary))]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] cursor-pointer shadow-sm hover:border-[hsl(var(--primary))]/40 transition-colors"
            >
              <option>All Platforms</option>
              <option>Mobile</option>
              <option>PC</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--primary))] pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-[hsl(var(--primary))]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] cursor-pointer shadow-sm hover:border-[hsl(var(--primary))]/40 transition-colors"
            >
              <option>Sort: Popular</option>
              <option>A-Z</option>
              <option>Newest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--primary))] pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Games Grid */}
      {sortedGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {sortedGames.map((game, idx) => (
            <GameCard key={game.id} {...game} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Gamepad2 className="h-16 w-16 mx-auto text-[hsl(var(--primary))]/20 mb-4" />
          <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">No games found</h3>
          <p className="text-[hsl(var(--foreground))]/60">We couldn't find any games matching "{searchParams.get("q")}".</p>
        </div>
      )}

    </div>
  );
}

function GamesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[hsl(var(--primary))]/20 pb-6">
        <div>
          <div className="h-12 w-64 bg-gray-200/50 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-gray-200/50 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200/50 rounded-full animate-pulse" />
          <div className="h-10 w-32 bg-gray-200/50 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-[20px] bg-white/50 border border-white p-4 h-[280px] flex flex-col relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent" />
            <div className="relative z-10 flex-1 flex flex-col items-center text-center pt-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-4" />
              <div className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded-md" />
            </div>
            <div className="relative z-10 mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="h-4 w-16 bg-gray-200 rounded-md" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay py-8 relative overflow-hidden">
      
      {/* Decorative Golden Dotted Side Decoration */}
      <div className="absolute left-4 top-20 bottom-20 w-8 border-l-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />
      <div className="absolute right-4 top-20 bottom-20 w-8 border-r-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />

      <Suspense fallback={<GamesSkeleton />}>
        <GamesContent />
      </Suspense>
    </div>
  );
}
