"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Shield, Crosshair, Sword, Zap } from "lucide-react";

const popularGames = [
  { id: "mlbb", name: "Mobile Legends", category: "MOBA", price: "Rp 1.500", icon: Sword, color: "#073B4C", bg: "bg-blue-100" },
  { id: "pubgm", name: "PUBG Mobile", category: "Battle Royale", price: "Rp 10.000", icon: Crosshair, color: "#0B1D34", bg: "bg-orange-100" },
  { id: "ff", name: "Free Fire", category: "Battle Royale", price: "Rp 5.000", icon: Shield, color: "#F7C873", bg: "bg-red-100" },
  { id: "valo", name: "Valorant", category: "FPS", price: "Rp 15.000", icon: Zap, color: "#073B4C", bg: "bg-red-50" },
  { id: "genshin", name: "Genshin Impact", category: "RPG", price: "Rp 16.000", icon: Gamepad2, color: "#0B1D34", bg: "bg-purple-100" },
];

export function PopularGames() {
  return (
    <section className="py-16 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight">
              Popular Top Ups
            </h2>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Find the best deals for your favorite games.
            </p>
          </div>
          <button className="text-[var(--color-teal)] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All Games <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {popularGames.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group flex flex-col bg-white rounded-[20px] p-4 premium-shadow border border-white hover:-translate-y-2 transition-all duration-300"
            >
              {/* Thumbnail Placeholder */}
              <div className={`w-full aspect-[4/3] rounded-xl ${game.bg} flex items-center justify-center relative overflow-hidden mb-4`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent mix-blend-overlay" />
                <game.icon className="h-10 w-10 opacity-70" style={{ color: game.color }} />
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-semibold text-[var(--color-gold)] mb-1 uppercase tracking-wider">{game.category}</span>
                <h3 className="font-heading font-bold text-[hsl(var(--foreground))] text-lg mb-1 line-clamp-1">{game.name}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Starts at {game.price}</p>
                
                <button className="mt-auto flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-teal)] group-hover:bg-[var(--color-teal)] group-hover:text-white transition-colors ml-auto shadow-sm">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
