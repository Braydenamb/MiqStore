"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

const overviewStats = [
  {
    label: "Revenue Hari Ini",
    value: formatCurrency(15750000),
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "Transaksi Hari Ini",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "User Baru",
    value: "58",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    label: "Tingkat Sukses",
    value: "98.5%",
    change: "-0.3%",
    trend: "down",
    icon: Activity,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const recentOrders = [
  { id: "INV-2001", user: "Rizky P.", game: "Mobile Legends", product: "706 Diamonds", amount: 135000, status: "success" },
  { id: "INV-2002", user: "Sarah A.", game: "Genshin Impact", product: "Welkin Moon", amount: 79000, status: "processing" },
  { id: "INV-2003", user: "Ahmad F.", game: "Free Fire", product: "720 Diamonds", amount: 130000, status: "success" },
  { id: "INV-2004", user: "Dewi A.", game: "Valorant", product: "1375 VP", amount: 149000, status: "pending" },
  { id: "INV-2005", user: "Budi S.", game: "PUBG Mobile", product: "660 UC", amount: 159000, status: "success" },
];

const topProducts = [
  { name: "Mobile Legends", sales: 12450, revenue: 856000000 },
  { name: "Free Fire", sales: 8920, revenue: 580000000 },
  { name: "Genshin Impact", sales: 6340, revenue: 1250000000 },
  { name: "Valorant", sales: 5210, revenue: 780000000 },
  { name: "PUBG Mobile", sales: 4180, revenue: 630000000 },
];

const statusColors: Record<string, string> = {
  success: "bg-green-500/20 text-green-400",
  processing: "bg-cyan-500/20 text-cyan-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Overview
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Ringkasan statistik hari ini — {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
                  {stat.value}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] p-3 hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 shrink-0">
                      <Gamepad2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{order.game}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {order.user} • {order.product} • {order.id}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Products</CardTitle>
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
                          <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                            {i + 1}
                          </span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {formatCompactNumber(product.sales)} sales
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
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
