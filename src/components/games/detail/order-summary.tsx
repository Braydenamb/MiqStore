import { Info, HelpCircle, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { GameField, FAQ_ITEMS, ProductItem, PaymentMethod } from "@/lib/constants";

interface OrderSummaryProps {
  game: { name: string; fields: GameField[] };
  chosenProduct: ProductItem | undefined;
  chosenPayment: PaymentMethod | undefined;
  fieldValues: Record<string, string>;
  fee: number;
  total: number;
  canCheckout: boolean;
  isSubmitting: boolean;
  onCheckout: () => void;
}

export function OrderSummary({
  game,
  chosenProduct,
  chosenPayment,
  fieldValues,
  fee,
  total,
  canCheckout,
  isSubmitting,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Sticky Order Summary (Desktop Only) */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-[hsl(var(--primary))]/20 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent opacity-50" />
          
          <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-[hsl(var(--foreground))]">
            <Info className="h-5 w-5 text-[hsl(var(--primary))]" /> Ringkasan Pesanan
          </h3>

          <div className="space-y-4">
            {/* Game & Item */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-[hsl(var(--foreground))]/60">Produk</span>
              <div className="text-right">
                <p className="text-sm font-bold text-[hsl(var(--foreground))]">{game.name}</p>
                <p className="text-xs text-[hsl(var(--primary))] font-medium">{chosenProduct?.name || "-"}</p>
              </div>
            </div>
            
            <Separator className="bg-white/10" />
            
            {/* ID */}
            {game.fields.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-[hsl(var(--foreground))]/60">Detail Akun</span>
                <div className="text-right">
                  <p className="text-sm font-mono text-[hsl(var(--foreground))] max-w-[150px] truncate">
                    {fieldValues[game.fields[0]?.key] || "-"}
                  </p>
                </div>
              </div>
            )}

            <Separator className="bg-white/10" />

            {/* Payment */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-[hsl(var(--foreground))]/60">Pembayaran</span>
              <span className="text-sm font-bold text-[hsl(var(--foreground))]">
                {chosenPayment?.name || "-"}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="bg-black/20 rounded-xl p-3 space-y-2 border border-white/5 mt-4 shadow-inner">
              <div className="flex justify-between text-xs">
                <span className="text-[hsl(var(--foreground))]/60">Harga</span>
                <span className="text-[hsl(var(--foreground))] font-medium">{chosenProduct ? formatCurrency(chosenProduct.price) : "-"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[hsl(var(--foreground))]/60">Biaya Admin</span>
                <span className="text-[hsl(var(--foreground))] font-medium">{chosenPayment ? formatCurrency(fee) : "-"}</span>
              </div>
              <Separator className="bg-white/10 my-2" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-[hsl(var(--foreground))]">Total</span>
                <span className="text-xl font-extrabold text-[hsl(var(--primary))]">
                  {chosenProduct ? formatCurrency(total) : "-"}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={onCheckout}
              disabled={isSubmitting || !canCheckout}
              className="w-full h-12 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-bold text-base transition-all disabled:opacity-50 mt-4 shadow-lg shadow-[hsl(var(--primary))]/20"
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
        <div className="mt-6 bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl">
          <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2 text-[hsl(var(--foreground))]">
            <HelpCircle className="h-4 w-4" /> Bantuan Top Up
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.slice(0, 3).map((faq, i) => (
              <AccordionItem value={`faq-${i}`} key={i} className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 text-xs font-semibold text-left text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[11px] text-[hsl(var(--foreground))]/60 leading-relaxed pb-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Dummy Recent Orders (Desktop) */}
        <div className="mt-6 bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex items-center gap-3 overflow-hidden shadow-xl">
          <History className="h-8 w-8 text-[hsl(var(--primary))]/40 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[hsl(var(--foreground))]/60 font-medium mb-0.5">Transaksi Terakhir</p>
            <div className="animate-pulse">
              <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">0812****889 top up 1050 Diamonds</p>
              <p className="text-[10px] text-[hsl(var(--primary))]">Beberapa detik yang lalu</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Extra Sections */}
      <div className="lg:hidden space-y-6">
        {/* FAQ Mobile */}
        <div className="bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl">
          <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2 text-[hsl(var(--foreground))]">
            <HelpCircle className="h-4 w-4" /> Cara Top Up
          </h3>
          <ol className="list-decimal pl-4 space-y-2 text-xs text-[hsl(var(--foreground))]/70">
            <li>Masukkan Detail Akun (User ID / Zone ID).</li>
            <li>Pilih jumlah diamond atau item yang diinginkan.</li>
            <li>Pilih metode pembayaran yang tersedia.</li>
            <li>Klik tombol Bayar Sekarang untuk checkout.</li>
            <li>Selesaikan pembayaran dan diamond otomatis masuk.</li>
          </ol>
        </div>

        {/* Dummy Recent Orders (Mobile) */}
        <div className="bg-[hsl(var(--card))]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex items-center gap-3 overflow-hidden shadow-xl">
          <History className="h-8 w-8 text-[hsl(var(--primary))]/40 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[hsl(var(--foreground))]/60 font-medium mb-0.5">Transaksi Terakhir</p>
            <div className="animate-pulse">
              <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">0812****889 top up 1050 Diamonds</p>
              <p className="text-[10px] text-[hsl(var(--primary))]">Beberapa detik yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
