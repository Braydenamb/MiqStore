import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-[var(--color-gold)]/20 text-[var(--color-navy)] border-[var(--color-gold)]",
  processing: "bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/30",
  failed: "bg-red-100 text-red-700 border-red-200",
};

export type RecentOrder = {
  id: string;
  user: string;
  game: string;
  product: string;
  total: number;
  status: string;
  date: string;
};

export function RecentOrdersWidget({ recentOrders }: { recentOrders: RecentOrder[] }) {
  return (
    <Card className="h-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-5 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold font-heading text-[hsl(var(--foreground))]">Recent Orders</CardTitle>
        <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg hidden sm:flex" asChild>
          <Link href="/admin/orders">
            View All <ArrowUpRight className="ml-1 w-3 h-3" />
          </Link>
        </Button>
      </CardHeader>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]/60 font-medium border-b border-[hsl(var(--border))]">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Invoice ID</th>
              <th className="px-6 py-4 whitespace-nowrap">Customer</th>
              <th className="px-6 py-4 whitespace-nowrap">Product</th>
              <th className="px-6 py-4 whitespace-nowrap">Amount</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
            {recentOrders.map((order: RecentOrder) => (
              <tr key={order.id} className="hover:bg-[hsl(var(--secondary))] transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[hsl(var(--foreground))] whitespace-nowrap">
                  {order.id}
                  <div className="text-[10px] text-[hsl(var(--foreground))]/40 font-sans font-normal mt-0.5">{order.date}</div>
                </td>
                <td className="px-6 py-4 font-medium text-[hsl(var(--foreground))] whitespace-nowrap">
                  {order.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-bold text-[hsl(var(--foreground))]">{order.game}</p>
                  <p className="text-xs text-[hsl(var(--foreground))]/50">{order.product}</p>
                </td>
                <td className="px-6 py-4 font-bold text-[var(--color-teal)] whitespace-nowrap">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={cn("border font-bold uppercase tracking-wider text-[10px] px-2 py-0.5", statusStyles[order.status])}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(var(--foreground))]/40 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] rounded-lg">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
