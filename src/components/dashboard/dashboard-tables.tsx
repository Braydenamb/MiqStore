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
    <div className="flex flex-col gap-6 w-full">
      {/* Membership Upgrade Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-slate-900 shadow-xl border border-white/10"
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
      </motion.div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Transaksi Terakhir */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[hsl(var(--card))]/40 backdrop-blur-xl border border-[hsl(var(--border))] rounded-3xl p-6 h-[340px] flex flex-col shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Transaksi Terakhir</h3>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-[var(--liquid-blue)] hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-2">
              {recentTransactions.map((tx: any) => {
                const StatusIcon = statusMap[tx.status]?.icon;
                
                return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors border border-transparent hover:border-[hsl(var(--border))] group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <Gamepad2 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        {StatusIcon && <StatusIcon className={`h-3.5 w-3.5 text-${statusMap[tx.status].variant === 'success' ? 'green' : statusMap[tx.status].variant === 'warning' ? 'yellow' : 'red'}-500`} />}
                        Top Up {tx.game}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))]">{tx.date}</span>
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 rounded-sm font-bold flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" /> +500
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(tx.price)}</p>
                    <Badge variant={statusMap[tx.status]?.variant || "warning"} className="text-[9px] px-1.5 py-0 mt-1">
                      {statusMap[tx.status]?.label || tx.status}
                    </Badge>
                  </div>
                </div>
              );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 dark:bg-slate-900/60 rounded-2xl border border-[hsl(var(--border))] border-dashed backdrop-blur-md">
              <FolderOpen className="h-12 w-12 text-purple-400 mb-3 opacity-50" strokeWidth={1} />
              <p className="font-bold text-sm text-[hsl(var(--foreground))]">Belum ada transaksi</p>
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1.5 mb-5 max-w-[200px]">Yuk, top up game favoritmu sekarang!</p>
              <Button variant="secondary" size="sm" className="bg-[var(--liquid-blue)] hover:bg-[var(--liquid-blue)]/90 text-[hsl(var(--background))] font-semibold rounded-xl">
                Top Up Sekarang
              </Button>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
