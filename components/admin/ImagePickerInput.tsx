"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { readFileAsDataUrl } from "@/services/storage";
import { useMediaItems } from "@/services/use-store-data";

interface ImagePickerInputProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  helperText?: string;
  category?: string;
}

export function ImagePickerInput({
  label,
  value,
  onChange,
  helperText,
  category = "products",
}: ImagePickerInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { media } = useMediaItems();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("படத்தின் அளவு 5 MB வரம்பை விட அதிகமாக உள்ளது.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      setUploadError("படத்தைப் படிக்க முடியவில்லை");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">{label}</label>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center relative">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-7 h-7 text-slate-400" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#287A45] animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... அல்லது /uploads/..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#287A45] focus:border-transparent transition-all"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{isUploading ? "பதிவேற்றப்படுகிறது..." : "கோப்பு பதிவேற்று (அதிகபட்சம் 5MB)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#287A45]" />
              <span>{galleryOpen ? "நூலகத்தை மூடு" : "ஊடகத்திலிருந்து தேர்வு செய்"}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>நீக்கு</span>
              </button>
            )}
          </div>
          {uploadError && <p className="text-xs text-rose-600 font-medium">{uploadError}</p>}
          {helperText && !uploadError && <p className="text-xs text-slate-500">{helperText}</p>}
        </div>
      </div>

      {galleryOpen && (
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {media.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.url);
                setGalleryOpen(false);
              }}
              className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white hover:border-[#287A45] transition-all focus:outline-hidden focus:ring-2 focus:ring-[#287A45]"
              title={item.title}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
