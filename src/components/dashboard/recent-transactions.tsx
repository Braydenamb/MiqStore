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
        <Button variant="outline" className="text-sm font-bold border-white/10 hover:bg-white/5 rounded-xl h-9">
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
          <div className="flex flex-col h-full flex-1 justify-center py-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-4">
                <ShoppingBag className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="font-bold text-[hsl(var(--foreground))] text-base mb-1">Mulai Top Up Pertamamu</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">Dapatkan <span className="text-emerald-500 font-bold">Bonus Voucher 10%</span> untuk member baru!</p>
              <Button asChild size="sm" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 px-6">
                <Link href="/games">Klaim Promo & Top Up</Link>
              </Button>
            </div>
            
            <div className="pt-4 border-t border-[hsl(var(--border))]/50">
              <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3 flex items-center gap-1">
                🔥 Top Up Terlaris Hari Ini
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Mobile Legends", publisher: "Moonton", color: "bg-blue-500/20 text-blue-500" },
                  { name: "PUBG Mobile", publisher: "Tencent", color: "bg-orange-500/20 text-orange-500" },
                  { name: "Valorant", publisher: "Riot Games", color: "bg-red-500/20 text-red-500" },
                ].map((game) => (
                  <Link key={game.name} href={`/games`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/30 transition-colors group border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${game.color}`}>
                        {game.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">{game.name}</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{game.publisher}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
