"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export function AdminHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <Badge variant="glow" className="text-[10px] gap-1">
          <Zap className="h-3 w-3" /> Live
        </Badge>
      </div>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
    </motion.div>
  );
}
