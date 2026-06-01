"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { TrendingUp, Gamepad2 } from "lucide-react";

const statusColors: Record<string, string> = {
  success: "bg-green-500/15 text-green-400",
  processing: "bg-[var(--liquid-cyan)]/15 text-[var(--liquid-cyan)]",
  pending: "bg-[var(--liquid-amber)]/15 text-[var(--liquid-amber)]",
  failed: "bg-red-500/15 text-red-400",
};

interface AdminRecentProps {
  recentOrders: any[];
  topProducts: any[];
}

export function AdminRecent({ recentOrders, topProducts }: AdminRecentProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
              <Badge variant="outline" className="text-[10px] gap-1 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--liquid-purple)]/10 shrink-0">
                    <Gamepad2 className="h-4 w-4 text-[var(--liquid-purple)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{order.game}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {order.user} • {order.product} • {order.time}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0 tabular-nums">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--liquid-blue)]" />
              Top Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product: any, i: number) => {
                const maxSales = topProducts[0]?.sales || 1;
                const percentage = (product.sales / maxSales) * 100;

                return (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                          style={{ background: product.color }}
                        >
                          {i + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
                        {formatCompactNumber(product.sales)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${product.color}, ${product.color}88)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
