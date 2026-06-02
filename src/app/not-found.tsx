"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ShoppingCart, User, Gamepad2, Menu } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F7EEDB] text-[#063B4C] overflow-y-auto overflow-x-hidden font-sans selection:bg-[#5C9CB6]/30">
      {/* Vintage Texture Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.25] z-0 mix-blend-multiply" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      ></div>

      {/* Dotted Vintage Decoration */}
      <div className="fixed left-4 top-0 bottom-0 w-8 border-r border-[#063B4C]/10 opacity-30 pointer-events-none hidden md:block">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-dashed border-[#063B4C]/30"></div>
      </div>
      <div className="fixed right-4 top-0 bottom-0 w-8 border-l border-[#063B4C]/10 opacity-30 pointer-events-none hidden md:block">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-dashed border-[#063B4C]/30"></div>
      </div>

      {/* Navbar Overlay */}
      <nav className="relative z-50 w-full border-b border-[#063B4C]/10 bg-[#F7EEDB]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-[#063B4C] group-hover:-rotate-12 transition-transform duration-300" />
          <span className="font-heading font-bold text-xl tracking-tight text-[#063B4C]">MiqStore</span>
        </Link>
        
        {/* Center: Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#063B4C]/80">
          <Link href="/games" className="hover:text-[#063B4C] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D98A5F] hover:after:w-full after:transition-all after:duration-300">Games</Link>
          <Link href="/top-up" className="hover:text-[#063B4C] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D98A5F] hover:after:w-full after:transition-all after:duration-300">Top Up</Link>
          <Link href="/membership" className="hover:text-[#063B4C] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D98A5F] hover:after:w-full after:transition-all after:duration-300">Membership</Link>
          <Link href="/vouchers" className="hover:text-[#063B4C] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D98A5F] hover:after:w-full after:transition-all after:duration-300">Vouchers</Link>
          <Link href="/deals" className="hover:text-[#063B4C] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D98A5F] hover:after:w-full after:transition-all after:duration-300">Deals</Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 md:gap-4 text-[#063B4C]">
          <button className="p-2 hover:bg-[#063B4C]/5 rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 hover:bg-[#063B4C]/5 rounded-full transition-colors cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D98A5F] rounded-full border-2 border-[#F7EEDB]"></span>
          </button>
          <button className="p-2 hover:bg-[#063B4C]/5 rounded-full transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#063B4C]/5 rounded-full transition-colors md:hidden">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[600px] overflow-hidden">
        
        {/* Warm Radial Gradient Behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,138,95,0.1)_0%,transparent_70%)] rounded-full pointer-events-none -z-10"></div>

        {/* Hero Illustration */}
        <div className="relative mb-12 md:mb-16 flex flex-col items-center justify-center w-full max-w-lg">
          
          {/* Large Background 404 Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full"
          >
            <h1 className="text-[140px] md:text-[220px] font-heading font-black text-[#063B4C] tracking-tighter leading-none opacity-5 select-none">
              404
            </h1>
          </motion.div>

          {/* Sky Circle */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-64 h-64 md:w-80 md:h-80 bg-[#5C9CB6] rounded-full -z-10 border-4 border-[#063B4C]/10 shadow-inner overflow-hidden"
          >
            {/* Inner cloud */}
            <div className="absolute bottom-4 -left-4 w-32 h-10 bg-white/20 rounded-full blur-[2px]"></div>
            <div className="absolute top-12 -right-8 w-40 h-12 bg-white/20 rounded-full blur-[2px]"></div>
          </motion.div>
          
          {/* Animated Retro Console */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center items-center z-10"
          >
            <motion.div 
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-56 h-40 md:w-64 md:h-48 bg-[#EFE1C7] border-4 border-[#063B4C] rounded-[24px] shadow-[8px_8px_0px_#063B4C] flex flex-col items-center p-4 z-10"
            >
              {/* Screen Area */}
              <div className="w-full flex-1 bg-[#F7EEDB] border-[3px] border-[#063B4C] rounded-xl mb-4 flex flex-col items-center justify-center p-1 shadow-inner relative overflow-hidden group">
                <div className="w-full h-full bg-[#5C9CB6] rounded-lg border-2 border-[#063B4C]/20 shadow-inner relative overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Screen Glare */}
                  <div className="absolute -top-10 -right-10 w-24 h-40 bg-white/20 rotate-[35deg] pointer-events-none group-hover:translate-x-4 group-hover:-translate-y-2 transition-transform duration-700"></div>
                  
                  {/* Sad Pixel Face */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="flex gap-4">
                      <div className="w-2.5 h-3.5 bg-[#063B4C] rounded-full"></div>
                      <div className="w-2.5 h-3.5 bg-[#063B4C] rounded-full"></div>
                    </div>
                    {/* Sad Mouth */}
                    <div className="w-6 h-3 border-t-[3.5px] border-[#063B4C] rounded-t-full mt-1"></div>
                  </div>
                </div>
              </div>

              {/* Controls Area */}
              <div className="w-full flex justify-between px-3 md:px-4 items-center">
                {/* D-Pad */}
                <div className="relative w-8 h-8 md:w-9 md:h-9">
                  <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 bg-[#063B4C] rounded-sm"></div>
                  <div className="absolute top-0 left-1/2 w-3 h-full -translate-x-1/2 bg-[#063B4C] rounded-sm"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-[#063B4C] rounded-sm shadow-[inset_1px_1px_0px_rgba(255,255,255,0.2)]"></div>
                </div>

                {/* A/B Buttons */}
                <div className="flex gap-2.5 items-end rotate-12">
                  <div className="w-4 h-4 md:w-4.5 md:h-4.5 bg-[#D98A5F] rounded-full border-2 border-[#063B4C] shadow-[1.5px_1.5px_0px_#063B4C] active:translate-y-[1.5px] active:translate-x-[1.5px] active:shadow-none transition-all cursor-pointer"></div>
                  <div className="w-4 h-4 md:w-4.5 md:h-4.5 bg-[#D98A5F] rounded-full border-2 border-[#063B4C] shadow-[1.5px_1.5px_0px_#063B4C] active:translate-y-[1.5px] active:translate-x-[1.5px] active:shadow-none transition-all cursor-pointer mb-2"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Floating Stars & Planets Decoration */}
          <motion.div 
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            className="absolute top-4 left-4 md:top-10 md:-left-4 text-2xl text-[#D98A5F]"
          >
            ✦
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            className="absolute bottom-10 right-8 md:bottom-16 md:-right-8 text-xl text-[#063B4C]"
          >
            ✦
          </motion.div>

          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-4 left-8 md:-bottom-2 md:-left-12 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFE1C7] border-2 border-[#063B4C] flex items-center justify-center shadow-[inset_-3px_-3px_0px_rgba(6,59,76,0.15)] relative">
              <div className="w-14 h-1.5 rounded-full border border-[#063B4C] absolute -rotate-12 bg-[#F7EEDB]"></div>
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
          <h2 className="font-heading text-3xl md:text-[34px] font-bold mb-4 text-[#063B4C]">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-[#063B4C]/80 text-[15px] md:text-base mb-8 leading-relaxed font-medium">
            Sepertinya kamu nyasar ke dunia yang salah. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Link href="/" className="group flex items-center justify-center gap-2.5 bg-[#063B4C] text-[#F7EEDB] px-7 py-3.5 rounded-[16px] font-semibold shadow-[0_8px_20px_rgb(6,59,76,0.15)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgb(6,59,76,0.25)] transition-all duration-300 w-full sm:w-auto min-w-[170px]">
              <Home className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
              <span>Ke Beranda</span>
            </Link>
            
            <Link href="/games" className="group flex items-center justify-center gap-2.5 bg-[#F7EEDB] border-[2.5px] border-[#063B4C]/15 text-[#063B4C] px-7 py-3.5 rounded-[16px] font-semibold hover:border-[#063B4C]/30 hover:-translate-y-1 hover:bg-[#EFE1C7]/50 shadow-sm transition-all duration-300 w-full sm:w-auto min-w-[170px]">
              <Search className="w-[18px] h-[18px] text-[#D98A5F] group-hover:scale-110 transition-transform" />
              <span>Cari Game</span>
            </Link>
          </div>
        </motion.div>
      </main>
      
      {/* Vintage decorative corners */}
      <div className="fixed top-24 left-6 w-10 h-10 border-t-2 border-l-2 border-[#063B4C]/20 z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed top-24 right-6 w-10 h-10 border-t-2 border-r-2 border-[#063B4C]/20 z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#063B4C]/20 z-0 pointer-events-none hidden lg:block"></div>
      <div className="fixed bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#063B4C]/20 z-0 pointer-events-none hidden lg:block"></div>
    </div>
  );
}
