"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const revenueData = [
  { name: "Mon", revenue: 4000000 },
  { name: "Tue", revenue: 3000000 },
  { name: "Wed", revenue: 5000000 },
  { name: "Thu", revenue: 2780000 },
  { name: "Fri", revenue: 6890000 },
  { name: "Sat", revenue: 8390000 },
  { name: "Sun", revenue: 9490000 },
];

const topGamesData = [
  { name: "Mobile Legends", value: 45 },
  { name: "Free Fire", value: 25 },
  { name: "Valorant", value: 15 },
  { name: "Genshin", value: 10 },
  { name: "Others", value: 5 },
];

const COLORS = ["#073B4C", "#0E7490", "#E3B35A", "#EFE3CD", "#A1A1AA"];

const paymentMethodsData = [
  { name: "QRIS", users: 400 },
  { name: "GoPay", users: 300 },
  { name: "OVO", users: 200 },
  { name: "ShopeePay", users: 150 },
  { name: "BCA VA", users: 100 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Review your store's performance and transaction statistics.</p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6B7280' }} 
                      tickFormatter={(value) => `Rp${value / 1000000}M`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-teal)" strokeWidth={4} dot={{ r: 4, fill: "var(--color-teal)", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Top Games Sales</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topGamesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {topGamesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-[var(--color-navy)]">100%</span>
                  <span className="text-xs text-gray-400">Total Sales</span>
                </div>
              </div>
              <div className="w-full mt-4 space-y-2">
                {topGamesData.slice(0, 3).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-gray-600 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-[var(--color-navy)]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[var(--color-navy)]">Payment Methods Popularity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethodsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                    />
                    <Bar dataKey="users" fill="var(--color-gold)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
