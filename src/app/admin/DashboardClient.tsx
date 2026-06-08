"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  Receipt,
  TrendingUp,
  Clock,
  Gamepad2,
  Package,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { RevenueChartWidget } from "@/components/admin/widgets/RevenueChartWidget";
import { QuickActionsWidget } from "@/components/admin/widgets/QuickActionsWidget";
import { TopProductsWidget } from "@/components/admin/widgets/TopProductsWidget";
import { RecentUsersWidget } from "@/components/admin/widgets/RecentUsersWidget";
import { RecentOrdersWidget } from "@/components/admin/widgets/RecentOrdersWidget";
import { SortableWidget } from "@/components/admin/widgets/SortableWidget";

interface TopProduct {
  id: string;
  name: string;
  image: string | null;
  sales: number;
  revenue: number;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
}

interface RecentOrder {
  id: string;
  user: string;
  game: string;
  product: string;
  total: number;
  status: string;
  date: string;
}

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  revenueTodayStats: number;
  ordersToday: number;
  successRateToday: number;
  totalGames: number;
  totalItems: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  recentUsers: RecentUser[];
  chartData: { name: string; revenue: number }[];
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    pendingOrders,
    revenueTodayStats,
    ordersToday,
    successRateToday,
    totalGames,
    totalItems,
    recentOrders,
    topProducts,
    recentUsers,
    chartData,
  } = initialData;

  const defaultLayout = [
    "revenue-chart",
    "quick-actions",
    "top-products",
    "recent-users",
    "recent-orders"
  ];

  const [layout, setLayout] = useState<string[]>(defaultLayout);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLayout = localStorage.getItem("admin-dashboard-layout");
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        if (Array.isArray(parsed) && parsed.length === defaultLayout.length) {
          setLayout(parsed);
        }
      } catch (e) {}
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newLayout = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("admin-dashboard-layout", JSON.stringify(newLayout));
        return newLayout;
      });
    }
  };

  const stats = [
    { 
      title: "Total Revenue", 
      value: formatCurrency(totalRevenue), 
      trend: "+12.5%", 
      trendUp: true, 
      icon: Wallet,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    { 
      title: "Total Orders", 
      value: totalOrders.toLocaleString(), 
      trend: "+5.2%", 
      trendUp: true, 
      icon: Receipt,
      color: "text-[hsl(var(--primary))]",
      bg: "bg-[hsl(var(--primary))]/10"
    },
    { 
      title: "Total Users", 
      value: totalUsers.toLocaleString(), 
      trend: "+18.1%", 
      trendUp: true, 
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    { 
      title: "Pending Orders", 
      value: pendingOrders.toLocaleString(), 
      trend: "-2.4%", 
      trendUp: false, 
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
  ];

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const renderWidget = (id: string) => {
    switch (id) {
      case "revenue-chart":
        return <SortableWidget id={id} className="col-span-1 lg:col-span-2"><RevenueChartWidget chartData={chartData || []} /></SortableWidget>;
      case "quick-actions":
        return <SortableWidget id={id} className="col-span-1"><QuickActionsWidget /></SortableWidget>;
      case "top-products":
        return <SortableWidget id={id} className="col-span-1"><TopProductsWidget topProducts={topProducts || []} /></SortableWidget>;
      case "recent-users":
        return <SortableWidget id={id} className="col-span-1"><RecentUsersWidget recentUsers={recentUsers || []} /></SortableWidget>;
      case "recent-orders":
        return <SortableWidget id={id} className="col-span-1 lg:col-span-3"><RecentOrdersWidget recentOrders={recentOrders || []} /></SortableWidget>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] p-7 sm:p-9 shadow-lg shadow-black/20"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[hsl(var(--primary))] rounded-full blur-[80px] opacity-15" />
        <div className="absolute right-20 -bottom-20 w-48 h-48 bg-[hsl(var(--accent))] rounded-full blur-[60px] opacity-15" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="max-w-xl">
            <p className="text-[hsl(var(--primary))] font-bold text-sm mb-2">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-[hsl(var(--foreground))]/70 text-sm leading-relaxed">
              Ada{" "}
              <strong className="text-amber-400">{pendingOrders} pesanan pending</strong>{" "}
              yang perlu perhatianmu hari ini.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              asChild
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 font-bold rounded-xl h-10 px-5 text-sm transition-colors shadow-lg shadow-[hsl(var(--primary))]/20"
            >
              <Link href="/admin/orders?status=PENDING">Lihat Pending</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] rounded-xl h-10 px-5 text-sm"
            >
              <Link href="/admin/games">Kelola Games</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Today's Business Metrics */}
      <div>
        <h2 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3 px-1">
          Hari Ini
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Revenue Hari Ini",
              value: formatCurrency(revenueTodayStats),
              icon: Wallet,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              trend: null,
            },
            {
              label: "Orders Hari Ini",
              value: ordersToday.toLocaleString(),
              icon: Receipt,
              color: "text-[hsl(var(--primary))]",
              bg: "bg-[hsl(var(--primary))]/10",
              trend: null,
            },
            {
              label: "Success Rate",
              value: `${successRateToday}%`,
              icon: CheckCircle2,
              color: successRateToday >= 95 ? "text-emerald-400" : "text-amber-400",
              bg: successRateToday >= 95 ? "bg-emerald-400/10" : "bg-amber-400/10",
              trend: null,
            },
            {
              label: "Pending Payment",
              value: pendingOrders.toLocaleString(),
              icon: Clock,
              color: pendingOrders > 0 ? "text-amber-400" : "text-slate-400",
              bg: pendingOrders > 0 ? "bg-amber-400/10" : "bg-slate-400/10",
              trend: null,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <p className="text-xl font-extrabold text-[hsl(var(--foreground))]">{s.value}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All-Time Stats + Catalog */}
      <div>
        <h2 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3 px-1">
          Semua Waktu
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                    <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
                  </div>
                  <p className="text-lg font-extrabold text-[hsl(var(--foreground))]">{stat.value}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]/80 mt-0.5">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {/* Catalog metrics */}
          {[
            { title: "Games", value: totalGames.toLocaleString(), icon: Gamepad2, color: "text-violet-400", bg: "bg-violet-400/10", href: "/admin/games" },
            { title: "Total Items", value: totalItems.toLocaleString(), icon: Package, color: "text-cyan-400", bg: "bg-cyan-400/10", href: "/admin/games" },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (stats.length + i) * 0.05 }}
            >
              <Link href={s.href}>
                <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-sm rounded-2xl overflow-hidden hover:border-[hsl(var(--primary))]/30 transition-colors cursor-pointer">
                  <CardContent className="p-5">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
                      <s.icon className={cn("w-4.5 h-4.5", s.color)} />
                    </div>
                    <p className="text-lg font-extrabold text-[hsl(var(--foreground))]">{s.value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]/80 mt-0.5">{s.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Flexible Drag & Drop Widget Grid */}
      {isMounted && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={layout} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
              {layout.map((id) => renderWidget(id))}
            </div>
          </SortableContext>
        </DndContext>
      )}

    </div>
  );
}
