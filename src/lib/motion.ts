/**
 * MiqStore Motion System
 *
 * Liquid Cyber Pastel — Motion Philosophy:
 *   - Slow in, fast out
 *   - Soft spring physics
 *   - Layered movement with depth
 *   - Subtle, never aggressive
 */

import type { Variants } from "framer-motion";

/* ─── Spring Presets ─── */
export const spring = {
  soft: { type: "spring" as const, stiffness: 120, damping: 20 },
  medium: { type: "spring" as const, stiffness: 200, damping: 24 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 80, damping: 18 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 15 },
};

/* ─── Easing Presets ─── */
export const ease = {
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  out: [0, 0, 0.2, 1] as [number, number, number, number],
  in: [0.4, 0, 1, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

/* ─── Fade Variants ─── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: ease.smooth },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: ease.smooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ease.smooth },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ease.smooth },
  },
};

/* ─── Stagger Container ─── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

/* ─── Stagger Children ─── */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ease.smooth },
  },
};

/* ─── Card Variants ─── */
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: ease.smooth },
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: spring.soft,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/* ─── Liquid Float ─── */
export const liquidFloat: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 0.5, -0.5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ─── Page Transition ─── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: ease.out },
  },
};

/* ─── Modal/Dialog ─── */
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring.soft,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 4,
    filter: "blur(4px)",
    transition: { duration: 0.15 },
  },
};

/* ─── Bottom Sheet (Mobile) ─── */
export const bottomSheet: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: spring.medium,
  },
  exit: {
    y: "100%",
    transition: { duration: 0.25, ease: ease.in },
  },
};

/* ─── Navbar ─── */
export const navItem: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: spring.snappy },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

/* ─── Counter Animation ─── */
export const counterUp = (target: number, duration = 1.5) => ({
  from: 0,
  to: target,
  duration,
  ease: ease.out,
});

/* ─── Utility: Create delay ─── */
export const withDelay = (delay: number, variants: Variants): Variants => {
  const result: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null && "transition" in value) {
      result[key] = {
        ...value,
        transition: { ...(value.transition as object), delay },
      };
    } else {
      result[key] = value;
    }
  }
  return result;
};

/* ─── Utility: Viewport trigger ─── */
export const viewportConfig = {
  once: true,
  margin: "-80px 0px -80px 0px" as const,
} as const;
