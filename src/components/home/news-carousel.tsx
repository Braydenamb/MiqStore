"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2, Newspaper } from "lucide-react";
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

function NewsThumbnail({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
        <Gamepad2 className="w-8 h-8 text-white/20" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="160px"
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
        <div className="flex items-stretch bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

          {/* ── Left: Label + Thumbnail ── */}
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 border-r border-white/10 shrink-0">
            {/* News icon label */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-400/20">
                <Newspaper className="w-4 h-4 text-blue-300" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200/80 whitespace-nowrap">
                Info<br />Terbaru
              </span>
            </div>

            {/* Thumbnail with swipe animation */}
            <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 1 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 1 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
                  className="absolute inset-0"
                >
                  <NewsThumbnail src={banners[imageIndex].image} alt={banners[imageIndex].alt} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Content + Controls ── */}
          <div className="flex items-center justify-between flex-1 min-w-0 px-4 py-3 sm:px-5 sm:py-3.5 gap-3">
            {/* Animated text content */}
            <div className="relative flex-1 min-w-0 overflow-hidden h-[2.5rem] sm:h-[2.75rem]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0 }),
                    center: { y: 0, opacity: 1 },
                    exit: (d: number) => ({ y: d < 0 ? "100%" : "-100%", opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute inset-0 flex items-center"
                >
                  <Link
                    href={banners[imageIndex].link}
                    className="block w-full min-w-0 group/link"
                    draggable={false}
                  >
                    <p className="text-sm sm:text-base font-semibold text-white/90 group-hover/link:text-white truncate transition-colors leading-snug">
                      {banners[imageIndex].alt}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/40 mt-0.5 truncate">
                      Klik untuk selengkapnya
                    </p>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav arrows + dots */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Progress dots */}
              <div className="hidden sm:flex gap-1 items-center">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`transition-all duration-500 rounded-full h-1 ${
                      idx === imageIndex
                        ? "w-5 bg-[var(--color-gold)] shadow-[0_0_6px_rgba(234,179,8,0.4)]"
                        : "w-1.5 bg-white/25 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => paginate(-1)}
                  className="w-7 h-7 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => paginate(1)}
                  className="w-7 h-7 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
