import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function RevenueChartWidget({ chartData }: { chartData: any[] }) {
  return (
    <Card className="h-full border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="border-b border-gray-50 bg-white/50 px-6 py-5">
        <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#888" }} 
              tickFormatter={(value) => `Rp ${value / 1000000}M`}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), "Revenue"]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--color-teal)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "var(--color-teal)", strokeWidth: 0 }} 
              activeDot={{ r: 6, fill: "var(--color-navy)" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
