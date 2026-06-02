"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Gamepad2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
  id: `INV-${(1000 + i).toString()}`,
  game: ["Mobile Legends", "Free Fire", "Genshin Impact", "Valorant", "PUBG Mobile"][i % 5],
  product: ["344 Diamonds", "355 Diamonds", "Welkin Moon", "700 VP", "325 UC"][i % 5],
  price: [68000, 65000, 79000, 79000, 55000][i % 5],
  status: (["success", "success", "success", "processing", "failed"] as const)[i % 5],
  payment: ["QRIS", "GoPay", "BCA VA", "DANA", "OVO"][i % 5],
  date: `${28 - i} Mei 2026`,
}));

const statusMap = {
  success: { label: "Sukses", variant: "success" as const, icon: CheckCircle2, color: "text-green-400" },
  processing: { label: "Proses", variant: "warning" as const, icon: Clock, color: "text-amber-400" },
  pending: { label: "Pending", variant: "warning" as const, icon: Clock, color: "text-amber-400" },
  failed: { label: "Gagal", variant: "destructive" as const, icon: XCircle, color: "text-red-400" },
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockTransactions.filter((tx) => {
    const matchSearch =
      tx.game.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Riwayat Transaksi
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Semua transaksi kamu ada di sini
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Cari invoice atau game..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-40"
        >
          <option value="all">Semua Status</option>
          <option value="success">Sukses</option>
          <option value="processing">Diproses</option>
          <option value="pending">Pending</option>
          <option value="failed">Gagal</option>
        </Select>
        <Button variant="outline" className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            {/* Table Header (Desktop) */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 border-b border-[hsl(var(--border))] px-4 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              <span>Transaksi</span>
              <span>Pembayaran</span>
              <span className="text-right">Harga</span>
              <span>Tanggal</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            {paginated.length > 0 ? (
              paginated.map((tx) => {
                const st = statusMap[tx.status];
                return (
                  <div
                    key={tx.id}
                    className="grid sm:grid-cols-[1fr_120px_100px_100px_80px] gap-2 sm:gap-4 items-center border-b border-[hsl(var(--border))] px-4 py-3 last:border-0 hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 shrink-0">
                        <Gamepad2 className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{tx.game}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {tx.product} • {tx.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{tx.payment}</span>
                    <span className="text-sm font-semibold text-right">{formatCurrency(tx.price)}</span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{tx.date}</span>
                    <Badge variant={st.variant} className="text-[10px] w-fit justify-self-start sm:justify-self-auto">
                      {st.label}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[var(--color-gold)]/20 blur-2xl rounded-full" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-navy)]/5 border border-[var(--color-navy)]/10">
                    <Search className="h-10 w-10 text-[var(--color-navy)]/30" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">
                  Tidak Ada Transaksi
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6 leading-relaxed">
                  {search ? `Tidak ada transaksi yang cocok dengan pencarian "${search}". Coba gunakan kata kunci lain.` : "Sepertinya kamu belum pernah melakukan transaksi apa pun. Ayo mulai top up pertamamu sekarang!"}
                </p>
                {!search && (
                  <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-navy)] text-white rounded-full px-8 h-12 shadow-lg shadow-[var(--color-teal)]/20 transition-all">
                    Mulai Belanja
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(i + 1)}
                className="h-8 w-8 text-xs"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
