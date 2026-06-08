"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  GripVertical,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  isActive: boolean;
  _count: { products: number };
};

interface Props {
  initialCategories: Category[];
}

// ─── Server-compatible actions (inline for simplicity) ────────────────────────

async function serverCreate(data: {
  name: string; slug: string; description?: string;
  icon?: string; color?: string; isActive: boolean;
}) {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── Main Component ────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B",
  "#10B981", "#EF4444", "#14B8A6", "#F97316",
];

const initialForm = {
  name: "", slug: "", description: "", icon: "", color: PRESET_COLORS[0], isActive: true,
};

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  const resetForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "",
      color: cat.color || PRESET_COLORS[0],
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setIsFormOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    setForm((prev) => ({ ...prev, name, slug: prev.slug || slug }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      alert("Nama dan Slug wajib diisi.");
      return;
    }
    setIsLoading(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingId ? { ...c, ...data.data } : c
            )
          );
          resetForm();
        } else {
          alert(data.error || "Gagal memperbarui.");
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) => [...prev, { ...data.data, _count: { products: 0 } }]);
          resetForm();
        } else {
          alert(data.error || "Gagal membuat kategori.");
        }
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat && cat._count.products > 0) {
      alert(`Tidak bisa hapus: kategori ini memiliki ${cat._count.products} game.`);
      return;
    }
    if (!confirm("Hapus kategori ini?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Gagal menghapus.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">
            Categories
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Kelola kategori game (MOBA, Battle Royale, Voucher, dll.)
          </p>
        </div>
        <Button
          onClick={() => (isFormOpen && !editingId ? resetForm() : setIsFormOpen(true))}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-12 px-6"
        >
          {isFormOpen && !editingId ? "Cancel" : <><Plus className="w-5 h-5 mr-2" /> Add Category</>}
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-lg font-bold font-heading mb-5 text-[hsl(var(--foreground))]">
                {editingId ? "Edit Category" : "Buat Category Baru"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Nama</label>
                  <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Battle Royale" className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Slug</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="battle-royale" className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl font-mono text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Icon (emoji / text)</label>
                  <Input value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🎮" className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Warna</label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110" : "hover:scale-105"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Deskripsi</label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat..." className="h-11 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                  <label className="text-sm font-bold text-[hsl(var(--foreground))]">Active</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="outline" onClick={resetForm} className="rounded-xl border-[hsl(var(--border))] bg-transparent">
                  Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-11 px-6">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? "Simpan" : "Buat Category"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-[hsl(var(--muted-foreground))] font-medium border-b border-[hsl(var(--border))] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 hidden sm:table-cell">Slug</th>
                <th className="px-5 py-4 text-center">Games</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[hsl(var(--muted-foreground))]">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : null}
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40`, border: "1px solid" }}
                      >
                        {cat.icon || <LayoutGrid className="w-4 h-4" style={{ color: cat.color || undefined }} />}
                      </div>
                      <div>
                        <span className="font-bold text-[hsl(var(--foreground))]">{cat.name}</span>
                        {cat.description && (
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">{cat.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell font-mono text-xs text-[hsl(var(--muted-foreground))]">
                    /{cat.slug}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold text-sm">
                      {cat._count.products}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {cat.isActive ? (
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} disabled={isLoading} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))] bg-slate-900/30">
          {categories.length} kategori
        </div>
      </div>
    </div>
  );
}
// trigger ts server
