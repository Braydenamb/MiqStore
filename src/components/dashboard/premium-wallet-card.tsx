"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowRight, Eye, TrendingUp, Sparkles, Coins, Gamepad2, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumWalletCardProps {
  isLoading?: boolean;
  walletBalance?: number;
}

export function PremiumWalletCard({ isLoading, walletBalance = 0 }: PremiumWalletCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#073B4C] via-[#0B5E78] to-[#073B4C] p-8 sm:p-10 text-white shadow-xl group"
    >
      {/* Background Particles & Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--color-gold)]/20 rounded-full blur-[80px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[150%] bg-[#1E9E8E]/30 rounded-full blur-[100px] mix-blend-screen transition-transform duration-1000 group-hover:scale-110" />
        
        {/* Floating Particles (CSS dots) */}
        <div className="absolute top-[20%] left-[60%] w-2 h-2 bg-white/40 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px] animate-pulse delay-300" />
        <div className="absolute bottom-[20%] left-[40%] w-3 h-3 bg-[var(--color-gold)]/50 rounded-full blur-[2px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left Content */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 text-white/80">
            <Wallet className="h-5 w-5 text-white/90" />
            <span className="font-medium text-sm">Saldo MiqStore</span>
            <button className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="h-12 w-48 animate-pulse rounded-lg bg-white/20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight">
                  Rp {walletBalance.toLocaleString("id-ID")}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-[#1E9E8E]/20 border border-[#1E9E8E]/30 px-3 py-1.5 text-xs font-bold text-[#4DE6D3]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+ Rp 680 (Cashback) Bulan ini</span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Button className="rounded-full bg-transparent border border-white/30 text-white hover:bg-white hover:text-[#073B4C] transition-all px-6 h-11 font-bold group/btn">
              Deposit Saldo
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Right Side: Abstract Gaming Montage Placeholder */}
        {/* Since we can't use external images, we use a beautifully styled abstract composition that implies gaming (swords, coins, controllers) */}
        <div className="hidden md:flex relative h-48 w-[400px] items-center justify-center pointer-events-none">
          {/* Central Hero Shape */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl rotate-12"
          >
            <Swords className="h-16 w-16 text-[var(--color-gold)] drop-shadow-[0_0_15px_rgba(231,179,75,0.5)]" />
          </motion.div>

          {/* Secondary Shape */}
          <motion.div 
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute z-10 -left-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#1E9E8E]/40 to-[#1E9E8E]/10 backdrop-blur-sm border border-[#1E9E8E]/30 -rotate-12"
          >
            <Gamepad2 className="h-10 w-10 text-white/80" />
          </motion.div>

          {/* Floating Coins */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute z-30 -right-4 bottom-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#E7B34B] to-yellow-600 border border-yellow-300/50 shadow-[0_0_30px_rgba(231,179,75,0.4)]"
          >
            <Coins className="h-8 w-8 text-yellow-100" />
          </motion.div>

          {/* Sparkles */}
          <Sparkles className="absolute top-0 right-10 h-6 w-6 text-[var(--color-gold)]/60 animate-pulse" />
          <Sparkles className="absolute bottom-10 left-10 h-4 w-4 text-white/40 animate-pulse delay-500" />
        </div>

      </div>
    </motion.div>
  );
}
