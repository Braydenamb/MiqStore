import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ProductItem } from "@/lib/constants";

interface MobileCheckoutCTAProps {
  chosenProduct: ProductItem | undefined;
  total: number;
  canCheckout: boolean;
  isSubmitting: boolean;
  onCheckout: () => void;
}

export function MobileCheckoutCTA({
  chosenProduct,
  total,
  canCheckout,
  isSubmitting,
  onCheckout,
}: MobileCheckoutCTAProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-[76px] left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Harga</p>
            <p className="text-lg font-extrabold text-[hsl(var(--primary))]">
              {chosenProduct ? formatCurrency(total) : "Rp 0"}
            </p>
          </div>
          <Button
            size="lg"
            onClick={onCheckout}
            disabled={isSubmitting || !canCheckout}
            className="w-full h-14 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-bold text-base transition-all disabled:opacity-50 shadow-md shadow-[hsl(var(--primary))]/20"
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
  );
}
