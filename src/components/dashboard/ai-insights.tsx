"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, TrendingDown, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/providers/settings-provider";
import { cloudinaryUrl } from "@/lib/cloudinary";

export function AiInsights() {
  const { settings } = useSettings();
  const promoImage = settings["dashboard_promo_image"]
    ? (settings["dashboard_promo_image"].startsWith("http") ? settings["dashboard_promo_image"] : cloudinaryUrl(settings["dashboard_promo_image"]))
    : "/images/pubgm-logo.png";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Smart Recommendation Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 group hover:border-indigo-500/40 transition-colors shadow-sm"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-indigo-500/20">
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <h3 className="font-bold text-sm tracking-tight text-[hsl(var(--foreground))]">Smart Recommendation</h3>
        </div>
        
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-900/40 dark:bg-slate-900/80 shadow-inner border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
            <img src={promoImage} alt="Promo" className="h-10 w-10 object-contain drop-shadow-md" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[hsl(var(--foreground))] leading-tight">PUBG UC Sedang Diskon!</h4>
            <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] mt-1 mb-3">User dengan profil sepertimu banyak membeli paket 600 UC hari ini.</p>
            <Button size="sm" className="h-7 text-[10px] rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-3">
              Klaim Diskon 15%
            </Button>
          </div>
        </div>
      </motion.div>

      {/* AI Spending Insight Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 group hover:border-emerald-500/40 transition-colors shadow-sm"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 relative">
            <BrainCircuit className="h-4 w-4 text-emerald-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h3 className="font-bold text-sm tracking-tight text-[hsl(var(--foreground))]">Miq AI Insight</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <TrendingDown className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-0.5">Penghematan Bulan Ini</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">Rp 32.500</h4>
              <Sparkles className="h-3 w-3 text-emerald-500" />
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-emerald-500/50" />
        </div>
      </motion.div>
      
    </div>
  );
}
