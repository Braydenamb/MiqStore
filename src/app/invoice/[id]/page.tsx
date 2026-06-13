"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  AlertCircle,
  Loader2,
  Gamepad2,
  ChevronRight,
  RefreshCw,
  XCircle,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Types ─── */
type InvoiceStatus = "pending" | "paid" | "processing" | "success" | "failed" | "expired" | "refunded";

interface InvoiceData {
  id: string;
  game: string;
  gameSlug: string;
  product: string;
  gameUserId: string;
  gameZoneId: string;
  price: number;
  fee: number;
  discount: number;
  total: number;
  payment: string;
  paymentGateway: string;
  status: InvoiceStatus;
  providerRef: string | null;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
}

/* ─── Status Config ─── */
const statusConfig: Record<InvoiceStatus, { label: string; bg: string; icon: React.ElementType; description: string }> = {
  pending: {
    label: "Menunggu Pembayaran",
    bg: "bg-amber-500",
    icon: Clock,
    description: "Selesaikan pembayaran sebelum waktu habis.",
  },
  paid: {
    label: "Pembayaran Diterima",
    bg: "bg-blue-500",
    icon: CheckCircle2,
    description: "Pembayaran berhasil, sedang diproses.",
  },
  processing: {
    label: "Sedang Diproses",
    bg: "bg-[hsl(var(--primary))]",
    icon: Loader2,
    description: "Top up sedang diproses oleh sistem.",
  },
  success: {
    label: "Transaksi Berhasil",
    bg: "bg-emerald-500",
    icon: CheckCircle2,
    description: "Top up berhasil! Item sudah masuk ke akun game kamu.",
  },
  failed: {
    label: "Transaksi Gagal",
    bg: "bg-red-500",
    icon: XCircle,
    description: "Transaksi gagal. Dana akan dikembalikan dalam 1x24 jam.",
  },
  expired: {
    label: "Pesanan Kedaluwarsa",
    bg: "bg-gray-500",
    icon: Timer,
    description: "Waktu pembayaran telah habis.",
  },
  refunded: {
    label: "Dana Dikembalikan",
    bg: "bg-orange-500",
    icon: RefreshCw,
    description: "Dana telah dikembalikan ke akun kamu.",
  },
};

const TERMINAL_STATUSES: InvoiceStatus[] = ["success", "failed", "expired", "refunded"];
const POLL_INTERVAL = 3000; // 3 seconds

/* ─── Countdown Timer Hook ─── */
function useCountdown(expiredAt: string | null) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!expiredAt) return;

    const calcRemaining = () => {
      const diff = new Date(expiredAt).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calcRemaining());
    const timer = setInterval(() => {
      const remaining = calcRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt]);

  if (timeLeft === null || timeLeft <= 0) return null;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");

  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

/* ─── Main Component ─── */
export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confettiFired, setConfettiFired] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ─── Fetch Invoice Data ─── */
  const fetchInvoice = useCallback(async (): Promise<InvoiceData | null> => {
    try {
      const res = await fetch(`/api/invoice/${invoiceId}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invoice tidak ditemukan");
      }

      return json.data as InvoiceData;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat invoice";
      setError(msg);
      return null;
    }
  }, [invoiceId]);

  /* ─── Initial Load ─── */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const data = await fetchInvoice();
      if (!cancelled) {
        setInvoice(data);
        setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [fetchInvoice]);

  /* ─── Polling for status updates ─── */
  useEffect(() => {
    if (!invoice || TERMINAL_STATUSES.includes(invoice.status)) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(async () => {
      const fresh = await fetchInvoice();
      if (fresh) {
        setInvoice(fresh);
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [invoice?.status, fetchInvoice]);

  /* ─── Confetti on success ─── */
  useEffect(() => {
    if (invoice?.status === "success" && !confettiFired) {
      setConfettiFired(true);
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        const confetti = (window as unknown as Record<string, unknown>).confetti as ((opts: Record<string, unknown>) => void) | undefined;
        if (confetti) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#0B1D34", "#073B4C", "#F7C873", "#F5EEDC"],
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [invoice?.status, confettiFired]);

  const countdown = useCountdown(invoice?.status === "pending" ? invoice.expiredAt : null);
  const currentStatus = invoice?.status || "pending";
  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  /* ─── Copy helper ─── */
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin!`);
  };

  /* ─── Manual Refresh ─── */
  const handleRefresh = async () => {
    const fresh = await fetchInvoice();
    if (fresh) {
      setInvoice(fresh);
      toast.info("Status diperbarui");
    }
  };

  /* ─── Cancel Invoice ─── */
  const handleCancel = async () => {
    if (!confirm("Apakah kamu yakin ingin membatalkan pesanan ini?")) return;
    
    try {
      const res = await fetch(`/api/invoice/${invoiceId}/cancel`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal membatalkan pesanan");
      
      toast.success("Pesanan berhasil dibatalkan");
      const fresh = await fetchInvoice();
      if (fresh) setInvoice(fresh);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  /* ─── Loading Skeleton ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay pt-24 pb-32 lg:pb-16 font-sans">
        <div className="mx-auto max-w-xl px-4 sm:px-6 relative z-10">
          <div className="mb-8 flex items-center justify-center gap-2 text-sm text-[hsl(var(--foreground))]/60 font-medium">
            <div className="h-4 w-12 bg-[hsl(var(--muted))] rounded animate-pulse" />
            <ChevronRight className="h-4 w-4" />
            <div className="h-4 w-32 bg-[hsl(var(--muted))] rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8 text-center animate-pulse">
              <div className="h-2 bg-[hsl(var(--muted))] absolute top-0 left-0 right-0 rounded-t-2xl" />
              <div className="h-16 w-16 rounded-full bg-[hsl(var(--muted))] mx-auto mb-4" />
              <div className="h-6 w-48 bg-[hsl(var(--muted))] rounded mx-auto mb-2" />
              <div className="h-4 w-32 bg-[hsl(var(--muted))] rounded mx-auto" />
            </div>
            <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-4 w-24 bg-[hsl(var(--muted))] rounded" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--muted))]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-[hsl(var(--muted))] rounded" />
                  <div className="h-3 w-24 bg-[hsl(var(--muted))] rounded" />
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-3 w-full bg-[hsl(var(--muted))]/50 rounded" />
                <div className="h-3 w-full bg-[hsl(var(--muted))]/50 rounded" />
                <div className="h-3 w-2/3 bg-[hsl(var(--muted))]/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay pt-24 pb-32 font-sans flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center glass-card p-8 rounded-2xl max-w-sm w-full mx-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold font-heading text-[hsl(var(--foreground))] mb-2">Invoice Tidak Ditemukan</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">{error || "Invoice ini tidak ada atau sudah dihapus."}</p>
          <Button asChild className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90">
            <Link href="/games">Kembali ke Katalog</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay pt-24 pb-32 lg:pb-16 font-sans">
      <div className="mx-auto max-w-xl px-4 sm:px-6 relative z-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-center gap-2 text-sm text-[hsl(var(--foreground))]/60 font-medium">
          <Link href="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="text-[hsl(var(--foreground))] truncate max-w-[200px]">Invoice {invoice.id}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* ─── Status Header Card ─── */}
          <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 right-0 h-2 transition-colors duration-500", config.bg)} />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatus}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={cn(
                  "inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 text-white transition-colors duration-500 shadow-lg",
                  config.bg
                )}
              >
                <StatusIcon className={cn("h-8 w-8", currentStatus === "processing" && "animate-spin")} />
              </motion.div>
            </AnimatePresence>

            <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))] mb-1">
              {config.label}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{config.description}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]/70 font-mono">#{invoice.id}</p>

            {/* Countdown for pending */}
            {currentStatus === "pending" && countdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200"
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold tabular-nums">{countdown}</span>
                <span className="text-xs">tersisa</span>
              </motion.div>
            )}

            {/* Processing indicator */}
            {currentStatus === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Memproses top up...</span>
              </motion.div>
            )}
          </div>

          {/* ─── Order Details Card ─── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 bg-[hsl(var(--card))]/50 border-b border-[hsl(var(--border))]/50">
              <h2 className="text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">Detail Pesanan</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <h3 className="font-bold text-[hsl(var(--foreground))]">{invoice.game}</h3>
                  <p className="text-sm text-[hsl(var(--primary))] font-medium">{invoice.product}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              {/* Game User ID */}
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--border))]/50">
                <span className="text-[hsl(var(--muted-foreground))]">User ID</span>
                <div className="text-right flex items-center gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))]">{invoice.gameUserId || "-"}</span>
                  {invoice.gameUserId && (
                    <button
                      onClick={() => handleCopy(invoice.gameUserId, "User ID")}
                      className="text-[hsl(var(--muted-foreground))]/60 hover:text-[hsl(var(--primary))] transition-colors"
                      aria-label="Copy User ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Zone ID */}
              {invoice.gameZoneId && (
                <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--border))]/50">
                  <span className="text-[hsl(var(--muted-foreground))]">Zone ID</span>
                  <span className="font-bold text-[hsl(var(--foreground))]">{invoice.gameZoneId}</span>
                </div>
              )}

              {/* Payment Method */}
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--border))]/50">
                <span className="text-[hsl(var(--muted-foreground))]">Metode Pembayaran</span>
                <span className="font-bold text-[hsl(var(--foreground))] uppercase">{invoice.payment}</span>
              </div>

              {/* Transaction Time */}
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--border))]/50">
                <span className="text-[hsl(var(--muted-foreground))]">Waktu Transaksi</span>
                <span className="font-medium text-[hsl(var(--foreground))]">
                  {new Date(invoice.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>

              {/* Provider Reference */}
              {invoice.providerRef && (
                <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--border))]/50">
                  <span className="text-[hsl(var(--muted-foreground))]">Ref. Provider</span>
                  <span className="font-mono text-xs text-[hsl(var(--primary))]">{invoice.providerRef}</span>
                </div>
              )}

              {/* Pricing */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--muted-foreground))]">Harga Item</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">{formatCurrency(invoice.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--muted-foreground))]">Biaya Layanan</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">
                    {invoice.fee === 0 ? "Gratis" : formatCurrency(invoice.fee)}
                  </span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[hsl(var(--muted-foreground))]">Diskon</span>
                    <span className="font-medium text-green-600">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-4 bg-[hsl(var(--muted))]/30 rounded-xl mt-3">
                  <span className="font-bold text-[hsl(var(--foreground))]">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-[hsl(var(--primary))] tabular-nums">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Copy Invoice ID */}
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 font-bold"
              onClick={() => handleCopy(invoice.id, "Invoice ID")}
            >
              <Copy className="w-4 h-4 mr-2" /> Salin Invoice
            </Button>
            
            {/* Refresh (only for non-terminal) */}
            {!isTerminal && (
              <Button
                variant="ghost"
                className="flex-1 h-12 rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 font-bold"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Status
              </Button>
            )}

            {/* CTA based on status */}
            {currentStatus === "failed" || currentStatus === "expired" ? (
              <Button
                className="flex-1 h-12 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white font-bold"
                asChild
              >
                <Link href={invoice.gameSlug ? `/games/${invoice.gameSlug}` : "/games"}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
                </Link>
              </Button>
            ) : currentStatus === "success" ? (
              <Button
                className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                asChild
              >
                <Link href="/games">
                  <Gamepad2 className="w-4 h-4 mr-2" /> Beli Game Lain
                </Link>
              </Button>
            ) : currentStatus === "pending" ? (
              <div className="flex w-full gap-3 flex-col sm:flex-row">
                <Button
                  className="flex-1 h-12 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Batalkan Pesanan
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white font-bold"
                  asChild
                >
                  <Link href="/games">Beli Game Lain</Link>
                </Button>
              </div>
            ) : (
              <Button
                className="flex-1 h-12 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white font-bold"
                asChild
              >
                <Link href="/games">Beli Game Lain</Link>
              </Button>
            )}
          </div>

          {/* ─── Help Link ─── */}
          {isTerminal && (currentStatus === "failed" || currentStatus === "refunded") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-xs text-[hsl(var(--muted-foreground))]/70">
                Butuh bantuan?{" "}
                <a href="mailto:support@miqstore.com" className="text-[hsl(var(--primary))] font-medium hover:underline">
                  Hubungi Customer Service
                </a>
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
