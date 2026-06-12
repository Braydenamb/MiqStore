"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/components/providers/settings-provider";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface LoadingScreenProps {
  message?: string;
  isOverlay?: boolean;
}

export function LoadingScreen({ message = "Menyiapkan inventory game...", isOverlay = false }: LoadingScreenProps) {
  const containerClasses = isOverlay
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[hsl(var(--background))] texture-overlay overflow-hidden"
    : "min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[hsl(var(--background))] texture-overlay overflow-hidden";

  let logoUrl = "/icons/logo.png";
  try {
    const { settings } = useSettings();
    const siteLogo = settings["site_logo"];
    if (siteLogo) {
      logoUrl = siteLogo.startsWith("http") ? siteLogo : cloudinaryUrl(siteLogo);
    }
  } catch {
    // If not wrapped in SettingsProvider, fallback to default
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={containerClasses}
    >
      {/* ── Background Layer ── */}
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      {/* Subtle diagonal gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1D34]/40 via-transparent to-[hsl(var(--primary))]/5 opacity-60 pointer-events-none" />

      {/* ── Ambient Glow Orbs ── */}
      <motion.div
        animate={{ y: [0, -14, 0], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[20%] w-40 h-40 bg-[var(--color-gold)]/8 rounded-full blur-[60px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 12, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[25%] right-[20%] w-48 h-48 bg-[hsl(var(--primary))]/10 rounded-full blur-[70px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[40%] right-[35%] w-32 h-32 bg-[hsl(var(--primary))]/8 rounded-full blur-[50px] pointer-events-none"
      />

      {/* ── Central Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">

        {/* Logo with Orbital Rings */}
        <div className="relative mb-10">
          {/* Outer orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-8 rounded-full border border-[hsl(var(--primary))]/15"
          />
          {/* Middle orbital ring (counter-rotate) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-14 rounded-full border border-[var(--color-gold)]/10"
          >
            {/* Orbiting dot */}
            <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/60 shadow-[0_0_6px_var(--color-gold)]" />
          </motion.div>
          {/* Inner orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-4 rounded-full border border-white/5"
          >
            <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[hsl(var(--primary))]/50" />
          </motion.div>

          {/* Logo with float animation */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Pulsing glow behind logo */}
            <motion.div
              animate={{ scale: [1.6, 2.0, 1.6], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[hsl(var(--primary))]/20 blur-3xl rounded-full -z-10"
            />
            <img
              src={logoUrl}
              alt="MiqStore Logo"
              className="w-20 h-auto sm:w-24 drop-shadow-[0_4px_20px_rgba(7,59,76,0.25)]"
            />
          </motion.div>
        </div>

        {/* Loading Indicator: Wave Bars */}
        <div className="flex items-end gap-[3px] h-6 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ["6px", "20px", "6px"] }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              className="w-[3px] rounded-full bg-gradient-to-t from-[hsl(var(--primary))]/40 to-[hsl(var(--primary))]"
            />
          ))}
        </div>

        {/* Shimmer Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wider mb-2 relative overflow-hidden">
            <span className="text-[hsl(var(--foreground))]">Loading </span>
            <span className="text-[hsl(var(--primary))]">MiqStore</span>
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
            />
          </h2>
          <p className="text-xs sm:text-sm text-[hsl(var(--foreground))]/50 font-medium">
            {message}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
