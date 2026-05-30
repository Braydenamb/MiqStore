"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  DollarSign,
  ShoppingCart,
  Activity,
  Zap,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";

/* ─── Mock Data ─── */
const overviewStats = [
  {
    label: "Revenue Hari Ini",
    value: formatCurrency(15750000),
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "var(--liquid-purple)",
  },
  {
    label: "Transaksi Hari Ini",
    value: "342",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "var(--liquid-blue)",
  },
  {
    label: "User Baru",
    value: "58",
    change: "+15.3%",
    trend: "up" as const,
    icon: Users,
    color: "var(--liquid-cyan)",
  },
  {
    label: "Tingkat Sukses",
    value: "98.5%",
    change: "-0.3%",
    trend: "down" as const,
    icon: Activity,
    color: "var(--liquid-pink)",
  },
];

const recentOrders = [
  { id: "INV-2001", user: "Rizky P.", game: "Mobile Legends", product: "706 Diamonds", amount: 135000, status: "success", time: "2 menit lalu" },
  { id: "INV-2002", user: "Sarah A.", game: "Genshin Impact", product: "Welkin Moon", amount: 79000, status: "processing", time: "5 menit lalu" },
  { id: "INV-2003", user: "Ahmad F.", game: "Free Fire", product: "720 Diamonds", amount: 130000, status: "success", time: "8 menit lalu" },
  { id: "INV-2004", user: "Dewi A.", game: "Valorant", product: "1375 VP", amount: 149000, status: "pending", time: "12 menit lalu" },
  { id: "INV-2005", user: "Budi S.", game: "PUBG Mobile", product: "660 UC", amount: 159000, status: "success", time: "15 menit lalu" },
];

const topProducts = [
  { name: "Mobile Legends", sales: 12450, color: "var(--liquid-purple)" },
  { name: "Free Fire", sales: 8920, color: "var(--liquid-blue)" },
  { name: "Genshin Impact", sales: 6340, color: "var(--liquid-cyan)" },
  { name: "Valorant", sales: 5210, color: "var(--liquid-pink)" },
  { name: "PUBG Mobile", sales: 4180, color: "var(--liquid-indigo)" },
];

/* Revenue chart — 7-day mock data (visual bars) */
const revenueData = [
  { day: "Sen", value: 12400000, pct: 68 },
  { day: "Sel", value: 15200000, pct: 83 },
  { day: "Rab", value: 13800000, pct: 75 },
  { day: "Kam", value: 18300000, pct: 100 },
  { day: "Jum", value: 16500000, pct: 90 },
  { day: "Sab", value: 14100000, pct: 77 },
  { day: "Min", value: 15750000, pct: 86 },
];

/* Hourly traffic heatmap */
const hourlyTraffic = [
  { hour: "00", val: 12 }, { hour: "03", val: 5 }, { hour: "06", val: 8 },
  { hour: "09", val: 28 }, { hour: "12", val: 45 }, { hour: "15", val: 62 },
  { hour: "18", val: 85 }, { hour: "19", val: 100 }, { hour: "20", val: 95 },
  { hour: "21", val: 88 }, { hour: "22", val: 65 }, { hour: "23", val: 35 },
];

const statusColors: Record<string, string> = {
  success: "bg-green-500/15 text-green-400",
  processing: "bg-[var(--liquid-cyan)]/15 text-[var(--liquid-cyan)]",
  pending: "bg-[var(--liquid-amber)]/15 text-[var(--liquid-amber)]",
  failed: "bg-red-500/15 text-red-400",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <Badge variant="glow" className="text-[10px] gap-1">
            <Zap className="h-3 w-3" /> Live
          </Badge>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {overviewStats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <Card className="card-hover relative overflow-hidden">
              {/* Subtle glow */}
              <div
                className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-3xl opacity-10"
                style={{ background: stat.color }}
              />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 12%, transparent)` }}
                  >
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Chart + Hourly Traffic */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Revenue Chart (CSS bars) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[var(--liquid-purple)]" />
                  Revenue 7 Hari
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-400" /> +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48 pt-4">
                {revenueData.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
                      {formatCompactNumber(d.value / 1000000)}M
                    </span>
                    <motion.div
                      className="w-full rounded-xl relative overflow-hidden"
                      style={{
                        background: i === revenueData.length - 1
                          ? `linear-gradient(180deg, var(--liquid-purple) 0%, var(--liquid-blue) 100%)`
                          : `linear-gradient(180deg, rgba(192,132,252,0.3) 0%, rgba(125,211,252,0.15) 100%)`,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Shine effect on current day */}
                      {i === revenueData.length - 1 && (
                        <div className="absolute inset-0 animate-shine" />
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-medium ${i === revenueData.length - 1 ? "text-[var(--liquid-purple)]" : "text-[hsl(var(--muted-foreground))]"}`}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Traffic Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--liquid-cyan)]" />
                Traffic Jam Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hourlyTraffic.map((h) => (
                  <div key={h.hour} className="flex items-center gap-2">
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] w-8 shrink-0 tabular-nums">
                      {h.hour}:00
                    </span>
                    <div className="flex-1 h-5 rounded-lg bg-[hsl(var(--muted))] overflow-hidden">
                      <motion.div
                        className="h-full rounded-lg"
                        style={{
                          background: h.val > 80
                            ? `linear-gradient(90deg, var(--liquid-purple), var(--liquid-pink))`
                            : h.val > 50
                            ? `linear-gradient(90deg, var(--liquid-blue), var(--liquid-cyan))`
                            : `rgba(125,211,252,0.25)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${h.val}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] w-6 text-right tabular-nums">
                      {h.val}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--liquid-purple)]" /> Peak
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--liquid-blue)]" /> Moderate
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-[rgba(125,211,252,0.3)]" /> Low
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
                <Badge variant="outline" className="text-[10px] gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3 hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--liquid-purple)]/10 shrink-0">
                      <Gamepad2 className="h-4 w-4 text-[var(--liquid-purple)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{order.game}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {order.user} • {order.product} • {order.time}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0 tabular-nums">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--liquid-blue)]" />
                Top Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, i) => {
                  const maxSales = topProducts[0].sales;
                  const percentage = (product.sales / maxSales) * 100;

                  return (
                    <div key={product.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                            style={{ background: product.color }}
                          >
                            {i + 1}
                          </span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
                          {formatCompactNumber(product.sales)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${product.color}, ${product.color}88)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
