"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  HelpCircle,
  History,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { POPULAR_GAMES, PAYMENT_METHODS, FAQ_ITEMS } from "@/lib/constants";
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
];

const paymentCategoryLabels: Record<string, string> = {
  qris: "QRIS",
  "e-wallet": "E-Wallet",
  "virtual-account": "Virtual Account",
  retail: "Retail",
  "credit-card": "Credit Card",
};

/* ─── Step Badge ─── */
function StepBadge({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20 text-[var(--color-teal)] text-sm font-bold">
        {num}
      </span>
      <h2 className="text-xl font-bold font-heading text-[var(--color-navy)] tracking-wide">{title}</h2>
    </div>
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem(`miq_saved_id_${slug}`);
    if (saved) {
      try {
        setFieldValues(JSON.parse(saved));
      } catch (e) {}
    }
  }, [slug]);

  const handleFieldChange = (key: string, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    const newValues = { ...fieldValues, [key]: numericValue };
    setFieldValues(newValues);
    localStorage.setItem(`miq_saved_id_${slug}`, JSON.stringify(newValues));
  };

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

  const allFieldsFilled = game?.fields.every((f) => fieldValues[f.key]?.trim().length > 3) ?? true;
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
    }, 600);
  };

  if (!game) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[var(--color-cream)] texture-overlay text-[var(--color-navy)]">
        <div className="text-center relative z-10">
          <Gamepad2 className="h-16 w-16 text-[var(--color-teal)]/40 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold font-heading mb-2">Game tidak ditemukan</h2>
          <Button variant="outline" className="mt-4 border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-teal)]/10" asChild>
            <Link href="/games">Kembali ke katalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] texture-overlay text-[var(--color-navy)] pb-32 lg:pb-16 font-sans">
      
      {/* ── Hero Banner (Retro Modern Style) ── */}
      <div className="w-full relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-navy)]">
        {/* Background Banner with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-[2px] scale-105 mix-blend-overlay"
          style={{ backgroundImage: `url(${game.banner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-[var(--color-navy)]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)] via-transparent to-[var(--color-navy)]/50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />
        
        {/* Colorful Abstract Accents */}
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-[var(--color-teal)]/30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-[var(--color-gold)]/20 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl bg-[var(--color-cream)] p-1 shadow-2xl shrink-0 border border-white/20 relative overflow-hidden">
             <div 
               className="w-full h-full rounded-xl bg-cover bg-center"
               style={{ backgroundImage: `url(${game.image})` }}
             />
          </div>
          <div className="pb-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-2 md:mb-3 drop-shadow-md text-white">
              {game.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium text-white/80">
              <span className="flex items-center gap-1.5 text-white/90"><ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" /> {game.publisher}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
              <span className="flex items-center gap-1.5 text-white/90"><Zap className="h-4 w-4 text-yellow-400" /> Proses 1-5 Menit</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout (2 Columns on Desktop) ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: User ID */}
            {game.fields.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
                <StepBadge num={1} title="Masukkan Detail Akun" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {game.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-xs font-bold text-gray-500 uppercase tracking-wider">{field.label}</Label>
                      <Input
                        id={field.key}
                        type="text"
                        inputMode="numeric"
                        placeholder={field.placeholder}
                        value={fieldValues[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 text-[var(--color-navy)] placeholder:text-gray-400 focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] rounded-xl transition-all font-mono"
                      />
                    </div>
                  ))}
                </div>
                {isHydrated && Object.values(fieldValues).some(v => v) && (
                  <p className="mt-3 text-xs text-[var(--color-teal)] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Data tersimpan otomatis
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 2: Choose Product */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
              <StepBadge num={game.fields.length > 0 ? 2 : 1} title="Pilih Nominal" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer overflow-hidden",
                      selectedProduct === product.id
                        ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5 shadow-md transform scale-[1.02]"
                        : "border-gray-100 bg-white hover:border-[var(--color-teal)]/30 hover:bg-gray-50 hover:-translate-y-0.5"
                    )}
                  >
                    {product.popular && (
                      <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-[var(--color-navy)] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm">
                        HOT
                      </div>
                    )}
                    <span className="text-sm font-bold text-[var(--color-navy)] leading-tight mb-1 pr-4">{product.name}</span>
                    <span className="text-xs font-bold text-[var(--color-teal)] mt-auto drop-shadow-sm">
                      {formatCurrency(product.price)}
                    </span>
                    {selectedProduct === product.id && (
                      <motion.div layoutId="product-check" className="absolute bottom-2 right-2">
                        <CheckCircle2 className="h-5 w-5 text-[var(--color-teal)] drop-shadow-sm" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Step 3: Payment Method */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
              <StepBadge num={game.fields.length > 0 ? 3 : 2} title="Metode Pembayaran" />
              <Accordion type="single" collapsible defaultValue="e-wallet" className="space-y-3">
                {Object.entries(paymentGroups).map(([category, methods]) => (
                  <AccordionItem value={category} key={category} className="border border-gray-100 bg-gray-50 rounded-xl px-2 overflow-hidden data-[state=open]:border-[var(--color-teal)]/30 transition-colors">
                    <AccordionTrigger className="hover:no-underline py-4 px-3 text-sm font-bold uppercase tracking-wider text-[var(--color-navy)]/80 data-[state=open]:text-[var(--color-teal)]">
                      {paymentCategoryLabels[category] || category}
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {methods.map((pm) => (
                          <button
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 cursor-pointer",
                              selectedPayment === pm.id
                                ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5 shadow-md transform scale-[1.01]"
                                : "border-gray-200 bg-white hover:border-[var(--color-teal)]/30 hover:bg-gray-50"
                            )}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-[var(--color-navy)] shrink-0">
                              {pm.name.slice(0, 2)}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-sm font-bold text-[var(--color-navy)] truncate">{pm.name}</p>
                              <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                                {pm.fee === 0 ? "Bebas Biaya Admin" : pm.feeType === "flat" ? `+${formatCurrency(pm.fee)}` : `+${pm.fee}%`}
                              </p>
                            </div>
                            {selectedPayment === pm.id && (
                              <motion.div layoutId="payment-check" className="shrink-0 text-[var(--color-teal)]">
                                <CheckCircle2 className="h-5 w-5" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

          </div>

          {/* Right Column (Sidebar Summary Desktop + Extra Sections) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sticky Order Summary (Desktop Only) */}
            <div className="hidden lg:block sticky top-24">
              <div className="bg-white rounded-2xl border border-[var(--color-teal)]/20 p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent opacity-50" />
                
                <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-[var(--color-navy)]">
                  <Info className="h-5 w-5 text-[var(--color-teal)]" /> Ringkasan Pesanan
                </h3>

                <div className="space-y-4">
                  {/* Game & Item */}
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">Produk</span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--color-navy)]">{game.name}</p>
                      <p className="text-xs text-[var(--color-teal)] font-medium">{chosenProduct?.name || "-"}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-100" />
                  
                  {/* ID */}
                  {game.fields.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Detail Akun</span>
                      <div className="text-right">
                        <p className="text-sm font-mono text-[var(--color-navy)] max-w-[150px] truncate">
                          {fieldValues[game.fields[0]?.key] || "-"}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="bg-gray-100" />

                  {/* Payment */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pembayaran</span>
                    <span className="text-sm font-bold text-[var(--color-navy)]">
                      {chosenPayment?.name || "-"}
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100 mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Harga</span>
                      <span className="text-[var(--color-navy)] font-medium">{chosenProduct ? formatCurrency(chosenProduct.price) : "-"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Biaya Admin</span>
                      <span className="text-[var(--color-navy)] font-medium">{chosenPayment ? formatCurrency(fee) : "-"}</span>
                    </div>
                    <Separator className="bg-gray-200 my-2" />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-[var(--color-navy)]">Total</span>
                      <span className="text-xl font-extrabold text-[var(--color-teal)]">
                        {chosenProduct ? formatCurrency(total) : "-"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isSubmitting || !canCheckout}
                    className="w-full h-12 rounded-xl bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white font-bold text-base transition-all disabled:opacity-50 mt-4 shadow-lg shadow-[var(--color-teal)]/20"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                    ) : (
                      "Bayar Sekarang"
                    )}
                  </Button>
                </div>
              </div>

              {/* FAQ Section (Desktop) */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2 text-[var(--color-navy)]">
                  <HelpCircle className="h-4 w-4" /> Bantuan Top Up
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {FAQ_ITEMS.slice(0, 3).map((faq, i) => (
                    <AccordionItem value={`faq-${i}`} key={i} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 text-xs font-semibold text-left text-[var(--color-navy)]/70 hover:text-[var(--color-navy)]">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[11px] text-gray-500 leading-relaxed pb-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
            
            {/* FAQ Mobile */}
            <div className="lg:hidden bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2 text-[var(--color-navy)]">
                <HelpCircle className="h-4 w-4" /> Cara Top Up
              </h3>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-gray-600">
                <li>Masukkan Detail Akun (User ID / Zone ID).</li>
                <li>Pilih jumlah diamond atau item yang diinginkan.</li>
                <li>Pilih metode pembayaran yang tersedia.</li>
                <li>Klik tombol Bayar Sekarang untuk checkout.</li>
                <li>Selesaikan pembayaran dan diamond otomatis masuk.</li>
              </ol>
            </div>

            {/* Dummy Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 overflow-hidden shadow-sm">
              <History className="h-8 w-8 text-[var(--color-teal)]/40 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Transaksi Terakhir</p>
                <div className="animate-pulse">
                  <p className="text-sm font-bold text-[var(--color-navy)] truncate">0812****889 top up 1050 Diamonds</p>
                  <p className="text-[10px] text-[var(--color-teal)]">Beberapa detik yang lalu</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Sticky Mobile CTA Bottom Bar ── */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }} 
          animate={{ y: 0 }} 
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Harga</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-extrabold text-[var(--color-teal)] truncate">
                  {chosenProduct ? formatCurrency(total) : "Rp 0"}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={isSubmitting || !canCheckout}
              className="shrink-0 w-[140px] h-12 rounded-xl bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-md shadow-[var(--color-teal)]/20"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Beli Sekarang"
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
