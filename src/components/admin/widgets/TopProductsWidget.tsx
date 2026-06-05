import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

type TopProduct = {
  id: string;
  name: string;
  image: string | null;
  sales: number;
  revenue: number;
};

export function TopProductsWidget({ topProducts }: { topProducts: TopProduct[] }) {
  return (
    <Card className="h-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[hsl(var(--foreground))]">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-[hsl(var(--border))]">
          {topProducts.map((product, idx) => (
            <div key={product.id} className="p-4 sm:px-6 flex items-center gap-4 hover:bg-[hsl(var(--secondary))] transition-colors">
              <div className="w-6 h-6 flex items-center justify-center font-bold text-[hsl(var(--foreground))]/40 text-sm">
                #{idx + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--secondary))] overflow-hidden relative flex-shrink-0">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[hsl(var(--muted))]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[hsl(var(--foreground))] truncate">{product.name}</p>
                <p className="text-xs text-[hsl(var(--foreground))]/60">{product.sales} sales</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[hsl(var(--primary))] text-sm">{formatCurrency(product.revenue)}</p>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <div className="p-6 text-center text-[hsl(var(--foreground))]/50 text-sm">No sales data available.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
