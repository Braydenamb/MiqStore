"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 relative overflow-hidden"
      id="testimonial-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge variant="glow" className="mb-3">
            ⭐ Testimoni
          </Badge>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] sm:text-3xl">
            Dipercaya{" "}
            <span className="gradient-text">Ribuan Gamer</span>
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
            Lihat apa kata mereka tentang pengalaman top up di MiqStore
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-8 w-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      "h-4 w-4",
                      j < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-[hsl(var(--border))]">
                  <User className="h-5 w-5 text-purple-400" />
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
        </div>
      </div>
    </section>
  );
}
