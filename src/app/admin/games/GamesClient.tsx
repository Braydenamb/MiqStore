"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Gamepad2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Loader2,
  Package,
  ExternalLink,
  Eye,
  AlertTriangle,
  ChevronDown,
  Filter,
  SortAsc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/admin/UploadZone";
import { MultiUploadZone } from "@/components/admin/MultiUploadZone";
import { cloudinaryUrl } from "@/lib/cloudinary";
import {
  createGame,
  updateGame,
  deleteGame,
  toggleGameStatus,
  GameFormData,
} from "@/actions/admin-games";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Game = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  isPopular: boolean;
  image: string | null;
  banner: string | null;
  gallery: string[];
  categoryId: string;
  providerId: string | null;
  gameType: string | null;
  publisher: string | null;
  updatedAt: Date;
  category: { id: string; name: string; slug: string };
  provider: { id: string; name: string } | null;
  _count: { items: number; transactions: number };
  activeItemCount: number;
};

type Category = { id: string; name: string; slug: string };
type Provider = { id: string; name: string; slug: string };

interface Props {
  initialGames: Game[];
  stats: { total: number; active: number; inactive: number; totalItems: number };
  categories: Category[];
  providers: Provider[];
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function GameHealthDot({ game }: { game: Game }) {
  if (!game.isActive) {
    return <div className="w-2 h-2 rounded-full bg-slate-500" title="Inactive" />;
  }
  if (game._count.items === 0) {
    return (
      <div
        className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
        title="Active — No items yet"
      />
    );
  }
  if (game.activeItemCount === 0) {
    return (
      <div
        className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
        title="Active — All items inactive"
      />
    );
  }
  return <div className="w-2 h-2 rounded-full bg-emerald-400" title="Active" />;
}

function ActionDropdown({
  game,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  game: Game;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-lg"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-48 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden py-1"
          >
            <Link
              href={`/top-up/${game.slug}`}
              target="_blank"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="w-4 h-4" />
              View Store Page
            </Link>
            <Link
              href={`/admin/games/${game.id}/items`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Package className="w-4 h-4" />
              Manage Items
            </Link>
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Game
            </button>
            <button
              onClick={() => { onToggleStatus(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              {game.isActive ? (
                <><XCircle className="w-4 h-4" /> Deactivate</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Activate</>
              )}
            </button>
            <div className="my-1 border-t border-[hsl(var(--border))]" />
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Game
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const initialFormState: GameFormData = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  isPopular: false,
  categoryId: "",
  providerId: "",
  gameType: "mobile",
  publisher: "",
  image: "",
  banner: "",
  gallery: [],
};

export default function GamesClient({ initialGames, stats, categories, providers }: Props) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GameFormData>(initialFormState);

  // Filters (client-side for now)
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (game: Game) => {
    setFormData({
      name: game.name,
      slug: game.slug,
      description: game.description || "",
      isActive: game.isActive,
      isPopular: game.isPopular,
      categoryId: game.categoryId,
      providerId: game.providerId || "",
      gameType: game.gameType || "mobile",
      publisher: game.publisher || "",
      image: game.image || "",
      banner: game.banner || "",
      gallery: game.gallery || [],
    });
    setEditingId(game.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus game ini? Tindakan tidak bisa dibatalkan.")) return;
    setIsLoading(true);
    const res = await deleteGame(id);
    if (res.success) {
      setGames((prev) => prev.filter((g) => g.id !== id));
    } else {
      alert(res.error || "Gagal menghapus game.");
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (game: Game) => {
    const res = await toggleGameStatus(game.id, !game.isActive);
    if (res.success) {
      setGames((prev) =>
        prev.map((g) => (g.id === game.id ? { ...g, isActive: !g.isActive } : g))
      );
    } else {
      alert(res.error || "Gagal mengubah status.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      alert("Nama dan Slug wajib diisi.");
      return;
    }

    setIsLoading(true);

    if (editingId) {
      const res = await updateGame(editingId, formData);
      if (res.success && res.data) {
        setGames((prev) =>
          prev.map((g) =>
            g.id === editingId
              ? { ...g, ...res.data, activeItemCount: g.activeItemCount }
              : g
          )
        );
        resetForm();
      } else {
        alert(res.error || "Gagal memperbarui game.");
      }
    } else {
      const res = await createGame(formData);
      if (res.success && res.data) {
        setGames((prev) => [
          {
            ...res.data,
            category: categories.find((c) => c.id === formData.categoryId) ?? {
              id: formData.categoryId,
              name: "Unknown",
              slug: "",
            },
            provider: providers.find((p) => p.id === formData.providerId) ?? null,
            _count: { items: 0, transactions: 0 },
            activeItemCount: 0,
          } as unknown as Game,
          ...prev,
        ]);
        resetForm();
      } else {
        alert(res.error || "Gagal membuat game.");
      }
    }

    setIsLoading(false);
  };

  // Auto-slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, name, slug: prev.slug || slug }));
  };

  // Filtered games
  const filteredGames = games.filter((g) => {
    const matchQ = !searchQ || g.name.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus =
      filterStatus === "all" || (filterStatus === "active" ? g.isActive : !g.isActive);
    const matchCategory = filterCategory === "all" || g.categoryId === filterCategory;
    return matchQ && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">
            Games Management
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Kelola semua game, kategori, dan status ketersediaan.
          </p>
        </div>
        <Button
          onClick={() => (isFormOpen && !editingId ? resetForm() : setIsFormOpen(true))}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 transition-all h-12 px-6"
        >
          {isFormOpen && !editingId ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" /> Add Game
            </>
          )}
        </Button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Games", value: stats.total, color: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--primary))]/10" },
          { label: "Active", value: stats.active, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Inactive", value: stats.inactive, color: "text-slate-400", bg: "bg-slate-400/10" },
          { label: "Total Items", value: stats.totalItems, color: "text-amber-400", bg: "bg-amber-400/10" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <Gamepad2 className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className={`text-xl font-extrabold ${s.color}`}>{s.value.toLocaleString()}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Form ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl">
              <h2 className="text-lg font-bold font-heading text-[hsl(var(--foreground))] mb-6">
                {editingId ? "Edit Game" : "Tambah Game Baru"}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Text Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                      Nama Game <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Mobile Legends"
                      className="h-12 bg-slate-900/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-[hsl(var(--foreground))]"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                      Slug (URL) <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. mobile-legends"
                      className="h-12 bg-slate-900/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-[hsl(var(--foreground))] font-mono text-sm"
                    />
                  </div>

                  {/* Publisher */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                      Publisher
                    </label>
                    <Input
                      value={formData.publisher || ""}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="e.g. Moonton"
                      className="h-12 bg-slate-900/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-[hsl(var(--foreground))]"
                    />
                  </div>

                  {/* Category + Provider */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                        Kategori
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full h-12 px-3 bg-slate-900/50 border border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none"
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                        Provider
                      </label>
                      <select
                        value={formData.providerId || ""}
                        onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                        className="w-full h-12 px-3 bg-slate-900/50 border border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none"
                      >
                        <option value="">Manual</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Game Type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                      Tipe Game
                    </label>
                    <div className="flex gap-2">
                      {["mobile", "pc", "console"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, gameType: type })}
                          className={`flex-1 h-10 rounded-xl text-sm font-bold capitalize transition-all ${
                            formData.gameType === type
                              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                              : "bg-slate-900/50 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deskripsi singkat untuk halaman game..."
                      className="w-full h-20 p-3 bg-slate-900/50 border border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none resize-none"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 accent-[hsl(var(--primary))]"
                      />
                      <span className="text-sm font-bold text-[hsl(var(--foreground))]">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="w-4 h-4 accent-[hsl(var(--primary))]"
                      />
                      <span className="text-sm font-bold text-[hsl(var(--foreground))]">Popular</span>
                    </label>
                  </div>
                </div>

                {/* Right: Images */}
                <div className="space-y-5">
                  <UploadZone
                    label="Banner Game"
                    recommendedAspect="16:9 / 1920×1080px"
                    defaultValue={formData.banner || ""}
                    onUpload={(publicId) => setFormData({ ...formData, banner: publicId })}
                  />
                  <UploadZone
                    label="Icon / Thumbnail"
                    recommendedAspect="1:1 / 512×512px"
                    defaultValue={formData.image || ""}
                    onUpload={(publicId) => setFormData({ ...formData, image: publicId })}
                  />
                  <MultiUploadZone
                    label="Gallery Game"
                    defaultValues={formData.gallery || []}
                    onUpdate={(publicIds) => setFormData({ ...formData, gallery: publicIds })}
                  />
                  <div className="pt-2 flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="rounded-xl border-[hsl(var(--border))] bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-12 px-8"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId ? "Simpan Perubahan" : "Buat Game"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table Section ───────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row gap-3 bg-slate-900/30">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Cari game..."
              className="h-10 pl-10 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl w-full text-[hsl(var(--foreground))]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="h-10 px-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--primary))]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-[hsl(var(--muted-foreground))] font-medium border-b border-[hsl(var(--border))] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Game</th>
                <th className="px-5 py-4 hidden lg:table-cell">Kategori</th>
                <th className="px-5 py-4 text-center">Items</th>
                <th className="px-5 py-4 hidden sm:table-cell text-center">Active Items</th>
                <th className="px-5 py-4 hidden xl:table-cell">Last Updated</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Gamepad2 className="w-10 h-10 text-[hsl(var(--muted-foreground))]/30 mx-auto mb-3" />
                    <p className="text-[hsl(var(--muted-foreground))] font-medium">
                      {searchQ || filterStatus !== "all" || filterCategory !== "all"
                        ? "Tidak ada game yang cocok dengan filter."
                        : "Belum ada game. Buat yang pertama!"}
                    </p>
                  </td>
                </tr>
              ) : null}

              {filteredGames.map((game) => (
                <motion.tr
                  key={game.id}
                  layout
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Game Name + Thumbnail */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-[hsl(var(--border))] flex items-center justify-center overflow-hidden">
                          {game.image ? (
                            <img
                              src={
                                game.image.startsWith("http")
                                  ? game.image
                                  : cloudinaryUrl(game.image)
                              }
                              alt={game.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Gamepad2 className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <GameHealthDot game={game} />
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors block">
                          {game.name}
                        </span>
                        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                          /{game.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <Badge
                      variant="outline"
                      className="bg-slate-800/50 border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs"
                    >
                      {game.category?.name ?? "—"}
                    </Badge>
                  </td>

                  {/* Total Items */}
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold text-sm">
                      {game._count.items}
                    </span>
                  </td>

                  {/* Active Items */}
                  <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                    {game._count.items === 0 ? (
                      <span className="text-[hsl(var(--muted-foreground))]/50 text-xs">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm ${
                          game.activeItemCount === 0
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {game.activeItemCount}
                      </span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="px-5 py-3.5 hidden xl:table-cell text-xs text-[hsl(var(--muted-foreground))]">
                    {game.updatedAt
                      ? formatDistanceToNow(new Date(game.updatedAt), {
                          addSuffix: true,
                          locale: idLocale,
                        })
                      : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    {game.isActive ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs"
                      >
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {/* Quick: Manage Items */}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 hover:bg-[hsl(var(--primary))]/10 rounded-lg"
                        title="Manage Items"
                      >
                        <Link href={`/admin/games/${game.id}/items`}>
                          <Package className="w-4 h-4" />
                        </Link>
                      </Button>
                      {/* Quick: Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(game)}
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg"
                        title="Edit Game"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {/* More dropdown */}
                      <ActionDropdown
                        game={game}
                        onEdit={() => handleEdit(game)}
                        onDelete={() => handleDelete(game.id)}
                        onToggleStatus={() => handleToggleStatus(game)}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))] bg-slate-900/30">
          <span>
            Menampilkan <strong className="text-[hsl(var(--foreground))]">{filteredGames.length}</strong> dari{" "}
            <strong className="text-[hsl(var(--foreground))]">{games.length}</strong> game
          </span>
          {filteredGames.length !== games.length && (
            <button
              onClick={() => {
                setSearchQ("");
                setFilterStatus("all");
                setFilterCategory("all");
              }}
              className="text-[hsl(var(--primary))] hover:underline text-xs font-medium"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// trigger ts server
