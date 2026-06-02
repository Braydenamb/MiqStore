"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, CalendarCheck, CheckCircle2, Sparkles, Crown, Gamepad2, Gift } from "lucide-react";

export function DashboardSidebar() {
  return (
    <div className="xl:w-80 shrink-0 flex flex-col gap-6">
      
      {/* Personalized Quick Top Up */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass-card rounded-3xl p-5 shadow-sm border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-sm">Lanjut Main?</h3>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-4 group cursor-pointer">
            <div className="absolute inset-0 bg-[url('/images/mlbb-logo.png')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity blur-sm" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-900/60 shadow-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/images/mlbb-logo.png" alt="MLBB" className="h-full w-full object-cover p-2" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Mobile Legends</h4>
                <p className="text-[10px] text-white/70 mt-0.5">Diamond ML hampir habis!</p>
              </div>
            </div>
            <Button size="sm" className="w-full mt-4 rounded-xl bg-[var(--liquid-blue)] hover:bg-[var(--liquid-blue)]/90 text-[hsl(var(--background))] font-bold relative z-10 shadow-lg shadow-cyan-500/20">
              Top Up Sekarang
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Daily Engagement / Reward System */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <div className="glass-card rounded-3xl p-5 shadow-sm border border-[hsl(var(--border))] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4 text-orange-500" />
              <h3 className="font-bold text-sm">Daily Reward</h3>
            </div>
            <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-500 border-orange-500/20 rounded-full font-bold">Day 3 Streak</Badge>
          </div>
          
          <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 relative z-10">
            Check-in hari ini untuk klaim Mystery Box spesial!
          </p>
          
          <div className="flex gap-2 relative z-10">
            <Button className="flex-1 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white font-bold shadow-lg shadow-orange-500/20 border-none transition-transform hover:scale-[1.02]">
              Klaim Reward
            </Button>
            <div className="h-10 w-10 shrink-0 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform cursor-pointer">
              <Gift className="h-5 w-5 text-rose-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Terbaru Banner */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <div className="rounded-3xl p-5 shadow-xl border border-[hsl(var(--border))] relative overflow-hidden bg-slate-900 group cursor-pointer">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/40 to-cyan-500/40 opacity-80" />
          
          <div className="relative z-10">
            <Badge className="bg-cyan-500 text-white font-bold text-[9px] uppercase tracking-wider mb-3 rounded-full shadow-lg shadow-cyan-500/30 border-none px-2 py-0.5">
              Flash Sale
            </Badge>
            <h3 className="text-lg font-black text-white leading-tight mb-1">
              PUBG Mobile<br />UC Diskon 20%
            </h3>
            <p className="text-xs text-white/80 font-medium mb-4">
              Hanya hari ini!
            </p>
            <Button size="sm" variant="outline" className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md font-bold text-xs h-8 px-4 w-fit">
              Lihat Promo
            </Button>
          </div>
          
          {/* Floating Event Element */}
          <div className="absolute -right-4 bottom-0 w-32 h-32 opacity-80 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-40 rounded-full" />
            <Sparkles className="w-full h-full text-white drop-shadow-2xl fill-white/20 p-4" strokeWidth={1} />
          </div>
        </div>
      </motion.div>
      
    </div>
  );
}
