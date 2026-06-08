"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
// import { PremiumWalletCard } from "@/components/dashboard/premium-wallet-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FavoriteGamesList } from "@/components/dashboard/favorite-games-list";
import { PromoWidget } from "@/components/dashboard/promo-widget";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickTopUp } from "@/components/dashboard/quick-top-up";

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
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[hsl(var(--foreground))] tracking-tight">
          Selamat datang kembali, {session?.user?.name || "Miq User"}! <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]/60">
          Semoga harimu menyenangkan dan hoki selalu!
        </p>
      </motion.div>

      {/* Stats Grid (4 Mini Cards) */}
      <div className="mb-10">
        <StatsGrid 
          isLoading={isLoading} 
          totalTransactions={data?.stats?.totalTransactions}
          totalSpent={data?.stats?.totalSpent}
          rewardPoints={data?.stats?.rewardPoints}
          membership={data?.stats?.membership}
        />
      </div>

      {/* Promo Widget (Moved up for priority) */}
      <div className="mb-10">
        <PromoWidget />
      </div>

      {/* Quick Top Up */}
      <div className="mb-10">
        <QuickTopUp />
      </div>

      {/* Bottom Grid: Transactions & Favorite Games */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentTransactions transactions={data?.recentTransactions} />
        <FavoriteGamesList games={data?.favoriteGames} />
      </div>
    </div>
  );
}
