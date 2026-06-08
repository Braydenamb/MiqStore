"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Gamepad2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/admin/UploadZone";
import { MultiUploadZone } from "@/components/admin/MultiUploadZone";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { createAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/actions/admin-products";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  image: string | null;
  banner: string | null;
  gallery: string[];
  _count?: { items: number };
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    isActive: true,
    image: "",
    banner: "",
    gallery: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      slug: "",
      description: "",
      isActive: true,
      image: "",
      banner: "",
      gallery: [],
    });
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      isActive: product.isActive,
      image: product.image || "",
      banner: product.banner || "",
      gallery: product.gallery || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    
    setIsLoading(true);
    const res = await deleteAdminProduct(id);
    if (res.success) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert(res.error || "Failed to delete product");
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      alert("Name and Slug are required.");
      return;
    }

    setIsLoading(true);
    
    if (formData.id) {
      // Edit
      const res = await updateAdminProduct(formData.id, formData);
      if (res.success && res.data) {
        setProducts(products.map(p => p.id === formData.id ? { ...res.data, _count: p._count } : p));
        resetForm();
      } else {
        alert(res.error || "Failed to update product");
      }
    } else {
      // Create
      const res = await createAdminProduct(formData);
      if (res.success && res.data) {
        setProducts([{ ...res.data, _count: { items: 0 } }, ...products]);
        resetForm();
      } else {
        alert(res.error || "Failed to create product");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">Products Management</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Manage games, top-up nominals, and pricing.</p>
        </div>
        <Button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 transition-all h-12 px-6"
        >
          {isFormOpen ? "Cancel" : <><Plus className="w-5 h-5 mr-2" /> Add New Game</>}
        </Button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl mb-6">
              <h2 className="text-lg font-bold font-heading text-[hsl(var(--foreground))] mb-6">
                {formData.id ? "Edit Game" : "Create New Game"}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">Game Name</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Mobile Legends" 
                      className="h-12 bg-slate-900/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl text-[hsl(var(--foreground))]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">Slug (URL)</label>
                    <Input 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="e.g. mobile-legends" 
                      className="h-12 bg-slate-900/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl text-[hsl(var(--foreground))]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[hsl(var(--foreground))]">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Short description for the game page..."
                      className="w-full h-24 p-4 bg-slate-900/50 border border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] rounded-xl text-sm text-[hsl(var(--foreground))] outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="activeStatus" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))] cursor-pointer" 
                    />
                    <label htmlFor="activeStatus" className="text-sm font-bold text-[hsl(var(--foreground))] cursor-pointer">Set as Active</label>
                  </div>
                </div>

                <div className="space-y-6">
                  <UploadZone 
                    label="Game Banner" 
                    recommendedAspect="16:9 / 1920x1080px"
                    defaultValue={formData.banner}
                    onUpload={(publicId) => setFormData({...formData, banner: publicId})}
                  />
                  <UploadZone 
                    label="Square Icon (Thumbnail)" 
                    recommendedAspect="1:1 / 512x512px" 
                    defaultValue={formData.image}
                    onUpload={(publicId) => setFormData({...formData, image: publicId})}
                  />
                  <MultiUploadZone 
                    label="Game Gallery" 
                    defaultValues={formData.gallery}
                    onUpdate={(publicIds) => setFormData({...formData, gallery: publicIds})}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-12 px-8 w-full sm:w-auto"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      Save Game
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Section */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <Input placeholder="e.g. Mobile Legends..." className="h-10 pl-10 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl w-full text-[hsl(var(--foreground))]" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="rounded-xl font-bold bg-slate-900/50 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-slate-800 hover:text-[hsl(var(--foreground))] w-full sm:w-auto">Filter: All</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-[hsl(var(--muted-foreground))] font-medium border-b border-[hsl(var(--border))]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Game</th>
                <th className="px-6 py-4 whitespace-nowrap">Slug</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Items</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] bg-transparent">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[hsl(var(--muted-foreground))]">
                    No games found. Create one!
                  </td>
                </tr>
              ) : null}
              {products.map((game) => (
                <tr key={game.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-[hsl(var(--border))] flex items-center justify-center shrink-0 overflow-hidden relative">
                        {game.image ? (
                          <img 
                            src={game.image.startsWith('http') ? game.image : cloudinaryUrl(game.image)} 
                            alt={game.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.src = ""; e.currentTarget.classList.add("hidden"); }} 
                          />
                        ) : null}
                        <Gamepad2 className="w-6 h-6 text-[hsl(var(--muted-foreground))] absolute -z-10" />
                      </div>
                      <span className="font-bold text-[hsl(var(--foreground))] text-base group-hover:text-[hsl(var(--primary))] transition-colors">{game.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                    /{game.slug}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold">
                      {game._count?.items || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {game.isActive ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-3 py-1 font-bold">
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(game)}
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(game.id)}
                        disabled={isLoading}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-lg md:hidden">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))] bg-slate-900/30">
          Showing {products.length > 0 ? 1 : 0} to {products.length} of {products.length} entries
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] bg-slate-900/50 hover:bg-slate-800" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-transparent">1</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] bg-slate-900/50 hover:bg-slate-800" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
