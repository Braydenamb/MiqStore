import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { ProductItem } from "@/lib/constants";
import { StepBadge } from "./step-badge";

interface DenominationGridProps {
  products: ProductItem[];
  selectedProduct: string | null;
  onSelectProduct: (id: string) => void;
  stepNum: number;
}

export function DenominationGrid({ products, selectedProduct, onSelectProduct, stepNum }: DenominationGridProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
      <StepBadge num={stepNum} title="Pilih Nominal" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product.id)}
            className={cn(
              "relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer overflow-hidden",
              selectedProduct === product.id
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 shadow-md transform scale-[1.02]"
                : "border-gray-100 bg-white hover:border-[hsl(var(--primary))]/30 hover:bg-gray-50 hover:-translate-y-0.5"
            )}
          >
            {product.popular && (
              <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-[hsl(var(--foreground))] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm">
                HOT
              </div>
            )}
            <span className="text-sm font-bold text-[hsl(var(--foreground))] leading-tight mb-1 pr-4">
              {product.name}
            </span>
            <span className="text-xs font-bold text-[hsl(var(--primary))] mt-auto drop-shadow-sm">
              {formatCurrency(product.price)}
            </span>
            {selectedProduct === product.id && (
              <motion.div layoutId="product-check" className="absolute bottom-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))] drop-shadow-sm" />
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
