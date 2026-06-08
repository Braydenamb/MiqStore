"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Receipt, TrendingUp, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Decorative Sparkline Component
function Sparkline({ color }: { color: string }) {
  return (
    <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 shrink-0">
      <path d="M2 28C6.5 25.5 10 18 15 18C20 18 22.5 24 28 24C33.5 24 38 12 43 12C48 12 51.5 22 57 22C62.5 22 66 10 71 10C76 10 78 5 78 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="78" cy="5" r="3" fill={color} />
    </svg>
  );
}

interface StatsGridProps {
  isLoading: boolean;
  totalTransactions?: string | number;
  totalSpent?: number;
  rewardPoints?: string | number;
}

export function StatsGrid({ isLoading, totalTransactions = "0", totalSpent = 0, rewardPoints = "0" }: StatsGridProps) {
  const stats = [
    { label: "Transaksi", title: "Total Transaksi", value: isLoading ? "..." : totalTransactions, icon: Receipt, color: "var(--liquid-cyan)" },
    { label: "Bulan ini", title: "Total Belanja", value: isLoading ? "..." : formatCurrency(totalSpent), icon: TrendingUp, color: "var(--liquid-blue)" },
    { label: "Poin", title: "Poin Reward", value: isLoading ? "..." : rewardPoints, icon: Star, color: "var(--liquid-amber)" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-3 gap-5"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={staggerItem}>
          <div className="glass-card rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow border border-[hsl(var(--border))]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm shrink-0"
                  style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">{stat.title}</p>
                  <p className="text-xl font-extrabold mt-0.5 text-[hsl(var(--foreground))]">{stat.value}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{stat.label}</p>
              <Sparkline color={stat.color} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
