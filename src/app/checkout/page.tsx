"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CreditCard,
  Wallet,
  QrCode,
  Building2,
  Store,
  Loader2,
  AlertCircle,
  ChevronDown,
  Gamepad2,
  Sparkles,
  Check,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, cn } from "@/lib/utils";
import { PAYMENT_METHODS, POPULAR_GAMES } from "@/lib/constants";
import { fadeUp, staggerContainer, staggerItem, spring } from "@/lib/motion";

const paymentGroups = [
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan & bayar dari e-wallet manapun", recommended: true, methods: PAYMENT_METHODS.filter((m) => m.category === "qris") },
  { id: "e-wallet", label: "E-Wallet", icon: Wallet, desc: "GoPay, OVO, DANA, ShopeePay", methods: PAYMENT_METHODS.filter((m) => m.category === "e-wallet") },
  { id: "virtual-account", label: "Virtual Account", icon: Building2, desc: "Transfer via ATM atau mobile banking", methods: PAYMENT_METHODS.filter((m) => m.category === "virtual-account") },
  { id: "retail", label: "Gerai Retail", icon: Store, desc: "Bayar di Indomaret / Alfamart", methods: PAYMENT_METHODS.filter((m) => m.category === "retail") },
];

/* ─── Progress Steps ─── */
function ProgressBar({ step }: { step: number }) {
  const steps = ["Produk", "Pembayaran", "Konfirmasi"];
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold transition-all",
            i <= step
              ? "bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white shadow-lg shadow-purple-500/20"
              : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          )}>
            {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span className={cn(
            "text-xs font-medium hidden sm:block",
            i <= step ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
          )}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-px mx-1",
              i < step ? "bg-gradient-to-r from-[var(--liquid-purple)] to-[var(--liquid-blue)]" : "bg-[hsl(var(--border))]"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gameSlug = searchParams.get("game") || "";
  const itemName = searchParams.get("item") || "";
  const priceParam = searchParams.get("price") || "0";
  const userId = searchParams.get("uid") || "";
  const zoneId = searchParams.get("zid") || "";

  const price = parseInt(priceParam);
  const game = POPULAR_GAMES.find((g) => g.slug === gameSlug);

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("qris");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
  const fee = selectedMethod
    ? selectedMethod.feeType === "percent"
      ? Math.round(price * (selectedMethod.fee / 100))
      : selectedMethod.fee
    : 0;
  const discount = promoApplied ? Math.round(price * 0.1) : 0;
  const total = price + fee - discount;
  const currentStep = selectedPayment ? 2 : 1;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MIQ10" || promoCode.toUpperCase() === "FLASHSALE") {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPayment) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;
    router.push(`/invoice/${invoiceId}`);
  };

  if (!game || !price) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold mb-2">Data Checkout Tidak Valid</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Silakan pilih item dari halaman game terlebih dahulu.
          </p>
          <Button asChild><Link href="/games">Kembali ke Games</Link></Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32 lg:pb-16 aurora-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4 pt-4">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={`/games/${gameSlug}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <ProgressBar step={currentStep} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Payment Methods */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Section Title */}
            <motion.div variants={staggerItem}>
              <h1 className="text-xl font-extrabold">Pilih Pembayaran</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Pilih metode pembayaran yang kamu inginkan
              </p>
            </motion.div>

            {/* Mobile Order Summary */}
            <motion.div variants={staggerItem} className="lg:hidden">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl shrink-0 overflow-hidden bg-[var(--color-navy)]">
                      {game.image ? (
                        <img src={game.image} alt={game.name} className="object-cover h-full w-full" />
                      ) : (
                        <Gamepad2 className="h-5 w-5 text-white/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{game.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{itemName}</p>
                    </div>
                    <p className="ml-auto font-bold text-sm tabular-nums">{formatCurrency(price)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* MiqStore Wallet Top Section */}
            <motion.div variants={staggerItem}>
              <Card className={cn(
                "overflow-hidden transition-all border-2",
                selectedPayment === "wallet"
                  ? "border-[var(--liquid-cyan)] bg-[var(--liquid-cyan)]/5 ring-1 ring-[var(--liquid-cyan)]/30"
                  : "border-[var(--liquid-cyan)]/30 hover:border-[var(--liquid-cyan)]/50"
              )}>
                <button
                  className="w-full p-4 flex items-center justify-between transition-colors"
                  onClick={() => setSelectedPayment("wallet")}
                  disabled={total > 125000} // Mock check for insufficient balance
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `color-mix(in srgb, var(--liquid-cyan) 15%, transparent)` }}
                    >
                      <Wallet className="h-6 w-6 text-[var(--liquid-cyan)]" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold">Saldo MiqStore</p>
                        <Badge variant="glow" className="text-[9px] px-1.5 py-0 bg-[var(--liquid-cyan)]/10 text-[var(--liquid-cyan)] border-[var(--liquid-cyan)]/30">
                          <Sparkles className="h-2.5 w-2.5 mr-0.5" /> Bebas Biaya
                        </Badge>
                      </div>
                      <p className="text-sm font-medium tabular-nums text-[hsl(var(--muted-foreground))] mt-0.5">
                        Sisa saldo: <span className={total > 125000 ? "text-red-400" : "text-foreground"}>Rp 125.000</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {total > 125000 ? (
                      <span className="text-xs font-semibold text-red-400">Saldo Tidak Cukup</span>
                    ) : (
                      selectedPayment === "wallet" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--liquid-cyan)]"
                        >
                          <Check className="h-3.5 w-3.5 text-black" />
                        </motion.div>
                      )
                    )}
                  </div>
                </button>
              </Card>
            </motion.div>

            {/* Payment Groups */}
            {paymentGroups.map((group) => (
              <motion.div key={group.id} variants={staggerItem}>
                <Card className={cn(
                  "overflow-hidden transition-all",
                  expandedGroup === group.id && "ring-1 ring-[var(--liquid-purple)]/20"
                )}>
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-[hsl(var(--muted))] transition-colors"
                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `color-mix(in srgb, var(--liquid-purple) 10%, transparent)` }}
                      >
                        <group.icon className="h-5 w-5 text-[var(--liquid-purple)]" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{group.label}</p>
                          {group.recommended && (
                            <Badge variant="glow" className="text-[9px] px-1.5 py-0">
                               Tercepat
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{group.desc}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", expandedGroup === group.id && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {expandedGroup === group.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <CardContent className="p-4 pt-0 border-t border-[hsl(var(--border))]">
                          <div className="grid gap-2 pt-3">
                            {group.methods.map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPayment(method.id)}
                                className={cn(
                                  "flex items-center justify-between rounded-xl border p-3 transition-all duration-300",
                                  selectedPayment === method.id
                                    ? "border-[var(--liquid-purple)] bg-[var(--liquid-purple)]/5 ring-1 ring-[var(--liquid-purple)]/30"
                                    : "border-[hsl(var(--border))] hover:border-[rgba(255,255,255,0.1)] hover:bg-[hsl(var(--muted))]"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-xs font-bold">
                                    {method.name.slice(0, 2)}
                                  </div>
                                  <span className="text-sm font-medium">{method.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {method.fee === 0 ? "Gratis" : method.feeType === "percent" ? `${method.fee}%` : formatCurrency(method.fee)}
                                  </span>
                                  {selectedPayment === method.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--liquid-purple)]"
                                    >
                                      <Check className="h-3 w-3 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Sticky Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 space-y-4">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl shrink-0 overflow-hidden bg-[var(--color-navy)]">
                      {game.image ? (
                        <img src={game.image} alt={game.name} className="object-cover h-full w-full" />
                      ) : (
                        <Gamepad2 className="h-6 w-6 text-white/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{game.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{itemName}</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="rounded-xl bg-[hsl(var(--muted))] p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[hsl(var(--muted-foreground))]">User ID</span>
                      <span className="font-medium tabular-nums">{userId || "-"}</span>
                    </div>
                    {zoneId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-[hsl(var(--muted-foreground))]">Zone ID</span>
                        <span className="font-medium tabular-nums">{zoneId}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Kode Promo
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Masukkan kode"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="text-xs h-9"
                        disabled={promoApplied}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyPromo}
                        disabled={!promoCode || promoApplied}
                        className="shrink-0 h-9"
                      >
                        {promoApplied ? <Check className="h-3.5 w-3.5 text-green-400" /> : "Pakai"}
                      </Button>
                    </div>
                    {promoApplied && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-green-400">
                        🎉 Diskon 10% berhasil diterapkan!
                      </motion.p>
                    )}
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Coba: MIQ10 atau FLASHSALE
                    </p>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Harga</span>
                      <span className="tabular-nums">{formatCurrency(price)}</span>
                    </div>
                    <AnimatePresence>
                      {fee > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">Biaya Layanan</span>
                          <span className="tabular-nums">{formatCurrency(fee)}</span>
                        </motion.div>
                      )}
                      {discount > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex justify-between text-green-400">
                          <span>Diskon</span>
                          <span className="tabular-nums">-{formatCurrency(discount)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="gradient-text tabular-nums">
                        {formatCurrency(total)}
                      </motion.span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={!selectedPayment || isProcessing}
                    onClick={handleCheckout}
                  >
                    {isProcessing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
                    ) : (
                      <><CreditCard className="h-4 w-4" /> Bayar {formatCurrency(total)}</>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <ShieldCheck className="h-3 w-3 text-green-400" /> SSL Secure
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <Clock className="h-3 w-3 text-[var(--liquid-cyan)]" /> Proses Instan
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Mobile Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong p-4 lg:hidden" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Total Bayar</span>
              {selectedMethod && (
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">via {selectedMethod.name}</p>
              )}
            </div>
            <motion.span key={total} initial={{ scale: 1.08 }} animate={{ scale: 1 }} className="text-lg font-bold gradient-text tabular-nums">
              {formatCurrency(total)}
            </motion.span>
          </div>
          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!selectedPayment || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
            ) : (
              <><CreditCard className="h-4 w-4" /> Bayar Sekarang</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--liquid-purple)]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
