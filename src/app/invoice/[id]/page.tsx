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
  Loader2,
  Gamepad2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";

type InvoiceStatus = "pending" | "paid" | "processing" | "success" | "failed";

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

const statusConfig: Record<InvoiceStatus, { label: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Menunggu Pembayaran", bg: "bg-[var(--color-gold)]", icon: Clock },
  paid: { label: "Pembayaran Diterima", bg: "bg-blue-400", icon: CheckCircle2 },
  processing: { label: "Sedang Diproses", bg: "bg-[var(--color-teal)]", icon: Loader2 },
  success: { label: "Transaksi Berhasil", bg: "bg-green-500", icon: CheckCircle2 },
  failed: { label: "Transaksi Gagal", bg: "bg-red-400", icon: AlertCircle },
};

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
    payment: "QRIS",
    paymentCode: "QRIS-8810-0812",
    status: "pending",
    createdAt: new Date().toISOString(),
    expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });

  const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>("pending");

  /* Simulate Status Changes */
  useEffect(() => {
    const statuses: InvoiceStatus[] = ["pending", "paid", "processing", "success"];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < statuses.length) {
        setCurrentStatus(statuses[i]);
      } else {
        clearInterval(interval);
      }
    }, 4000); // changes every 4s for demo
    return () => clearInterval(interval);
  }, []);

  /* Confetti Animation on Success */
  useEffect(() => {
    if (currentStatus === "success") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        if ((window as any).confetti) {
          (window as any).confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0B1D34', '#073B4C', '#F7C873', '#F5EEDC']
          });
        }
      };
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [currentStatus]);

  const StatusIcon = statusConfig[currentStatus].icon;
  const statusBg = statusConfig[currentStatus].bg;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] texture-overlay pt-24 pb-32 lg:pb-16 font-sans">
      <div className="mx-auto max-w-xl px-4 sm:px-6 relative z-10">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-[var(--color-navy)]/60 font-medium">
          <Link href="/" className="hover:text-[var(--color-teal)] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[var(--color-navy)]">Invoice {invoice.id}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Status Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
            {/* Top color bar matching status */}
            <div className={cn("absolute top-0 left-0 right-0 h-2 transition-colors duration-500", statusBg)} />
            
            <motion.div
              key={currentStatus}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 text-white transition-colors duration-500 shadow-lg",
                statusBg
              )}
            >
              <StatusIcon className={cn("h-8 w-8", currentStatus === "processing" && "animate-spin")} />
            </motion.div>
            
            <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)] mb-1">
              {statusConfig[currentStatus].label}
            </h1>
            <p className="text-sm text-gray-500 font-mono">#{invoice.id}</p>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Detail Pesanan</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-teal)]/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-6 h-6 text-[var(--color-teal)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-navy)]">{invoice.game}</h3>
                  <p className="text-sm text-[var(--color-teal)] font-medium">{invoice.product}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500">User ID</span>
                <div className="text-right">
                  <span className="block font-bold text-[var(--color-navy)]">{invoice.userId}</span>
                  <span className="text-xs text-green-500 font-medium">{invoice.nickname}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-bold text-[var(--color-navy)] uppercase">{invoice.payment}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-500">Waktu Transaksi</span>
                <span className="font-medium text-[var(--color-navy)]">
                  {new Date(invoice.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Harga Item</span>
                  <span className="font-medium text-[var(--color-navy)]">{formatCurrency(invoice.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Biaya Layanan</span>
                  <span className="font-medium text-[var(--color-navy)]">{formatCurrency(invoice.fee)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-bold text-[var(--color-navy)]">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-[var(--color-teal)] tabular-nums">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200 text-[var(--color-navy)] hover:bg-gray-50 font-bold"
              onClick={() => handleCopy(invoice.id)}
            >
              <Copy className="w-4 h-4 mr-2" /> Salin Invoice
            </Button>
            
            {currentStatus === "failed" ? (
              <Button className="flex-1 h-12 rounded-xl bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold" asChild>
                <Link href="/games/mobile-legends"><RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi</Link>
              </Button>
            ) : (
              <Button className="flex-1 h-12 rounded-xl bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold" asChild>
                <Link href="/games">Beli Game Lain</Link>
              </Button>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
