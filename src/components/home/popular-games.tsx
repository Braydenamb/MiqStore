"use client";

import { ArrowRight, Gamepad2, Shield, Crosshair, Sword, Zap, Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import { Typography } from "@/components/typography";

import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { PublicGame } from "@/lib/types";

const getCategoryIcon = (categoryName: string) => {
  const cat = categoryName?.toLowerCase() || "";
  if (cat.includes("moba") || cat.includes("rpg")) return Sword;
  if (cat.includes("fps") || cat.includes("shooter")) return Crosshair;
  if (cat.includes("battle royale")) return Shield;
  return Gamepad2;
};

export function PopularGames({ initialGames = [] }: { initialGames?: PublicGame[] }) {
  const mobileGames = initialGames.filter(g => 
    g.category?.name?.toLowerCase().includes("mobile") || 
    g.gameType?.toLowerCase() === "mobile" || 
    (!g.category?.name?.toLowerCase().includes("pc") && g.gameType?.toLowerCase() !== "pc")
  );

  const pcGames = initialGames.filter(g => 
    g.category?.name?.toLowerCase().includes("pc") || 
    g.gameType?.toLowerCase() === "pc"
  );

  const renderGrid = (games: PublicGame[], title: string, subtitle: string) => (
    <div className="mb-16 last:mb-0">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <Typography.Heading level="h2">
            {title}
          </Typography.Heading>
          <Typography.Body size="lg" className="mt-2">
            {subtitle}
          </Typography.Body>
        </div>
        <Link href="/games" className="text-[hsl(var(--primary))] font-medium flex items-center gap-1 hover:gap-2 transition-all">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-[hsl(var(--border))]">
          <Gamepad2 className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
          <p className="text-[hsl(var(--foreground))] font-medium">Belum ada game yang ditambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {games.map((game, idx) => {
            return (
              <Link href={`/games/${game.slug}`} key={game.id} className="block h-full">
                <CardContainer className="h-full w-full">
                  <CardBody className="relative flex flex-col bg-[hsl(var(--card))]/40 rounded-2xl overflow-hidden shadow-lg border border-white/5 group/card transition-all duration-300 hover:shadow-xl hover:border-[hsl(var(--primary))]/30 h-full w-full">
                    {/* Thumbnail / Image */}
                    <CardItem translateZ="50" className="w-full relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-900">
                      {game.image ? (
                        <Image 
                          src={game.image.startsWith('http') ? game.image : cloudinaryUrl(game.image)} 
                          alt={game.name} 
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-600 font-bold text-2xl">{game.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

                      {/* Blurred Textbox with Game Name */}
                      <div className="absolute bottom-2 inset-x-2 p-3 rounded-xl bg-gradient-to-t from-white/20 to-white/5 backdrop-blur-xl border border-white/20 flex flex-col gap-1.5 items-start">
                        <h3 className="font-bold text-white text-sm sm:text-base leading-tight drop-shadow-md line-clamp-2 text-left w-full">
                          {game.name}
                        </h3>
                        <div className="bg-[#a8ff9e] text-[#0a3a0a] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded">
                          5% Off
                        </div>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section id="popular-games" className="py-16 bg-[hsl(var(--background))] scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {renderGrid(initialGames, "Game Terpopuler", "Kumpulan game paling diminati bulan ini.")}
        {renderGrid(mobileGames, "Mobile Games", "Temukan penawaran terbaik untuk game favoritmu.")}
        {pcGames.length > 0 && renderGrid(pcGames, "PC Games", "Top up game PC terpopuler dengan harga termurah.")}
      </div>
    </section>
  );
}
