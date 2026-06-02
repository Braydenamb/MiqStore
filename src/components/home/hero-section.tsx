"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Gamepad2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[hsl(var(--background))] texture-overlay flex items-center pt-20 pb-16">
      
      {/* Background Decor */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-10%] w-[800px] h-[800px] rounded-full bg-[var(--color-navy)] blur-[120px]" />
        <div className="absolute right-[10%] top-[20%] w-[500px] h-[500px] rounded-full bg-[var(--color-teal)] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5 text-sm font-semibold text-[var(--color-teal)] backdrop-blur-md border border-white/50 shadow-sm mb-6"
            >
              <Zap className="h-4 w-4 text-[var(--color-gold)] fill-[var(--color-gold)]" />
              New Look. Same Speed.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-navy)] leading-[1.1]"
            >
              Top Up.<br />
              <span className="text-[var(--color-teal)]">Play.</span><br />
              Done Right.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-gray-600 max-w-lg"
            >
              Instant game top ups, memberships, and vouchers delivered in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="bg-teal hover:bg-[var(--color-navy)] rounded-full h-14 px-8 text-lg shadow-lg shadow-[#073B4C]/20 transition-all hover:-translate-y-1"
                onClick={() => toast.success("Memulai Top Up", { description: "Mengarahkan ke halaman Top Up..." })}
              >
                Top Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full h-14 px-8 text-lg border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)]/5 transition-all"
                onClick={() => {
                  toast("Menjelajahi Game", { description: "Mengarahkan ke katalog game..." });
                  window.location.href = "/games";
                }}
              >
                Browse Games
              </Button>
            </motion.div>
          </div>

          {/* Right Visuals */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            
            {/* Cosmic blue streak (CSS implementation) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-teal)] to-[var(--color-navy)] opacity-20 rounded-[100px] rotate-12 blur-3xl animate-pulse" />
            
            {/* Twinkling stars */}
            <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-[var(--color-gold)] animate-twinkle shadow-[0_0_10px_var(--color-gold)]" />
            <div className="absolute top-[70%] right-[30%] w-1.5 h-1.5 rounded-full bg-white animate-twinkle shadow-[0_0_8px_white]" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-[20%] left-[40%] w-3 h-3 rounded-full bg-[var(--color-teal)] animate-twinkle shadow-[0_0_12px_var(--color-teal)]" style={{ animationDelay: '2s' }} />
            
            {/* Realistic White Controller (Abstract Placeholder built with SVG) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[400px] aspect-video animate-float flex items-center justify-center"
            >
              {/* Abstract 3D-ish Controller Shape */}
              <div className="absolute w-[360px] h-[220px] bg-white rounded-[100px] shadow-[0_30px_60px_rgba(11,29,52,0.15),inset_0_-10px_20px_rgba(0,0,0,0.05),inset_0_10px_20px_rgba(255,255,255,1)] flex items-center justify-between px-10">
                {/* D-Pad Area */}
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-inner relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                     <Gamepad2 className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                {/* Buttons Area */}
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-inner relative gap-2">
                  <div className="absolute top-2 w-6 h-6 rounded-full bg-[var(--color-teal)] shadow-sm" />
                  <div className="absolute bottom-2 w-6 h-6 rounded-full bg-[var(--color-navy)] shadow-sm" />
                  <div className="absolute left-2 w-6 h-6 rounded-full bg-[var(--color-gold)] shadow-sm" />
                  <div className="absolute right-2 w-6 h-6 rounded-full bg-gray-300 shadow-sm" />
                </div>
              </div>
            </motion.div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-[10%] right-[10%] z-20"
            >
              <div className="glass-panel px-6 py-4 rounded-2xl premium-shadow flex items-center gap-4 bg-white/90">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-[var(--color-navy)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[var(--color-navy)] leading-tight">Instant Delivery</p>
                  <p className="text-sm font-medium text-gray-500">100% Secure</p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
