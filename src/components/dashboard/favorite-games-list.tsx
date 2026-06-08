"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface Game {
  id: string;
  name: string;
  publisher: string;
  color: string;
  image?: string | null;
}

const FAVORITE_GAMES: Game[] = [
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    color: "from-blue-500 to-indigo-600",
    image: "/images/Mobile_legends(1).jpg",
  },
  {
    id: "pubgm",
    name: "PUBG Mobile",
    publisher: "Tencent",
    color: "from-orange-500 to-red-600",
    image: "/images/pubgm.jpg",
  },
  {
    id: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    color: "from-red-500 to-rose-700",
    image: "/images/Valorant_(1).jpg",
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    color: "from-teal-400 to-emerald-600",
    image: "/images/genshin-impact-(1).jpg",
  },
];

function GameItem({ game, i }: { game: Game, i: number }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 bg-slate-900">
        {game.image && !imgError ? (
          <Image 
            src={game.image.startsWith('http') || game.image.startsWith('/') ? game.image : cloudinaryUrl(game.image)} 
            alt={game.name} 
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300"
            onError={() => setImgError(true)}
            unoptimized={game.image.startsWith('http')}
          />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-white/50" />
            </div>
          </>
        )}
      </div>
      <h4 className="font-bold text-[hsl(var(--foreground))] text-sm truncate">{game.name}</h4>
      <p className="text-[10px] font-medium text-[hsl(var(--foreground))]/50 truncate">{game.publisher}</p>
    </motion.div>
  );
}

export function FavoriteGamesList({ games }: { games?: Game[] }) {
  const displayGames = games && games.length > 0 ? games : FAVORITE_GAMES;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-[hsl(var(--foreground))] flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          Game Favorit
        </h3>
        <Button variant="ghost" className="text-sm font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--border))]/30 hover:text-[hsl(var(--foreground))] rounded-xl h-9">
          Lihat Semua
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayGames.map((game, i) => (
          <GameItem key={game.id} game={game} i={i} />
        ))}
      </div>
    </div>
  );
}
