"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="py-12 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[24px] bg-[var(--color-teal)] px-6 py-12 sm:px-12 sm:py-16 premium-shadow"
        >
          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-[var(--color-gold)] blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left Content */}
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Your Games. <br />
                <span className="text-[var(--color-gold)]">Your Way.</span>
              </h2>
              
              <ul className="space-y-4 mb-8 text-white/90 text-left mx-auto md:mx-0 max-w-sm">
                <li className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Fast Delivery
                </li>
                <li className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Secure Checkout
                </li>
                <li className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-gold)]" />
                  Trusted by Thousands
                </li>
              </ul>

              <Button size="lg" className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-white rounded-full h-14 px-8 text-lg font-semibold shadow-lg transition-all w-full sm:w-auto">
                Explore Deals
              </Button>
            </div>

            {/* Right Illustration (Golden Globe Placeholder) */}
            <motion.div 
              className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-[var(--color-gold)]/30 border-dashed" />
              <div className="absolute inset-2 rounded-full border border-[var(--color-gold)]/50" />
              <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(247,200,115,0.3)] border border-[var(--color-gold)]/40">
                <Globe2 className="h-20 w-20 text-[var(--color-gold)] opacity-80" />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
