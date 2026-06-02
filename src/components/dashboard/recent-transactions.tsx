"use client";

import { Receipt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  game: string;
  product: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: "TRX-001", game: "Mobile Legends", product: "344 Diamonds", amount: 95000, status: "SUCCESS", date: "Hari ini, 14:30" },
  { id: "TRX-002", game: "PUBG Mobile", product: "600 UC", amount: 150000, status: "SUCCESS", date: "Kemarin, 09:15" },
  { id: "TRX-003", game: "Valorant", product: "1125 VP", amount: 120000, status: "PENDING", date: "24 Mei 2026, 16:45" },
];

export function RecentTransactions({ transactions = mockTransactions }: { transactions?: Transaction[] }) {
  return (
    <div className="bg-[#FFF8EC] border border-[#E8DCC7] rounded-[24px] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-[var(--color-navy)] flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[var(--color-teal)]" />
          Transaksi Terakhir
        </h3>
        <Button variant="ghost" className="text-sm font-bold text-[var(--color-teal)] hover:bg-[#E8DCC7]/30 hover:text-[var(--color-navy)] rounded-xl h-9">
          Lihat Semua
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((trx) => (
          <div key={trx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E8DCC7]/60 hover:border-[#E8DCC7] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--color-teal)]/20 to-[var(--color-navy)]/10 flex items-center justify-center font-bold text-[var(--color-navy)] shadow-sm group-hover:scale-105 transition-transform">
                {trx.game.substring(0, 1)}
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-navy)] text-sm">{trx.game}</h4>
                <p className="text-[11px] font-medium text-[var(--color-navy)]/50 mt-0.5">{trx.product} &bull; {trx.date}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold text-sm text-[var(--color-navy)]">
                -Rp {trx.amount.toLocaleString("id-ID")}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                trx.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" :
                trx.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {trx.status === "SUCCESS" ? "BERHASIL" : trx.status === "PENDING" ? "PENDING" : "GAGAL"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
