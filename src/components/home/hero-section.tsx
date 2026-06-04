"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { Typography } from "@/components/typography";
import { FlipWords } from "@/components/ui/flip-words";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function HeroSection({ heroBannerUrl }: { heroBannerUrl?: string }) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[hsl(var(--background))] texture-overlay flex items-center pt-20 pb-16">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(var(--primary))] backdrop-blur-xl border border-[hsl(var(--primary))]/20 shadow-[0_0_15px_rgba(165,180,252,0.15)] mb-6"
            >
              <Zap className="h-4 w-4 text-[var(--color-gold)] fill-[var(--color-gold)] drop-shadow-md" />
              Proses Cepat, Harga Bersahabat.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography.Display size="xl" color="primary" className="drop-shadow-sm">
                Top Up.<br />
                <FlipWords words={["Main.", "Menang.", "Juara."]} /> <br />
                Tanpa Ribet.
              </Typography.Display>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg"
            >
              <Typography.Body size="lg" color="secondary">
                Top up diamond, UC, dan voucher game favoritmu dengan harga termurah dan proses kilat.
              </Typography.Body>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="flex items-center gap-2 bg-[hsl(var(--background))] hover:bg-[hsl(var(--primary))]/10 transition-colors text-[hsl(var(--foreground))] text-lg font-medium px-8 h-14"
                onClick={() => toast.success("Memulai Top Up", { description: "Mengarahkan ke halaman Top Up..." })}
              >
                Top Up Sekarang
                <ArrowRight className="h-5 w-5" />
              </HoverBorderGradient>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full h-14 px-8 text-lg border-[hsl(var(--primary))]/50 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 transition-all"
                onClick={() => {
                  toast("Menjelajahi Game", { description: "Mengarahkan ke katalog game..." });
                  window.location.href = "/games";
                }}
              >
                Lihat Daftar Game
              </Button>
            </motion.div>
          </div>

          {/* Right Visuals */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            

            {/* Main Visual Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[400px] aspect-video animate-float flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <Image 
                src={heroBannerUrl || cloudinaryUrl("Games/Mobile legends/banner")} 
                alt="Gaming Experience" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))]/90 to-transparent" />
            </motion.div>

            {/* Floating Card */}
            <div className="absolute bottom-[10%] right-[10%] z-20">
              <div className="bg-[hsl(var(--popover))]/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <Typography.Heading level="h4" className="font-bold leading-tight text-[hsl(var(--foreground))]">
                    Proses Instan
                  </Typography.Heading>
                  <Typography.Body size="sm" className="font-medium text-[hsl(var(--muted-foreground))]">
                    Aman & Terpercaya
                  </Typography.Body>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
