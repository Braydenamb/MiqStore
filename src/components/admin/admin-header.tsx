"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export function AdminHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden mb-8"
    >
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[100px] bg-[var(--liquid-purple)]/20 pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <Badge variant="glow" className="text-[10px] gap-1">
              <Zap className="h-3 w-3" /> Live
            </Badge>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
