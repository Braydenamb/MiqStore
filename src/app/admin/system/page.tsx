"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Terminal, 
  Database, 
  Cpu,
  BarChart,
  Server,
  Play,
  Square
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data representing Prometheus/Loki responses
const MOCK_METRICS = [
  { name: "transaction_created", value: 1432, type: "counter" },
  { name: "topup_success_apigames", value: 890, type: "counter" },
  { name: "topup_success_digiflazz", value: 420, type: "counter" },
  { name: "fraud_blocks", value: 14, type: "counter" },
  { name: "route_topup_order_duration_ms", value: 450, type: "gauge", unit: "ms" },
];

const MOCK_LOGS = [
  `{"timestamp":"2026-05-31T15:01:22.000Z","level":"INFO","message":"Initiating Smart Route for INV-48A9B"}`,
  `{"timestamp":"2026-05-31T15:01:22.150Z","level":"INFO","message":"Provider selected!","provider":"Apigames","latency":250,"price":9600}`,
  `{"timestamp":"2026-05-31T15:01:23.850Z","level":"INFO","message":"[Trace End] route_topup_order","durationMs":850,"status":"success"}`,
  `{"timestamp":"2026-05-31T15:04:10.000Z","level":"WARN","message":"Transaction blocked for user USR-889 by AI Risk Engine","fraudScore":92,"reasons":["High Velocity: 5 transactions in 10 mins"]}`,
];

export default function SystemHealthPage() {
  const [isStreaming, setIsStreaming] = useState(true);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          System Observability <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">All Systems Operational</Badge>
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Live Prometheus metrics and Loki structured log streams.
        </p>
      </motion.div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-[var(--liquid-cyan)]" /> 
                  Prometheus Counters
                </CardTitle>
                <CardDescription>Live aggregation of telemetry metrics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_METRICS.map((metric) => (
                  <div key={metric.name} className="flex flex-col gap-1 border-b border-[hsl(var(--border))] pb-3 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{metric.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase bg-black/50">{metric.type}</Badge>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {metric.value.toLocaleString()} {metric.unit && <span className="text-sm text-[hsl(var(--muted-foreground))] font-normal">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-400" /> 
                  Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2"><Cpu className="h-4 w-4 text-blue-400"/> CPU Usage</span>
                  <span className="font-bold">24%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2"><Database className="h-4 w-4 text-green-400"/> Database (Prisma)</span>
                  <span className="font-bold text-green-400">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-orange-400"/> Mem Usage</span>
                  <span className="font-bold">412 MB</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Log Stream */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <Card className="h-full border-[hsl(var(--border))] bg-[#0A0A0A] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-white/10 bg-black/40 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 font-mono">
                    <Terminal className="h-5 w-5 text-gray-400" /> 
                    Live Log Stream (Loki)
                  </CardTitle>
                  <CardDescription>Tail: /var/log/miqstore/app.log</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`h-8 gap-1 ${isStreaming ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : "border-red-500/50 text-red-400 hover:bg-red-500/10"}`}
                  onClick={() => setIsStreaming(!isStreaming)}
                >
                  {isStreaming ? <><Square className="h-3 w-3" /> Stop Tail</> : <><Play className="h-3 w-3" /> Resume</>}
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative min-h-[400px]">
                <div className="absolute inset-0 p-4 font-mono text-[11px] sm:text-xs overflow-y-auto space-y-2">
                  {MOCK_LOGS.map((log, i) => {
                    const parsed = JSON.parse(log);
                    const isError = parsed.level === "ERROR";
                    const isWarn = parsed.level === "WARN";
                    
                    return (
                      <div key={i} className={`p-2 rounded border ${isError ? 'border-red-500/30 bg-red-500/5 text-red-300' : isWarn ? 'border-orange-500/30 bg-orange-500/5 text-orange-300' : 'border-white/5 bg-white/5 text-gray-300'}`}>
                        <div className="flex flex-wrap gap-2 mb-1">
                          <span className="text-gray-500">{parsed.timestamp}</span>
                          <span className={`font-bold ${isError ? 'text-red-400' : isWarn ? 'text-orange-400' : 'text-[var(--liquid-cyan)]'}`}>
                            [{parsed.level}]
                          </span>
                        </div>
                        <p className="text-white mb-2">{parsed.message}</p>
                        
                        {/* Context Data */}
                        {Object.keys(parsed).filter(k => !['timestamp','level','message'].includes(k)).length > 0 && (
                          <div className="pl-4 border-l-2 border-white/10 text-gray-400 mt-1">
                            {Object.entries(parsed)
                              .filter(([k]) => !['timestamp','level','message'].includes(k))
                              .map(([k, v]) => (
                                <div key={k}>
                                  <span className="text-gray-500">{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {isStreaming && (
                    <div className="flex items-center gap-2 text-gray-500 p-2 mt-4">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Waiting for new logs...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
