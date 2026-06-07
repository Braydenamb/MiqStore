import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { GameField } from "@/lib/constants";
import { StepBadge } from "./step-badge";

interface UserIdFormProps {
  fields: GameField[];
  fieldValues: Record<string, string>;
  isHydrated: boolean;
  onFieldChange: (key: string, value: string) => void;
}

export function UserIdForm({ fields, fieldValues, isHydrated, onFieldChange }: UserIdFormProps) {
  if (fields.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-7 shadow-2xl">
      <StepBadge num={1} title="Masukkan Detail Akun" />
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
      {isHydrated && Object.values(fieldValues).some(v => v) && (
        <p className="mt-3 text-xs text-[hsl(var(--primary))] flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Data tersimpan otomatis
        </p>
      )}
    </motion.div>
  );
}
