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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const stats = [
  { label: "Total Transaksi", value: "47", icon: Receipt, color: "var(--liquid-purple)" },
  { label: "Total Belanja", value: formatCurrency(2450000), icon: TrendingUp, color: "var(--liquid-blue)" },
  { label: "Saldo Bonus", value: formatCurrency(125000), icon: Wallet, color: "var(--liquid-cyan)" },
  { label: "Poin Reward", value: "1,250", icon: Star, color: "var(--liquid-amber)" },
];

const recentTransactions = [
  { id: "INV-001", game: "Mobile Legends", product: "344 Diamonds", price: 68000, status: "success" as const, date: "28 Mei 2026" },
  { id: "INV-002", game: "Genshin Impact", product: "Welkin Moon", price: 79000, status: "success" as const, date: "27 Mei 2026" },
  { id: "INV-003", game: "Valorant", product: "700 VP", price: 79000, status: "processing" as const, date: "26 Mei 2026" },
  { id: "INV-004", game: "Free Fire", product: "355 Diamonds", price: 65000, status: "success" as const, date: "25 Mei 2026" },
];

const statusMap = {
  success: { label: "Sukses", variant: "success" as const, icon: CheckCircle2 },
  processing: { label: "Proses", variant: "warning" as const, icon: Clock },
  pending: { label: "Pending", variant: "warning" as const, icon: Clock },
  failed: { label: "Gagal", variant: "destructive" as const, icon: Clock },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Selamat datang kembali, Miq! 👋
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <Card className="card-hover relative overflow-hidden">
              <div
                className="absolute -top-6 -right-6 h-20 w-20 rounded-full blur-3xl opacity-10"
                style={{ background: stat.color }}
              />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 12%, transparent)` }}
                  >
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                </div>
                <p className="mt-3 text-xl font-bold">{stat.value}</p>
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

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/transactions">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
    </div>
  );
}
