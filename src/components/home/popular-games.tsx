"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Shield, Crosshair, Sword, Zap } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

const popularGames = [
  { id: "mlbb", slug: "mobile-legends", name: "Mobile Legends", category: "MOBA", price: "Rp 1.500", icon: Sword, color: "#073B4C", bg: "bg-blue-100", image: "/images/mobile-legends.jpg" },
  { id: "pubgm", slug: "pubg-mobile", name: "PUBG Mobile", category: "Battle Royale", price: "Rp 10.000", icon: Crosshair, color: "#0B1D34", bg: "bg-orange-100", image: "/images/pubg-mobile.jpg" },
  { id: "ff", slug: "free-fire", name: "Free Fire", category: "Battle Royale", price: "Rp 5.000", icon: Shield, color: "#F7C873", bg: "bg-red-100", image: "/images/free-fire.webp" },
  { id: "valo", slug: "valorant", name: "Valorant", category: "FPS", price: "Rp 15.000", icon: Zap, color: "#073B4C", bg: "bg-red-50", image: "/images/valorant.jpg" },
  { id: "genshin", slug: "genshin-impact", name: "Genshin Impact", category: "RPG", price: "Rp 16.000", icon: Gamepad2, color: "#0B1D34", bg: "bg-purple-100", image: "/images/genshin-impact.jpg" },
];

export function PopularGames() {
  return (
    <section className="py-16 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-h1">
              Popular Top Ups
            </h2>
            <p className="mt-2 text-body-large">
              Find the best deals for your favorite games.
            </p>
          </div>
          <Link href="/games" className="text-[var(--color-teal)] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All Games <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {popularGames.map((game, idx) => (
            <Link href={`/games/${game.slug}`} key={game.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col bg-white rounded-[20px] p-4 premium-shadow border border-white hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full"
              >
              {/* Thumbnail Placeholder / Image */}
              <div className={`w-full aspect-[4/3] rounded-xl ${game.bg} flex items-center justify-center relative overflow-hidden mb-4 bg-[var(--color-navy)]`}>
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
              <div className="flex-1 flex flex-col z-10 relative">
                <span className="text-caption text-[var(--color-gold)] mb-1">{game.category}</span>
                <h3 className="text-h3 mb-1 line-clamp-1">{game.name}</h3>
                <p className="text-body text-sm mb-4">Starts at {game.price}</p>
                
                <button className="mt-auto flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-teal)] group-hover:bg-[var(--color-teal)] group-hover:text-white transition-colors ml-auto shadow-sm">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
