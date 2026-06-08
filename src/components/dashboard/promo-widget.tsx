"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function PromoWidget() {
  return (
    <div className="bg-gradient-to-r from-[hsl(var(--primary))]/20 to-indigo-500/20 backdrop-blur-md border border-[hsl(var(--primary))]/30 rounded-[24px] p-6 sm:p-8 shadow-lg shadow-[hsl(var(--primary))]/5 relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--primary))] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold tracking-wider text-[hsl(var(--primary))] uppercase">Spesial Hari Ini</span>
          </div>
          <h3 className="text-2xl font-heading font-extrabold text-[hsl(var(--foreground))]">Diskon up to 30% untuk Member Baru!</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-md leading-relaxed">
            Dapatkan potongan harga spesial untuk top-up pertamamu di Mobile Legends & Valorant. Klaim vouchernya sekarang sebelum kehabisan!
          </p>
        </div>
        
        <div className="flex-shrink-0 w-full md:w-auto">
          <Button asChild className="w-full md:w-auto bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 h-12 px-8">
            <Link href="/dashboard/vouchers">
              Klaim Voucher <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
