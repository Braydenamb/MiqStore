"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function DashboardClient({ initialData }: { initialData: any }) {
  const { totalRevenue, totalOrders, totalUsers, pendingOrders, recentOrders, topProducts, recentUsers, chartData } = initialData;

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
      color: "text-[var(--color-teal)]",
      bg: "bg-[var(--color-teal)]/10"
    },
    { 
      title: "Total Orders", 
      value: totalOrders.toLocaleString(), 
      trend: "+5.2%", 
      trendUp: true, 
      icon: Receipt,
      color: "text-[var(--color-navy)]",
      bg: "bg-[var(--color-navy)]/10"
    },
    { 
      title: "Total Users", 
      value: totalUsers.toLocaleString(), 
      trend: "+18.1%", 
      trendUp: true, 
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Pending Orders", 
      value: pendingOrders.toLocaleString(), 
      trend: "-2.4%", 
      trendUp: false, 
      icon: Clock,
      color: "text-[var(--color-gold)]",
      bg: "bg-[var(--color-gold)]/20"
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
            Here's what's happening with your store today. You have <strong className="text-white">{pendingOrders} pending orders</strong> that need your attention.
          </p>
          <div className="mt-8 flex gap-3">
            <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-white font-bold rounded-xl h-10 px-6 transition-colors">
              View Pending Orders
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Fixed Top */}
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
