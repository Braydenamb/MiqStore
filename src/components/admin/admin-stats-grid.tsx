"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminStatsGridProps {
  isLoading: boolean;
  data: any;
}

export function AdminStatsGrid({ isLoading, data }: AdminStatsGridProps) {
  const overviewStats = [
    {
      label: "Revenue Hari Ini",
      value: isLoading ? "..." : formatCurrency(data?.todayRevenue || 0),
      change: "+0.0%",
      trend: "up" as const,
      icon: DollarSign,
      color: "var(--liquid-purple)",
    },
    {
      label: "Transaksi Hari Ini",
      value: isLoading ? "..." : (data?.todayTx || 0).toString(),
      change: "+0.0%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "var(--liquid-blue)",
    },
    {
      label: "User Baru",
      value: isLoading ? "..." : (data?.newUsers || 0).toString(),
      change: "+0.0%",
      trend: "up" as const,
      icon: Users,
      color: "var(--liquid-cyan)",
    },
    {
      label: "Tingkat Sukses",
      value: isLoading ? "..." : `${data?.successRate || 0}%`,
      change: "0.0%",
      trend: "up" as const,
      icon: Activity,
      color: "var(--liquid-pink)",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {overviewStats.map((stat: any) => (
        <motion.div key={stat.label} variants={staggerItem}>
          <Card className="card-hover relative overflow-hidden">
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
  );
}
