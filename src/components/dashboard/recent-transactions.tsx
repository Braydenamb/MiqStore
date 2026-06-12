"use client";

import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Transaksi Terakhir</h2>
        <Link
          href="/dashboard/transactions"
          className="text-base font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Lihat Semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[hsl(var(--muted))] animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-2">
          {items.map((trx) => {
            const st = statusConfig[trx.status] ?? statusConfig.PENDING;
            return (
              <div
                key={trx.id}
                className="flex items-center gap-4 px-6 py-5 rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60"
              >
                <div className="h-14 w-14 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))] truncate">{trx.game}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">{trx.product} · {trx.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    {formatCurrency(trx.amount)}
                  </span>
                  <span className={cn("text-sm font-medium px-3 py-1 rounded-full", st.className)}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="h-20 w-20 rounded-3xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
            <Gamepad2 className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
          </div>
          <p className="text-lg font-medium text-[hsl(var(--foreground))]">Belum ada transaksi</p>
          <p className="text-base text-[hsl(var(--muted-foreground))] mt-1 mb-6">
            Yuk mulai top up game favoritmu!
          </p>
          <Link
            href="/games"
            className="text-base font-semibold text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 rounded-xl px-6 py-3 hover:bg-[hsl(var(--primary))]/5 transition-colors"
          >
            Lihat Game
          </Link>
        </div>
      )}
    </div>
  );
}
