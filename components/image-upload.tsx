"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
  multiple?: boolean;
}

export function ImageUpload({ name, defaultValue, label = "Subir Imagen", multiple = false }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue);
        if (Array.isArray(parsed)) {
          setImages(parsed);
        } else {
          setImages([defaultValue]);
        }
      } catch {
        setImages([defaultValue]);
      }
    }
  }, [defaultValue]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (multiple) {
        setImages(prev => [...prev, base64]);
      } else {
        setImages([base64]);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(handleFile);
      e.dataTransfer.clearData();
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{label}</label>
      
      {/* Hidden input to submit the data */}
      <input type="hidden" name={name} value={multiple ? JSON.stringify(images) : images[0] || ""} />

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-stone-800 bg-stone-900/50 hover:border-stone-600 hover:bg-stone-900'}`}
      >
        <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-orange-500' : 'text-stone-500'}`} />
        <p className="text-sm text-stone-300 font-medium text-center">
          Haz clic o arrastra {multiple ? 'tus imágenes' : 'tu imagen'} aquí
        </p>
        <p className="text-xs text-stone-600 mt-1">Soporta JPG y PNG</p>
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          multiple={multiple}
          className="hidden" 
          ref={fileInputRef} 
          onChange={(e) => {
            if (e.target.files) Array.from(e.target.files).forEach(handleFile);
            e.target.value = '';
          }} 
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <AnimatePresence>
            {images.map((img, idx) => (
              <motion.div 
                key={`${idx}-${img.substring(0, 30)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-video rounded-xl overflow-hidden border border-stone-800 group bg-stone-950"
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${img})` }}
                />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
