"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";

const RECENT_PURCHASES = [
  { name: "Rizky P.", item: "257 Diamond Mobile Legends", time: "12 detik lalu" },
  { name: "Sarah A.", item: "Blessing of the Welkin Moon", time: "35 detik lalu" },
  { name: "Budi S.", item: "720 UC PUBG Mobile", time: "1 menit lalu" },
  { name: "Dewi A.", item: "1375 VP Valorant", time: "2 menit lalu" },
  { name: "Ahmad F.", item: "355 Diamond Free Fire", time: "3 menit lalu" },
  { name: "Maya I.", item: "Weekly Pass Honkai: Star Rail", time: "4 menit lalu" },
];

export function LiveActivityTicker() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setIsVisible(true);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (pathname.startsWith("/admin") || isDismissed) return null;

  const current = RECENT_PURCHASES[currentIndex];

  return (
    <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-30 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto flex items-center gap-3 bg-[hsl(var(--background))]/90 backdrop-blur-xl border border-white/15 p-3 pr-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-xs sm:max-w-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-bold text-[hsl(var(--foreground))] truncate">
                <span className="text-[hsl(var(--primary))] font-extrabold">{current.name}</span> baru saja membeli
              </p>
              <p className="text-xs font-semibold text-[hsl(var(--foreground))]/80 truncate">
                {current.item}
              </p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                {current.time} • Transaksi Sukses
              </p>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Tutup notifikasi"
              className="text-gray-400 hover:text-gray-200 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
