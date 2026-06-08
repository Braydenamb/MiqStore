"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";

export function QuickTopUp() {
  const games = [
    { id: "mlbb", name: "Mobile Legends", image: "/images/Mobile_legends(1).jpg", color: "from-blue-500 to-indigo-600" },
    { id: "pubgm", name: "PUBG Mobile", image: "/images/pubgm.jpg", color: "from-orange-500 to-red-600" },
    { id: "valorant", name: "Valorant", image: "/images/Valorant_(1).jpg", color: "from-red-500 to-rose-700" },
    { id: "genshin", name: "Genshin Impact", image: "/images/genshin-impact-(1).jpg", color: "from-teal-400 to-emerald-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="font-heading font-bold text-lg text-[hsl(var(--foreground))]">Quick Top Up</h3>
      </div>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-3 sm:gap-4"
      >
        {games.map((game, i) => (
          <motion.div key={game.id} variants={staggerItem}>
            <Link href={`/games/${game.id}`} className="group flex flex-col items-center gap-3 w-full">
              <div className="relative flex aspect-square w-full sm:h-[84px] sm:w-[84px] items-center justify-center rounded-[20px] sm:rounded-[24px] bg-slate-900 shadow-sm border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 overflow-hidden group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                {game.image ? (
                  <Image 
                    src={game.image} 
                    alt={game.name} 
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80`} />
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white font-bold text-[10px] sm:text-xs bg-[hsl(var(--primary))] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Top Up
                  </span>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[hsl(var(--foreground))]/70 text-center leading-tight group-hover:text-[hsl(var(--foreground))] transition-colors truncate w-full px-1">
                {game.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
