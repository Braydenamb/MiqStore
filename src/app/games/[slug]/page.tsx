"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Gamepad2,
  ShieldCheck,
  Zap,
  ChevronRight,
  Loader2,
  Check,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { POPULAR_GAMES, PAYMENT_METHODS } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";

/* ── Mock product items per game ── */
interface ProductItem {
  id: string;
  name: string;
  amount: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
}

const GAME_PRODUCTS: Record<string, ProductItem[]> = {
  "mobile-legends": [
    { id: "ml-86", name: "86 Diamonds", amount: 86, price: 18500 },
    { id: "ml-172", name: "172 Diamonds", amount: 172, price: 36000 },
    { id: "ml-257", name: "257 Diamonds", amount: 257, price: 52000 },
    { id: "ml-344", name: "344 Diamonds", amount: 344, price: 68000, popular: true },
    { id: "ml-429", name: "429 Diamonds", amount: 429, price: 84000 },
    { id: "ml-514", name: "514 Diamonds", amount: 514, price: 99000 },
    { id: "ml-706", name: "706 Diamonds", amount: 706, price: 135000, popular: true },
    { id: "ml-878", name: "878 Diamonds", amount: 878, price: 168000 },
    { id: "ml-1050", name: "1050 Diamonds", amount: 1050, price: 199000 },
    { id: "ml-2010", name: "2010 Diamonds", amount: 2010, price: 375000 },
    { id: "ml-4805", name: "4805 Diamonds", amount: 4805, price: 850000 },
    { id: "ml-starlight", name: "Starlight Member", amount: 1, price: 149000, originalPrice: 159000 },
  ],
  "free-fire": [
    { id: "ff-70", name: "70 Diamonds", amount: 70, price: 14000 },
    { id: "ff-140", name: "140 Diamonds", amount: 140, price: 27000 },
    { id: "ff-355", name: "355 Diamonds", amount: 355, price: 65000, popular: true },
    { id: "ff-720", name: "720 Diamonds", amount: 720, price: 130000 },
    { id: "ff-1450", name: "1450 Diamonds", amount: 1450, price: 255000 },
    { id: "ff-membership", name: "Weekly Membership", amount: 1, price: 29000 },
  ],
  "genshin-impact": [
    { id: "gi-60", name: "60 Genesis Crystals", amount: 60, price: 16000 },
    { id: "gi-300", name: "300+30 Genesis Crystals", amount: 330, price: 79000 },
    { id: "gi-980", name: "980+110 Genesis Crystals", amount: 1090, price: 249000, popular: true },
    { id: "gi-1980", name: "1980+260 Genesis Crystals", amount: 2240, price: 479000 },
    { id: "gi-3280", name: "3280+600 Genesis Crystals", amount: 3880, price: 799000 },
    { id: "gi-6480", name: "6480+1600 Genesis Crystals", amount: 8080, price: 1599000 },
    { id: "gi-blessing", name: "Blessing of the Welkin Moon", amount: 1, price: 79000, popular: true },
  ],
  "valorant": [
    { id: "vl-125", name: "125 VP", amount: 125, price: 15000 },
    { id: "vl-420", name: "420 VP", amount: 420, price: 49000 },
    { id: "vl-700", name: "700 VP", amount: 700, price: 79000, popular: true },
    { id: "vl-1375", name: "1375 VP", amount: 1375, price: 149000 },
    { id: "vl-2400", name: "2400 VP", amount: 2400, price: 249000 },
    { id: "vl-4000", name: "4000 VP", amount: 4000, price: 399000 },
    { id: "vl-8150", name: "8150 VP", amount: 8150, price: 799000 },
  ],
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: "def-1", name: "Paket 1", amount: 100, price: 15000 },
  { id: "def-2", name: "Paket 2", amount: 300, price: 45000 },
  { id: "def-3", name: "Paket 3", amount: 500, price: 75000, popular: true },
  { id: "def-4", name: "Paket 4", amount: 1000, price: 150000 },
  { id: "def-5", name: "Paket 5", amount: 2500, price: 350000 },
  { id: "def-6", name: "Paket 6", amount: 5000, price: 650000 },
];

const paymentCategoryLabels: Record<string, string> = {
  qris: "QRIS",
  "e-wallet": "E-Wallet",
  "virtual-account": "Virtual Account",
  retail: "Retail",
  "credit-card": "Credit Card",
};

/* ─── Step Badge ─── */
function StepBadge({ num, active }: { num: number; active: boolean }) {
  return (
    <span className={cn(
      "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold transition-all",
      active
        ? "bg-gradient-to-br from-[var(--liquid-purple)] to-[var(--liquid-blue)] text-white shadow-lg shadow-purple-500/20"
        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
    )}>
      {num}
    </span>
  );
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const game = POPULAR_GAMES.find((g) => g.slug === slug);
  const products = GAME_PRODUCTS[slug] || DEFAULT_PRODUCTS;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const chosenProduct = products.find((p) => p.id === selectedProduct);
  const chosenPayment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

  const paymentGroups = useMemo(() => {
    const groups: Record<string, typeof PAYMENT_METHODS> = {};
    for (const pm of PAYMENT_METHODS) {
      if (!groups[pm.category]) groups[pm.category] = [];
      groups[pm.category].push(pm);
    }
    return groups;
  }, []);

  const fee = chosenPayment
    ? chosenPayment.feeType === "flat"
      ? chosenPayment.fee
      : chosenProduct
        ? Math.ceil(chosenProduct.price * (chosenPayment.fee / 100))
        : 0
    : 0;
  const total = chosenProduct ? chosenProduct.price + fee : 0;

  const handleValidateId = () => {
    const userId = fieldValues[game?.fields[0]?.key || "user_id"];
    if (!userId) return;
    setIsValidating(true);
    setTimeout(() => {
      setNickname("Player★" + userId.slice(-4));
      setIsValidating(false);
    }, 1200);
  };

  const handleSubmit = () => {
    if (!chosenProduct || !selectedPayment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/invoice/INV-${Date.now().toString(36).toUpperCase()}`);
    }, 1500);
  };

  const allFieldsFilled = game?.fields.every((f) => fieldValues[f.key]?.trim()) ?? true;
  const canCheckout = allFieldsFilled && selectedProduct && selectedPayment;

  if (!game) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mx-auto mb-4">
            <Gamepad2 className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Game tidak ditemukan</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/games">Kembali ke daftar game</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32 lg:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 pt-4 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"
        >
          <Link href="/games" className="hover:text-[var(--liquid-purple)] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Games
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[hsl(var(--foreground))] font-medium">{game.name}</span>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ── LEFT: Main Content ── */}
          <div className="space-y-5">
            {/* Game Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background glow */}
              <div
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: game.color }}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm"
                  style={{
                    background: `${game.color}18`,
                    border: `1px solid ${game.color}25`,
                    boxShadow: `0 8px 32px ${game.color}20`,
                  }}
                >
                  <Gamepad2 className="h-8 w-8" style={{ color: game.color }} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold">{game.name}</h1>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {game.publisher} • Top Up Instan
                  </p>
                </div>
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                <Badge variant="success" className="gap-1">
                  <Zap className="h-3 w-3" /> Proses 1-5 detik
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> 100% Aman
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" /> 24/7 Online
                </Badge>
              </div>
            </motion.div>

            {/* Step 1: Input User ID */}
            {game.fields.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <StepBadge num={1} active={!allFieldsFilled || !nickname} />
                      Masukkan Data Akun
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {game.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key}>{field.label}</Label>
                          {field.type === "select" ? (
                            <Select
                              id={field.key}
                              value={fieldValues[field.key] || ""}
                              onChange={(e) =>
                                setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                            >
                              <option value="">{field.placeholder}</option>
                              {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </Select>
                          ) : (
                            <Input
                              id={field.key}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={fieldValues[field.key] || ""}
                              onChange={(e) =>
                                setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleValidateId}
                        disabled={!fieldValues[game.fields[0]?.key] || isValidating}
                        className="gap-1"
                      >
                        {isValidating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Cek Akun
                      </Button>
                      <AnimatePresence>
                        {nickname && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-green-400 font-medium flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> {nickname}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Choose Product — Quick Nominal Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <StepBadge num={game.fields.length > 0 ? 2 : 1} active={!selectedProduct} />
                    Pilih Nominal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all duration-300 cursor-pointer",
                          selectedProduct === product.id
                            ? "border-[var(--liquid-purple)] bg-[var(--liquid-purple)]/8 shadow-sm shadow-purple-500/15"
                            : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[rgba(255,255,255,0.1)] hover:bg-[hsl(var(--muted))]"
                        )}
                        id={`product-${product.id}`}
                      >
                        {product.popular && (
                          <Badge variant="glow" className="absolute -top-2 right-1 text-[9px] px-1.5 py-0 gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" /> HOT
                          </Badge>
                        )}
                        <span className="text-sm font-bold">{product.name}</span>
                        <span className="text-xs font-semibold text-[var(--liquid-purple)]">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))] line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                        {selectedProduct === product.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--liquid-purple)]"
                          >
                            <Check className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3: Payment Method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <StepBadge num={game.fields.length > 0 ? 3 : 2} active={!selectedPayment} />
                    Pilih Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(paymentGroups).map(([category, methods]) => (
                    <div key={category}>
                      <p className="mb-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        {paymentCategoryLabels[category] || category}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {methods.map((pm) => (
                          <button
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm.id)}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border-2 p-3 transition-all duration-300 cursor-pointer",
                              selectedPayment === pm.id
                                ? "border-[var(--liquid-purple)] bg-[var(--liquid-purple)]/8"
                                : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[rgba(255,255,255,0.1)]"
                            )}
                            id={`payment-${pm.id}`}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-xs font-bold shrink-0">
                              {pm.name.slice(0, 2)}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{pm.name}</p>
                              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                {pm.fee === 0 ? "Tanpa biaya" : pm.feeType === "flat" ? `+${formatCurrency(pm.fee)}` : `+${pm.fee}%`}
                              </p>
                            </div>
                            {selectedPayment === pm.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--liquid-purple)] shrink-0"
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── RIGHT: Order Summary (Sticky) ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Game */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                      style={{ background: `${game.color}18` }}
                    >
                      <Gamepad2 className="h-5 w-5" style={{ color: game.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{game.name}</p>
                      {nickname && <p className="text-xs text-green-400">{nickname}</p>}
                    </div>
                  </div>

                  <Separator />

                  {/* Selected Product */}
                  {chosenProduct ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">{chosenProduct.name}</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(chosenProduct.price)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] italic">Belum memilih nominal</p>
                  )}

                  {/* Payment Fee */}
                  <AnimatePresence>
                    {chosenPayment && fee > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">Biaya layanan</span>
                        <span className="tabular-nums">{formatCurrency(fee)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Promo Code */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Kode promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="text-xs"
                    />
                    <Button variant="outline" size="sm" disabled={!promoCode} className="gap-1">
                      <Tag className="h-3 w-3" /> Pakai
                    </Button>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-extrabold gradient-text tabular-nums"
                    >
                      {total > 0 ? formatCurrency(total) : "-"}
                    </motion.span>
                  </div>

                  {/* Submit */}
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={!canCheckout || isSubmitting}
                    onClick={handleSubmit}
                    id="checkout-btn"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> Beli Sekarang</>
                    )}
                  </Button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <ShieldCheck className="h-3 w-3 text-green-400" /> SSL Secure
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <Zap className="h-3 w-3 text-[var(--liquid-amber)]" /> Instan
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Mobile Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong p-4 lg:hidden" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Total Bayar</span>
              {chosenProduct && <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{chosenProduct.name}</p>}
            </div>
            <span className="text-lg font-bold gradient-text tabular-nums">
              {total > 0 ? formatCurrency(total) : "-"}
            </span>
          </div>
          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!canCheckout || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Beli Sekarang</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
