"use client";

import { motion } from "framer-motion";
import { Star, Smartphone, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface GameCardProps {
  id: string;
  name: string;
  publisher: string;
  platform: string;
  popular: boolean;
  icon: LucideIcon;
  color: string;
  bg: string;
  index: number;
}

export function GameCard({ name, publisher, platform, popular, icon: Icon, color, bg, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-[var(--color-cream)] rounded-[18px] border border-[#0F3D4A]/20 p-3 hover:shadow-[0_15px_30px_-5px_rgba(8,59,76,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      {/* Image Thumbnail Placeholder */}
      <div className={`relative w-full aspect-[4/5] rounded-[14px] ${bg} overflow-hidden mb-4 flex items-center justify-center`}>
        
        {/* Popular Badge */}
        {popular && (
          <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-[var(--color-teal)] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-md">
            <Star className="h-3 w-3 fill-white" />
            POPULAR
          </div>
        )}
        
        {/* CSS Zoom Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none z-10" />

        {/* Scaling Icon Container */}
        <div className="relative z-0 transition-transform duration-500 ease-out group-hover:scale-110">
          <Icon className="h-16 w-16 opacity-80" style={{ color }} />
        </div>
      </div>

      {/* Card Details */}
      <div className="px-1 pb-1 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg text-[var(--color-navy)] mb-1 leading-tight group-hover:text-[var(--color-teal)] transition-colors">
          {name}
        </h3>
        <p className="text-xs text-[var(--color-teal)]/70 font-medium mb-3">
          {publisher}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-1.5 border border-[#0F3D4A]/30 rounded-full px-2 py-0.5 text-[10px] font-semibold text-[var(--color-navy)] bg-white/50">
            {platform.includes('Mobile') && <Smartphone className="h-3 w-3" />}
            {platform.includes('PC') && <Monitor className="h-3 w-3" />}
            {platform}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
