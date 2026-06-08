"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HOME_NEWS_BANNERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useSettings } from "@/components/providers/settings-provider";
import { cloudinaryUrl } from "@/lib/cloudinary";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function NewsImage({ src, alt }: { src: string, alt: string }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        <Gamepad2 className="w-32 h-32 text-white/20" />
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill
      sizes="(max-width: 1440px) 100vw, 1440px"
      priority
      className="object-cover"
      draggable={false}
      onError={() => setError(true)}
    />
  );
}

export function NewsCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const { settings } = useSettings();
  
  // Try to parse dynamic banners, fallback to constants
  const banners = useMemo(() => {
    try {
      const dynamicStr = settings["home_news_banners"];
      if (dynamicStr) {
        const parsed = JSON.parse(dynamicStr);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: any) => ({
            ...b,
            image: b.image.startsWith("http") ? b.image : cloudinaryUrl(b.image)
          }));
        }
      }
    } catch {}
    return HOME_NEWS_BANNERS;
  }, [settings]);

  // We only have a few items, we use wrap to make it infinite
  const imageIndex = wrap(0, banners.length, page);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Auto move every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-transparent">
      {/* 
        Container Edge-to-Edge on Mobile, 
        Rounded Container on lg screens 
      */}
      <div className="mx-auto max-w-[1440px] lg:px-6 lg:pt-6">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] bg-gray-900 lg:rounded-[32px] overflow-hidden group shadow-2xl">
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={{
                enter: (direction: number) => {
                  return {
                    x: direction > 0 ? "100%" : "-100%",
                    opacity: 1
                  };
                },
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1
                },
                exit: (direction: number) => {
                  return {
                    zIndex: 0,
                    x: direction < 0 ? "100%" : "-100%",
                    opacity: 1
                  };
                }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Link href={banners[imageIndex].link} className="block w-full h-full relative" draggable={false}>
                <NewsImage src={banners[imageIndex].image} alt={banners[imageIndex].alt} />
                
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d34]/90 via-[#0b1d34]/20 to-transparent pointer-events-none" />
                
                {/* Text Content */}
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 pointer-events-none">
                  <div>
                    <div className="inline-block bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                      Info Terbaru
                    </div>
                    <Typography.Heading level="h3" className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white drop-shadow-xl max-w-3xl leading-tight">
                      {banners[imageIndex].alt}
                    </Typography.Heading>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls (Liquid Glass) */}
          <div className="absolute inset-y-0 left-2 right-2 sm:left-4 sm:right-4 flex items-center justify-between z-30 pointer-events-none">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => paginate(-1)}
              className="pointer-events-auto rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] opacity-90 hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => paginate(1)}
              className="pointer-events-auto rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] opacity-90 hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>

          {/* Minimalist Progress Indicators */}
          <div className="absolute bottom-4 right-6 lg:bottom-8 lg:right-12 flex gap-2 z-30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const direction = idx > imageIndex ? 1 : -1;
                  setPage([idx, direction]);
                }}
                className={`transition-all duration-500 rounded-full h-1.5 lg:h-2 ${
                  idx === imageIndex 
                    ? "w-8 lg:w-12 bg-[var(--color-gold)] shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
