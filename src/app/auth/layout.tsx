"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/components/providers/settings-provider";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();
  
  const leftChar = settings["auth_character_left"] 
    ? (settings["auth_character_left"].startsWith("http") ? settings["auth_character_left"] : cloudinaryUrl(settings["auth_character_left"]))
    : "/characters/knight.png";
    
  const rightChar = settings["auth_character_right"]
    ? (settings["auth_character_right"].startsWith("http") ? settings["auth_character_right"] : cloudinaryUrl(settings["auth_character_right"]))
    : "/characters/mascot.png";

  // Dimension settings (with defaults)
  const leftWidth = settings["auth_character_left_width"] || "120";
  const leftHeight = settings["auth_character_left_height"] || "80";
  const rightWidth = settings["auth_character_right_width"] || "110";
  const rightHeight = settings["auth_character_right_height"] || "80";

  return (
    <div className="h-full flex-1 flex flex-col bg-[hsl(var(--background))] texture-overlay relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-gold)]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full bg-[hsl(var(--primary))]/5 blur-[150px]" />
        
        {/* Soft circular lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-[var(--color-gold)]/10 animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[hsl(var(--primary))]/10 animate-spin-slow-reverse" />
        
        {/* Minimal halftone dots/grain texture (achieved via CSS in globals) */}
        <div className="absolute inset-0 texture-overlay opacity-30" />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-8 lg:py-0 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center lg:justify-between px-4 sm:px-6 lg:px-12 relative">
          
          {/* Left Decorative Illustration (Desktop Only) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center w-[400px] relative h-[80vh] max-h-[600px]"
          >
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[var(--color-gold)]/20 blur-2xl" />
            <img 
              src={leftChar} 
              alt="Fantasy Knight" 
              className="h-auto object-contain absolute bottom-0 left-0 animate-float"
              style={{ 
                width: `${leftWidth}%`,
                maxHeight: `${leftHeight}vh`,
                filter: "drop-shadow(0 20px 40px rgba(7, 59, 76, 0.15))" 
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Floating particles */}
            <div className="absolute top-1/4 right-10 w-3 h-3 rounded-full bg-[var(--color-gold)] animate-twinkle" />
            <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-twinkle" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-[var(--color-gold)]/50 animate-twinkle" style={{ animationDelay: "2s" }} />
          </motion.div>

          {/* Center Auth Content */}
          <div className="w-full max-w-md relative z-20 flex justify-center">
            {children}
          </div>

          {/* Right Decorative Illustration (Desktop Only) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center w-[400px] relative h-[80vh] max-h-[600px]"
          >
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[hsl(var(--primary))]/10 blur-3xl" />
            <img 
              src={rightChar} 
              alt="Anime Mascot" 
              className="h-auto object-contain absolute bottom-0 right-0 animate-float"
              style={{ 
                width: `${rightWidth}%`,
                maxHeight: `${rightHeight}vh`,
                animationDelay: "1.5s", 
                filter: "drop-shadow(0 20px 40px rgba(7, 59, 76, 0.15))" 
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Floating particles */}
            <div className="absolute top-1/3 left-10 w-3 h-3 rounded-full bg-[hsl(var(--primary))] animate-twinkle" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-2/3 right-10 w-2 h-2 rounded-full bg-[var(--color-gold)] animate-twinkle" style={{ animationDelay: "1.5s" }} />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
