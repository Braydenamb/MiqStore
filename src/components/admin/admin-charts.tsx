"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber } from "@/lib/utils";
import { Activity, BarChart3 } from "lucide-react";
import { linearRegressionForecast } from "@/lib/forecasting";

interface AdminChartsProps {
  historicalRevenue: number[];
}

export default function AdminCharts({ historicalRevenue }: AdminChartsProps) {
  const forecastedRevenue = historicalRevenue.some((val: number) => val > 0) ? linearRegressionForecast(historicalRevenue, 3) : [0,0,0];
  const maxRevenue = Math.max(...historicalRevenue, ...forecastedRevenue, 1);

  const revenueData = [
    { day: "Sen", value: historicalRevenue[0], pct: (historicalRevenue[0] / maxRevenue) * 100, isForecast: false },
    { day: "Sel", value: historicalRevenue[1], pct: (historicalRevenue[1] / maxRevenue) * 100, isForecast: false },
    { day: "Rab", value: historicalRevenue[2], pct: (historicalRevenue[2] / maxRevenue) * 100, isForecast: false },
    { day: "Kam", value: historicalRevenue[3], pct: (historicalRevenue[3] / maxRevenue) * 100, isForecast: false },
    { day: "Jum", value: historicalRevenue[4], pct: (historicalRevenue[4] / maxRevenue) * 100, isForecast: false },
    { day: "Sab", value: historicalRevenue[5], pct: (historicalRevenue[5] / maxRevenue) * 100, isForecast: false },
    { day: "Min", value: historicalRevenue[6], pct: (historicalRevenue[6] / maxRevenue) * 100, isForecast: false },
    { day: "+1", value: forecastedRevenue[0], pct: (forecastedRevenue[0] / maxRevenue) * 100, isForecast: true },
    { day: "+2", value: forecastedRevenue[1], pct: (forecastedRevenue[1] / maxRevenue) * 100, isForecast: true },
    { day: "+3", value: forecastedRevenue[2], pct: (forecastedRevenue[2] / maxRevenue) * 100, isForecast: true },
  ];

  const hourlyTraffic = [
    { hour: "00", val: 12 }, { hour: "03", val: 5 }, { hour: "06", val: 8 },
    { hour: "09", val: 28 }, { hour: "12", val: 45 }, { hour: "15", val: 62 },
    { hour: "18", val: 85 }, { hour: "19", val: 100 }, { hour: "20", val: 95 },
    { hour: "21", val: 88 }, { hour: "22", val: 65 }, { hour: "23", val: 35 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-white/5 bg-[hsl(var(--card))]/40 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-[100px] bg-[var(--liquid-purple)]/20 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[var(--liquid-purple)]" />
                Revenue Forecast (AI)
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-[var(--liquid-cyan)]/30 text-[var(--liquid-cyan)] bg-[var(--liquid-cyan)]/5">
                <Activity className="h-3 w-3 mr-1" /> Model Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48 pt-4">
              {revenueData.map((d: any, i: number) => (
                <div key={d.day} className={`flex-1 flex flex-col items-center gap-2 ${d.isForecast ? 'opacity-80' : ''}`}>
                  <span className={`text-[10px] font-medium ${d.isForecast ? 'text-[var(--liquid-cyan)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {formatCompactNumber(d.value / 1000000)}M
                  </span>
                  <motion.div
                    className={`w-full rounded-xl relative overflow-hidden ${d.isForecast ? 'border-2 border-dashed border-[var(--liquid-cyan)]/50' : ''}`}
                    style={{
                      background: d.isForecast 
                        ? `linear-gradient(180deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.05) 100%)`
                        : i === 6 
                        ? `linear-gradient(180deg, var(--liquid-purple) 0%, var(--liquid-blue) 100%)`
                        : `linear-gradient(180deg, rgba(192,132,252,0.3) 0%, rgba(125,211,252,0.15) 100%)`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${d.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {i === 6 && <div className="absolute inset-0 animate-shine" />}
                  </motion.div>
                  <span className={`text-[10px] font-medium ${d.isForecast ? 'text-[var(--liquid-cyan)]' : i === 6 ? "text-[var(--liquid-purple)]" : "text-[hsl(var(--muted-foreground))]"}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="h-full border-white/5 bg-[hsl(var(--card))]/40 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[100px] bg-[var(--liquid-cyan)]/20 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--liquid-cyan)]" />
              Traffic Jam Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hourlyTraffic.map((h: any) => (
                <div key={h.hour} className="flex items-center gap-2">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))] w-8 shrink-0 tabular-nums">
                    {h.hour}:00
                  </span>
                  <div className="flex-1 h-5 rounded-lg bg-[hsl(var(--muted))] overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg"
                      style={{
                        background: h.val > 80
                          ? `linear-gradient(90deg, var(--liquid-purple), var(--liquid-pink))`
                          : h.val > 50
                          ? `linear-gradient(90deg, var(--liquid-blue), var(--liquid-cyan))`
                          : `rgba(125,211,252,0.25)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${h.val}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))] w-6 text-right tabular-nums">
                    {h.val}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[var(--liquid-purple)]" /> Peak
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[var(--liquid-blue)]" /> Moderate
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[rgba(125,211,252,0.3)]" /> Low
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
