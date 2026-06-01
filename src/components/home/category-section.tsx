"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/motion";

export function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 relative overflow-hidden"
      id="category-section"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--liquid-purple)" />
        <div className="orb orb-cyan h-60 w-60 top-1/4 -right-30 opacity-15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))] sm:text-3xl tracking-tight">
            Semua <span className="gradient-text">Kebutuhan Digital</span>
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
            Dari top up game sampai bayar tagihan, semua bisa dilakukan di satu tempat
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={staggerItem}>
              <Link
                href={`/${category.slug}`}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-500 hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-1"
                id={`category-${category.slug}`}
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl",
                    category.gradient
                  )}
                >
                  <category.icon className="h-6 w-6 text-white" />
                </div>

                {/* Hover glow */}
                <div
                  className="absolute -inset-0.5 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-8 bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--liquid-purple), var(--liquid-blue))`,
                  }}
                />

                {/* Text */}
                <div className="relative">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] group-hover:text-[var(--liquid-purple)] transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
