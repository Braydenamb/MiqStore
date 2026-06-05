"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface MultiUploadZoneProps {
  label: string;
  onUpdate: (publicIds: string[]) => void;
  defaultValues?: string[];
  folder?: string;
}

export function MultiUploadZone({ label, onUpdate, defaultValues = [], folder = "Games/Gallery" }: MultiUploadZoneProps) {
  const [items, setItems] = useState<string[]>(defaultValues);

  useEffect(() => {
    setItems(defaultValues);
  }, [defaultValues]);

  const handleRemove = (publicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newItems = items.filter(id => id !== publicId);
    setItems(newItems);
    onUpdate(newItems);
  };

  const handleReorder = (newItems: string[]) => {
    setItems(newItems);
    onUpdate(newItems);
  };

  const handleSuccess = (result: any, widget: any) => {
    if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
      const publicId = result.info.public_id as string;
      setItems(prev => {
        const newItems = [...prev, publicId];
        onUpdate(newItems);
        return newItems;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-[hsl(var(--foreground))]">{label}</label>
        <span className="text-[10px] text-gray-400 font-medium">{items.length} image(s)</span>
      </div>

      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
        options={{
          folder: folder,
          sources: ["local", "url", "camera", "google_drive"],
          multiple: true,
        }}
        onSuccess={handleSuccess}
      >
        {({ open }) => {
          return (
            <div
              className={cn(
                "border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center p-6",
                "border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"
              )}
              onClick={(e) => {
                e.preventDefault();
                open();
              }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[hsl(var(--foreground))]">Click to add images to Gallery</p>
                  <p className="text-xs text-gray-500 mt-1">Select multiple files at once</p>
                </div>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>

      {items.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Drag to Reorder</p>
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <Reorder.Item 
                  key={item} 
                  value={item} 
                  className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[hsl(var(--foreground))] transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 shrink-0">
                    <img 
                      src={item.startsWith('http') ? item : cloudinaryUrl(item)} 
                      alt="Gallery item" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-gray-500 truncate">{item}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => handleRemove(item, e)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}
    </div>
  );
}
