"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Happy Customers", value: "50K+" },
  { label: "Top Ups Delivered", value: "1M+" },
  { label: "Average Rating", value: "4.9/5" },
  { label: "Uptime & Reliability", value: "99.9%" },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-[var(--color-teal)] relative overflow-hidden">
      {/* Decorative Texture */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-[var(--color-gold)] uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
