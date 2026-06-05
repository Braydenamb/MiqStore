import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepBadge } from "./step-badge";
import { PaymentMethod } from "@/lib/constants";

interface PaymentMethodListProps {
  paymentGroups: Record<string, PaymentMethod[]>;
  paymentCategoryLabels: Record<string, string>;
  selectedPayment: string | null;
  onSelectPayment: (id: string) => void;
  stepNum: number;
}

export function PaymentMethodList({
  paymentGroups,
  paymentCategoryLabels,
  selectedPayment,
  onSelectPayment,
  stepNum,
}: PaymentMethodListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm">
      <StepBadge num={stepNum} title="Metode Pembayaran" />
      <Accordion type="single" collapsible defaultValue="e-wallet" className="space-y-3">
        {Object.entries(paymentGroups).map(([category, methods]) => (
          <AccordionItem value={category} key={category} className="border border-gray-100 bg-gray-50 rounded-xl px-2 overflow-hidden data-[state=open]:border-[hsl(var(--primary))]/30 transition-colors">
            <AccordionTrigger className="hover:no-underline py-4 px-3 text-sm font-bold uppercase tracking-wider text-[hsl(var(--foreground))]/80 data-[state=open]:text-[hsl(var(--primary))]">
              {paymentCategoryLabels[category] || category}
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {methods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => onSelectPayment(pm.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 cursor-pointer text-left",
                      selectedPayment === pm.id
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 shadow-md transform scale-[1.01]"
                        : "border-gray-200 bg-white hover:border-[hsl(var(--primary))]/30 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-[hsl(var(--foreground))] shrink-0">
                      {pm.name.slice(0, 2)}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{pm.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                        {pm.fee === 0 ? "Bebas Biaya Admin" : pm.feeType === "flat" ? `+${formatCurrency(pm.fee)}` : `+${pm.fee}%`}
                      </p>
                    </div>
                    {selectedPayment === pm.id && (
                      <motion.div layoutId="payment-check" className="shrink-0 text-[hsl(var(--primary))]">
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
  );
}
