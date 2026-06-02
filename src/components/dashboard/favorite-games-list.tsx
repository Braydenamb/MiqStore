"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Game {
  id: string;
  name: string;
  publisher: string;
  color: string;
}

const FAVORITE_GAMES: Game[] = [
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "pubgm",
    name: "PUBG Mobile",
    publisher: "Tencent",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    color: "from-red-500 to-rose-700",
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    color: "from-teal-400 to-emerald-600",
  },
];

export function FavoriteGamesList({ games }: { games?: Game[] }) {
  const displayGames = games && games.length > 0 ? games : FAVORITE_GAMES;

  return (
    <div className="bg-[#FFF8EC] border border-[#E8DCC7] rounded-[24px] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-[var(--color-navy)] flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          Game Favorit
        </h3>
        <Button variant="ghost" className="text-sm font-bold text-[var(--color-teal)] hover:bg-[#E8DCC7]/30 hover:text-[var(--color-navy)] rounded-xl h-9">
          Lihat Semua
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayGames.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              
              {/* Abstract pattern placeholder */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading font-extrabold text-white/90 text-2xl tracking-tighter -rotate-12 group-hover:scale-110 transition-transform">
                  {game.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <h4 className="font-bold text-[var(--color-navy)] text-sm truncate">{game.name}</h4>
            <p className="text-[10px] font-medium text-[var(--color-navy)]/50 truncate">{game.publisher}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
