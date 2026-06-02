"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const faqs = [
  { q: "Berapa lama proses top up?", a: "Proses top up otomatis 1-5 detik setelah pembayaran dikonfirmasi." },
  { q: "Metode pembayaran apa saja?", a: "Kami menerima QRIS, E-Wallet (OVO, GoPay, Dana), Transfer Bank, dan Minimarket." },
  { q: "Apakah aman 100%?", a: "Ya, kami menggunakan sistem enkripsi dan transaksi langsung ke server game. Anti ban!" },
  { q: "Bagaimana jika pesanan tidak masuk?", a: "Hubungi Customer Service kami yang online 24/7. Uang kembali 100% jika pesanan gagal." },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-[hsl(var(--background))] border-b-4 border-[hsl(var(--border))]" id="faq-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1 text-sm font-black uppercase text-[hsl(var(--foreground))] mb-4 shadow-[var(--brutal-shadow-sm)]">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-4xl font-black uppercase text-[hsl(var(--foreground))] sm:text-5xl tracking-tighter">
            Ada <span className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 inline-block -rotate-2 border-4 border-[hsl(var(--background))] shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">Pertanyaan?</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: idx * 0.1 }}
              className="border-4 border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--brutal-shadow-sm)] overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <span className="text-lg font-black uppercase text-[hsl(var(--foreground))] pr-4">{faq.q}</span>
                <ChevronDown className={`h-6 w-6 text-[hsl(var(--foreground))] transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
              </button>
              {openIdx === idx && (
                <div className="p-4 sm:p-6 border-t-4 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <p className="text-base font-bold uppercase text-[hsl(var(--foreground))]/80 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
