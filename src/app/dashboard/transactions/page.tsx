"use client";

import { useState } from "react";
import { Search, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  invoiceId: string;
  game: string;
  product: string;
  price: number;
  total: number;
  status: "SUCCESS" | "PROCESSING" | "PENDING" | "FAILED";
  paymentMethod: string;
  createdAt: string;
}

const statusConfig = {
  SUCCESS: { label: "Berhasil", className: "bg-emerald-500/10 text-emerald-600" },
  PROCESSING: { label: "Diproses", className: "bg-blue-500/10 text-blue-600" },
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  FAILED: { label: "Gagal", className: "bg-red-500/10 text-red-600" },
};

const statusOptions = [
  { value: "all", label: "Semua" },
  { value: "success", label: "Berhasil" },
  { value: "processing", label: "Diproses" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Gagal" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const debouncedSearch = useDebounce(search, 400);

  const { data, isFetching } = useQuery({
    queryKey: ["transactions", page, perPage, statusFilter],
    queryFn: async () => {
      const url = new URL("/api/transactions", window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("per_page", perPage.toString());
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    placeholderData: (prev) => prev,
    staleTime: 15_000,
  });

  const transactions: Transaction[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPages: 1 };

  // Client-side search filter
  const filtered = debouncedSearch
    ? transactions.filter(
        (tx) =>
          tx.game.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          tx.invoiceId.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : transactions;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Transaksi</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Riwayat pembelian kamu
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Cari game atau nomor invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/30 transition-all"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className={cn(
                "shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                statusFilter === opt.value
                  ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                  : "bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading bar */}
      {isFetching && (
        <div className="h-0.5 rounded-full bg-[hsl(var(--primary))]/20 overflow-hidden">
          <div className="h-full w-1/3 bg-[hsl(var(--primary))] animate-shimmer-slide" />
        </div>
      )}

      {/* Transaction list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((tx) => {
            const st = statusConfig[tx.status] ?? statusConfig.PENDING;
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]/60"
              >
                <div className="h-10 w-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{tx.game}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate mt-0.5">
                    {tx.product} · {tx.paymentMethod}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]/70 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-sm font-bold text-[hsl(var(--foreground))]">
                    {formatCurrency(tx.total)}
                  </span>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", st.className)}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
            <Gamepad2 className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
          </div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            {debouncedSearch ? "Tidak ada hasil" : "Belum ada transaksi"}
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            {debouncedSearch
              ? `Tidak ada transaksi untuk "${debouncedSearch}"`
              : "Transaksimu akan muncul di sini"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Halaman {page} dari {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] disabled:opacity-40 hover:border-[hsl(var(--primary))]/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] disabled:opacity-40 hover:border-[hsl(var(--primary))]/50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
