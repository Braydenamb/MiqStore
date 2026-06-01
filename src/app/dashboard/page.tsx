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
  Eye,
  ChevronRight,
  CalendarCheck,
  FolderOpen,
  Zap,
} from "lucide-react";
import Link from "next/link";
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

// Decorative Sparkline Component
function Sparkline({ color }: { color: string }) {
  return (
    <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 shrink-0">
      <path d="M2 28C6.5 25.5 10 18 15 18C20 18 22.5 24 28 24C33.5 24 38 12 43 12C48 12 51.5 22 57 22C62.5 22 66 10 71 10C76 10 78 5 78 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="78" cy="5" r="3" fill={color} />
    </svg>
  );
}

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
    { label: "Transaksi", title: "Total Transaksi", value: isLoading ? "..." : (data?.stats?.totalTransactions || "0"), icon: Receipt, color: "var(--liquid-purple)" },
    { label: "Bulan ini", title: "Total Belanja", value: isLoading ? "..." : formatCurrency(data?.stats?.totalSpent || 0), icon: TrendingUp, color: "var(--liquid-blue)" },
    { label: "Poin", title: "Poin Reward", value: isLoading ? "..." : (data?.stats?.rewardPoints || "0"), icon: Star, color: "var(--liquid-amber)" },
  ];

  const recentTransactions = data?.recentTransactions || [];
  const walletHistory = data?.walletHistory || [];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">
          Selamat datang kembali, {session?.user?.name || "Miq User"}! 👋
        </h1>
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
          Semoga harimu menyenangkan dan hoki selalu!
        </p>
      </motion.div>

      {/* Main Saldo Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 text-white shadow-2xl shadow-blue-500/10"
          style={{
            background: `linear-gradient(105deg, #3b2786 0%, #2563eb 50%, #06b6d4 100%)`,
          }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-400 blur-[80px]" />
            <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-purple-500 blur-[60px]" />
            <div className="absolute top-10 right-10 md:flex gap-4 hidden">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold italic shadow-xl text-white/90">M</div>
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold italic shadow-xl mt-12 text-white/90">M</div>
            </div>
            {/* Mockup wallet graphic representation */}
            <div className="absolute right-[-10%] top-[-30%] md:right-[-5%] md:top-[-20%] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/20" />
            <div className="hidden md:flex absolute right-[5%] top-[10%] w-[350px] h-[250px] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl rotate-[-10deg] flex-col justify-end p-6 z-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 self-end mb-4 shadow-lg flex items-center justify-center border border-white/20">
                <Wallet className="h-8 w-8 text-white drop-shadow-sm" />
              </div>
              <div className="w-3/4 h-4 bg-white/30 rounded-full mb-3" />
              <div className="w-1/2 h-4 bg-white/20 rounded-full" />
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-start gap-4 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Wallet className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold opacity-90 tracking-wide">Saldo MiqStore</span>
              <Eye className="h-4 w-4 ml-1 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-md my-1">
              {isLoading ? "..." : formatCurrency(data?.stats?.walletBalance || 0)}
            </h2>
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <TrendingUp className="h-3.5 w-3.5" /> +Rp 680 (Cashback)
              </span>
              <span className="opacity-80">Bulan ini</span>
            </div>
            
            <Button size="lg" className="mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30 border-none font-bold px-8 h-12 text-sm transition-transform hover:scale-105">
              Deposit Saldo <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={3} />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {stats.map((stat: any) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm shrink-0"
                        style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}
                      >
                        <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">{stat.title}</p>
                        <p className="text-xl font-extrabold mt-0.5 text-[hsl(var(--foreground))]">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                    <Sparkline color={stat.color} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

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
                          <Badge variant={statusMap[tx.status].variant} className="text-[9px] px-1.5 py-0 mt-1">{statusMap[tx.status].label}</Badge>
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
        </div>

        {/* Right Sidebar (Quick Actions & Promos) */}
        <div className="xl:w-80 shrink-0 flex flex-col gap-6">
          {/* Quick Top Up */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-sm">Quick Top Up</h3>
              </div>
              
              <div className="space-y-2 mb-5">
                {[
                  { name: 'Mobile Legends', img: '/images/mlbb-logo.webp' }, 
                  { name: 'Free Fire', img: '/images/ff-logo.webp' }, 
                  { name: 'PUBG Mobile', img: '/images/pubgm-logo.webp' }
                ].map((game, i) => (
                  <Link href={`/games/${game.name.toLowerCase().replace(' ', '-')}`} key={i} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors border border-transparent hover:border-[hsl(var(--border))] group">
                    <div className="h-10 w-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-[hsl(var(--border))]">
                      {/* For now use Gamepad icon if image fails */}
                      <Gamepad2 className="h-5 w-5 text-[hsl(var(--muted-foreground))] group-hover:text-[var(--liquid-purple)] transition-colors" />
                    </div>
                    <span className="text-sm font-semibold flex-1">{game.name}</span>
                  </Link>
                ))}
              </div>
              
              <Button variant="outline" className="w-full rounded-xl border-[hsl(var(--border))] text-xs font-semibold hover:bg-[hsl(var(--muted))]">
                <Gamepad2 className="h-3.5 w-3.5 mr-2" /> Lihat Semua Game
              </Button>
            </div>
          </motion.div>

          {/* Daily Check-in */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
              <div className="flex gap-4 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CalendarCheck className="h-4 w-4 text-orange-500" />
                    <h3 className="font-bold text-sm">Daily Check-in</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                    Check-in setiap hari dan dapatkan poin reward!
                  </p>
                  <Button size="sm" className="bg-[var(--liquid-purple)] hover:bg-[var(--liquid-purple)]/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 px-5">
                    Check-in Sekarang
                  </Button>
                </div>
                <div className="shrink-0 pt-2">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/40 dark:to-purple-900/10 rounded-2xl shadow-lg shadow-purple-500/10 border border-purple-200 dark:border-purple-800 flex items-center justify-center rotate-6 hover:rotate-12 transition-transform cursor-pointer">
                    <CheckCircle2 className="h-8 w-8 text-[var(--liquid-purple)]" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Terbaru */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--liquid-purple)]" />
                  <h3 className="font-bold text-sm">Event Terbaru</h3>
                </div>
                <Link href="/promo" className="text-[10px] font-semibold text-[var(--liquid-purple)] hover:underline">
                  Lihat Semua
                </Link>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 to-[#2e1065] aspect-[16/9] p-5 border border-indigo-500/30 shadow-inner group cursor-pointer">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/30 blur-2xl rounded-full group-hover:bg-blue-500/40 transition-colors" />
                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-pink-500/30 blur-2xl rounded-full group-hover:bg-pink-500/40 transition-colors" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-cyan-300 text-[10px] font-bold tracking-wider mb-1">
                      <Sparkles className="h-3 w-3" /> TOP UP
                    </div>
                    <h4 className="text-white font-black text-xl italic uppercase drop-shadow-md leading-tight mt-0.5">September<br/>Deals!</h4>
                  </div>
                  <div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-[10px] border-none text-white font-bold py-1 px-3 shadow-lg shadow-purple-500/20">
                      Diskon hingga 20%
                    </Badge>
                  </div>
                </div>
                
                {/* Diamond graphic mock */}
                <div className="absolute -bottom-2 -right-2 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Crown className="w-24 h-24 rotate-12 fill-cyan-400/20" strokeWidth={1} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
