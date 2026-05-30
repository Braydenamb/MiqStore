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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const stats = [
  { label: "Total Transaksi", value: "47", icon: Receipt, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Total Belanja", value: formatCurrency(2450000), icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Saldo Bonus", value: formatCurrency(125000), icon: Wallet, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Poin Reward", value: "1,250", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const recentTransactions = [
  {
    id: "INV-001",
    game: "Mobile Legends",
    product: "344 Diamonds",
    price: 68000,
    status: "success" as const,
    date: "28 Mei 2026",
  },
  {
    id: "INV-002",
    game: "Genshin Impact",
    product: "Welkin Moon",
    price: 79000,
    status: "success" as const,
    date: "27 Mei 2026",
  },
  {
    id: "INV-003",
    game: "Valorant",
    product: "700 VP",
    price: 79000,
    status: "processing" as const,
    date: "26 Mei 2026",
  },
  {
    id: "INV-004",
    game: "Free Fire",
    product: "355 Diamonds",
    price: 65000,
    status: "success" as const,
    date: "25 Mei 2026",
  },
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Dashboard
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Selamat datang kembali, Miq! 👋
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                </div>
                <p className="mt-3 text-xl font-bold text-[hsl(var(--foreground))]">
                  {stat.value}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Membership Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 p-6">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                ⭐ Gold Member
              </Badge>
              <h3 className="text-lg font-bold text-white">
                Upgrade ke Diamond untuk diskon 15%!
              </h3>
              <p className="text-sm text-white/70 mt-1">
                Butuh 1,750 poin lagi untuk naik level
              </p>
            </div>
            <Button className="bg-white text-amber-800 hover:bg-white/90 shrink-0">
              Lihat Detail
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/transactions">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => {
                const st = statusMap[tx.status];
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] p-3 transition-colors hover:bg-[hsl(var(--muted))]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Gamepad2 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                        {tx.game}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {tx.product} • {tx.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {formatCurrency(tx.price)}
                      </p>
                      <Badge variant={st.variant} className="text-[10px] mt-0.5">
                        {st.label}
                      </Badge>
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
