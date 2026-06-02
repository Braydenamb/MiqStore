"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

const initialOrders = [
  { id: "INV-001", user: "Player77", userId: "12345", game: "Mobile Legends", product: "344 Diamonds", payment: "QRIS", total: 68000, status: "success", date: "2026-06-02 10:24" },
  { id: "INV-002", user: "JaneSmith", userId: "98765", game: "Free Fire", product: "355 Diamonds", payment: "GoPay", total: 65000, status: "pending", date: "2026-06-02 10:21" },
  { id: "INV-003", user: "BudiS", userId: "45678", game: "Valorant", product: "1375 VP", payment: "BCA VA", total: 149000, status: "processing", date: "2026-06-02 10:15" },
  { id: "INV-004", user: "SitiA", userId: "11223", game: "Genshin Impact", product: "Welkin Moon", payment: "OVO", total: 79000, status: "failed", date: "2026-06-02 09:45" },
  { id: "INV-005", user: "AndiW", userId: "33445", game: "Mobile Legends", product: "Weekly Pass", payment: "ShopeePay", total: 29000, status: "success", date: "2026-06-02 08:30" },
  { id: "INV-006", user: "ProGamer", userId: "99887", game: "PUBG Mobile", product: "600 UC", payment: "QRIS", total: 125000, status: "paid", date: "2026-06-02 08:15" },
];

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-[var(--color-gold)]/20 text-[var(--color-navy)] border-[var(--color-gold)]",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/30",
  failed: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels = ["pending", "paid", "processing", "success", "failed"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Status updated to ${newStatus.toUpperCase()}`);
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user.toLowerCase().includes(search.toLowerCase()) ||
    o.game.toLowerCase().includes(search.toLowerCase())
  );

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
            <Button variant="outline" className="rounded-xl font-bold bg-white w-full sm:w-auto gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="outline" className="rounded-xl font-bold bg-white w-full sm:w-auto gap-2">
              Status <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-mono text-xs font-bold text-[var(--color-navy)]">{order.id}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{order.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-[var(--color-navy)]">{order.user}</p>
                    <p className="text-xs text-gray-500 font-mono">ID: {order.userId}</p>
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
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={cn(
                          "appearance-none border font-bold uppercase tracking-wider text-[10px] px-2 py-1 rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-teal)] transition-shadow pr-6",
                          statusStyles[order.status]
                        )}
                      >
                        {statusLabels.map((s) => (
                          <option key={s} value={s} className="bg-white text-[var(--color-navy)] font-bold">
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none", statusStyles[order.status].includes('text-white') ? 'text-white' : 'text-current')} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--color-navy)] rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
          Showing {filteredOrders.length} entries
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg bg-[var(--color-navy)] text-white border-[var(--color-navy)]">1</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
