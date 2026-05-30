"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewportConfig,
} from "@/lib/motion";

export function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 relative overflow-hidden"
      id="testimonial-section"
    >
      {/* Subtle aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple h-96 w-96 -top-48 left-1/4 opacity-30" />
        <div className="orb orb-blue h-72 w-72 -bottom-36 right-1/3 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <Badge variant="glow" className="mb-3 gap-1">
            ⭐ Testimoni
          </Badge>
          <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))] sm:text-3xl tracking-tight">
            Dipercaya{" "}
            <span className="gradient-text">Ribuan Gamer</span>
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
            Lihat apa kata mereka tentang pengalaman top up di MiqStore
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={staggerItem}
              className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-500 hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.03)]"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-7 w-7 text-[var(--liquid-purple)]/10 group-hover:text-[var(--liquid-purple)]/20 transition-colors duration-300" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      "h-3.5 w-3.5",
                      j < testimonial.rating
                        ? "fill-[var(--liquid-amber)] text-[var(--liquid-amber)]"
                        : "text-[hsl(var(--muted))]"
                    )}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--liquid-purple)]/15 to-[var(--liquid-blue)]/15 border border-[hsl(var(--border))]">
                  <User className="h-4 w-4 text-[var(--liquid-purple)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {testimonial.game}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
