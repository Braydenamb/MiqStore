"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Gamepad2, Sword, Shield, Crosshair, Zap, Coins } from "lucide-react";
import { GameCard } from "@/components/games/game-card";

// Placeholder data since we are avoiding external assets
const GAMES = [
  { id: "mlbb", name: "Mobile Legends", publisher: "Moonton", platform: "Mobile", popular: true, icon: Sword, color: "#083B4C", bg: "bg-blue-100" },
  { id: "ff", name: "Free Fire", publisher: "Garena", platform: "Mobile", popular: true, icon: Shield, color: "#D4A44A", bg: "bg-orange-100" },
  { id: "pubgm", name: "PUBG Mobile", publisher: "Tencent", platform: "Mobile", popular: true, icon: Crosshair, color: "#0D1B2A", bg: "bg-gray-200" },
  { id: "valo", name: "Valorant", publisher: "Riot Games", platform: "PC", popular: true, icon: Zap, color: "#083B4C", bg: "bg-red-100" },
  { id: "genshin", name: "Genshin Impact", publisher: "HoYoverse", platform: "Mobile/PC", popular: true, icon: Gamepad2, color: "#0D1B2A", bg: "bg-purple-100" },
  { id: "hsr", name: "Honkai Star Rail", publisher: "HoYoverse", platform: "Mobile/PC", popular: false, icon: Gamepad2, color: "#083B4C", bg: "bg-indigo-100" },
  { id: "roblox", name: "Roblox", publisher: "Roblox Corp", platform: "Mobile/PC", popular: false, icon: Gamepad2, color: "#D4A44A", bg: "bg-slate-200" },
  { id: "steam", name: "Steam Wallet", publisher: "Valve", platform: "PC", popular: false, icon: Coins, color: "#0D1B2A", bg: "bg-blue-200" },
];

export default function GamesPage() {
  const [filter, setFilter] = useState("All Platforms");
  const [sort, setSort] = useState("Popular");

  return (
    <div className="min-h-screen bg-[var(--color-cream)] texture-overlay py-12 relative overflow-hidden">
      
      {/* Decorative Golden Dotted Side Decoration */}
      <div className="absolute left-4 top-20 bottom-20 w-8 border-l-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />
      <div className="absolute right-4 top-20 bottom-20 w-8 border-r-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--color-teal)]/20 pb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl sm:text-5xl font-bold text-[var(--color-navy)] mb-2"
            >
              All Games
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--color-teal)]/80"
            >
              Top up your favorite games instantly.
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
                className="appearance-none bg-white border border-[var(--color-teal)]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] cursor-pointer shadow-sm hover:border-[var(--color-teal)]/40 transition-colors"
              >
                <option>All Platforms</option>
                <option>Mobile</option>
                <option>PC</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-teal)] pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-[var(--color-teal)]/20 rounded-full py-2.5 pl-5 pr-10 text-sm font-medium text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] cursor-pointer shadow-sm hover:border-[var(--color-teal)]/40 transition-colors"
              >
                <option>Sort: Popular</option>
                <option>A-Z</option>
                <option>Newest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-teal)] pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {GAMES.map((game, idx) => (
            <GameCard key={game.id} {...game} index={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}
