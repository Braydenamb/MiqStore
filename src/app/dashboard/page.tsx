"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FavoriteGamesList } from "@/components/dashboard/favorite-games-list";
import { PromoWidget } from "@/components/dashboard/promo-widget";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickTopUp } from "@/components/dashboard/quick-top-up";
import {
  StatsGridSkeleton,
  RecentTransactionsSkeleton,
  FavoriteGamesSkeleton,
  QuickTopUpSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

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
    staleTime: 0,             // Selalu anggap data basi — refresh setiap kali fokus ke tab
    refetchInterval: 30_000,  // Auto-polling tiap 30 detik di background
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section — Renders INSTANTLY, no data needed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1.5 mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[hsl(var(--foreground))] tracking-tight">
          Selamat datang kembali, {session?.user?.name || "Miq User"}!{" "}
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]/60">
          Semoga harimu menyenangkan dan hoki selalu!
        </p>
      </motion.div>

      {/* Stats Grid — Shows skeleton while loading, then fades in data */}
      <div className="mb-10">
        <Suspense fallback={<StatsGridSkeleton />}>
          {isLoading ? (
            <StatsGridSkeleton />
          ) : (
            <StatsGrid
              isLoading={false}
              totalTransactions={data?.stats?.totalTransactions}
              totalSpent={data?.stats?.totalSpent}
              rewardPoints={data?.stats?.rewardPoints}
              membership={data?.stats?.membership}
            />
          )}
        </Suspense>
      </div>

      {/* Promo Widget — Static, renders instantly */}
      <div className="mb-10">
        <PromoWidget />
      </div>

      {/* Quick Top Up — Static, renders instantly */}
      <div className="mb-10">
        <Suspense fallback={<QuickTopUpSkeleton />}>
          <QuickTopUp />
        </Suspense>
      </div>

      {/* Bottom Grid — Each section independent, shows skeleton until data arrives */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          {isLoading ? (
            <RecentTransactionsSkeleton />
          ) : (
            <RecentTransactions transactions={data?.recentTransactions} />
          )}
        </Suspense>

        <Suspense fallback={<FavoriteGamesSkeleton />}>
          {isLoading ? (
            <FavoriteGamesSkeleton />
          ) : (
            <FavoriteGamesList games={data?.favoriteGames} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
