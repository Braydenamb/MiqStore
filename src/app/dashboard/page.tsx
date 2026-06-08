"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { QuickTopUp } from "@/components/dashboard/quick-top-up";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

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
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const firstName = session?.user?.name?.split(" ")[0] || "kamu";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
          Halo, {firstName}! 👋
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Mau top up game apa hari ini?
        </p>
      </div>

      {/* Quick Top Up */}
      <QuickTopUp />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={data?.recentTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}
