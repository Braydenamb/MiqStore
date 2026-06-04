"use client";

import { ArrowRight, Gamepad2, Shield, Crosshair, Sword, Zap } from "lucide-react";
import Image from "next/image";
import { Typography } from "@/components/typography";

import Link from "next/link";

import { cloudinaryUrl } from "@/lib/cloudinary";

const popularGames = [
  { id: "mlbb", slug: "mobile-legends", name: "Mobile Legends", category: "MOBA", price: "Rp 1.500", icon: Sword, color: "#073B4C", bg: "bg-blue-100", image: cloudinaryUrl("Games/Mobile legends/thumbnail") },
  { id: "pubgm", slug: "pubg-mobile", name: "PUBG Mobile", category: "Battle Royale", price: "Rp 10.000", icon: Crosshair, color: "#0B1D34", bg: "bg-orange-100", image: cloudinaryUrl("Games/PUBG Mobile/thumbnail") },
  { id: "ff", slug: "free-fire", name: "Free Fire", category: "Battle Royale", price: "Rp 5.000", icon: Shield, color: "#F7C873", bg: "bg-red-100", image: cloudinaryUrl("Games/Free fire/thumbnail") },
  { id: "valo", slug: "valorant", name: "Valorant", category: "FPS", price: "Rp 15.000", icon: Zap, color: "#073B4C", bg: "bg-red-50", image: cloudinaryUrl("Games/Valorant/thumbnail") },
  { id: "genshin", slug: "genshin-impact", name: "Genshin Impact", category: "RPG", price: "Rp 16.000", icon: Gamepad2, color: "#0B1D34", bg: "bg-purple-100", image: cloudinaryUrl("Games/Genshin impact/thumbnail") },
];

export function PopularGames() {
  return (
    <section className="py-16 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <Typography.Heading level="h2">
              Game Terpopuler
            </Typography.Heading>
            <Typography.Body size="lg" className="mt-2">
              Temukan penawaran terbaik untuk game favoritmu.
            </Typography.Body>
          </div>
          <Link href="/games" className="text-[hsl(var(--primary))] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {popularGames.map((game, idx) => (
            <Link href={`/games/${game.slug}`} key={game.id} className="block group">
              <div
                className="flex flex-col bg-[hsl(var(--card))]/40 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/5 hover:bg-[hsl(var(--card))]/80 hover:border-[hsl(var(--primary))]/30 hover:-translate-y-1 transition-all duration-300 h-full group-hover:shadow-[0_8px_30px_rgba(165,180,252,0.1)]"
              >
              {/* Thumbnail Placeholder / Image */}
              <div className={`w-full aspect-[4/3] rounded-xl ${game.bg} flex items-center justify-center relative overflow-hidden mb-4 bg-gray-900`}>
                <Image 
                  src={game.image} 
                  alt={game.name} 
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <game.icon className="absolute bottom-2 right-2 h-6 w-6 text-white/80 drop-shadow-md" />
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col z-10 relative mt-2">
                <Typography.Caption className="text-[var(--color-gold)] mb-1 font-medium tracking-wider uppercase">{game.category}</Typography.Caption>
                <Typography.Heading level="h3" className="mb-1 line-clamp-1 text-[hsl(var(--foreground))]">{game.name}</Typography.Heading>
                <Typography.Body size="sm" className="mb-4 text-[hsl(var(--muted-foreground))]">Mulai dari {game.price}</Typography.Body>
                
                <button className="mt-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-foreground))] transition-colors ml-auto shadow-sm">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
