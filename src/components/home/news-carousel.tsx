"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HOME_NEWS_BANNERS, type NewsBanner } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/providers/settings-provider";
import { cloudinaryUrl } from "@/lib/cloudinary";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        <Gamepad2 className="w-16 h-16 text-white/15" />
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

  const banners = useMemo(() => {
    try {
      const dynamicStr = settings["home_news_banners"];
      if (dynamicStr) {
        const parsed = JSON.parse(dynamicStr);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: NewsBanner) => ({
            ...b,
            image: b.image.startsWith("http") ? b.image : cloudinaryUrl(b.image),
          }));
        }
      }
    } catch {
      // fallback
    }
    return HOME_NEWS_BANNERS;
  }, [settings]);

  const imageIndex = wrap(0, banners.length, page);

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page],
  );

  const goTo = useCallback(
    (idx: number) => {
      const dir = idx > imageIndex ? 1 : -1;
      setPage([idx, dir]);
    },
    [imageIndex],
  );

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-[1440px] lg:px-6 lg:pt-6">
        {/* Compact carousel container */}
        <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[220px] bg-gray-900 lg:rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.5)]">

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={{
                enter: (d: number) => ({
                  x: d > 0 ? "100%" : "-100%",
                  opacity: 1,
                }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({
                  x: d < 0 ? "100%" : "-100%",
                  opacity: 1,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) paginate(1);
                else if (swipe > swipeConfidenceThreshold) paginate(-1);
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Link
                href={banners[imageIndex].link}
                className="block w-full h-full relative"
                draggable={false}
              >
                <SlideImage
                  src={banners[imageIndex].image}
                  alt={banners[imageIndex].alt}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Text content - left aligned */}
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="px-5 sm:px-8 lg:px-10 max-w-lg">
                    <div className="inline-block bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
                      Info Terbaru
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-snug line-clamp-2">
                      {banners[imageIndex].alt}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-2 right-2 sm:left-3 sm:right-3 flex items-center justify-between z-30 pointer-events-none">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => paginate(-1)}
              className="pointer-events-auto rounded-full w-8 h-8 lg:w-9 lg:h-9 bg-black/30 backdrop-blur-xl text-white border border-white/15 hover:bg-black/50 hover:scale-105 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => paginate(1)}
              className="pointer-events-auto rounded-full w-8 h-8 lg:w-9 lg:h-9 bg-black/30 backdrop-blur-xl text-white border border-white/15 hover:bg-black/50 hover:scale-105 transition-all opacity-80 hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress dots - bottom center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-500 rounded-full h-1 ${
                  idx === imageIndex
                    ? "w-5 bg-[var(--color-gold)] shadow-[0_0_6px_rgba(234,179,8,0.4)]"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
