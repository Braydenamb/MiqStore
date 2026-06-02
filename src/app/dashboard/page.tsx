"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { WalletBanner } from "@/components/dashboard/wallet-banner";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AiInsights } from "@/components/dashboard/ai-insights";

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

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Main Saldo Banner */}
          <WalletBanner isLoading={isLoading} walletBalance={data?.stats?.walletBalance} />

          {/* Quick Actions (Top Up, Voucher, dll) */}
          <QuickActions />

          {/* Stats Grid */}
          <StatsGrid 
            isLoading={isLoading} 
            totalTransactions={data?.stats?.totalTransactions}
            totalSpent={data?.stats?.totalSpent}
            rewardPoints={data?.stats?.rewardPoints}
          />

          {/* AI-Powered Insights & Recommendations */}
          <AiInsights />

          {/* Tables Row (includes Membership Upgrade Banner) */}
          <DashboardTables 
            recentTransactions={data?.recentTransactions || []}
            walletHistory={data?.walletHistory || []}
          />
        </div>

        {/* Right Sidebar (Quick Actions & Promos) */}
        <DashboardSidebar />
      </div>
    </div>
  );
}
