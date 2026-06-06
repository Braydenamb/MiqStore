"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ShoppingCart, User, Gamepad2, Menu } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overflow-y-auto overflow-x-hidden font-sans selection:bg-[hsl(var(--primary))]/30">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[hsl(var(--primary))]/10 to-transparent -z-10 pointer-events-none"></div>

      {/* Navbar Overlay */}
      <nav className="relative z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-[hsl(var(--primary))]/10 rounded-xl group-hover:bg-[hsl(var(--primary))]/20 transition-colors">
            <Gamepad2 className="w-6 h-6 text-[hsl(var(--primary))] group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-[hsl(var(--foreground))]">MiqStore</span>
        </Link>
        
        {/* Center: Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[hsl(var(--muted-foreground))]">
          <Link href="/games" className="hover:text-[hsl(var(--foreground))] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--primary))] hover:after:w-full after:transition-all after:duration-300 pb-1">Games</Link>
          <Link href="/top-up" className="hover:text-[hsl(var(--foreground))] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--primary))] hover:after:w-full after:transition-all after:duration-300 pb-1">Top Up</Link>
          <Link href="/membership" className="hover:text-[hsl(var(--foreground))] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--primary))] hover:after:w-full after:transition-all after:duration-300 pb-1">Membership</Link>
          <Link href="/vouchers" className="hover:text-[hsl(var(--foreground))] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--primary))] hover:after:w-full after:transition-all after:duration-300 pb-1">Vouchers</Link>
          <Link href="/deals" className="hover:text-[hsl(var(--foreground))] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--primary))] hover:after:w-full after:transition-all after:duration-300 pb-1">Deals</Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 md:gap-4 text-[hsl(var(--muted-foreground))]">
          <button className="p-2 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] rounded-full transition-colors cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[hsl(var(--primary))] rounded-full border-2 border-[hsl(var(--background))]"></span>
          </button>
          <button className="p-2 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] rounded-full transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] rounded-full transition-colors md:hidden">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[600px] overflow-hidden">
        
        {/* Glow behind the hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(165,180,252,0.15)_0%,transparent_70%)] rounded-full pointer-events-none -z-10"></div>

        {/* Hero Illustration */}
        <div className="relative mb-12 md:mb-16 flex flex-col items-center justify-center w-full max-w-lg">
          
          {/* Large Background 404 Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full"
          >
            <h1 className="text-[140px] md:text-[220px] font-heading font-black text-[hsl(var(--primary))] tracking-tighter leading-none opacity-5 select-none">
              404
            </h1>
          </motion.div>

          {/* Sky Circle */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-64 h-64 md:w-80 md:h-80 bg-slate-900 rounded-full -z-10 border border-slate-800 shadow-inner overflow-hidden"
          >
            {/* Inner cloud */}
            <div className="absolute bottom-4 -left-4 w-32 h-10 bg-slate-800/50 rounded-full blur-[4px]"></div>
            <div className="absolute top-12 -right-8 w-40 h-12 bg-[hsl(var(--primary))]/10 rounded-full blur-[4px]"></div>
          </motion.div>
          
          {/* Animated Modern Console */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center items-center z-10"
          >
            <motion.div 
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-56 h-40 md:w-64 md:h-48 glass-card rounded-[24px] flex flex-col items-center p-4 z-10"
            >
              {/* Screen Area */}
              <div className="w-full flex-1 bg-slate-950 border border-slate-800/50 rounded-xl mb-4 flex flex-col items-center justify-center p-1 shadow-inner relative overflow-hidden group">
                <div className="w-full h-full bg-slate-900 rounded-lg border border-[hsl(var(--primary))]/20 shadow-[inset_0_0_20px_rgba(165,180,252,0.1)] relative overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Screen Glare */}
                  <div className="absolute -top-10 -right-10 w-24 h-40 bg-white/5 rotate-[35deg] pointer-events-none group-hover:translate-x-4 group-hover:-translate-y-2 transition-transform duration-700"></div>
                  
                  {/* Sad Face */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="flex gap-4">
                      <div className="w-2.5 h-3.5 bg-[hsl(var(--primary))] rounded-full animate-pulse"></div>
                      <div className="w-2.5 h-3.5 bg-[hsl(var(--primary))] rounded-full animate-pulse"></div>
                    </div>
                    {/* Sad Mouth */}
                    <div className="w-6 h-3 border-t-[3.5px] border-[hsl(var(--primary))] rounded-t-full mt-1"></div>
                  </div>
                </div>
              </div>

              {/* Controls Area */}
              <div className="w-full flex justify-between px-3 md:px-4 items-center">
                {/* D-Pad */}
                <div className="relative w-8 h-8 md:w-9 md:h-9">
                  <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 bg-slate-700 rounded-sm"></div>
                  <div className="absolute top-0 left-1/2 w-3 h-full -translate-x-1/2 bg-slate-700 rounded-sm"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-slate-600 rounded-sm"></div>
                </div>

                {/* A/B Buttons */}
                <div className="flex gap-2.5 items-end rotate-12">
                  <div className="w-4 h-4 md:w-4.5 md:h-4.5 bg-[hsl(var(--primary))] rounded-full shadow-[0_0_10px_rgba(165,180,252,0.5)] active:scale-90 transition-all cursor-pointer"></div>
                  <div className="w-4 h-4 md:w-4.5 md:h-4.5 bg-[hsl(var(--accent))] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] active:scale-90 transition-all cursor-pointer mb-2"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Floating Stars & Planets Decoration */}
          <motion.div 
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            className="absolute top-4 left-4 md:top-10 md:-left-4 text-2xl text-[hsl(var(--primary))]"
          >
            ✦
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            className="absolute bottom-10 right-8 md:bottom-16 md:-right-8 text-xl text-[hsl(var(--primary))]"
          >
            ✦
          </motion.div>

          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-4 left-8 md:-bottom-2 md:-left-12 z-20"
          >
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center relative">
              <div className="w-14 h-1.5 rounded-full bg-slate-800/80 absolute -rotate-12"></div>
            </div>
          </motion.div>
        </div>

        {/* Text & CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto relative z-20"
        >
          <h2 className="font-heading text-3xl md:text-[34px] font-bold mb-4 text-[hsl(var(--foreground))]">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] text-[15px] md:text-base mb-8 leading-relaxed font-medium">
            Sepertinya kamu nyasar ke dunia yang salah. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="group flex items-center justify-center gap-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-7 py-3.5 rounded-2xl font-medium hover:bg-[hsl(var(--primary))]/90 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(165,180,252,0.2)] transition-all duration-300 w-full sm:w-auto min-w-[170px]">
              <Home className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
              <span>Ke Beranda</span>
            </Link>
            
            <Link href="/games" className="group flex items-center justify-center gap-2.5 glass-panel text-[hsl(var(--foreground))] px-7 py-3.5 rounded-2xl font-medium hover:bg-slate-800/80 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[170px]">
              <Search className="w-[18px] h-[18px] text-[hsl(var(--primary))] group-hover:scale-110 transition-transform" />
              <span>Cari Game</span>
            </Link>
          </div>
        </motion.div>
      </main>
      
      {/* Decorative corners */}
      <div className="fixed top-24 left-6 w-10 h-10 border-t border-l border-[hsl(var(--border))] z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed top-24 right-6 w-10 h-10 border-t border-r border-[hsl(var(--border))] z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed bottom-6 left-6 w-10 h-10 border-b border-l border-[hsl(var(--border))] z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed bottom-6 right-6 w-10 h-10 border-b border-r border-[hsl(var(--border))] z-0 pointer-events-none hidden lg:block"></div>
    </div>
  );
}
