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
          <div className="inline-flex items-center gap-2 border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1 text-sm font-black uppercase text-[hsl(var(--foreground))] mb-4 shadow-[var(--brutal-shadow-sm)]">
            <MessageSquare className="h-4 w-4" />
            Kata Mereka
          </div>
          <h2 className="text-4xl font-black uppercase text-[hsl(var(--foreground))] sm:text-5xl tracking-tighter">
            Review <span className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 inline-block rotate-1 border-4 border-[hsl(var(--background))] shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">Gamer</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={testi.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.2 }}
              className="border-4 border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-[var(--brutal-shadow)] transition-transform hover:-translate-y-2"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[hsl(var(--foreground))] text-[hsl(var(--foreground))]" />
                ))}
              </div>
              <p className="text-lg font-bold uppercase text-[hsl(var(--foreground))] mb-6 line-clamp-4 leading-relaxed">
                "{testi.text}"
              </p>
              <div className="border-t-4 border-[hsl(var(--border))] pt-4">
                <h4 className="font-black uppercase text-[hsl(var(--foreground))] text-xl">{testi.name}</h4>
                <p className="text-sm font-bold uppercase text-[hsl(var(--foreground))]/60">{testi.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
