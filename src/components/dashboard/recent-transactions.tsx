"use client";

import Link from "next/link";
import { Gamepad2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  game: string;
  product: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED" | "PROCESSING";
  date: string;
}

const statusConfig = {
  SUCCESS: { label: "Berhasil", className: "bg-emerald-500/10 text-emerald-600" },
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  PROCESSING: { label: "Diproses", className: "bg-blue-500/10 text-blue-600" },
  FAILED: { label: "Gagal", className: "bg-red-500/10 text-red-600" },
};

export function RecentTransactions({
  transactions,
  isLoading,
}: {
  transactions?: Transaction[];
  isLoading?: boolean;
}) {
  const items = transactions?.slice(0, 3) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Transaksi Terakhir</h2>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Lihat Semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-[hsl(var(--muted))] animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-2">
          {items.map((trx) => {
            const st = statusConfig[trx.status] ?? statusConfig.PENDING;
            return (
              <div
                key={trx.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60"
              >
                <div className="h-9 w-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-4 w-4 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{trx.game}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{trx.product} · {trx.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {formatCurrency(trx.amount)}
                  </span>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", st.className)}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
            <Gamepad2 className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
          </div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">Belum ada transaksi</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 mb-4">
            Yuk mulai top up game favoritmu!
          </p>
          <Link
            href="/games"
            className="text-xs font-semibold text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 rounded-xl px-4 py-2 hover:bg-[hsl(var(--primary))]/5 transition-colors"
          >
            Lihat Game
          </Link>
        </div>
      )}
    </div>
  );
}
