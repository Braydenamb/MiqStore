"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Image as ImageIcon } from "lucide-react";
import { getGalleryAssets, CloudinaryAsset } from "@/actions/admin-gallery";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface GallerySelectorModalProps {
  onSelect: (publicId: string) => void;
  trigger?: React.ReactNode;
  multiple?: boolean;
}

export function GallerySelectorModal({ onSelect, trigger, multiple = false }: GallerySelectorModalProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open && assets.length === 0) {
      setLoading(true);
      getGalleryAssets().then(res => {
        setAssets(res);
        setLoading(false);
      });
    }
  }, [open, assets.length]);

  const filteredAssets = assets.filter(a => 
    a.filename.toLowerCase().includes(search.toLowerCase()) || 
    a.public_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (asset: CloudinaryAsset) => {
    onSelect(asset.public_id);
    if (!multiple) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" className="w-full gap-2 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-slate-800">
            <ImageIcon className="w-4 h-4" />
            Choose from Gallery
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col bg-[hsl(var(--card))] border-[hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold text-[hsl(var(--foreground))]">
            Select Media from Gallery
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900/50 border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 mt-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <p>No media found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredAssets.map(asset => (
                <div 
                  key={asset.public_id}
                  onClick={() => handleSelect(asset)}
                  className="group relative aspect-square rounded-xl bg-slate-900 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[hsl(var(--primary))] transition-all"
                >
                  <img 
                    src={asset.resource_type === 'video' ? asset.secure_url.replace('.mp4', '.jpg') : cloudinaryUrl(asset.public_id)} 
                    alt={asset.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <div className="bg-[hsl(var(--primary))] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                       Select
                     </div>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-bold uppercase backdrop-blur-sm">
                    {asset.format}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
