"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Clock, Crown, Sparkles, ChevronRight, Gamepad2, FolderOpen, Wallet } from "lucide-react";

const statusMap: Record<string, { label: string, variant: "success" | "warning" | "destructive", icon: any }> = {
  SUCCESS: { label: "Sukses", variant: "success", icon: CheckCircle2 },
  PROCESSING: { label: "Proses", variant: "warning", icon: Clock },
  PENDING: { label: "Pending", variant: "warning", icon: Clock },
  FAILED: { label: "Gagal", variant: "destructive", icon: Clock },
};

interface DashboardTablesProps {
  recentTransactions: any[];
  walletHistory: any[];
}

export function DashboardTables({ recentTransactions, walletHistory }: DashboardTablesProps) {
  return (
    <>
      {/* Membership Upgrade Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-lg border border-purple-500/20"
          style={{
            background: `linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)`,
          }}
        >
          <div className="absolute right-0 inset-y-0 w-1/2 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
          {/* Fake crystal */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-80 hidden md:block">
            <div className="w-24 h-24 rotate-45 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-lg blur-xl absolute opacity-40" />
            <Crown className="w-24 h-24 text-cyan-300 drop-shadow-2xl relative z-10 fill-cyan-400/20" strokeWidth={1.5} />
          </div>
          
          <div className="relative z-10">
            <Badge className="mb-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 gap-1.5 px-3 py-1 font-bold rounded-full">
              <Crown className="h-3.5 w-3.5 fill-yellow-500/20" /> Gold Member
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
              Upgrade ke <span className="text-cyan-400">Diamond</span> untuk diskon 15%!
            </h3>
            <p className="text-sm font-medium text-white/70 mb-6">
              Butuh 1.750 poin lagi untuk naik level
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1 max-w-sm">
                <div className="h-2.5 w-full rounded-full bg-black/40 overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-white/50 mt-2">
                  <span>3.250 / 5.000 poin</span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white px-6 font-semibold">
                <Sparkles className="h-4 w-4 mr-2 text-cyan-400" /> Lihat Detail
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaksi Terakhir */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 h-[340px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base">Transaksi Terakhir</h3>
              <Link href="/dashboard/transactions" className="text-xs font-semibold text-[var(--liquid-purple)] flex items-center hover:underline">
                Lihat Semua <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-2">
                {recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors border border-transparent hover:border-[hsl(var(--border))] group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <Gamepad2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tx.game}</p>
                        <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-0.5">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(tx.price)}</p>
                      <Badge variant={statusMap[tx.status]?.variant || "warning"} className="text-[9px] px-1.5 py-0 mt-1">
                        {statusMap[tx.status]?.label || tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-150" />
                  <FolderOpen className="h-16 w-16 text-purple-400 relative z-10 fill-purple-400/20" strokeWidth={1} />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-purple-500 rounded-full border-[3px] border-[hsl(var(--card))] flex items-center justify-center text-white font-black text-sm shadow-sm z-20">?</div>
                </div>
                <p className="font-bold text-sm text-[hsl(var(--foreground))]">Belum ada transaksi</p>
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1.5 mb-5 max-w-[200px]">Yuk, top up game favoritmu sekarang!</p>
                <Button size="sm" className="bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] hover:opacity-90 text-white rounded-xl px-6 shadow-md shadow-purple-500/20 font-semibold text-xs">Top Up Sekarang</Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Riwayat Saldo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 h-[340px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base">Riwayat Saldo</h3>
              <Link href="/dashboard/wallet" className="text-xs font-semibold text-[var(--liquid-purple)] flex items-center hover:underline">
                Lihat Semua <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            
            {walletHistory.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-2">
                {walletHistory.map((wh: any) => (
                  <div key={wh.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors border border-transparent hover:border-[hsl(var(--border))] group">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${wh.amount > 0 ? 'bg-green-500/10 group-hover:bg-green-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}>
                        <Wallet className={`h-5 w-5 ${wh.amount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{wh.type === 'deposit' ? 'Topup Saldo' : wh.type === 'cashback' ? 'Cashback' : 'Pembayaran'}</p>
                        <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-0.5">{wh.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${wh.amount > 0 ? 'text-green-500' : 'text-foreground'}`}>
                        {wh.amount > 0 ? '+' : ''}{formatCurrency(wh.amount)}
                      </p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 font-semibold">Berhasil</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150" />
                  <Wallet className="h-16 w-16 text-blue-400 relative z-10 fill-blue-400/20" strokeWidth={1} />
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-[hsl(var(--card))] rounded-full flex items-center justify-center z-20 border-[3px] border-[hsl(var(--card))]">
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <p className="font-bold text-sm text-[hsl(var(--foreground))]">Belum ada riwayat saldo</p>
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1.5 mb-5 max-w-[220px]">Lakukan top up untuk melihat riwayat saldo.</p>
                <Button size="sm" className="bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)] hover:opacity-90 text-white rounded-xl px-6 shadow-md shadow-blue-500/20 font-semibold text-xs">Deposit Sekarang</Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
