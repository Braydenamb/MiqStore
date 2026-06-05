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
    <Card className="h-full border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-gray-50 bg-white/50 px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-50">
          {topProducts.map((product, idx) => (
            <div key={product.id} className="p-4 sm:px-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center font-bold text-gray-400 text-sm">
                #{idx + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--color-navy)] truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} sales</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[var(--color-teal)] text-sm">{formatCurrency(product.revenue)}</p>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">No sales data available.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
