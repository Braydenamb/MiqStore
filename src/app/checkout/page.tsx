"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, cn } from "@/lib/utils";
import { PAYMENT_METHODS, POPULAR_GAMES } from "@/lib/constants";

// Group payment methods by category
const paymentGroups = [
  {
    id: "qris",
    label: "QRIS",
    icon: QrCode,
    description: "Scan & bayar dari e-wallet manapun",
    methods: PAYMENT_METHODS.filter((m) => m.category === "qris"),
  },
  {
    id: "e-wallet",
    label: "E-Wallet",
    icon: Wallet,
    description: "GoPay, OVO, DANA, ShopeePay",
    methods: PAYMENT_METHODS.filter((m) => m.category === "e-wallet"),
  },
  {
    id: "virtual-account",
    label: "Virtual Account",
    icon: Building2,
    description: "Transfer via ATM, mobile banking",
    methods: PAYMENT_METHODS.filter((m) => m.category === "virtual-account"),
  },
  {
    id: "retail",
    label: "Gerai Retail",
    icon: Store,
    description: "Bayar di Indomaret/Alfamart",
    methods: PAYMENT_METHODS.filter((m) => m.category === "retail"),
  },
];

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

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MIQ10" || promoCode.toUpperCase() === "FLASHSALE") {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPayment) return;
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;
    router.push(`/invoice/${invoiceId}`);
  };

  if (!game || !price) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Data Checkout Tidak Valid</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Silakan pilih item dari halaman game terlebih dahulu.
          </p>
          <Button asChild>
            <Link href="/games">Kembali ke Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/games/${gameSlug}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: Payment Methods */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
                Checkout
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Pilih metode pembayaran untuk menyelesaikan transaksi
              </p>
            </motion.div>

            {/* Order Summary (Mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:hidden"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: game.color + "20" }}
                    >
                      <Gamepad2
                        className="h-6 w-6"
                        style={{ color: game.color }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{game.name}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {itemName}
                      </p>
                    </div>
                    <p className="ml-auto font-bold">{formatCurrency(price)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Groups */}
            {paymentGroups.map((group, gi) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.05 }}
              >
                <Card>
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-[hsl(var(--muted))] transition-colors rounded-t-xl"
                    onClick={() =>
                      setExpandedGroup(
                        expandedGroup === group.id ? null : group.id
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <group.icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{group.label}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedGroup === group.id && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedGroup === group.id && (
                    <CardContent className="p-4 pt-0 border-t border-[hsl(var(--border))]">
                      <div className="grid gap-2 pt-3">
                        {group.methods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3 transition-all",
                              selectedPayment === method.id
                                ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500"
                                : "border-[hsl(var(--border))] hover:border-purple-500/50 hover:bg-[hsl(var(--muted))]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-[hsl(var(--muted))] text-xs font-bold">
                                {method.name.slice(0, 2)}
                              </div>
                              <span className="text-sm font-medium">
                                {method.name}
                              </span>
                            </div>
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {method.fee === 0
                                ? "Gratis"
                                : method.feeType === "percent"
                                ? `${method.fee}%`
                                : formatCurrency(method.fee)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right: Order Summary (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: game.color + "20" }}
                    >
                      <Gamepad2
                        className="h-6 w-6"
                        style={{ color: game.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {game.name}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {itemName}
                      </p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="rounded-lg bg-[hsl(var(--muted))] p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        User ID
                      </span>
                      <span className="font-medium">{userId || "-"}</span>
                    </div>
                    {zoneId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Zone ID
                        </span>
                        <span className="font-medium">{zoneId}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label className="text-xs">Kode Promo</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Masukkan kode"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
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
                        {promoApplied ? "✓" : "Pakai"}
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-[10px] text-green-400">
                        🎉 Diskon 10% berhasil diterapkan!
                      </p>
                    )}
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Coba: MIQ10 atau FLASHSALE
                    </p>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Harga
                      </span>
                      <span>{formatCurrency(price)}</span>
                    </div>
                    {fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Biaya Layanan
                        </span>
                        <span>{formatCurrency(fee)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Diskon</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="gradient-text">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedPayment || isProcessing}
                    onClick={handleCheckout}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Bayar {formatCurrency(total)}
                      </>
                    )}
                  </Button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <ShieldCheck className="h-3 w-3 text-green-400" />
                      SSL Secure
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      Proses Instan
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Mobile Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur-lg p-4 lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Total
            </span>
            <span className="text-lg font-bold gradient-text">
              {formatCurrency(total)}
            </span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={!selectedPayment || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Bayar Sekarang
              </>
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
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
