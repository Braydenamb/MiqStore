"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Grid, Smartphone, Monitor, Ticket, Coins } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { Typography } from "@/components/typography";

const categories = [
  { id: "mobile", name: "Mobile Games", icon: Smartphone, count: 42 },
  { id: "pc", name: "PC Games", icon: Monitor, count: 28 },
  { id: "voucher", name: "Voucher", icon: Ticket, count: 15 },
  { id: "crypto", name: "E-Wallet", icon: Coins, count: 8 },
];

export function CategorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-[hsl(var(--background))] border-b-4 border-[hsl(var(--border))]" id="category-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-4 py-1.5 text-sm font-semibold text-[hsl(var(--primary))] mb-6">
            <Grid className="h-4 w-4" />
            Kategori
          </div>
          <Typography.Heading level="h2">
            Jelajahi <span className="text-[hsl(var(--primary))]">Katalog</span>
          </Typography.Heading>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={`/categories/${category.id}`}
                className="group block rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--primary))]/5 mb-4 group-hover:bg-[hsl(var(--primary))] group-hover:text-white transition-colors text-[hsl(var(--primary))]">
                  <category.icon className="h-8 w-8" />
                </div>
                <Typography.Heading level="h4" className="mb-2">
                  {category.name}
                </Typography.Heading>
                <Typography.Body size="sm" color="muted">
                  {category.count} Item
                </Typography.Body>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
