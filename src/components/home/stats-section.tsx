"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/utils";

function AnimatedCounter({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  const displayValue =
    target >= 1000
      ? formatCompactNumber(count)
      : target % 1 !== 0
        ? count.toFixed(1)
        : count.toString();

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-20" id="stats-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl glass p-8 sm:p-12">
          {/* Background glow */}
          <div className="absolute top-0 left-1/4 h-48 w-48 rounded-full bg-purple-600/10 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-[80px]" />

          <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-[hsl(var(--foreground))] sm:text-4xl lg:text-5xl gradient-text">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </div>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
