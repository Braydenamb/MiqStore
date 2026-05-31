"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Gamepad2,
  QrCode,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

type InvoiceStatus = "pending" | "paid" | "processing" | "success" | "failed" | "expired";

interface InvoiceData {
  id: string;
  game: string;
  product: string;
  userId: string;
  nickname: string;
  price: number;
  fee: number;
  total: number;
  payment: string;
  paymentCode: string;
  status: InvoiceStatus;
  createdAt: string;
  expiredAt: string;
}

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; icon: React.ElementType; badgeVariant: "success" | "warning" | "default" | "destructive" | "secondary" }
> = {
  pending: { label: "Menunggu Pembayaran", color: "text-amber-400", icon: Clock, badgeVariant: "warning" },
  paid: { label: "Pembayaran Diterima", color: "text-blue-400", icon: CheckCircle2, badgeVariant: "secondary" },
  processing: { label: "Sedang Diproses", color: "text-cyan-400", icon: Loader2, badgeVariant: "secondary" },
  success: { label: "Berhasil", color: "text-green-400", icon: CheckCircle2, badgeVariant: "success" },
  failed: { label: "Gagal", color: "text-red-400", icon: AlertCircle, badgeVariant: "destructive" },
  expired: { label: "Kadaluarsa", color: "text-gray-400", icon: AlertCircle, badgeVariant: "destructive" },
};

const timeline: { status: InvoiceStatus; label: string }[] = [
  { status: "pending", label: "Pesanan Dibuat" },
  { status: "paid", label: "Pembayaran Diterima" },
  { status: "processing", label: "Diproses Provider" },
  { status: "success", label: "Selesai" },
];

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  /* Mock invoice data */
  const [invoice] = useState<InvoiceData>({
    id: invoiceId || "INV-DEMO",
    game: "Mobile Legends",
    product: "344 Diamonds",
    userId: "123456789",
    nickname: "Player★6789",
    price: 68000,
    fee: 4000,
    total: 72000,
    payment: "BCA Virtual Account",
    paymentCode: "8810 0812 3456 7890",
    status: "pending",
    createdAt: new Date().toISOString(),
    expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  /* Countdown timer */
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(invoice.expiredAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setCountdown("00:00:00");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [invoice.expiredAt]);

  /* Simulate status progression */
  const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>("pending");
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStatus("paid"), 5000),
      setTimeout(() => setCurrentStatus("processing"), 8000),
      setTimeout(() => setCurrentStatus("success"), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const StatusIcon = statusConfig[currentStatus].icon;
  const currentStepIndex = timeline.findIndex((t) => t.status === currentStatus);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"
        >
          <Link href="/" className="hover:text-[var(--liquid-purple)] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[hsl(var(--foreground))] font-medium">Invoice</span>
        </motion.div>

        {/* Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <motion.div
            key={currentStatus}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "inline-flex h-16 w-16 items-center justify-center rounded-full mb-4",
              currentStatus === "success"
                ? "bg-green-500/20"
                : currentStatus === "failed" || currentStatus === "expired"
                  ? "bg-red-500/20"
                  : "bg-amber-500/20"
            )}
          >
            <StatusIcon
              className={cn(
                "h-8 w-8",
                statusConfig[currentStatus].color,
                currentStatus === "processing" && "animate-spin"
              )}
            />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
            {statusConfig[currentStatus].label}
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Invoice #{invoice.id}
          </p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {timeline.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isActive = i === currentStepIndex;

                  return (
                    <div key={step.status} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: isActive ? [1, 1.1, 1] : 1,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: isActive ? Infinity : 0,
                          }}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                            isCompleted
                              ? "bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white shadow-lg shadow-purple-500/20"
                              : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            i + 1
                          )}
                        </motion.div>
                        <span
                          className={cn(
                            "mt-2 text-[10px] sm:text-xs text-center max-w-[70px] sm:max-w-none",
                            isCompleted
                              ? "text-[hsl(var(--foreground))] font-medium"
                              : "text-[hsl(var(--muted-foreground))]"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < timeline.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                            i < currentStepIndex
                              ? "bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)]"
                              : "bg-[hsl(var(--muted))]"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detail Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStatus === "pending" && (
                  <>
                    {/* Countdown */}
                    <div className="rounded-xl bg-[var(--liquid-amber)]/10 border border-[var(--liquid-amber)]/20 p-4 text-center">
                      <p className="text-xs text-[var(--liquid-amber)] mb-1">
                        Bayar sebelum
                      </p>
                      <p className="text-2xl font-mono font-bold text-[var(--liquid-amber)] tabular-nums">
                        {countdown}
                      </p>
                    </div>

                    {/* Payment Code */}
                    <div className="space-y-2">
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {invoice.payment}
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] p-3">
                        <p className="flex-1 text-lg font-mono font-bold text-[hsl(var(--foreground))] tracking-wider">
                          {invoice.paymentCode}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(invoice.paymentCode)}
                          className="shrink-0"
                          aria-label="Copy payment code"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[hsl(var(--border))] p-6">
                      <QrCode className="h-24 w-24 text-[hsl(var(--muted-foreground))]" />
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Scan QRIS untuk bayar
                      </p>
                    </div>
                  </>
                )}

                {/* Price breakdown */}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Harga</span>
                    <span>{formatCurrency(invoice.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Biaya layanan</span>
                    <span>{formatCurrency(invoice.fee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="gradient-text">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--liquid-blue)]/15">
                    <Gamepad2 className="h-5 w-5 text-[var(--liquid-blue)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{invoice.game}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {invoice.product}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">User ID</span>
                    <span className="font-mono">{invoice.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Nickname</span>
                    <span className="text-green-400">{invoice.nickname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Status</span>
                    <Badge variant={statusConfig[currentStatus].badgeVariant}>
                      {statusConfig[currentStatus].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Invoice</span>
                    <span className="font-mono text-xs">{invoice.id}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href="/games">
                      Beli Lagi
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
