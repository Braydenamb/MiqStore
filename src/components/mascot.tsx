"use client";

import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";

// Note: Replace '/mascot.riv' with your actual Rive file path in the public folder
// You can get free Rive assets from https://rive.app/community/

export function Mascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { rive, RiveComponent } = useRive({
    src: "/mascot.riv",
    stateMachines: "State Machine 1", // Replace with your state machine name
    autoplay: true,
  });

  // Example: how to trigger an input
  const onClickInput = useStateMachineInput(rive, "State Machine 1", "onClick");

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {/* Chat Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="glass-card p-4 rounded-2xl rounded-br-sm shadow-xl max-w-[250px] border border-[var(--liquid-purple)]/30 relative pointer-events-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] rounded-2xl blur opacity-20 -z-10" />
            <h4 className="font-bold text-sm text-[hsl(var(--foreground))] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--liquid-purple)]" />
              AI Assistant
            </h4>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed">
              Halo! Ada yang bisa kubantu? Coba fitur pencarian atau lihat promo terbaru.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rive Canvas / Toggle Button */}
      <div className="relative pointer-events-auto group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (onClickInput) onClickInput.fire();
          }}
          className="relative w-16 h-16 rounded-full glass flex items-center justify-center border border-white/10 overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgba(192,132,252,0.3)]"
        >
          {/* Fallback Icon if Rive fails to load */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <MessageCircle className="w-6 h-6 text-white/50" />
          </div>
          
          {/* Rive Component */}
          <div className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <RiveComponent />
          </div>
        </button>
      </div>
    </div>
  );
}
