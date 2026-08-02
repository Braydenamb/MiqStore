"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppWidget() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const defaultMsg = encodeURIComponent("Halo Admin MiqStore, saya butuh bantuan mengenai transaksi top up.");
  const waUrl = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Customer Service via WhatsApp"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3 lg:px-4 lg:py-3 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle className="h-5 w-5 fill-white text-emerald-500 shrink-0" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide pr-0.5">
        CS 24/7 Online
      </span>
    </a>
  );
}
