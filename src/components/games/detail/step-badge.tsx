interface StepBadgeProps {
  num: number;
  title: string;
}

export function StepBadge({ num, title }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20 text-[var(--color-teal)] text-sm font-bold">
        {num}
      </span>
      <h2 className="text-xl font-bold font-heading text-[var(--color-navy)] tracking-wide">{title}</h2>
    </div>
  );
}
