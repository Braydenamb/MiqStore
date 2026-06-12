"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Gamepad2,
  Clock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Session storage persistence ─── */
const CHECKOUT_STORAGE_KEY = "miq_checkout_data";

interface PersistedCheckout {
  game: { id: string; name: string; image: string; publisher: string };
  userId: string;
  zoneId: string;
  selectedProduct: { id: string; name: string; price: number };
  selectedPayment: { id: string; name: string; logo: string; fee?: number };
}

function saveCheckoutToStorage(data: PersistedCheckout) {
  try {
    sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded or private mode */ }
}

function loadCheckoutFromStorage(): PersistedCheckout | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    return raw ? JSON.parse(raw) as PersistedCheckout : null;
  } catch { return null; }
}

function clearCheckoutStorage() {
  try { sessionStorage.removeItem(CHECKOUT_STORAGE_KEY); } catch { /* noop */ }
}

/* ─── Countdown Timer ─── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-[hsl(var(--foreground))] font-bold text-lg bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
      <Clock className="w-5 h-5 text-[hsl(var(--primary))]" />
      <span className="tabular-nums">{m}:{s}</span>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CheckoutPage() {
  const router = useRouter();
  const checkoutStore = useCheckoutStore();
  const { game, userId, zoneId, selectedProduct, selectedPayment } = checkoutStore;

  const [isAgreed, setIsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Check if Snap.js SDK is loaded
  useEffect(() => {
    const checkSnap = () => {
      if (window.snap) {
        setSnapReady(true);
        return true;
      }
      return false;
    };

    if (checkSnap()) return;

    // Poll for Snap.js availability (lazyOnload strategy)
    const interval = setInterval(() => {
      if (checkSnap()) clearInterval(interval);
    }, 500);

    // Give up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!window.snap) {
        toast.error("Sistem pembayaran gagal dimuat. Silakan refresh.");
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Persist checkout data to sessionStorage on mount
  useEffect(() => {
    if (game && selectedProduct && selectedPayment) {
      saveCheckoutToStorage({ game, userId, zoneId, selectedProduct, selectedPayment });
    }
  }, [game, userId, zoneId, selectedProduct, selectedPayment]);

  // Restore from sessionStorage if store is empty (page refresh)
  useEffect(() => {
    if (!game && !selectedProduct && !selectedPayment) {
      const saved = loadCheckoutFromStorage();
      if (saved) {
        checkoutStore.setGame(saved.game);
        checkoutStore.setUserId(saved.userId);
        checkoutStore.setZoneId(saved.zoneId);
        checkoutStore.setSelectedProduct(saved.selectedProduct);
        checkoutStore.setSelectedPayment(saved.selectedPayment);
        toast.info("Data checkout dipulihkan");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Payment Handler ─── */
  const handlePay = useCallback(async () => {
    if (!isAgreed || !game || !selectedProduct || !selectedPayment) return;

    if (!window.snap) {
      toast.error("Sistem pembayaran belum siap. Silakan tunggu atau refresh halaman.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSlug: game.id,
          gameName: game.name,
          productCode: selectedProduct.id,
          productName: selectedProduct.name,
          gameUserId: userId,
          gameZoneId: zoneId,
          price: selectedProduct.price,
          paymentMethod: selectedPayment.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat transaksi");
      }

      const { token, invoiceId } = result.data;

      // Clear session storage after successful transaction creation
      clearCheckoutStorage();

      // Trigger Midtrans Snap payment modal
      window.snap.pay(token, {
        onSuccess: () => {
          checkoutStore.reset();
          router.push(`/invoice/${invoiceId}?status=success`);
        },
        onPending: () => {
          router.push(`/invoice/${invoiceId}?status=pending`);
        },
        onError: () => {
          toast.error("Pembayaran gagal atau dibatalkan.");
          setIsProcessing(false);
          router.push(`/invoice/${invoiceId}?status=failed`);
        },
        onClose: () => {
          toast.info("Jendela pembayaran ditutup. Pesanan tetap aktif selama 24 jam.");
          setIsProcessing(false);
          // Redirect to invoice so user can see pending status
          router.push(`/invoice/${invoiceId}?status=pending`);
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan jaringan";

      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        toast.error("Koneksi bermasalah. Periksa internet kamu dan coba lagi.", {
          action: {
            label: "Coba Lagi",
            onClick: () => { handlePay(); },
          },
        });
      } else if (message.includes("No active products")) {
        toast.error("Produk belum tersedia di sistem. Hubungi customer service.");
      } else {
        toast.error(message);
      }

      setIsProcessing(false);
    }
  }, [isAgreed, game, selectedProduct, selectedPayment, userId, zoneId, router, checkoutStore]);

  /* ─── Empty State ─── */
  if (!game || !selectedProduct || !selectedPayment) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[hsl(var(--background))] texture-overlay">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
          <AlertCircle className="h-12 w-12 text-[hsl(var(--primary))] mx-auto mb-4 opacity-50" />
          <h1 className="text-xl font-bold font-heading text-[hsl(var(--foreground))] mb-2">Data Kosong</h1>
          <p className="text-sm text-gray-500 mb-6">Silakan pilih game dan produk terlebih dahulu sebelum checkout.</p>
          <Button asChild className="w-full bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(var(--primary))]">
            <Link href="/games">Kembali ke Katalog</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const price = selectedProduct.price;
  const fee = selectedPayment.fee || 0;
  const total = price + fee;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay pt-24 pb-40 lg:pb-16 font-sans">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" asChild className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))]/10">
            <Link href={`/games/${game.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">Konfirmasi</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Timer Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Selesaikan dalam</p>
              <p className="text-xs text-gray-400">Pesanan akan dibatalkan otomatis jika melewati batas waktu.</p>
            </div>
            <CountdownTimer />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                {game.image ? (
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Gamepad2 className="w-8 h-8 text-[hsl(var(--primary))]" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">{game.name}</h2>
                <p className="text-sm text-[hsl(var(--primary))] font-medium">{selectedProduct.name}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User ID</span>
                <span className="font-bold text-[hsl(var(--foreground))]">{userId || "-"}</span>
              </div>
              {zoneId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Zone ID</span>
                  <span className="font-bold text-[hsl(var(--foreground))]">{zoneId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-bold text-[hsl(var(--foreground))] uppercase">{selectedPayment.name}</span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold font-heading text-[hsl(var(--foreground))] text-lg mb-4">Rincian Harga</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Harga Item</span>
              <span className="font-medium">{formatCurrency(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Biaya Layanan</span>
              <span className="font-medium">{fee === 0 ? "Gratis" : formatCurrency(fee)}</span>
            </div>
            <div className="w-full h-px bg-gray-100 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-[hsl(var(--foreground))]">Total Pembayaran</span>
              <span className="text-xl font-extrabold text-[hsl(var(--primary))] tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Snap.js Status Indicator */}
          {!snapReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
            >
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Memuat sistem pembayaran...</p>
                <p className="text-xs text-amber-600">Mohon tunggu sebentar.</p>
              </div>
            </motion.div>
          )}

          {/* Terms & CTA */}
          <div className="space-y-6 pt-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-tight cursor-pointer">
                Saya menyetujui <Link href="/terms" className="text-[hsl(var(--primary))] font-medium hover:underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-[hsl(var(--primary))] font-medium hover:underline">Kebijakan Privasi</Link> yang berlaku di MiqStore.
              </label>
            </div>

            <Button
              className="w-full h-14 rounded-xl text-lg font-bold bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white shadow-[0_8px_30px_rgba(11,29,52,0.2)] transition-all disabled:opacity-50"
              disabled={!isAgreed || isProcessing || !snapReady}
              onClick={handlePay}
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses Pesanan...</>
              ) : !snapReady ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memuat Pembayaran...</>
              ) : (
                "Bayar Sekarang"
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Pembayaran Aman & Terenkripsi
            </p>
          </div>

        </motion.div>
      </div>

      {/* Mobile Sticky Checkout CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto max-w-2xl px-4 pt-3 pb-1 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total</p>
            <p className="text-lg font-extrabold text-[hsl(var(--primary))] tabular-nums">{formatCurrency(total)}</p>
          </div>
          <Button
            className="shrink-0 h-12 px-8 rounded-xl text-base font-bold bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white shadow-md transition-all disabled:opacity-50"
            disabled={!isAgreed || isProcessing || !snapReady}
            onClick={handlePay}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Bayar Sekarang"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
