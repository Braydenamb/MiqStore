"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, UserCheck } from "lucide-react";
import { GameField } from "@/lib/types";
import { StepBadge } from "./step-badge";

interface UserIdFormProps {
  gameSlug?: string;
  fields: GameField[];
  fieldValues: Record<string, string>;
  isHydrated: boolean;
  onFieldChange: (key: string, value: string) => void;
}

export function UserIdForm({ gameSlug, fields, fieldValues, isHydrated, onFieldChange }: UserIdFormProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  const userId = fieldValues[fields[0]?.key || ""] || "";
  const zoneId = fieldValues[fields[1]?.key || ""] || "";

  useEffect(() => {
    if (!gameSlug || !userId || userId.trim().length < 3) {
      setVerifiedName(null);
      return;
    }

    if (fields.length > 1 && !zoneId) {
      setVerifiedName(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidating(true);
      try {
        const res = await fetch("/api/game/validate-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameSlug, userId, zoneId }),
        });
        const data = await res.json();
        if (data.success && data.data?.verified) {
          setVerifiedName(data.data.nickname);
        } else {
          setVerifiedName(null);
        }
      } catch {
        setVerifiedName(null);
      } finally {
        setIsValidating(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [gameSlug, userId, zoneId, fields.length]);

  if (fields.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-7 shadow-2xl">
      <StepBadge num={1} title="Masukkan Detail Akun" isCompleted={fields.length > 0 && fields.every(f => !!fieldValues[f.key]?.trim())} />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-xs font-bold text-[hsl(var(--foreground))]/70 uppercase tracking-wider">
              {field.label}
            </Label>
            <Input
              id={field.key}
              type="text"
              inputMode="numeric"
              placeholder={field.placeholder}
              value={fieldValues[field.key] || ""}
              onChange={(e) => onFieldChange(field.key, e.target.value)}
              className="h-12 bg-black/20 border-white/10 text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground))]/40 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] rounded-xl transition-all font-mono shadow-inner"
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {isValidating && (
          <span className="text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 font-medium animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[hsl(var(--primary))]" />
            Memverifikasi ID Akun...
          </span>
        )}

        {!isValidating && verifiedName && (
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            {verifiedName}
          </span>
        )}

        {!isValidating && isHydrated && Object.values(fieldValues).some(v => v) && (
          <span className="text-[hsl(var(--muted-foreground))]/70 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-[hsl(var(--primary))]" /> Data tersimpan otomatis
          </span>
        )}
      </div>
    </motion.div>
  );
}

