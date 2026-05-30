"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/utils";
import { staggerContainer, staggerItem, viewportConfig } from "@/lib/motion";

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

const statColors = [
  "var(--liquid-purple)",
  "var(--liquid-blue)",
  "var(--liquid-cyan)",
  "var(--liquid-pink)",
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section ref={ref} className="py-16 sm:py-24" id="stats-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12">
          {/* Aurora orbs */}
          <div className="orb orb-purple h-64 w-64 -top-20 -left-20 animate-glow-pulse" />
          <div className="orb orb-blue h-48 w-48 -bottom-16 -right-16 animate-glow-pulse" style={{ animationDelay: "2s" }} />

          {/* Noise */}
          <div className="absolute inset-0 rounded-3xl noise-overlay pointer-events-none" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center relative"
              >
                {/* Subtle glow dot */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full blur-2xl opacity-20"
                  style={{ background: statColors[i] }}
                />
                <div
                  className="relative text-3xl font-extrabold sm:text-4xl lg:text-5xl"
                  style={{
                    background: `linear-gradient(135deg, ${statColors[i]}, ${statColors[(i + 1) % 4]})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
