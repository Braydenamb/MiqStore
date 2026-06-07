interface StepBadgeProps {
  num: number;
  title: string;
}

export function StepBadge({ num, title }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-sm font-bold">
        {num}
      </span>
      <h2 className="text-xl font-bold font-heading text-[hsl(var(--foreground))] tracking-wide">{title}</h2>
    </div>
  );
}
