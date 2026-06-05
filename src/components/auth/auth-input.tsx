import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-[hsl(var(--foreground))] ml-1">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))]/40 group-focus-within:text-[hsl(var(--primary))] transition-colors">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-xl border border-white/50 bg-white/50 px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground))]/30 outline-none transition-all duration-300",
              "focus:bg-white focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))]/10",
              "hover:border-white hover:bg-white/70",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10 bg-red-50/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))]/40 hover:text-[hsl(var(--primary))] transition-colors"
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[11px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
