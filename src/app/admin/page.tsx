"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";

const AdminCharts = dynamic(() => import("@/components/admin/admin-charts").then(mod => mod.AdminCharts), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-[hsl(var(--card))]/40 backdrop-blur-md rounded-2xl animate-pulse border border-white/5" />
});

const AdminRecent = dynamic(() => import("@/components/admin/admin-recent").then(mod => mod.AdminRecent), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-[hsl(var(--card))]/40 backdrop-blur-md rounded-2xl animate-pulse border border-white/5" />
});

export default function AdminPage() {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    gcTime: 1000 * 60 * 30, // 30 minutes cache storage
  });

  return (
    <div className="space-y-6">
      <AdminHeader />
      <AdminStatsGrid isLoading={isLoading} data={data?.overview} />
      <AdminCharts historicalRevenue={data?.historicalRevenue || [0,0,0,0,0,0,0]} />
      <AdminRecent recentOrders={data?.recentOrders || []} topProducts={data?.topProducts || []} />
    </div>
  );
}
