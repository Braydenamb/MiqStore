"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Transaksi Berhasil", value: "2M+" },
  { label: "Pengguna Aktif", value: "500K+" },
  { label: "Game Tersedia", value: "100+" },
  { label: "Rating Kepuasan", value: "4.9/5" },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-[hsl(var(--foreground))] border-b-4 border-[hsl(var(--background))]" id="stats-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
              className="border-4 border-[hsl(var(--background))] bg-[hsl(var(--background))] p-6 text-center shadow-[4px_4px_0px_hsl(var(--background))] transform hover:-translate-y-1 transition-transform"
            >
              <div className="text-4xl sm:text-5xl font-black uppercase text-[hsl(var(--foreground))] drop-shadow-[2px_2px_0px_#888]">
                {stat.value}
              </div>
              <div className="mt-2 text-sm sm:text-base font-bold uppercase text-[hsl(var(--foreground))]/80 border-t-4 border-[hsl(var(--border))] pt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
