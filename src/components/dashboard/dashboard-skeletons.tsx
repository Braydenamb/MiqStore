import { Skeleton } from "@/components/ui/skeleton";

// ─── Stats Grid Skeleton ────────────────────────────────────────────────────
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-3xl p-5 border border-[hsl(var(--border))]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-[30px] w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Recent Transactions Skeleton ───────────────────────────────────────────
export function RecentTransactionsSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-[hsl(var(--border))]">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-40 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <div className="text-right space-y-1.5">
              <Skeleton className="h-4 w-20 rounded-full ml-auto" />
              <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Favorite Games Skeleton ─────────────────────────────────────────────────
export function FavoriteGamesSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-[hsl(var(--border))]">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-3/4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Top Up Skeleton ───────────────────────────────────────────────────
export function QuickTopUpSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-36 rounded-full" />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <Skeleton className="aspect-square w-full sm:h-[84px] sm:w-[84px] rounded-[20px]" />
            <Skeleton className="h-3 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
