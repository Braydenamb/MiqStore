import React from "react";
import { cn } from "@/lib/utils";

type TypographyColor =
  | "primary"
  | "secondary"
  | "muted"
  | "success"
  | "warning"
  | "danger"
  | "brand-gradient";

interface BaseTypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  color?: TypographyColor;
  as?: React.ElementType;
  className?: string;
}

const getColorClass = (color?: TypographyColor) => {
  switch (color) {
    case "primary": return "typo-color-primary";
    case "secondary": return "typo-color-secondary";
    case "muted": return "typo-color-muted";
    case "success": return "typo-color-success";
    case "warning": return "typo-color-warning";
    case "danger": return "typo-color-danger";
    case "brand-gradient": return "text-gradient";
    default: return "";
  }
};

// --- Display ---
interface DisplayProps extends BaseTypographyProps {
  size?: "xl" | "lg" | "md";
}

export function Display({ children, size = "xl", color = "primary", as: Component = "h1", className, ...props }: DisplayProps) {
  const sizeClass = {
    xl: "typo-display-xl",
    lg: "typo-display-lg",
    md: "typo-display-md",
  }[size];

  return (
    <Component className={cn(sizeClass, getColorClass(color), className)} {...props}>
      {children}
    </Component>
  );
}

// --- Heading ---
interface HeadingProps extends BaseTypographyProps {
  level?: "h1" | "h2" | "h3" | "h4";
}

export function Heading({ children, level = "h2", color = "primary", as, className, ...props }: HeadingProps) {
  const Component = as || level;
  const levelClass = {
    h1: "typo-h1",
    h2: "typo-h2",
    h3: "typo-h3",
    h4: "typo-h4",
  }[level];

  return (
    <Component className={cn(levelClass, getColorClass(color), className)} {...props}>
      {children}
    </Component>
  );
}

// --- Body ---
interface BodyProps extends BaseTypographyProps {
  size?: "lg" | "base" | "sm";
}

export function Body({ children, size = "base", color = "secondary", as: Component = "p", className, ...props }: BodyProps) {
  const sizeClass = {
    lg: "typo-body-lg",
    base: "typo-body",
    sm: "typo-body-sm",
  }[size];

  return (
    <Component className={cn(sizeClass, getColorClass(color), className)} {...props}>
      {children}
    </Component>
  );
}

// --- Caption ---
export function Caption({ children, color = "muted", as: Component = "span", className, ...props }: BaseTypographyProps) {
  return (
    <Component className={cn("typo-caption", getColorClass(color), className)} {...props}>
      {children}
    </Component>
  );
}

// --- Label ---
export function Label({ children, color = "primary", as: Component = "span", className, ...props }: BaseTypographyProps) {
  return (
    <Component className={cn("typo-label", getColorClass(color), className)} {...props}>
      {children}
    </Component>
  );
}

// Main export object
export const Typography = {
  Display,
  Heading,
  Body,
  Caption,
  Label,
};
