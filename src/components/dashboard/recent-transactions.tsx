"use client";

import { Receipt, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Transaction {
  id: string;
  game: string;
  product: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  date: string;
}

export function RecentTransactions({ transactions }: { transactions?: Transaction[] }) {
  const displayTransactions = transactions || [];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-lg shadow-black/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-[hsl(var(--foreground))] flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[hsl(var(--primary))]" />
          Transaksi Terakhir
        </h3>
        <Button variant="ghost" className="text-sm font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--border))]/30 hover:text-[hsl(var(--foreground))] rounded-xl h-9">
          Lihat Semua
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {displayTransactions.length > 0 ? (
          displayTransactions.map((trx) => (
            <div key={trx.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-[hsl(var(--border))]/60 hover:border-[hsl(var(--border))] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--foreground))]/10 flex items-center justify-center font-bold text-[hsl(var(--foreground))] shadow-sm group-hover:scale-105 transition-transform">
                  {trx.game.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-[hsl(var(--foreground))] text-sm">{trx.game}</h4>
                  <p className="text-[11px] font-medium text-[hsl(var(--foreground))]/50 mt-0.5">{trx.product} &bull; {trx.date}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-sm text-[hsl(var(--foreground))]">
                  -Rp {trx.amount.toLocaleString("id-ID")}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  trx.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" :
                  trx.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {trx.status === "SUCCESS" ? "BERHASIL" : trx.status === "PENDING" ? "PENDING" : "GAGAL"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full flex-1">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h4 className="font-bold text-[hsl(var(--foreground))] text-base mb-1">Belum ada transaksi</h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 max-w-[250px]">Yuk, mulai transaksi pertamamu dan nikmati berbagai promo menarik!</p>
            <Button asChild className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20">
              <Link href="/">Mulai Top Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
