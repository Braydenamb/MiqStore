"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminCharts } from "@/components/admin/admin-charts";
import { AdminRecent } from "@/components/admin/admin-recent";

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
