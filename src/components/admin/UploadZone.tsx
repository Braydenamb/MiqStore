"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  label: string;
  onUpload?: (file: File) => void;
  defaultValue?: string;
  recommendedAspect?: string;
}

export function UploadZone({ label, onUpload, defaultValue, recommendedAspect }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsUploading(false);
      if (onUpload) onUpload(file);
    }, 1000);
  };

  const removeFile = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-[var(--color-navy)]">{label}</label>
        {recommendedAspect && (
          <span className="text-[10px] text-gray-400 font-medium">Rec: {recommendedAspect}</span>
        )}
      </div>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]",
          dragActive ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100",
          preview ? "p-2 border-solid" : "p-6"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[var(--color-teal)] animate-spin" />
              <p className="text-sm text-[var(--color-navy)] font-bold">Uploading...</p>
            </motion.div>
          ) : preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900 group"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover max-h-[200px]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="gap-2 rounded-xl">
                  <X className="w-4 h-4" /> Remove Image
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-[var(--color-teal)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-navy)]">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
