"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  MoreHorizontal,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

const stats = [
  { 
    title: "Total Revenue", 
    value: formatCurrency(12500000), 
    trend: "+12.5%", 
    trendUp: true, 
    icon: Wallet,
    color: "text-[var(--color-teal)]",
    bg: "bg-[var(--color-teal)]/10"
  },
  { 
    title: "Total Orders", 
    value: "1,234", 
    trend: "+5.2%", 
    trendUp: true, 
    icon: Receipt,
    color: "text-[var(--color-navy)]",
    bg: "bg-[var(--color-navy)]/10"
  },
  { 
    title: "Total Users", 
    value: "892", 
    trend: "+18.1%", 
    trendUp: true, 
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  { 
    title: "Pending Orders", 
    value: "12", 
    trend: "-2.4%", 
    trendUp: false, 
    icon: Clock,
    color: "text-[var(--color-gold)]",
    bg: "bg-[var(--color-gold)]/20"
  },
];

const recentOrders = [
  { id: "INV-001", user: "John Doe", game: "Mobile Legends", product: "344 Diamonds", total: 68000, status: "success", date: "2 mins ago" },
  { id: "INV-002", user: "Jane Smith", game: "Free Fire", product: "355 Diamonds", total: 65000, status: "pending", date: "5 mins ago" },
  { id: "INV-003", user: "Budi Santoso", game: "Valorant", product: "1375 VP", total: 149000, status: "processing", date: "12 mins ago" },
  { id: "INV-004", user: "Siti Aminah", game: "Genshin Impact", product: "Welkin Moon", total: 79000, status: "failed", date: "1 hour ago" },
  { id: "INV-005", user: "Andi Wijaya", game: "Mobile Legends", product: "Weekly Pass", total: 29000, status: "success", date: "2 hours ago" },
];

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-[var(--color-gold)]/20 text-[var(--color-navy)] border-[var(--color-gold)]",
  processing: "bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/30",
  failed: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[var(--color-navy)] text-white p-8 sm:p-10"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-teal)] rounded-full blur-[80px] opacity-60" />
        <div className="absolute right-20 -bottom-20 w-48 h-48 bg-[var(--color-gold)] rounded-full blur-[60px] opacity-40" />
        
        <div className="relative z-10 max-w-2xl">
          <p className="text-[var(--color-gold)] font-bold text-sm mb-2">{today}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4">Welcome back, Admin! 👋</h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Here's what's happening with your store today. You have <strong className="text-white">12 pending orders</strong> that need your attention.
          </p>
          <div className="mt-8 flex gap-3">
            <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-white font-bold rounded-xl h-10 px-6 transition-colors">
              View Pending Orders
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className={cn("flex items-center gap-1 text-sm font-bold", stat.trendUp ? "text-green-500" : "text-red-500")}>
                    {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-extrabold text-[var(--color-navy)] mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-white/50 px-6 py-5 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg hidden sm:flex">
              View All <ArrowUpRight className="ml-1 w-3 h-3" />
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Invoice ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[var(--color-navy)] whitespace-nowrap">
                      {order.id}
                      <div className="text-[10px] text-gray-400 font-sans font-normal mt-0.5">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-navy)] whitespace-nowrap">
                      {order.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-[var(--color-navy)]">{order.game}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--color-teal)] whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={cn("border font-bold uppercase tracking-wider text-[10px] px-2 py-0.5", statusStyles[order.status])}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--color-navy)] rounded-lg">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
