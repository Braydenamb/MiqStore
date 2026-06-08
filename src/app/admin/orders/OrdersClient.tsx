"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAdminOrders, updateOrderStatus } from "@/actions/admin-orders";
import { useDebounce } from "@/hooks/use-debounce";

const statusStyles: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/20",
  paid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  processing: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  expired: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const statusLabels = ["pending", "paid", "processing", "success", "failed", "refunded", "expired"];

type OrderData = {
  id: string;
  dbId: string;
  user: string;
  userId: string;
  game: string;
  product: string;
  payment: string;
  total: number;
  status: string;
  date: string;
};

export default function OrdersClient({ initialData }: { initialData: { orders: OrderData[], total: number, totalPages: number } }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search — avoids query on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  // ── TanStack Query: cache + placeholderData prevents blank-table flash ──────
  const { data, isFetching } = useQuery({
    queryKey: ["admin-orders", page, debouncedSearch, statusFilter],
    queryFn: async () => {
      const result = await getAdminOrders(page, 20, debouncedSearch, statusFilter);
      if (!result.success || !result.data) throw new Error("Failed to fetch orders");
      return result.data;
    },
    initialData: { orders: initialData.orders, total: initialData.total, totalPages: initialData.totalPages },
    placeholderData: (prev) => prev, // Keep previous page data while fetching next
    staleTime: 15_000,
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const handleStatusChange = async (dbId: string, newStatus: string) => {
    const result = await updateOrderStatus(dbId, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } else {
      toast.error(result.error || "Gagal mengubah status");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl">
        <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">Order Management</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Track and manage user top-up transactions.</p>
      </div>

      {/* List Section */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input 
              placeholder="Search by Invoice, User, or Game..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl w-full text-[hsl(var(--foreground))]" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-10 px-4 pr-10 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl font-bold text-sm outline-none cursor-pointer focus:border-[hsl(var(--primary))] w-full sm:w-auto text-[hsl(var(--foreground))]"
              >
                <option value="all">All Status</option>
                {statusLabels.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {/* Subtle top-bar indicator instead of blocking overlay */}
          {isFetching && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]/30 z-10 overflow-hidden rounded-t-lg">
              <div className="h-full bg-[hsl(var(--primary))] animate-shimmer-slide" style={{ width: "40%" }} />
            </div>
          )}
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-[hsl(var(--muted-foreground))] font-medium border-b border-[hsl(var(--border))]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Invoice ID & Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Customer Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Game & Item</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] bg-transparent">
              {orders.map((order) => (
                <tr key={order.dbId} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-mono text-xs font-bold text-[hsl(var(--foreground))]">{order.id}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 font-medium">{order.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[hsl(var(--foreground))]">{order.user}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">ID: {order.userId.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[hsl(var(--foreground))]">{order.game}</p>
                    <p className="text-xs text-[hsl(var(--primary))] font-medium">{order.product}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[hsl(var(--foreground))]">{formatCurrency(order.total)}</p>
                    <p className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))] mt-1">{order.payment}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block w-full">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.dbId, e.target.value)}
                        className={cn(
                          "appearance-none border font-bold uppercase tracking-wider text-[10px] px-2 py-1 rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[hsl(var(--primary))] transition-shadow pr-6",
                          statusStyles[order.status] || statusStyles.pending
                        )}
                      >
                        {statusLabels.map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-[hsl(var(--foreground))] font-bold">
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none", statusStyles[order.status]?.includes('text-white') ? 'text-white' : 'text-current')} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !isFetching && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))] bg-slate-900/30">
            Showing {orders.length} of {total} entries
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 rounded-lg border-[hsl(var(--border))] bg-slate-900/50 hover:bg-slate-800 text-[hsl(var(--muted-foreground))]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-3 font-bold text-[hsl(var(--foreground))]">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-8 px-3 rounded-lg border-[hsl(var(--border))] bg-slate-900/50 hover:bg-slate-800 text-[hsl(var(--muted-foreground))]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
