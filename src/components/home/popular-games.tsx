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

  const renderGrid = (games: PublicGame[], title: string) => (
    <div className="mb-12 last:mb-0">
      <div className="mb-6">
        <Typography.Heading level="h2">
          {title}
        </Typography.Heading>
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
                  <CardBody className="relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-[hsl(var(--border))]/30 group/card transition-all duration-300 hover:shadow-md hover:border-[hsl(var(--primary))]/50 h-full w-full">
                    {/* Thumbnail / Image */}
                    <CardItem translateZ="50" className="w-full relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-900">
                      {game.image ? (
                        <Image 
                          src={game.image.startsWith('http') ? game.image : cloudinaryUrl(game.image)} 
                          alt={game.name} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-600 font-bold text-2xl">{game.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Soft overlay to ensure readability if image is too bright */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                      {/* Blurred Textbox with Game Name */}
                      <div className="absolute bottom-2 inset-x-2 p-3 rounded-xl bg-white/70 backdrop-blur-md flex flex-col gap-1.5 items-start shadow-sm">
                        <h3 className="font-bold text-[hsl(var(--foreground))] text-sm sm:text-base leading-tight line-clamp-2 text-left w-full">
                          {game.name}
                        </h3>
                        <div className="bg-[hsl(var(--primary))] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded">
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
        {renderGrid(initialGames, "Populer")}
        {renderGrid(mobileGames, "Mobile Games")}
        {pcGames.length > 0 && renderGrid(pcGames, "PC Games")}
      </div>
    </section>
  );
}
