import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md relative z-10"
    >
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/20 transition-transform group-hover:scale-105">
            <Gamepad2 className="h-6 w-6 text-[var(--color-gold)]" />
          </div>
          <span className="font-heading text-3xl font-bold tracking-tight text-[hsl(var(--primary))]">
            {APP_NAME}
          </span>
        </Link>
      </div>

      <div className="rounded-[28px] p-8 sm:p-10 bg-white/70 backdrop-blur-xl border border-white/40 premium-shadow">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
            {title}
          </h1>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]/60">
            {subtitle}
          </p>
        </div>

        {children}

        <p className="mt-8 text-center text-sm font-medium text-[hsl(var(--foreground))]/60">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-bold text-[hsl(var(--primary))] hover:text-[var(--color-gold)] transition-colors"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
