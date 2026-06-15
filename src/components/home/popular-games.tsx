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
  // Fallback to empty if DB has no games yet, or we could leave the old dummy data here as a fallback.
  // But since we want to fully connect it to DB, we will just use `initialGames`.

  return (
    <section id="popular-games" className="py-16 bg-[hsl(var(--background))] scroll-mt-20">
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

        {initialGames.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-[hsl(var(--border))]">
            <Gamepad2 className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <p className="text-[hsl(var(--foreground))] font-medium">Belum ada game populer yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {initialGames.map((game, idx) => {
              const IconComponent = getCategoryIcon(game.category?.name ?? "");
              
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
                        <div className="absolute bottom-2 inset-x-2 p-2 sm:p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
                          <h3 className="text-center font-bold text-white truncate text-sm sm:text-base drop-shadow-md">
                            {game.name}
                          </h3>
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
    </section>
  );
}
