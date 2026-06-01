"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, CalendarCheck, CheckCircle2, Sparkles, Crown, Gamepad2 } from "lucide-react";

export function DashboardSidebar() {
  return (
    <div className="xl:w-80 shrink-0 flex flex-col gap-6">
      {/* Quick Top Up */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-sm">Quick Top Up</h3>
          </div>
          
          <div className="space-y-2 mb-5">
            {[
              { name: 'Mobile Legends', img: '/images/mlbb-logo.webp' }, 
              { name: 'Free Fire', img: '/images/ff-logo.webp' }, 
              { name: 'PUBG Mobile', img: '/images/pubgm-logo.webp' }
            ].map((game, i) => (
              <Link href={`/games/${game.name.toLowerCase().replace(' ', '-')}`} key={i} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors border border-transparent hover:border-[hsl(var(--border))] group">
                <div className="h-10 w-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-[hsl(var(--border))]">
                  {/* For now use Gamepad icon if image fails */}
                  <Gamepad2 className="h-5 w-5 text-[hsl(var(--muted-foreground))] group-hover:text-[var(--liquid-purple)] transition-colors" />
                </div>
                <span className="text-sm font-semibold flex-1">{game.name}</span>
              </Link>
            ))}
          </div>
          
          <Button variant="outline" className="w-full rounded-xl border-[hsl(var(--border))] text-xs font-semibold hover:bg-[hsl(var(--muted))]">
            <Gamepad2 className="h-3.5 w-3.5 mr-2" /> Lihat Semua Game
          </Button>
        </div>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <CalendarCheck className="h-4 w-4 text-orange-500" />
                <h3 className="font-bold text-sm">Daily Check-in</h3>
              </div>
              <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                Check-in setiap hari dan dapatkan poin reward!
              </p>
              <Button size="sm" className="bg-[var(--liquid-purple)] hover:bg-[var(--liquid-purple)]/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 px-5">
                Check-in Sekarang
              </Button>
            </div>
            <div className="shrink-0 pt-2">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/40 dark:to-purple-900/10 rounded-2xl shadow-lg shadow-purple-500/10 border border-purple-200 dark:border-purple-800 flex items-center justify-center rotate-6 hover:rotate-12 transition-transform cursor-pointer">
                <CheckCircle2 className="h-8 w-8 text-[var(--liquid-purple)]" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Terbaru */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--liquid-purple)]" />
              <h3 className="font-bold text-sm">Event Terbaru</h3>
            </div>
            <Link href="/promo" className="text-[10px] font-semibold text-[var(--liquid-purple)] hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 to-[#2e1065] aspect-[16/9] p-5 border border-indigo-500/30 shadow-inner group cursor-pointer">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/30 blur-2xl rounded-full group-hover:bg-blue-500/40 transition-colors" />
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-pink-500/30 blur-2xl rounded-full group-hover:bg-pink-500/40 transition-colors" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-1 text-cyan-300 text-[10px] font-bold tracking-wider mb-1">
                  <Sparkles className="h-3 w-3" /> TOP UP
                </div>
                <h4 className="text-white font-black text-xl italic uppercase drop-shadow-md leading-tight mt-0.5">September<br/>Deals!</h4>
              </div>
              <div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-[10px] border-none text-white font-bold py-1 px-3 shadow-lg shadow-purple-500/20">
                  Diskon hingga 20%
                </Badge>
              </div>
            </div>
            
            {/* Diamond graphic mock */}
            <div className="absolute -bottom-2 -right-2 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] opacity-90 group-hover:scale-110 transition-transform duration-500">
              <Crown className="w-24 h-24 rotate-12 fill-cyan-400/20" strokeWidth={1} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
