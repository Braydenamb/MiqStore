"use client";

import { ArrowRight, Gamepad2, Shield, Crosshair, Sword, Zap, Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import { Typography } from "@/components/typography";

import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cloudinaryUrl } from "@/lib/cloudinary";

const getCategoryIcon = (categoryName: string) => {
  const cat = categoryName?.toLowerCase() || "";
  if (cat.includes("moba") || cat.includes("rpg")) return Sword;
  if (cat.includes("fps") || cat.includes("shooter")) return Crosshair;
  if (cat.includes("battle royale")) return Shield;
  return Gamepad2;
};

export function PopularGames({ initialGames = [] }: { initialGames?: any[] }) {
  // Fallback to empty if DB has no games yet, or we could leave the old dummy data here as a fallback.
  // But since we want to fully connect it to DB, we will just use `initialGames`.

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

        {initialGames.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-[hsl(var(--border))]">
            <Gamepad2 className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <p className="text-[hsl(var(--foreground))] font-medium">Belum ada game populer yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {initialGames.map((game, idx) => {
              const IconComponent = getCategoryIcon(game.category?.name);
              
              return (
                <Link href={`/games/${game.slug}`} key={game.id} className="block h-full">
                  <CardContainer className="h-full w-full">
                    <CardBody
                      className="flex flex-col bg-[hsl(var(--card))]/40 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/5 hover:bg-[hsl(var(--card))]/80 hover:border-[hsl(var(--primary))]/30 transition-all duration-300 h-full w-full group/card hover:shadow-[0_8px_30px_rgba(165,180,252,0.1)]"
                    >
                      {/* Thumbnail Placeholder / Image */}
                      <CardItem translateZ="50" className="w-full">
                        <div className={`w-full aspect-[4/3] rounded-xl flex items-center justify-center relative overflow-hidden mb-4 bg-slate-900`}>
                          {game.image ? (
                            <Image 
                              src={game.image.startsWith('http') ? game.image : cloudinaryUrl(game.image)} 
                              alt={game.name} 
                              fill
                              className="object-cover opacity-90 group-hover/card:opacity-100 transition-all duration-300 group-hover/card:scale-105"
                            />
                          ) : (
                            <Gamepad2 className="w-12 h-12 text-slate-700 opacity-50" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                          <IconComponent className="absolute bottom-2 right-2 h-6 w-6 text-white/80 drop-shadow-md" />
                        </div>
                      </CardItem>
                      
                      {/* Details */}
                      <CardItem translateZ="30" className="flex-1 flex flex-col z-10 relative mt-2 w-full">
                        <Typography.Caption className="text-[var(--color-gold)] mb-1 font-medium tracking-wider uppercase">
                          {game.category?.name || game.gameType || "Games"}
                        </Typography.Caption>
                        <Typography.Heading level="h3" className="mb-1 line-clamp-1 text-[hsl(var(--foreground))]">
                          {game.name}
                        </Typography.Heading>
                        <Typography.Body size="sm" className="mb-4 text-[hsl(var(--muted-foreground))]">
                          Tersedia {game._count?.items || 0} item
                        </Typography.Body>
                        
                        <button className="mt-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-[hsl(var(--muted-foreground))] group-hover/card:bg-[hsl(var(--primary))] group-hover/card:text-[hsl(var(--primary-foreground))] transition-colors ml-auto shadow-sm">
                          <ArrowRight className="h-4 w-4" />
                        </button>
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
