"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldAlert,
  UserX,
  TrendingDown,
  Activity,
  AlertTriangle,
  Bot,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data from AI Brain
const SECURITY_ALERTS = [
  { id: "SEC-901", user: "budi_gaming", reason: "High Velocity (5 tx/min)", score: 92, time: "2 mins ago" },
  { id: "SEC-902", user: "anon_8821", reason: "Suspicious IP Anomaly", score: 85, time: "15 mins ago" },
];

const CHURN_RADAR = [
  { id: "USR-104", user: "siti_savage", lastTx: "18 days ago", action: "10% Promo Minted", status: "Auto-Sent" },
  { id: "USR-992", user: "joko_pro", lastTx: "21 days ago", action: "15% Promo Minted", status: "Auto-Sent" },
  { id: "USR-115", user: "ayu_healer", lastTx: "15 days ago", action: "Push Notification", status: "Pending" },
];

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          AI Insights <Badge variant="glow" className="bg-purple-500/10 text-purple-400 border-purple-500/50">BETA</Badge>
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Real-time security intelligence and churn prediction radar.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ecosystem Health</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">98.2%</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Platform is stable</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked by AI</CardTitle>
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">14</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">In the last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Churners</CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">89</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">&gt; 14 days without topup</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retention Auto-Promos</CardTitle>
              <Bot className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">45</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Promo codes minted today</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Security Alerts Feed */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="col-span-1 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Live Security Alerts
              </CardTitle>
              <CardDescription>
                Transactions automatically blocked by the AI Risk Engine.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SECURITY_ALERTS.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between p-4 border border-red-500/10 rounded-lg bg-red-500/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{alert.user}</span>
                        <Badge variant="outline" className="text-red-400 border-red-500/30">Score: {alert.score}</Badge>
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{alert.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{alert.time}</p>
                      <Button variant="ghost" size="sm" className="h-8 mt-1 text-red-400 hover:text-red-300">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Churn Radar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card className="col-span-1 border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                Churn Radar
              </CardTitle>
              <CardDescription>
                Users flagged for high churn risk and automated retention actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CHURN_RADAR.map((radar) => (
                  <div key={radar.id} className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <UserX className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{radar.user}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Last purchase: {radar.lastTx}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-400 flex items-center gap-1 justify-end">
                        <Zap className="h-3 w-3" /> {radar.action}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{radar.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
