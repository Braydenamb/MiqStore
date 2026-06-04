"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAdminOrders, updateOrderStatus } from "@/actions/admin-orders";

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-[var(--color-gold)]/20 text-[var(--color-navy)] border-[var(--color-gold)]",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/30",
  failed: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-gray-200 text-gray-700 border-gray-300",
  expired: "bg-gray-100 text-gray-400 border-gray-200",
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
  const [orders, setOrders] = useState<OrderData[]>(initialData.orders);
  const [total, setTotal] = useState(initialData.total);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data when filters or page change
  useEffect(() => {
    // skip initial render fetch since we have initialData
    if (page === 1 && debouncedSearch === "" && statusFilter === "all" && orders === initialData.orders) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getAdminOrders(page, 20, debouncedSearch, statusFilter);
      if (result.success && result.data) {
        setOrders(result.data.orders);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        toast.error("Gagal memuat pesanan");
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [debouncedSearch, statusFilter, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleStatusChange = async (dbId: string, newStatus: string) => {
    // Optimistic update
    setOrders(orders.map(o => o.dbId === dbId ? { ...o, status: newStatus } : o));
    
    const result = await updateOrderStatus(dbId, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } else {
      toast.error(result.error || "Gagal mengubah status");
      // Revert if failed (optional, can just re-fetch)
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage user top-up transactions.</p>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Invoice, User, or Game..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 bg-white border-gray-200 rounded-xl w-full" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-10 px-4 pr-10 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none cursor-pointer focus:border-[var(--color-teal)] w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                {statusLabels.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--color-teal)] animate-spin" />
            </div>
          )}
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Invoice ID & Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Customer Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Game & Item</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {orders.map((order) => (
                <tr key={order.dbId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-mono text-xs font-bold text-[var(--color-navy)]">{order.id}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{order.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[var(--color-navy)]">{order.user}</p>
                    <p className="text-xs text-gray-500 font-mono">ID: {order.userId.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[var(--color-navy)]">{order.game}</p>
                    <p className="text-xs text-[var(--color-teal)] font-medium">{order.product}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[var(--color-navy)]">{formatCurrency(order.total)}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{order.payment}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block w-full">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.dbId, e.target.value)}
                        className={cn(
                          "appearance-none border font-bold uppercase tracking-wider text-[10px] px-2 py-1 rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-teal)] transition-shadow pr-6",
                          statusStyles[order.status] || statusStyles.pending
                        )}
                      >
                        {statusLabels.map((s) => (
                          <option key={s} value={s} className="bg-white text-[var(--color-navy)] font-bold">
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none", statusStyles[order.status]?.includes('text-white') ? 'text-white' : 'text-current')} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--color-navy)] rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
            Showing {orders.length} of {total} entries
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-8 px-3 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-3 font-bold text-[var(--color-navy)]">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-8 px-3 rounded-lg"
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
