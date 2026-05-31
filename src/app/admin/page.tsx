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

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { linearRegressionForecast } from "@/lib/forecasting";

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
                  Revenue Forecast (AI)
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-[var(--liquid-cyan)]/30 text-[var(--liquid-cyan)] bg-[var(--liquid-cyan)]/5">
                  <Activity className="h-3 w-3 mr-1" /> Model Aktif
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48 pt-4">
                {revenueData.map((d, i) => (
                  <div key={d.day} className={`flex-1 flex flex-col items-center gap-2 ${d.isForecast ? 'opacity-80' : ''}`}>
                    <span className={`text-[10px] font-medium ${d.isForecast ? 'text-[var(--liquid-cyan)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                      {formatCompactNumber(d.value / 1000000)}M
                    </span>
                    <motion.div
                      className={`w-full rounded-xl relative overflow-hidden ${d.isForecast ? 'border-2 border-dashed border-[var(--liquid-cyan)]/50' : ''}`}
                      style={{
                        background: d.isForecast 
                          ? `linear-gradient(180deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.05) 100%)`
                          : i === 6 // Current day (Min)
                          ? `linear-gradient(180deg, var(--liquid-purple) 0%, var(--liquid-blue) 100%)`
                          : `linear-gradient(180deg, rgba(192,132,252,0.3) 0%, rgba(125,211,252,0.15) 100%)`,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Shine effect on current day */}
                      {i === 6 && (
                        <div className="absolute inset-0 animate-shine" />
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-medium ${d.isForecast ? 'text-[var(--liquid-cyan)]' : i === 6 ? "text-[var(--liquid-purple)]" : "text-[hsl(var(--muted-foreground))]"}`}>
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
