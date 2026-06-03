"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Tag, Clock } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Top Up", subtitle: "Delivered in seconds" },
  { icon: ShieldCheck, title: "Secure Payments", subtitle: "100% safe checkout" },
  { icon: Tag, title: "Best Prices", subtitle: "Unbeatable deals" },
  { icon: Clock, title: "24/7 Support", subtitle: "Always here for you" },
];

export function FeatureStrip() {
  return (
    <section className="py-12 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8 bg-white/50 backdrop-blur-sm rounded-3xl p-8 premium-shadow border border-white/60">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-teal)] border border-[var(--color-gold)]/30">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-h3 text-base sm:text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-body text-xs sm:text-sm">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
