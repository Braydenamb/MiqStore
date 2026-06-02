"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Grid, Smartphone, Monitor, Ticket, Coins } from "lucide-react";
import { fadeUp } from "@/lib/motion";

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
          <div className="inline-flex items-center gap-2 border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1 text-sm font-black uppercase text-[hsl(var(--foreground))] mb-4 shadow-[var(--brutal-shadow-sm)]">
            <Grid className="h-4 w-4" />
            Kategori
          </div>
          <h2 className="text-4xl font-black uppercase text-[hsl(var(--foreground))] sm:text-5xl tracking-tighter">
            Jelajahi <span className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 inline-block -rotate-1 border-4 border-[hsl(var(--background))] shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">Katalog</span>
          </h2>
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
                className="group block border-4 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center shadow-[var(--brutal-shadow)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[var(--brutal-shadow-lg)]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center border-4 border-[hsl(var(--border))] bg-[hsl(var(--background))] mb-4 group-hover:bg-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-foreground))] transition-colors">
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black uppercase text-[hsl(var(--foreground))]">
                  {category.name}
                </h3>
                <p className="mt-2 inline-block border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-2 py-0.5 text-xs font-bold uppercase">
                  {category.count} Item
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
