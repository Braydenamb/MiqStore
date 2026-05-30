"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Gamepad2,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, cn } from "@/lib/utils";
import { POPULAR_GAMES } from "@/lib/constants";

const mockProducts = POPULAR_GAMES.map((game, i) => ({
  id: game.id,
  name: game.name,
  slug: game.slug,
  publisher: game.publisher,
  category: game.category,
  items: Math.floor(Math.random() * 8) + 4,
  totalSales: Math.floor(Math.random() * 15000) + 1000,
  revenue: Math.floor(Math.random() * 500000000) + 50000000,
  isActive: i !== 7,
  isPopular: game.popular,
  color: game.color,
}));

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Kelola semua produk game dan voucher
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">Semua Kategori</option>
          <option value="mobile">Mobile</option>
          <option value="pc">PC</option>
          <option value="console">Console</option>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card
              className={cn(
                "card-hover relative overflow-hidden",
                !product.isActive && "opacity-60"
              )}
            >
              {/* Color bar */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: product.color }}
              />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: product.color + "20" }}
                    >
                      <Gamepad2
                        className="h-5 w-5"
                        style={{ color: product.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{product.name}</h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {product.publisher}
                      </p>
                    </div>
                  </div>
                  {product.isPopular && (
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted))]">
                    <p className="text-sm font-bold">{product.items}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Items
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted))]">
                    <p className="text-sm font-bold">
                      {(product.totalSales / 1000).toFixed(1)}k
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Sales
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[hsl(var(--muted))]">
                    <p className="text-sm font-bold">
                      {(product.revenue / 1000000).toFixed(0)}M
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Revenue
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={product.isActive ? "success" : "destructive"}
                      className="text-[10px]"
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
