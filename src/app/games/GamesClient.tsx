"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Gamepad2 } from "lucide-react";
import { GameCard } from "@/components/games/game-card";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function GamesClient({ initialGames }: { initialGames: any[] }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  
  const [filter, setFilter] = useState("All Platforms");
  const [sort, setSort] = useState("Popular");

  const filteredGames = initialGames.filter(g => {
    const publisherName = g.publisher || "";
    const matchesSearch = g.name.toLowerCase().includes(q) || publisherName.toLowerCase().includes(q);
    const platformStr = g.category?.name || "Mobile";
    const matchesPlatform = filter === "All Platforms" || platformStr.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesPlatform;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sort === "A-Z") return a.name.localeCompare(b.name);
    if (sort === "Popular") return (a.isPopular === b.isPopular) ? 0 : a.isPopular ? -1 : 1;
    if (sort === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

        {/* Mobile: horizontal scrollable pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex md:hidden overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-none"
        >
          {["All Platforms", "Mobile", "PC", "Console"].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                filter === p
                  ? "bg-[hsl(var(--primary))] text-white border-transparent"
                  : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]/70 hover:border-[hsl(var(--primary))]/40"
              )}
            >
              {p}
            </button>
          ))}
          <div className="shrink-0 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-[hsl(var(--card))]/50 backdrop-blur-md border border-[hsl(var(--primary))]/20 rounded-full py-2 pl-4 pr-8 text-sm font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] cursor-pointer"
            >
              <option>Popular</option>
              <option>A-Z</option>
              <option>Newest</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--primary))] pointer-events-none" />
          </div>
        </motion.div>

        {/* Desktop: dropdowns */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center gap-4"
        >
          {/* Filters */}
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[hsl(var(--card))]/50 backdrop-blur-md border border-[hsl(var(--primary))]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] cursor-pointer shadow-sm hover:border-[hsl(var(--primary))]/40 transition-colors"
            >
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">All Platforms</option>
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">Mobile</option>
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">PC</option>
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">Console</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--primary))] pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-[hsl(var(--card))]/50 backdrop-blur-md border border-[hsl(var(--primary))]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] cursor-pointer shadow-sm hover:border-[hsl(var(--primary))]/40 transition-colors"
            >
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">Sort: Popular</option>
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">A-Z</option>
              <option className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">Newest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--primary))] pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Games Grid */}
      {sortedGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {sortedGames.map((game, idx) => (
            <GameCard 
              key={game.id} 
              id={game.id}
              slug={game.slug}
              name={game.name}
              publisher={game.publisher || "Unknown"}
              platform={game.gameType || "Mobile"}
              category={game.category?.name}
              popular={game.isPopular}
              color={game.color || "#073B4C"}
              image={game.image}
              index={idx} 
            />
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
