import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepBadgeProps {
  num: number;
  title: string;
  isCompleted?: boolean;
}

export function StepBadge({ num, title, isCompleted }: StepBadgeProps) {
  return (
    <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
            isCompleted
              ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              : "bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]"
          )}
        >
          {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : num}
        </span>
        <h2 className="text-xl font-bold font-heading text-[hsl(var(--foreground))] tracking-wide">{title}</h2>
      </div>
      {isCompleted && (
        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Selesai
        </span>
      )}
    </div>
  );
}

