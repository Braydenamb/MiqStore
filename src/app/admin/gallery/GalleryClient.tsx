"use client";

import { useState } from "react";
import { CloudinaryAsset, deleteGalleryAsset } from "@/actions/admin-gallery";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, Trash2, Copy, Check, Search, FileImage, Film, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";

export function GalleryClient({ initialAssets }: { initialAssets: CloudinaryAsset[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filteredAssets = initialAssets.filter(asset => 
    asset.public_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (publicId: string, resourceType: "image" | "video" | "raw") => {
    if (!confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;
    
    setIsDeleting(publicId);
    try {
      const res = await deleteGalleryAsset(publicId, resourceType);
      if (res.success) {
        toast.success("Asset deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete asset");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUploadSuccess = (result: { info?: { public_id?: string } | string }) => {
    if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
      toast.success("Asset uploaded successfully");
      router.refresh(); // Refresh the page to fetch new assets
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center glass-card p-4 rounded-2xl border border-[hsl(var(--border))]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <Input 
            placeholder="Search assets by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900/50 border-[hsl(var(--border))] focus-visible:ring-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
          />
        </div>

        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
          options={{
            folder: "Gallery",
            sources: ["local", "url", "camera", "google_drive"],
            multiple: true,
            resourceType: "auto", // allow images and videos
          }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <Button 
              onClick={(e) => { e.preventDefault(); open(); }}
              className="w-full sm:w-auto gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))]"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Media
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {/* Grid */}
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[hsl(var(--border))] rounded-3xl bg-slate-900/30">
          <div className="w-16 h-16 bg-slate-900 border border-[hsl(var(--border))] rounded-2xl flex items-center justify-center mb-4">
            <FileImage className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">No assets found</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 max-w-sm">
            {searchQuery ? "No media matches your search." : "Your gallery is empty. Upload some images or videos to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.public_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative glass-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden flex flex-col"
              >
                {/* Media Preview */}
                <div className="relative aspect-square bg-slate-900/80 overflow-hidden">
                  {asset.resource_type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                       <Film className="w-12 h-12 text-white/50 absolute" />
                       <video 
                         src={asset.secure_url} 
                         className="w-full h-full object-cover opacity-80"
                         muted 
                         loop 
                         onMouseEnter={(e) => e.currentTarget.play()}
                         onMouseLeave={(e) => e.currentTarget.pause()}
                       />
                    </div>
                  ) : (
                    <img 
                      src={cloudinaryUrl(asset.public_id)} 
                      alt={asset.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2 py-1 text-[10px] font-bold bg-black/60 text-white backdrop-blur-md rounded-md uppercase tracking-wider">
                      {asset.format}
                    </span>
                    {asset.resource_type === "video" && (
                      <span className="px-2 py-1 text-[10px] font-bold bg-blue-500/80 text-white backdrop-blur-md rounded-md flex items-center gap-1">
                        <Film className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border-none backdrop-blur-md transition-colors"
                      onClick={() => handleCopy(asset.secure_url, asset.public_id)}
                      title="Copy URL"
                    >
                      {copiedId === asset.public_id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-10 w-10 rounded-full bg-red-500/80 hover:bg-red-600 border-none backdrop-blur-md transition-colors"
                      onClick={() => handleDelete(asset.public_id, asset.resource_type)}
                      disabled={isDeleting === asset.public_id}
                      title="Delete Asset"
                    >
                      {isDeleting === asset.public_id ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Trash2 className="w-4 h-4 text-white" />}
                    </Button>
                  </div>
                  
                  {/* Mobile Actions Overlay (Always visible on very small screens, or we can just rely on hover for touch devices which Next handles decently, but let's add a fallback if needed. For now hover is ok.) */}
                </div>

                {/* Info Footer */}
                <div className="p-3">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                    {(asset.bytes / 1024).toFixed(1)} KB • {asset.width}x{asset.height}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
