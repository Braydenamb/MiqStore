"use client";

import { UploadCloud, X, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useState, useEffect } from "react";
import { GallerySelectorModal } from "./GallerySelectorModal";

interface UploadZoneProps {
  label: string;
  onUpload?: (publicId: string) => void;
  defaultValue?: string;
  recommendedAspect?: string;
  folder?: string;
}

export function UploadZone({ label, onUpload, defaultValue, recommendedAspect, folder = "Games" }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  // Update preview when defaultValue changes (e.g. when editing a different game)
  useEffect(() => {
    setPreview(defaultValue || null);
  }, [defaultValue]);

  const removeFile = () => {
    setPreview(null);
    if (onUpload) onUpload("");
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-[hsl(var(--foreground))]">{label}</label>
        {recommendedAspect && (
          <span className="text-[10px] text-[hsl(var(--foreground))]/40 font-medium">Rec: {recommendedAspect}</span>
        )}
      </div>
      
      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
        options={{
          folder: folder,
          sources: ["local", "url", "camera", "google_drive"],
          multiple: false,
          maxFiles: 1,
        }}
        onSuccess={(result, { widget }) => {
          if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
            const publicId = result.info.public_id as string;
            setPreview(publicId);
            if (onUpload) onUpload(publicId);
            widget.close();
          }
        }}
      >
        {({ open }) => {
          return (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]",
                "border-[hsl(var(--border))] bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 cursor-pointer",
                preview ? "p-2 border-solid" : "p-6"
              )}
              onClick={(e) => {
                if (!preview) {
                  e.preventDefault();
                  open();
                }
              }}
            >
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900 group"
                  >
                    {/* Render preview image using cloudinaryUrl if it's a publicId, or directly if it's a full URL */}
                    <img 
                      src={preview.startsWith('http') ? preview : cloudinaryUrl(preview)} 
                      alt="Preview" 
                      className="w-full h-full object-cover max-h-[200px]" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="gap-2 rounded-xl">
                        <X className="w-4 h-4" /> Remove Image
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-emerald-500/80 backdrop-blur-sm text-white rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[hsl(var(--foreground))]">Click to upload from Cloudinary</p>
                      <p className="text-xs text-[hsl(var(--foreground))]/60 mt-1">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }}
      </CldUploadWidget>

      <AnimatePresence>
        {!preview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <GallerySelectorModal 
              onSelect={(id) => {
                setPreview(id);
                if (onUpload) onUpload(id);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
