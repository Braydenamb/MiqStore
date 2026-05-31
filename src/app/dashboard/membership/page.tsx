"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Lock, 
  Sparkles, 
  Gift, 
  Gamepad2, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mocking User State
const MOCK_STATE = {
  currentLevel: 15,
  currentXP: 14500,
  xpForNextLevel: 15000,
  progressPercent: 90, // (14500 - 14000) / 1000 * 100 = 50% actually, but let's just use 90% for visual impact
  tier: "SILVER" as const,
  rewardPoints: 1450
};

const TIERS = [
  { id: "BRONZE", name: "Bronze", minLevel: 1, color: "var(--liquid-amber)", desc: "1% Cashback", icon: Star },
  { id: "SILVER", name: "Silver", minLevel: 10, color: "var(--liquid-cyan)", desc: "1.5% Cashback", icon: Zap },
  { id: "GOLD", name: "Gold", minLevel: 25, color: "var(--liquid-purple)", desc: "2% Cashback + Priority Support", icon: Crown },
  { id: "DIAMOND", name: "Diamond", minLevel: 50, color: "var(--liquid-blue)", desc: "3% Cashback + VIP Discord", icon: Trophy },
];

const RECENT_HISTORY = [
  { id: "xp-1", action: "Topup Mobile Legends", amount: "+680 XP", date: "Hari ini, 14:30", type: "earn" },
  { id: "xp-2", action: "Topup Genshin Impact", amount: "+790 XP", date: "Kemarin, 19:15", type: "earn" },
  { id: "xp-3", action: "Daily Check-in", amount: "+50 XP", date: "Kemarin, 08:00", type: "bonus" },
  { id: "xp-4", action: "Level Up Bonus!", amount: "+1000 XP", date: "25 Mei 2026", type: "level" },
];

export default function MembershipPage() {
  const currentTierIndex = TIERS.findIndex(t => t.id === MOCK_STATE.tier);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          Gamification & Loyalty <Badge variant="glow" className="bg-[var(--liquid-amber)]/10 text-[var(--liquid-amber)]">BETA</Badge>
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Kumpulkan XP dari setiap transaksi dan naikkan levelmu untuk membuka benefit eksklusif!
        </p>
      </motion.div>

      {/* Main Hero Card */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(192,132,252,0.15) 50%, rgba(59,130,246,0.1) 100%)`,
            border: "1px solid rgba(192,132,252,0.2)",
            boxShadow: "0 20px 40px -15px rgba(192,132,252,0.1)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb h-72 w-72 -top-32 -right-32 bg-[var(--liquid-cyan)] opacity-20 blur-[80px]" />
            <div className="orb h-72 w-72 -bottom-32 -left-32 bg-[var(--liquid-purple)] opacity-20 blur-[80px]" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            
            {/* Rank Badge */}
            <div className="shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--liquid-cyan)] to-[var(--liquid-purple)] rounded-full blur-xl opacity-40 animate-pulse" />
              <div className="relative h-32 w-32 rounded-full border-4 border-black/50 bg-gradient-to-br from-[hsl(var(--muted))] to-black flex flex-col items-center justify-center shadow-2xl">
                <Zap className="h-10 w-10 text-[var(--liquid-cyan)] mb-1" />
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] tracking-widest uppercase">Level</span>
                <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {MOCK_STATE.currentLevel}
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-3xl font-extrabold flex items-center justify-center md:justify-start gap-2">
                    {TIERS[currentTierIndex].name} Member
                    <Badge variant="outline" className="text-xs border-[var(--liquid-cyan)] text-[var(--liquid-cyan)]">Current</Badge>
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    Hanya butuh 500 XP lagi untuk naik ke Level {MOCK_STATE.currentLevel + 1}!
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black font-mono">{MOCK_STATE.currentXP.toLocaleString()}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Total XP</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--liquid-cyan)]">Lvl {MOCK_STATE.currentLevel}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">Lvl {MOCK_STATE.currentLevel + 1}</span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-black/40 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${MOCK_STATE.progressPercent}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--liquid-cyan)] to-[var(--liquid-purple)]"
                  />
                </div>
                <p className="text-center md:text-right text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
                  {(MOCK_STATE.xpForNextLevel - 1000 + (MOCK_STATE.progressPercent / 100 * 1000)).toLocaleString()} / {MOCK_STATE.xpForNextLevel.toLocaleString()} XP
                </p>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tier Roadmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[var(--liquid-amber)]" /> 
                Membership Perks
              </CardTitle>
              <CardDescription>Keuntungan eksklusif berdasarkan Tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TIERS.map((tier, index) => {
                  const isUnlocked = index <= currentTierIndex;
                  const isCurrent = index === currentTierIndex;
                  
                  return (
                    <div 
                      key={tier.id} 
                      className={cn(
                        "relative flex items-center gap-4 p-4 rounded-xl border transition-all",
                        isCurrent ? "border-[var(--liquid-cyan)]/50 bg-[var(--liquid-cyan)]/5" : 
                        isUnlocked ? "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20" : 
                        "border-dashed border-[hsl(var(--border))] opacity-50"
                      )}
                    >
                      {/* Line connector */}
                      {index !== TIERS.length - 1 && (
                        <div className={cn(
                          "absolute left-9 top-14 bottom-[-16px] w-0.5",
                          isUnlocked ? "bg-gradient-to-b from-[var(--liquid-cyan)]/50 to-transparent" : "bg-[hsl(var(--border))]"
                        )} />
                      )}

                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full z-10",
                        isUnlocked ? `bg-[${tier.color}]/20 text-[${tier.color}]` : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                      )} style={isUnlocked ? { backgroundColor: `color-mix(in srgb, ${tier.color} 20%, transparent)`, color: tier.color } : {}}>
                        {isUnlocked ? <tier.icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          {tier.name}
                          {isCurrent && <Badge variant="glow" className="text-[9px] px-1.5 py-0 bg-[var(--liquid-cyan)]/10 text-[var(--liquid-cyan)] border-[var(--liquid-cyan)]/30">Current</Badge>}
                          {!isUnlocked && <span className="text-[10px] font-normal text-[hsl(var(--muted-foreground))]">Unlocks at Lv {tier.minLevel}</span>}
                        </h4>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{tier.desc}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        {isUnlocked ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <div className="text-[10px] font-mono font-medium text-[hsl(var(--muted-foreground))] border rounded px-2 py-1">
                            {tier.minLevel * 1000} XP
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: History & Quests */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--liquid-purple)]" /> Riwayat XP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_HISTORY.map((hist) => (
                  <div key={hist.id} className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3 last:border-0 last:pb-0">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                      hist.type === 'earn' ? "bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)]" :
                      hist.type === 'level' ? "bg-[var(--liquid-amber)]/10 text-[var(--liquid-amber)]" :
                      "bg-[var(--liquid-cyan)]/10 text-[var(--liquid-cyan)]"
                    )}>
                      {hist.type === 'earn' ? <Gamepad2 className="h-4 w-4" /> :
                       hist.type === 'level' ? <Crown className="h-4 w-4" /> :
                       <Gift className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{hist.action}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{hist.date}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400 font-mono shrink-0">{hist.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="p-4 rounded-xl border border-dashed border-[var(--liquid-amber)]/30 bg-[var(--liquid-amber)]/5 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[var(--liquid-amber)] shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[var(--liquid-amber)]">Misi Spesial Musim Ini!</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">Topup 3x minggu ini untuk mendapatkan +500 XP bonus!</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
