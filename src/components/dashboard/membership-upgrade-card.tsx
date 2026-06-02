"use client";

import { motion } from "framer-motion";
import { Crown, Gem, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MembershipUpgradeCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-[24px] bg-[#FFF8EC] border border-[#E8DCC7] shadow-sm p-6 sm:p-8 group"
    >
      {/* Background decorations */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-gold)]/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side Content */}
        <div className="flex-1 flex flex-col items-start gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold)] font-bold text-xs border border-[var(--color-gold)]/30">
            <Crown className="h-3.5 w-3.5" />
            <span>Gold Member</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-navy)] leading-tight">
              Upgrade ke <span className="text-[var(--color-teal)]">Diamond</span> untuk <br className="hidden sm:block" />
              diskon 15%!
            </h3>
            <p className="text-sm font-medium text-[var(--color-navy)]/60">
              Butuh 1.750 poin lagi untuk naik level
            </p>
          </div>

          <div className="w-full max-w-md mt-2 space-y-2">
            <div className="h-2.5 w-full rounded-full bg-[#E8DCC7] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-[var(--color-teal)]" 
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-[var(--color-navy)]/50">
              <span>3.250 / 5.000 poin</span>
            </div>
          </div>
        </div>

        {/* Middle/Right Actions */}
        <div className="shrink-0 flex items-center justify-center">
           <Button className="rounded-xl bg-[var(--color-navy)] text-white hover:bg-[var(--color-teal)] transition-all px-6 h-11 font-bold group/btn">
              Lihat Detail
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
        </div>

        {/* Abstract Diamond Visuals (Replacing the image) */}
        <div className="hidden lg:flex relative h-32 w-32 shrink-0 items-center justify-center mr-8 pointer-events-none">
           <motion.div
             animate={{ y: [-5, 5, -5] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative z-20"
           >
              <Gem className="h-24 w-24 text-[var(--color-teal)] drop-shadow-[0_10px_15px_rgba(7,59,76,0.3)]" strokeWidth={1.5} />
              <Crown className="absolute -top-6 -right-2 h-10 w-10 text-[var(--color-gold)] drop-shadow-md rotate-12" />
           </motion.div>

           <Sparkles className="absolute top-0 -left-4 h-5 w-5 text-[var(--color-gold)] animate-pulse" />
           <Sparkles className="absolute bottom-4 -right-4 h-6 w-6 text-[var(--color-teal)]/50 animate-pulse delay-300" />
        </div>

      </div>
    </motion.div>
  );
}
