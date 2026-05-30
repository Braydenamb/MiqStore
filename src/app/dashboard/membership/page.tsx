"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Star,
  Gift,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Bronze",
    icon: "🥉",
    color: "from-amber-700 to-amber-900",
    borderColor: "border-amber-700/50",
    pointsRequired: 0,
    cashback: 0,
    discount: 0,
    benefits: ["Akses semua produk", "Riwayat transaksi"],
  },
  {
    name: "Silver",
    icon: "🥈",
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-400/50",
    pointsRequired: 500,
    cashback: 2,
    discount: 3,
    benefits: [
      "Semua benefit Bronze",
      "Cashback 2%",
      "Diskon member 3%",
      "Akses promo eksklusif",
    ],
  },
  {
    name: "Gold",
    icon: "⭐",
    color: "from-amber-400 to-yellow-600",
    borderColor: "border-amber-400/50",
    pointsRequired: 1500,
    cashback: 5,
    discount: 7,
    current: true,
    benefits: [
      "Semua benefit Silver",
      "Cashback 5%",
      "Diskon member 7%",
      "Priority support",
      "Voucher bulanan",
    ],
  },
  {
    name: "Diamond",
    icon: "💎",
    color: "from-cyan-400 to-blue-600",
    borderColor: "border-cyan-400/50",
    pointsRequired: 3000,
    cashback: 10,
    discount: 15,
    benefits: [
      "Semua benefit Gold",
      "Cashback 10%",
      "Diskon member 15%",
      "Dedicated account manager",
      "Early access produk baru",
      "Free ongkir voucher",
    ],
  },
];

export default function MembershipPage() {
  const currentPoints = 1250;
  const currentTier = tiers.find((t) => t.current)!;
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.pointsRequired) /
        (nextTier.pointsRequired - currentTier.pointsRequired)) *
      100
    : 100;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Membership
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Level dan benefit membership kamu
        </p>
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{currentTier.icon}</span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {currentTier.name} Member
                  </h2>
                </div>
                <p className="text-sm text-white/80">
                  {currentPoints.toLocaleString()} poin reward
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  Cashback {currentTier.cashback}%
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  Diskon {currentTier.discount}%
                </Badge>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                  <span>
                    {currentTier.icon} {currentTier.name}
                  </span>
                  <span>
                    {nextTier.icon} {nextTier.name} (
                    {nextTier.pointsRequired.toLocaleString()} poin)
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
                <p className="text-xs text-white/70 mt-2">
                  Butuh{" "}
                  {(nextTier.pointsRequired - currentPoints).toLocaleString()}{" "}
                  poin lagi untuk upgrade ke {nextTier.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Poin",
            value: "1,250",
            icon: Star,
            color: "text-amber-400",
          },
          {
            label: "Cashback Didapat",
            value: formatCurrency(245000),
            icon: Gift,
            color: "text-green-400",
          },
          {
            label: "Hemat Diskon",
            value: formatCurrency(180000),
            icon: TrendingUp,
            color: "text-cyan-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold mb-4">Semua Level Membership</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tiers.map((tier, i) => (
            <Card
              key={tier.name}
              className={cn(
                "relative overflow-hidden",
                tier.current && "ring-2 ring-amber-400"
              )}
            >
              {tier.current && (
                <Badge className="absolute right-3 top-3 bg-amber-500 text-white">
                  Level Saat Ini
                </Badge>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <CardTitle className="text-base">{tier.name}</CardTitle>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {tier.pointsRequired.toLocaleString()} poin
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <Badge variant="outline" className="text-[10px]">
                    Cashback {tier.cashback}%
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Diskon {tier.discount}%
                  </Badge>
                </div>
                <Separator />
                <ul className="space-y-1.5">
                  {tier.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
