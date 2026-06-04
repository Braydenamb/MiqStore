"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Gamepad2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { Typography } from "@/components/typography";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[hsl(var(--background))] texture-overlay flex items-center pt-20 pb-16">
      
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0 dark:from-blue-900/10" />

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
              Proses Cepat, Harga Bersahabat.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography.Display size="xl" color="primary">
                Top Up.<br />
                <span className="text-[var(--color-teal)]">Main.</span><br />
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
              <Button 
                size="lg" 
                className="bg-teal hover:bg-[var(--color-navy)] rounded-full h-14 px-8 text-lg shadow-lg shadow-[#073B4C]/20 transition-all hover:-translate-y-1"
                onClick={() => toast.success("Memulai Top Up", { description: "Mengarahkan ke halaman Top Up..." })}
              >
                Top Up Sekarang
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
              className="relative z-10 w-full max-w-[400px] aspect-video animate-float flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            >
              <Image 
                src={cloudinaryUrl("Games/Mobile legends/banner")} 
                alt="Gaming Experience" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/60 to-transparent" />
            </motion.div>

            {/* Floating Card */}
            <div className="absolute bottom-[10%] right-[10%] z-20">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <Typography.Heading level="h4" color="primary" className="font-bold leading-tight">
                    Proses Instan
                  </Typography.Heading>
                  <Typography.Body size="sm" color="muted" className="font-medium">
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
