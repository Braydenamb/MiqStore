/**
 * Shared TypeScript types for MiqStore.
 * Derived from Prisma models with common include shapes.
 * Use these instead of `any` in component props.
 */

import type { Product, Category, ProductItem } from "@prisma/client";

// ── Public Game (from getPublicGames / getPopularGames) ──────────────────────
export interface PublicGame extends Product {
  category: Category | null;
  _count?: { items: number };
}

// ── Game Detail (from getGameDetails) ────────────────────────────────────────
export interface GameDetail extends Product {
  category: Category | null;
  items: ProductItem[];
}

// ── Admin Dashboard Types ────────────────────────────────────────────────────
export interface DashboardRecentOrder {
  id: string;
  user: string;
  game: string;
  product: string;
  total: number;
  status: string;
  date: string;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  image: string | null;
  sales: number;
  revenue: number;
}

export interface DashboardRecentUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
}

export interface DashboardChartPoint {
  name: string;
  revenue: number;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  revenueTodayStats: number;
  ordersToday: number;
  successRateToday: number;
  totalGames: number;
  totalItems: number;
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
  recentUsers: DashboardRecentUser[];
  chartData: DashboardChartPoint[];
}

// ── Admin Stats Widget Types ─────────────────────────────────────────────────
export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  color: string;
  href?: string;
}

// ── Cloudinary Widget Result ─────────────────────────────────────────────────
export interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
}

export interface CloudinaryWidgetInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}
