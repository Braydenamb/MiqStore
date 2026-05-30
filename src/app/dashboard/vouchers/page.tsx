"use client";

import { motion } from "framer-motion";
import { Ticket, Copy, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

const vouchers = [
  {
    id: "v1",
    code: "MIQ10",
    name: "Diskon 10% Semua Game",
    description: "Berlaku untuk semua produk game",
    discount: "10%",
    minPurchase: 50000,
    maxDiscount: 50000,
    expiresAt: "2026-06-30",
    isUsed: false,
  },
  {
    id: "v2",
    code: "FLASHSALE",
    name: "Flash Sale Spesial",
    description: "Diskon 15% untuk Mobile Legends",
    discount: "15%",
    minPurchase: 30000,
    maxDiscount: 30000,
    expiresAt: "2026-06-15",
    isUsed: false,
  },
  {
    id: "v3",
    code: "GOLDMEMBER",
    name: "Bonus Gold Member",
    description: "Cashback ekstra 5% khusus Gold Member",
    discount: "5%",
    minPurchase: 0,
    maxDiscount: 25000,
    expiresAt: "2026-07-01",
    isUsed: false,
  },
  {
    id: "v4",
    code: "WELCOME50",
    name: "Welcome Bonus",
    description: "Diskon Rp5.000 untuk transaksi pertama",
    discount: "Rp5.000",
    minPurchase: 20000,
    maxDiscount: 5000,
    expiresAt: "2026-05-01",
    isUsed: true,
  },
];

export default function VouchersPage() {
  const activeVouchers = vouchers.filter((v) => !v.isUsed);
  const usedVouchers = vouchers.filter((v) => v.isUsed);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Voucher Saya
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {activeVouchers.length} voucher aktif tersedia
        </p>
      </motion.div>

      {/* Active Vouchers */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Ticket className="h-4 w-4 text-purple-400" />
          Voucher Aktif
        </h2>
        {activeVouchers.map((voucher, i) => (
          <motion.div
            key={voucher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden">
              {/* Left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500" />
              <CardContent className="p-4 pl-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold">{voucher.name}</h3>
                      <Badge variant="glow" className="text-[10px]">
                        {voucher.discount}
                      </Badge>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                      {voucher.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <span>
                        Min. {formatCurrency(voucher.minPurchase)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        s/d {new Date(voucher.expiresAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-purple-500/50 bg-purple-500/5 px-3 py-2">
                      <code className="text-xs font-mono font-bold text-purple-400">
                        {voucher.code}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => copyCode(voucher.code)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Used Vouchers */}
      {usedVouchers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Sudah Digunakan
          </h2>
          {usedVouchers.map((voucher) => (
            <Card key={voucher.id} className="opacity-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium line-through">
                      {voucher.name}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {voucher.code}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Terpakai
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
