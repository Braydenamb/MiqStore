"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  Gamepad2,
  Package,
  TrendingUp,
  BarChart2,
  Percent,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cloudinaryUrl } from "@/lib/cloudinary";
import {
  createItem,
  updateItem,
  deleteItem,
  bulkUpdateItemStatus,
  bulkDeleteItems,
  bulkAdjustPrice,
  ItemFormData,
} from "@/actions/admin-items";
import { formatCurrency } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GameInfo {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  categoryName: string;
  totalItems: number;
  activeItems: number;
}

interface Item {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  amount: number;
  price: number;
  originalPrice: number | null;
  resellerPrice: number | null;
  providerCode: string | null;
  isActive: boolean;
  isPopular: boolean;
  order: number;
  salesCount: number;
  createdAt: Date;
}

interface Props {
  game: GameInfo;
  initialItems: Item[];
}

// ─── Bulk Action Bar ───────────────────────────────────────────────────────────

function BulkActionBar({
  selectedCount,
  onEnable,
  onDisable,
  onDelete,
  onPriceAdjust,
  onClear,
}: {
  selectedCount: number;
  onEnable: () => void;
  onDisable: () => void;
  onDelete: () => void;
  onPriceAdjust: (pct: number) => void;
  onClear: () => void;
}) {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [pct, setPct] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl shadow-black/50 px-4 py-3"
    >
      <span className="text-sm font-bold text-[hsl(var(--foreground))] pr-3 border-r border-[hsl(var(--border))]">
        {selectedCount} dipilih
      </span>

      <Button
        size="sm"
        variant="ghost"
        onClick={onEnable}
        className="h-8 text-emerald-400 hover:bg-emerald-400/10 text-xs font-bold"
      >
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aktifkan
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onDisable}
        className="h-8 text-slate-400 hover:bg-slate-400/10 text-xs font-bold"
      >
        <XCircle className="w-3.5 h-3.5 mr-1" /> Nonaktifkan
      </Button>

      {showPriceInput ? (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            placeholder="±%"
            className="w-20 h-8 text-xs bg-slate-900/80 border-[hsl(var(--border))] rounded-lg"
          />
          <Button
            size="sm"
            onClick={() => {
              const p = parseFloat(pct);
              if (!isNaN(p)) { onPriceAdjust(p); setShowPriceInput(false); setPct(""); }
            }}
            className="h-8 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs px-2"
          >
            <Save className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowPriceInput(false)} className="h-8 px-2">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowPriceInput(true)}
          className="h-8 text-amber-400 hover:bg-amber-400/10 text-xs font-bold"
        >
          <Percent className="w-3.5 h-3.5 mr-1" /> Sesuaikan Harga
        </Button>
      )}

      <div className="w-px h-4 bg-[hsl(var(--border))]" />

      <Button
        size="sm"
        variant="ghost"
        onClick={onDelete}
        className="h-8 text-red-400 hover:bg-red-400/10 text-xs font-bold"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
      </Button>
      <button
        onClick={onClear}
        className="h-6 w-6 flex items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Item Form Modal ───────────────────────────────────────────────────────────

const emptyForm = {
  name: "",
  description: "",
  amount: 0,
  price: 0,
  originalPrice: "",
  resellerPrice: "",
  providerCode: "",
  isActive: true,
  isPopular: false,
};

function ItemFormModal({
  gameId,
  editItem,
  onClose,
  onSaved,
}: {
  gameId: string;
  editItem: Item | null;
  onClose: () => void;
  onSaved: (item: Item, isNew: boolean) => void;
}) {
  const [form, setForm] = useState(
    editItem
      ? {
          name: editItem.name,
          description: editItem.description || "",
          amount: editItem.amount,
          price: editItem.price,
          originalPrice: editItem.originalPrice?.toString() || "",
          resellerPrice: editItem.resellerPrice?.toString() || "",
          providerCode: editItem.providerCode || "",
          isActive: editItem.isActive,
          isPopular: editItem.isPopular,
        }
      : { ...emptyForm }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setError("Nama dan Harga wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: Partial<ItemFormData> = {
      gameId,
      name: form.name,
      description: form.description || undefined,
      amount: Number(form.amount),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      resellerPrice: form.resellerPrice ? Number(form.resellerPrice) : undefined,
      providerCode: form.providerCode || undefined,
      isActive: form.isActive,
      isPopular: form.isPopular,
    };

    if (editItem) {
      const res = await updateItem(editItem.id, payload);
      if (res.success && res.data) {
        onSaved(
          {
            ...editItem,
            ...res.data,
            originalPrice: res.data.originalPrice ?? null,
            resellerPrice: res.data.resellerPrice ?? null,
            providerCode: res.data.providerCode ?? null,
            description: res.data.description ?? null,
            salesCount: editItem.salesCount,
          },
          false
        );
        onClose();
      } else {
        setError(res.error || "Gagal menyimpan.");
      }
    } else {
      const res = await createItem(payload as ItemFormData);
      if (res.success && res.data) {
        onSaved(
          {
            ...res.data,
            originalPrice: res.data.originalPrice ?? null,
            resellerPrice: res.data.resellerPrice ?? null,
            providerCode: res.data.providerCode ?? null,
            description: res.data.description ?? null,
            salesCount: 0,
          },
          true
        );
        onClose();
      } else {
        setError(res.error || "Gagal membuat item.");
      }
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-heading text-[hsl(var(--foreground))]">
            {editItem ? "Edit Item" : "Tambah Item Baru"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[hsl(var(--foreground))]">
              Nama Item <span className="text-red-400">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. 86 Diamonds"
              className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl"
            />
          </div>

          {/* Amount + Provider Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                Nominal
              </label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                placeholder="86"
                className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                Provider Code
              </label>
              <Input
                value={form.providerCode}
                onChange={(e) => setForm({ ...form, providerCode: e.target.value })}
                placeholder="SKU / kode"
                className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl font-mono text-sm"
              />
            </div>
          </div>

          {/* Price + Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                Harga Jual (IDR) <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="19000"
                className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                Harga Asli (coretan)
              </label>
              <Input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="21000"
                className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl"
              />
            </div>
          </div>

          {/* Reseller Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[hsl(var(--foreground))]">
              Harga Reseller
            </label>
            <Input
              type="number"
              value={form.resellerPrice}
              onChange={(e) => setForm({ ...form, resellerPrice: e.target.value })}
              placeholder="Opsional"
              className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[hsl(var(--foreground))]">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Catatan opsional..."
              rows={2}
              className="w-full p-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none resize-none focus:border-[hsl(var(--primary))]"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-[hsl(var(--primary))]"
              />
              <span className="text-sm font-bold text-[hsl(var(--foreground))]">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                className="w-4 h-4 accent-amber-400"
              />
              <span className="text-sm font-bold text-[hsl(var(--foreground))]">Popular</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-[hsl(var(--border))] bg-transparent"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-11 px-6"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editItem ? "Simpan Perubahan" : "Tambah Item"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GameItemsClient({ game, initialItems }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchQ =
        !searchQ ||
        item.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        item.providerCode?.toLowerCase().includes(searchQ.toLowerCase());
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" ? item.isActive : !item.isActive);
      return matchQ && matchStatus;
    });
  }, [items, searchQ, filterStatus]);

  const allSelected =
    filteredItems.length > 0 && filteredItems.every((i) => selectedIds.has(i.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const openModal = (item?: Item) => {
    setEditItem(item ?? null);
    setIsModalOpen(true);
  };

  const handleSaved = (savedItem: Item, isNew: boolean) => {
    if (isNew) {
      setItems((prev) => [...prev, savedItem]);
    } else {
      setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    setIsLoading(true);
    const res = await deleteItem(id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      alert(res.error || "Gagal menghapus item.");
    }
    setIsLoading(false);
  };

  // Bulk handlers
  const handleBulkEnable = async () => {
    setIsLoading(true);
    const ids = [...selectedIds];
    const res = await bulkUpdateItemStatus(ids, true, game.id);
    if (res.success) {
      setItems((prev) => prev.map((i) => (ids.includes(i.id) ? { ...i, isActive: true } : i)));
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const handleBulkDisable = async () => {
    setIsLoading(true);
    const ids = [...selectedIds];
    const res = await bulkUpdateItemStatus(ids, false, game.id);
    if (res.success) {
      setItems((prev) => prev.map((i) => (ids.includes(i.id) ? { ...i, isActive: false } : i)));
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selectedIds.size} item? Tindakan tidak dapat dibatalkan.`)) return;
    setIsLoading(true);
    const ids = [...selectedIds];
    const res = await bulkDeleteItems(ids, game.id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const handleBulkPriceAdjust = async (pct: number) => {
    setIsLoading(true);
    const ids = [...selectedIds];
    const res = await bulkAdjustPrice(ids, pct, game.id);
    if (res.success) {
      // Re-calculate prices locally
      setItems((prev) =>
        prev.map((i) =>
          ids.includes(i.id)
            ? { ...i, price: Math.max(0, Math.round(i.price * (1 + pct / 100))) }
            : i
        )
      );
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const activeCount = items.filter((i) => i.isActive).length;

  return (
    <div className="space-y-6 pb-20">
      {/* ── Breadcrumb ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
        <Link href="/admin/games" className="hover:text-[hsl(var(--foreground))] flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Games
        </Link>
        <span>/</span>
        <span className="text-[hsl(var(--foreground))] font-medium">{game.name}</span>
        <span>/</span>
        <span className="text-[hsl(var(--primary))] font-bold">Items</span>
      </div>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-[hsl(var(--border))] flex items-center justify-center overflow-hidden shrink-0">
            {game.image ? (
              <img
                src={game.image.startsWith("http") ? game.image : cloudinaryUrl(game.image)}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Gamepad2 className="w-7 h-7 text-[hsl(var(--muted-foreground))]" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">
              {game.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                {game.categoryName}
              </span>
              <span className="text-xs font-bold text-[hsl(var(--primary))]">
                {game.totalItems} items · {activeCount} active
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Item
        </Button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Items", value: items.length, color: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--primary))]/10", icon: Package },
          { label: "Active", value: activeCount, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
          { label: "Inactive", value: items.length - activeCount, color: "text-slate-400", bg: "bg-slate-400/10", icon: XCircle },
          { label: "Total Sales", value: items.reduce((s, i) => s + i.salesCount, 0), color: "text-amber-400", bg: "bg-amber-400/10", icon: BarChart2 },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className={`text-xl font-extrabold ${s.color}`}>{s.value.toLocaleString()}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row gap-3 bg-slate-900/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Cari item atau provider code..."
              className="h-10 pl-10 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl w-full text-[hsl(var(--foreground))]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="h-10 px-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-[hsl(var(--muted-foreground))] font-medium border-b border-[hsl(var(--border))] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[hsl(var(--primary))] cursor-pointer"
                  />
                </th>
                <th className="px-5 py-4">Item</th>
                <th className="px-5 py-4 text-right">Harga</th>
                <th className="px-5 py-4 text-right hidden sm:table-cell">Harga Asli</th>
                <th className="px-5 py-4 hidden lg:table-cell">Provider Code</th>
                <th className="px-5 py-4 text-center hidden sm:table-cell">Penjualan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-[hsl(var(--muted-foreground))]/30 mx-auto mb-3" />
                    <p className="text-[hsl(var(--muted-foreground))] font-medium">
                      {items.length === 0
                        ? "Belum ada item. Tambahkan nominal pertama!"
                        : "Tidak ada item yang cocok."}
                    </p>
                    {items.length === 0 && (
                      <Button
                        onClick={() => openModal()}
                        className="mt-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Item
                      </Button>
                    )}
                  </td>
                </tr>
              ) : null}

              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/30 transition-colors group ${
                    selectedIds.has(item.id) ? "bg-[hsl(var(--primary))]/5" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-[hsl(var(--primary))] cursor-pointer"
                    />
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[hsl(var(--foreground))]">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                        {item.description}
                      </div>
                    )}
                    {item.isPopular && (
                      <Badge className="mt-1 bg-amber-400/10 text-amber-400 border-amber-400/20 text-[10px] px-1.5 py-0">
                        ⭐ Popular
                      </Badge>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right font-bold text-[hsl(var(--foreground))]">
                    {formatCurrency(item.price)}
                  </td>

                  <td className="px-5 py-3.5 text-right text-[hsl(var(--muted-foreground))] line-through text-sm hidden sm:table-cell">
                    {item.originalPrice ? formatCurrency(item.originalPrice) : "—"}
                  </td>

                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="font-mono text-xs text-[hsl(var(--muted-foreground))] bg-slate-800/50 px-2 py-0.5 rounded">
                      {item.providerCode || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                      <TrendingUp className="w-3 h-3" />
                      {item.salesCount}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    {item.isActive ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(item)}
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={isLoading}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))] bg-slate-900/30">
          <span>
            {filteredItems.length} dari {items.length} item
            {selectedIds.size > 0 && (
              <span className="ml-2 text-[hsl(var(--primary))] font-bold">
                · {selectedIds.size} dipilih
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ── Bulk Action Bar ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <BulkActionBar
            selectedCount={selectedIds.size}
            onEnable={handleBulkEnable}
            onDisable={handleBulkDisable}
            onDelete={handleBulkDelete}
            onPriceAdjust={handleBulkPriceAdjust}
            onClear={() => setSelectedIds(new Set())}
          />
        )}
      </AnimatePresence>

      {/* ── Item Form Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <ItemFormModal
            gameId={game.id}
            editItem={editItem}
            onClose={() => { setIsModalOpen(false); setEditItem(null); }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
// trigger ts server
