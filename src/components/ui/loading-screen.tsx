"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
  isOverlay?: boolean;
}

export function LoadingScreen({ message = "Menyiapkan inventory game...", isOverlay = false }: LoadingScreenProps) {
  const containerClasses = isOverlay
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-cream)] dark:bg-[#1a1c23] texture-overlay"
    : "min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[var(--color-cream)] dark:bg-[#1a1c23] texture-overlay";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={containerClasses}
    >
      {/* Background gradients for soft vignette & tactile depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.04)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-navy)]/5 via-transparent to-[var(--color-teal)]/5 dark:from-[#0B1D34]/40 dark:to-[#073B4C]/20 opacity-50 pointer-events-none" />
      
      {/* Floating particles (very subtle) */}
      <motion.div 
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--color-gold)]/10 dark:bg-[var(--color-gold)]/5 rounded-full blur-[40px] pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-[var(--color-teal)]/10 dark:bg-[var(--color-teal)]/10 rounded-full blur-[50px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">
        {/* Logo Section */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-10 relative"
        >
          {/* Subtle logo glow */}
          <div className="absolute inset-0 bg-[var(--color-teal)]/10 dark:bg-[var(--color-teal)]/30 blur-2xl rounded-full scale-[1.8] -z-10" />
          <img 
            src="/icons/logo.png" 
            alt="MiqStore Logo" 
            className="w-20 h-auto sm:w-24 drop-shadow-[0_4px_16px_rgba(7,59,76,0.15)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]" 
          />
        </motion.div>

        {/* Loading Indicator: Retro Pixel Blocks */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.2 }}
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[1px] bg-[var(--color-navy)] dark:bg-[var(--color-cream)] shadow-sm"
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[var(--color-navy)] dark:text-[var(--color-cream)] mb-2 tracking-wider">
            Loading MiqStore
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-navy)]/60 dark:text-[var(--color-cream)]/50 font-medium">
            {message}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
