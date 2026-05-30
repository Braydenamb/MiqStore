import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-indigo)] text-white shadow-lg shadow-purple-500/15 hover:shadow-purple-500/25 hover:brightness-110 focus-visible:ring-purple-400",
        secondary:
          "bg-gradient-to-r from-[var(--liquid-blue)] to-[var(--liquid-cyan)] text-gray-900 shadow-lg shadow-blue-400/15 hover:shadow-blue-400/25 hover:brightness-110 focus-visible:ring-blue-400",
        accent:
          "bg-gradient-to-r from-[var(--liquid-pink)] to-[var(--liquid-purple)] text-white shadow-lg shadow-pink-400/15 hover:shadow-pink-400/25 hover:brightness-110 focus-visible:ring-pink-400",
        destructive:
          "bg-red-600/90 text-white shadow-lg shadow-red-500/15 hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))] hover:border-[rgba(255,255,255,0.1)] hover:text-[hsl(var(--foreground))] focus-visible:ring-[hsl(var(--ring))]",
        ghost:
          "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
        link:
          "text-[var(--liquid-purple)] underline-offset-4 hover:underline hover:brightness-125",
        glass:
          "glass hover:bg-white/8 text-[hsl(var(--foreground))] focus-visible:ring-[hsl(var(--ring))]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
