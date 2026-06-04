"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const testimonials = [
  { name: "Budi Gamer", text: "Mantap banget, diamond masuk detik itu juga. Adminnya juga fast respon. Recomended pokoknya!", rating: 5, role: "Pro Player MLBB" },
  { name: "Siti Salma", text: "Harga vouchernya paling murah dari toko lain. Sering ada promo juga. Mantul dah!", rating: 5, role: "Valorant Radiant" },
  { name: "Asep Knalpot", text: "Top up FF disini gak pernah kecewa. Aman dan terpercaya. Auto booyah tiap hari!", rating: 5, role: "FF Enthusiast" },
];

export function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-[hsl(var(--card))] border-b-4 border-[hsl(var(--border))]" id="testimonial-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-teal)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--color-teal)] mb-6">
            <MessageSquare className="h-4 w-4" />
            Kata Mereka
          </div>
          <Typography.Heading level="h2">
            Review <span className="text-[var(--color-teal)]">Gamer</span>
          </Typography.Heading>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={testi.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.2 }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                ))}
              </div>
              <Typography.Body size="lg" className="mb-8 font-medium italic text-gray-700 dark:text-gray-300">
                "{testi.text}"
              </Typography.Body>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center text-[var(--color-teal)] font-bold">
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <Typography.Heading level="h4" className="text-base font-bold">
                    {testi.name}
                  </Typography.Heading>
                  <Typography.Body size="sm" color="muted">
                    {testi.role}
                  </Typography.Body>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
