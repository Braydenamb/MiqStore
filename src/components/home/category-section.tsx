"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 relative overflow-hidden"
      id="category-section"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] sm:text-3xl">
            Semua <span className="gradient-text">Kebutuhan Digital</span>
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
            Dari top up game sampai bayar tagihan, semua bisa dilakukan di satu
            tempat
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/${category.slug}`}
                className="group relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
                id={`category-${category.slug}`}
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
                    category.gradient
                  )}
                >
                  <category.icon className="h-7 w-7 text-white" />
                </div>

                {/* Glow effect on hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    "bg-gradient-to-br",
                    category.gradient
                  )}
                  style={{ opacity: 0 }}
                />
                <div
                  className="absolute -inset-0.5 rounded-xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))`,
                  }}
                />

                {/* Text */}
                <div className="relative">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
