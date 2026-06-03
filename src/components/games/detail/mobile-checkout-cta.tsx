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
            onClick={onCheckout}
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
  );
}
