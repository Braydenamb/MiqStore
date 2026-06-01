"use client";

import { motion } from "framer-motion";
import { Wallet, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface WalletBannerProps {
  isLoading: boolean;
  walletBalance?: number;
}

export function WalletBanner({ isLoading, walletBalance = 0 }: WalletBannerProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 text-white shadow-2xl shadow-blue-500/10"
        style={{
          background: `linear-gradient(105deg, #3b2786 0%, #2563eb 50%, #06b6d4 100%)`,
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-400 blur-[80px]" />
          <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-purple-500 blur-[60px]" />
          <div className="absolute top-10 right-10 md:flex gap-4 hidden">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold italic shadow-xl text-white/90">M</div>
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold italic shadow-xl mt-12 text-white/90">M</div>
          </div>
          {/* Mockup wallet graphic representation */}
          <div className="absolute right-[-10%] top-[-30%] md:right-[-5%] md:top-[-20%] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/20" />
          <div className="hidden md:flex absolute right-[5%] top-[10%] w-[350px] h-[250px] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl rotate-[-10deg] flex-col justify-end p-6 z-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 self-end mb-4 shadow-lg flex items-center justify-center border border-white/20">
              <Wallet className="h-8 w-8 text-white drop-shadow-sm" />
            </div>
            <div className="w-3/4 h-4 bg-white/30 rounded-full mb-3" />
            <div className="w-1/2 h-4 bg-white/20 rounded-full" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-start gap-4 max-w-lg">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Wallet className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold opacity-90 tracking-wide">Saldo MiqStore</span>
            <Eye className="h-4 w-4 ml-1 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-md my-1">
            {isLoading ? "..." : formatCurrency(walletBalance)}
          </h2>
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <TrendingUp className="h-3.5 w-3.5" /> +Rp 680 (Cashback)
            </span>
            <span className="opacity-80">Bulan ini</span>
          </div>
          
          <Button size="lg" className="mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30 border-none font-bold px-8 h-12 text-sm transition-transform hover:scale-105">
            Deposit Saldo <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
