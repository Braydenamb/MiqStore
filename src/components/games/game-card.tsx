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
  image?: string | null;
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
          <CardBody className="relative flex flex-col bg-[hsl(var(--card))]/40 rounded-2xl overflow-hidden shadow-lg border border-white/5 group/card transition-all duration-300 hover:shadow-xl hover:border-[hsl(var(--primary))]/30 h-full w-full">
            {/* Thumbnail / Image */}
            <CardItem translateZ="50" className="w-full relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-900">
              {image && !imgError ? (
                <Image 
                  src={image.startsWith('http') ? image : cloudinaryUrl(image)} 
                  alt={name} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-600 font-bold text-2xl">{name.charAt(0)}</span>
                </div>
              )}
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

              {/* Blurred Textbox with Game Name */}
              <div className="absolute bottom-2 inset-x-2 p-3 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/10 flex flex-col gap-1.5 items-start shadow-md">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base leading-tight drop-shadow-md line-clamp-2 text-left w-full">
                  {name}
                </h3>
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                  5% Off
                </div>
              </div>
            </CardItem>
          </CardBody>
      </CardContainer>
    </motion.div>
    </Link>
  );
}
