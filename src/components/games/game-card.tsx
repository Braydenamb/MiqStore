"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Smartphone, Monitor, Gamepad2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface GameCardProps {
  id: string;
  slug?: string;
  name: string;
  publisher: string;
  platform?: string;
  category?: string;
  popular: boolean;
  icon?: LucideIcon;
  color: string;
  bg?: string;
  index: number;
  image?: string;
}

export function GameCard({ slug, id, name, publisher, platform, category, popular, icon: Icon, color, bg, index, image }: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const gamePlatform = platform || category || "Mobile";
  const linkHref = slug ? `/games/${slug}` : `/games/${id}`;

  return (
    <Link href={linkHref} className="block group relative h-full">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="h-full"
    >
      <CardContainer className="h-full w-full">
        <CardBody
          className="bg-[hsl(var(--card))]/40 backdrop-blur-md rounded-[18px] border border-[hsl(var(--border))]/20 p-3 hover:shadow-[0_15px_30px_-5px_rgba(8,59,76,0.15)] hover:border-[hsl(var(--primary))]/30 transition-all duration-300 flex flex-col h-full w-full group/card hover:bg-[hsl(var(--card))]/80"
        >
          {/* Image Thumbnail Placeholder */}
          <CardItem translateZ="50" className="w-full">
            <div className={`relative w-full aspect-[4/5] rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center`}>
              
              {/* Popular Badge */}
              {popular && (
                <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-md">
                  <Star className="h-3 w-3 fill-current" />
                  POPULAR
                </div>
              )}
              
              {/* CSS Zoom Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10 transition-opacity group-hover/card:opacity-80" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none z-10" />

              {/* Scaling Icon Container or Image */}
              <div className="relative w-full h-full z-0 transition-transform duration-500 ease-out group-hover/card:scale-110">
                {image && !imgError ? (
                  <Image 
                    src={image.startsWith('http') ? image : cloudinaryUrl(image)} 
                    alt={name} 
                    fill 
                    className="object-cover opacity-90" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
                    {Icon ? <Icon className="h-16 w-16 opacity-80" style={{ color }} /> : <Gamepad2 className="h-16 w-16 opacity-30 text-white" />}
                  </div>
                )}
              </div>
            </div>
          </CardItem>

          {/* Card Details */}
          <CardItem translateZ="30" className="px-1 pt-4 pb-1 flex flex-col flex-1 w-full">
            <h3 className="font-heading font-bold text-lg text-[hsl(var(--foreground))] mb-1 leading-tight group-hover/card:text-[hsl(var(--primary))] transition-colors">
              {name}
            </h3>
            <p className="text-xs text-[hsl(var(--primary))]/70 font-medium mb-3">
              {publisher}
            </p>

            <div className="mt-auto flex items-center justify-between">
              {/* Platform Badge */}
              <div className="inline-flex items-center gap-1.5 border border-[hsl(var(--border))]/30 rounded-full px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--foreground))] bg-white/50 capitalize">
                {gamePlatform.includes('obile') && <Smartphone className="h-3 w-3" />}
                {gamePlatform.includes('pc') || gamePlatform.includes('PC') ? <Monitor className="h-3 w-3" /> : null}
                {gamePlatform}
              </div>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </motion.div>
    </Link>
  );
}
