"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Gamepad2, Ticket, Smartphone, Wallet, RefreshCw, Star, QrCode, Send } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    { label: "Top Up Game", icon: Gamepad2, href: "/games", color: "from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/20" },
    { label: "Beli Voucher", icon: Ticket, href: "/vouchers", color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20" },
    { label: "Isi Pulsa", icon: Smartphone, href: "/pulsa", color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
    { label: "E-Wallet", icon: Wallet, href: "/e-wallet", color: "from-orange-400 to-rose-500", shadow: "shadow-orange-500/20" },
    { label: "Repeat Order", icon: RefreshCw, href: "/dashboard/history", color: "from-slate-400 to-slate-600", shadow: "shadow-slate-500/20" },
    { label: "Game Favorit", icon: Star, href: "/dashboard/favorites", color: "from-amber-300 to-yellow-500", shadow: "shadow-yellow-500/20" },
    { label: "Scan QR", icon: QrCode, href: "/scan", color: "from-pink-400 to-rose-500", shadow: "shadow-pink-500/20" },
    { label: "Transfer", icon: Send, href: "/transfer", color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-500/20" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4"
    >
      {actions.map((action, i) => (
        <motion.div key={action.label} variants={staggerItem}>
          <Link href={action.href} className="group flex flex-col items-center gap-3 w-full">
            <div className={`relative flex h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] items-center justify-center rounded-[24px] bg-white dark:bg-slate-900/60 shadow-sm border border-slate-200 dark:border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 overflow-hidden`}>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${action.color} transition-opacity duration-300`} />
              <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${action.color} blur-xl rounded-full transition-opacity duration-500 -z-10`} />
              
              <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${action.color} text-white shadow-lg ${action.shadow} group-hover:shadow-xl transition-all duration-300 z-10`}>
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
