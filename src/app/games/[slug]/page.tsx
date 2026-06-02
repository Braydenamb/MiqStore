"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useCheckoutStore } from "@/store/useCheckoutStore";

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
function StepBadge({ num }: { num: number }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-navy)] text-white text-xs font-bold shadow-sm">
      {num}
    </span>
  );
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const checkoutStore = useCheckoutStore();

  const game = POPULAR_GAMES.find((g) => g.slug === slug);
  const products = GAME_PRODUCTS[slug] || DEFAULT_PRODUCTS;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const allFieldsFilled = game?.fields.every((f) => fieldValues[f.key]?.trim()) ?? true;
  const canCheckout = allFieldsFilled && selectedProduct && selectedPayment;

  const handleCheckout = () => {
    if (!game || !canCheckout || !chosenProduct || !chosenPayment) return;
    setIsSubmitting(true);
    
    checkoutStore.setGame({ id: game.id, name: game.name, image: game.image, publisher: game.publisher });
    checkoutStore.setUserId(fieldValues[game.fields[0]?.key] || "");
    checkoutStore.setZoneId(fieldValues[game.fields[1]?.key] || "");
    checkoutStore.setSelectedProduct({ id: chosenProduct.id, name: chosenProduct.name, price: chosenProduct.price });
    checkoutStore.setSelectedPayment({ id: chosenPayment.id, name: chosenPayment.name, logo: "", fee: fee });

    setTimeout(() => {
      router.push(`/checkout`);
    }, 800);
  };

  if (!game) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--color-cream)] texture-overlay">
        <div className="text-center relative z-10">
          <Gamepad2 className="h-16 w-16 text-[var(--color-teal)]/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-[var(--color-navy)] mb-2">Game tidak ditemukan</h2>
          <Button variant="outline" className="mt-4 border-[var(--color-teal)] text-[var(--color-teal)]" asChild>
            <Link href="/games">Kembali ke katalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] texture-overlay pb-32 lg:pb-16 font-sans">
      
      {/* ── Hero Banner (Retro Editorial Style) ── */}
      <div className="w-full bg-[var(--color-navy)] relative overflow-hidden pt-20 pb-12 border-b-4 border-[var(--color-gold)]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {/* Abstract Colorful Shapes representing game graphics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-teal)] opacity-50 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500 opacity-30 blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10 flex items-end gap-6 h-full mt-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-white p-1 shadow-2xl shrink-0 -mb-16 border border-white relative overflow-hidden">
             <div className="w-full h-full rounded-lg bg-[var(--color-teal)] flex items-center justify-center">
               <Gamepad2 className="w-12 h-12 text-white" />
             </div>
          </div>
          <div className="text-white pb-2 flex-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-2">{game.name}</h1>
            <div className="flex items-center gap-3 text-sm text-white/80 font-medium">
              <span>{game.publisher}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
              <span>Instan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-1">
          
          <div className="space-y-8">
            
            {/* Step 1: User ID */}
            {game.fields.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <StepBadge num={1} />
                  <h2 className="text-lg font-bold font-heading text-[var(--color-navy)]">Detail Akun</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {game.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-xs font-bold text-[var(--color-teal)] uppercase tracking-wider">{field.label}</Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={fieldValues[field.key] || ""}
                        onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">Pastikan User ID dan Zone ID Anda sudah benar. Kesalahan input sepenuhnya menjadi tanggung jawab pembeli.</p>
              </motion.div>
            )}

            {/* Step 2: Choose Product */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <StepBadge num={game.fields.length > 0 ? 2 : 1} />
                <h2 className="text-lg font-bold font-heading text-[var(--color-navy)]">Pilih Produk</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer overflow-hidden",
                      selectedProduct === product.id
                        ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5 shadow-md transform scale-[1.02]"
                        : "border-gray-100 bg-white hover:border-[var(--color-teal)]/30 hover:bg-gray-50"
                    )}
                  >
                    {product.popular && (
                      <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-[var(--color-navy)] text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                        HOT
                      </div>
                    )}
                    <span className="text-sm font-bold text-[var(--color-navy)] leading-tight mb-1 pr-4">{product.name}</span>
                    <span className="text-xs font-bold text-[var(--color-teal)] mt-auto">
                      {formatCurrency(product.price)}
                    </span>
                    {selectedProduct === product.id && (
                      <motion.div layoutId="product-check" className="absolute bottom-2 right-2 text-[var(--color-teal)]">
                        <CheckCircle2 className="h-5 w-5 fill-[var(--color-teal)] text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Step 3: Payment Method */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <StepBadge num={game.fields.length > 0 ? 3 : 2} />
                <h2 className="text-lg font-bold font-heading text-[var(--color-navy)]">Pilih Pembayaran</h2>
              </div>
              <div className="space-y-6">
                {Object.entries(paymentGroups).map(([category, methods]) => (
                  <div key={category}>
                    <p className="mb-3 text-xs font-bold text-[var(--color-teal)] uppercase tracking-wider">
                      {paymentCategoryLabels[category] || category}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {methods.map((pm) => (
                        <button
                          key={pm.id}
                          onClick={() => setSelectedPayment(pm.id)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer",
                            selectedPayment === pm.id
                              ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5 shadow-md transform scale-[1.02]"
                              : "border-gray-100 bg-white hover:border-[var(--color-teal)]/30 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-[var(--color-navy)] shrink-0">
                            {pm.name.slice(0, 2)}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--color-navy)] truncate">{pm.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {pm.fee === 0 ? "Tanpa biaya admin" : pm.feeType === "flat" ? `+${formatCurrency(pm.fee)}` : `+${pm.fee}%`}
                            </p>
                          </div>
                          {selectedPayment === pm.id && (
                            <motion.div layoutId="payment-check" className="shrink-0 text-[var(--color-teal)]">
                              <CheckCircle2 className="h-5 w-5 fill-[var(--color-teal)] text-white" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Sticky Mobile/Desktop CTA Bottom Bar ── */}
      <AnimatePresence>
        {canCheckout && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Pembayaran</p>
                <p className="text-xl font-extrabold text-[var(--color-navy)]">{formatCurrency(total)}</p>
              </div>
              <div className="flex items-center justify-between sm:hidden">
                <span className="text-sm font-bold text-[var(--color-navy)]">{chosenProduct?.name}</span>
                <span className="text-lg font-extrabold text-[var(--color-navy)]">{formatCurrency(total)}</span>
              </div>
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 h-12 rounded-xl bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold text-base transition-all shadow-lg shadow-[var(--color-navy)]/20"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengalihkan...</>
                ) : (
                  "Beli Sekarang"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
