"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { HOME_NEWS_BANNERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const banners = HOME_NEWS_BANNERS;

  // Auto move every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1 === banners.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 < 0 ? banners.length - 1 : prev - 1));
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative w-full py-8 overflow-hidden bg-white/50 border-y border-[var(--color-teal)]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-teal)]/10 flex items-center justify-center">
              <Newspaper className="h-5 w-5 text-[var(--color-teal)]" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-navy)] leading-tight">
                Berita & Update
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-teal)]/80 font-medium">
                Info terbaru seputar dunia game.
              </p>
            </div>
          </div>
          
          {/* Controls Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              className="rounded-full border-[var(--color-teal)]/20 text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="rounded-full border-[var(--color-teal)]/20 text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Area */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] lg:aspect-[4/1] bg-gray-100 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-lg border border-[var(--color-teal)]/10 group">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction < 0 ? 100 : -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Link href={banners[currentIndex].link} className="block w-full h-full relative cursor-pointer">
                {/* Image */}
                <img 
                  src={banners[currentIndex].image} 
                  alt={banners[currentIndex].alt} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                
                {/* Text Content */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="inline-block bg-[var(--color-gold)] text-[var(--color-navy)] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2">
                    Latest News
                  </div>
                  <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                    {banners[currentIndex].alt}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Controls Mobile (Hover / Visible on small screens) */}
          <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between sm:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={handlePrev}
              className="rounded-full w-8 h-8 bg-black/30 backdrop-blur text-white border-white/20 hover:bg-black/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={handleNext}
              className="rounded-full w-8 h-8 bg-black/30 backdrop-blur text-white border-white/20 hover:bg-black/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 flex gap-1.5 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 ${
                  idx === currentIndex 
                    ? "w-4 sm:w-6 bg-[var(--color-gold)]" 
                    : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
