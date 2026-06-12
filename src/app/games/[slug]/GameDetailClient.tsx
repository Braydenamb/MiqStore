"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PAYMENT_METHODS } from "@/lib/constants";
import { useCheckoutStore } from "@/store/useCheckoutStore";

import { GameBanner } from "@/components/games/detail/game-banner";
import { UserIdForm } from "@/components/games/detail/user-id-form";
import { DenominationGrid } from "@/components/games/detail/denomination-grid";
import { PaymentMethodList } from "@/components/games/detail/payment-method-list";
import { OrderSummary } from "@/components/games/detail/order-summary";
import { MobileCheckoutCTA } from "@/components/games/detail/mobile-checkout-cta";

const paymentCategoryLabels: Record<string, string> = {
  qris: "QRIS",
  "e-wallet": "E-Wallet",
  "virtual-account": "Virtual Account",
  retail: "Retail",
  "credit-card": "Credit Card",
};

export function GameDetailClient({ game, products }: { game: any, products: any[] }) {
  const router = useRouter();
  const slug = game?.slug;

  const checkoutStore = useCheckoutStore();

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsHydrated(true);
    const saved = localStorage.getItem(`miq_saved_id_${slug}`);
    if (saved) {
      try {
        setFieldValues(JSON.parse(saved));
      } catch (e) {}
    }
  }, [slug]);

  const handleFieldChange = (key: string, value: string) => {
    const newValues = { ...fieldValues, [key]: value };
    setFieldValues(newValues);
    if (slug) {
      localStorage.setItem(`miq_saved_id_${slug}`, JSON.stringify(newValues));
    }
  };

  const paymentGroups = useMemo(() => {
    const groups: Record<string, typeof PAYMENT_METHODS> = {};
    PAYMENT_METHODS.forEach((pm) => {
      if (!groups[pm.category]) groups[pm.category] = [];
      groups[pm.category].push(pm);
    });
    return groups;
  }, []);

  if (!game) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[hsl(var(--background))] texture-overlay text-[hsl(var(--foreground))]">
        <div className="text-center relative z-10">
          <Gamepad2 className="h-16 w-16 text-[hsl(var(--primary))]/40 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold font-heading mb-2">Game tidak ditemukan</h2>
          <Button variant="outline" className="mt-4 border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-transparent hover:bg-[hsl(var(--primary))]/10" asChild>
            <Link href="/games">Kembali ke katalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const chosenProduct = products.find((p) => p.id === selectedProduct);
  const chosenPayment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

  const fee = chosenPayment
    ? chosenPayment.feeType === "flat"
      ? chosenPayment.fee
      : chosenProduct
      ? (chosenProduct.price * chosenPayment.fee) / 100
      : 0
    : 0;

  const total = chosenProduct ? chosenProduct.price + fee : 0;

  // The fields might be JSON from Prisma, handle it
  const gameFields = Array.isArray(game.fields) ? game.fields : [];

  const canCheckout =
    gameFields.every((f: any) => fieldValues[f.key]?.trim()) &&
    selectedProduct &&
    selectedPayment;

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setIsSubmitting(true);
    
    checkoutStore.setGame({
      id: game.slug,
      name: game.name,
      image: game.image,
      publisher: game.publisher || game.provider?.name || "Unknown",
    });
    checkoutStore.setSelectedProduct({
      id: chosenProduct!.id,
      name: chosenProduct!.name,
      price: chosenProduct!.price,
    });
    checkoutStore.setSelectedPayment({
      id: chosenPayment!.id,
      name: chosenPayment!.name,
      logo: "",
      fee: fee,
    });

    const userIdKey = gameFields[0]?.key;
    const zoneIdKey = gameFields[1]?.key;
    checkoutStore.setUserId(userIdKey ? fieldValues[userIdKey] || "" : "");
    checkoutStore.setZoneId(zoneIdKey ? fieldValues[zoneIdKey] || "" : "");

    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay text-[hsl(var(--foreground))] pb-44 lg:pb-16 font-sans">
      <GameBanner game={game} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid gap-8 lg:grid-cols-12 relative">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-8 space-y-6">
            <UserIdForm 
              fields={gameFields}
              fieldValues={fieldValues}
              isHydrated={isHydrated}
              onFieldChange={handleFieldChange}
            />

            <DenominationGrid 
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              stepNum={gameFields.length > 0 ? 2 : 1}
            />

            <PaymentMethodList 
              paymentGroups={paymentGroups}
              paymentCategoryLabels={paymentCategoryLabels}
              selectedPayment={selectedPayment}
              onSelectPayment={setSelectedPayment}
              stepNum={gameFields.length > 0 ? 3 : 2}
            />
          </div>

          {/* Right Column (Sidebar) */}
          <OrderSummary 
            game={{...game, fields: gameFields}}
            chosenProduct={chosenProduct}
            chosenPayment={chosenPayment}
            fieldValues={fieldValues}
            fee={fee}
            total={total}
            canCheckout={!!canCheckout}
            isSubmitting={isSubmitting}
            onCheckout={handleCheckout}
          />

        </div>
      </div>

      {/* Mobile CTA */}
      <MobileCheckoutCTA 
        chosenProduct={chosenProduct}
        total={total}
        canCheckout={!!canCheckout}
        isSubmitting={isSubmitting}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
