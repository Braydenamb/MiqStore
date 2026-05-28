import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-purple-600/20 text-purple-400 border-purple-500/30",
        secondary:
          "border-transparent bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
        success:
          "border-transparent bg-green-600/20 text-green-400 border-green-500/30",
        warning:
          "border-transparent bg-amber-600/20 text-amber-400 border-amber-500/30",
        destructive:
          "border-transparent bg-red-600/20 text-red-400 border-red-500/30",
        outline:
          "text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
        glow:
          "border-transparent bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border border-purple-500/20 shadow-sm shadow-purple-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
