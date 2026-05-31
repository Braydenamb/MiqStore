"use client";

import { motion } from "framer-motion";
import {
  Receipt,
  TrendingUp,
  Wallet,
  Star,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { staggerContainer, staggerItem } from "@/lib/motion";

const statusMap: Record<string, { label: string, variant: "success" | "warning" | "destructive", icon: any }> = {
  SUCCESS: { label: "Sukses", variant: "success", icon: CheckCircle2 },
  PROCESSING: { label: "Proses", variant: "warning", icon: Clock },
  PENDING: { label: "Pending", variant: "warning", icon: Clock },
  FAILED: { label: "Gagal", variant: "destructive", icon: Clock },
};

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const stats = [
    { label: "Total Transaksi", value: isLoading ? "..." : (data?.stats?.totalTransactions || "0"), icon: Receipt, color: "var(--liquid-purple)" },
    { label: "Total Belanja", value: isLoading ? "..." : formatCurrency(data?.stats?.totalSpent || 0), icon: TrendingUp, color: "var(--liquid-blue)" },
    { label: "Poin Reward", value: isLoading ? "..." : (data?.stats?.rewardPoints || "0"), icon: Star, color: "var(--liquid-amber)" },
  ];

  const recentTransactions = data?.recentTransactions || [];
  const walletHistory = data?.walletHistory || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Selamat datang kembali, {session?.user?.name || "Miq"}! 👋
          </p>
        </div>
      </motion.div>

      {/* Hero Wallet Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(192,132,252,0.1) 50%, rgba(59,130,246,0.15) 100%)`,
            border: "1px solid rgba(34,211,238,0.2)",
            boxShadow: "0 20px 40px -15px rgba(34,211,238,0.1)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb h-64 w-64 -top-32 -right-32 bg-[var(--liquid-cyan)] opacity-20 blur-[80px]" />
            <div className="orb h-64 w-64 -bottom-32 -left-32 bg-[var(--liquid-purple)] opacity-20 blur-[80px]" />
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--liquid-cyan)]/20">
                  <Wallet className="h-4 w-4 text-[var(--liquid-cyan)]" />
                </div>
                <span className="text-sm font-medium text-[var(--liquid-cyan)]">Saldo MiqStore</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {isLoading ? "..." : formatCurrency(data?.stats?.walletBalance || 0)}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1 text-green-400 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" /> +Rp 680 (Cashback)
                </span>
                <span>Bulan ini</span>
              </div>
            </div>
            
            <div className="flex w-full md:w-auto flex-row gap-3">
              <Button size="lg" className="w-full md:w-auto bg-[var(--liquid-cyan)] text-black hover:bg-[var(--liquid-cyan)]/90 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                Deposit Saldo
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <Card className="card-hover relative overflow-hidden">
              <div
                className="absolute -top-6 -right-6 h-20 w-20 rounded-full blur-3xl opacity-10"
                style={{ background: stat.color }}
              />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 12%, transparent)` }}
                  >
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Membership Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(192,132,252,0.1) 50%, rgba(251,191,36,0.12) 100%)`,
            border: "1px solid rgba(251,191,36,0.15)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb h-40 w-40 -top-20 -right-20 bg-[var(--liquid-amber)] opacity-20 blur-3xl" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="glow" className="mb-2 gap-1">
                <Crown className="h-3 w-3 text-[var(--liquid-amber)]" /> Gold Member
              </Badge>
              <h3 className="text-lg font-bold">
                Upgrade ke <span className="gradient-text">Diamond</span> untuk diskon 15%!
              </h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                Butuh 1,750 poin lagi untuk naik level
              </p>
              {/* Progress bar */}
              <div className="mt-3 h-2 w-48 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "58%" }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-[var(--liquid-amber)] to-[var(--liquid-purple)]"
                />
              </div>
            </div>
            <Button variant="outline" className="shrink-0 gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Lihat Detail
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions & Wallet History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/transactions">Semua</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const st = statusMap[tx.status];
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3 transition-colors hover:bg-[hsl(var(--muted))]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--liquid-purple)]/10 shrink-0">
                        <Gamepad2 className="h-5 w-5 text-[var(--liquid-purple)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{tx.game}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {tx.product} • {tx.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">{formatCurrency(tx.price)}</p>
                        <Badge variant={st.variant} className="text-[10px] mt-0.5">{st.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Riwayat Saldo</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/wallet">Semua</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walletHistory.map((wh) => (
                  <div
                    key={wh.id}
                    className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3 transition-colors hover:bg-[hsl(var(--muted))]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                      wh.type === 'deposit' ? 'bg-green-500/10' : 
                      wh.type === 'cashback' ? 'bg-[var(--liquid-cyan)]/10' : 
                      'bg-red-500/10'
                    }`}>
                      {wh.type === 'deposit' ? <ArrowUpRight className="h-5 w-5 text-green-400" /> :
                       wh.type === 'cashback' ? <Sparkles className="h-5 w-5 text-[var(--liquid-cyan)]" /> :
                       <ArrowUpRight className="h-5 w-5 text-red-400 rotate-90" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate capitalize">
                        {wh.type === 'deposit' ? 'Topup Saldo' : 
                         wh.type === 'cashback' ? 'Cashback Loyalty' : 'Pembelian Game'}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {wh.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold tabular-nums ${wh.amount > 0 ? 'text-green-400' : ''}`}>
                        {wh.amount > 0 ? '+' : ''}{formatCurrency(wh.amount)}
                      </p>
                      <Badge variant="outline" className="text-[10px] mt-0.5 border-[hsl(var(--border))]">Berhasil</Badge>
                    </div>
                  </div>
                ))}
                
                {/* Promo Empty State if history is short */}
                <div className="mt-4 p-4 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-6 w-6 text-[hsl(var(--muted-foreground))] mb-2 opacity-50" />
                  <p className="text-sm font-medium">Bayar pakai Saldo MiqStore</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Lebih cepat, tanpa biaya admin, dan dapat cashback 1%!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
