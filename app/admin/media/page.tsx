"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Eye,
  FileCheck,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { mediaService } from "@/services/media-enquiry-service";
import { readFileAsDataUrl } from "@/services/storage";
import { MediaCategory, MediaItem } from "@/types";

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const mediaCategories = useMemo(
    () => [
      { id: "all" as const, label: isTa ? "அனைத்து கோப்புகளும்" : "All Media" },
      { id: "products" as const, label: isTa ? "பொருட்கள் புகைப்படங்கள்" : "Products" },
      { id: "banners" as const, label: isTa ? "பேனர்கள்" : "Banners" },
      { id: "categories" as const, label: isTa ? "பிரிவுகள்" : "Categories" },
      { id: "about" as const, label: isTa ? "எங்களைப் பற்றி & கடை" : "About & Store" },
      { id: "branding" as const, label: isTa ? "பிராண்டிங் & லோகோ" : "Branding & Logos" },
    ],
    [isTa]
  );

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterCat, setFilterCat] = useState<"all" | MediaCategory>("all");
  const [uploadModal, setUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<MediaCategory>("products");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [protectionWarning, setProtectionWarning] = useState<string | null>(null);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = () => {
    setLoading(true);
    try {
      setMediaList(mediaService.getAll());
    } catch (e) {
      console.error("Failed to load media", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const filtered = useMemo(() => {
    if (filterCat === "all") return mediaList;
    return mediaList.filter((m) => m.category === filterCat);
  }, [mediaList, filterCat]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(isTa ? "படத்தின் அளவு 5 MB வரம்பை விட அதிகமாக உள்ளது." : "Image size exceeds the 5 MB limit.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedUrl(dataUrl);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^.]+$/, ""));
      }
      showToast(isTa ? "புகைப்படம் வெற்றிகரமாகப் பதிவேற்றப்பட்டது" : "Image uploaded successfully", { type: "success" });
    } catch {
      setUploadError(isTa ? "படத்தைப் படிக்க முடியவில்லை." : "Failed to read image file.");
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl || !newTitle.trim()) {
      setUploadError(isTa ? "புகைப்படம் மற்றும் தலைப்பை உள்ளிடவும்." : "Please provide both an image and title.");
      return;
    }

    mediaService.add({
      title: newTitle.trim(),
      url: uploadedUrl,
      category: newCategory,
    });
    showToast(isTa ? "ஊடகக் கோப்பு நூலகத்தில் சேர்க்கப்பட்டது" : "Media asset added to library");

    setUploadModal(false);
    setNewTitle("");
    setUploadedUrl("");
    setUploadError(null);
    loadMedia();
  };

  const handleDeleteAttempt = async () => {
    if (!deleteTarget) return;

    try {
      mediaService.remove(deleteTarget.id);
      showToast(isTa ? "கோப்பு நூலகத்திலிருந்து நீக்கப்பட்டது" : "Asset removed from media library", { description: deleteTarget.title });
      loadMedia();
    } catch {
      showToast(isTa ? "நீக்கும் செயல்பாடு தோல்வியடைந்தது" : "Failed to delete media asset", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminShell
      title={isTa ? "ஊடக நூலகம்" : "Media Library"}
      subtitle={
        isTa
          ? "உயர்தர புகைப்படங்கள், பேனர்கள் மற்றும் லோகோ கோப்புகளைப் பதிவேற்றி நிர்வகித்தல்"
          : "Upload and manage product photos, promotional banners, and branding assets"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMedia}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
            title={isTa ? "புதுப்பி" : "Refresh"}
          >
            <RefreshCw className={`w-4 h-4 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setNewTitle("");
              setUploadedUrl("");
              setUploadError(null);
              setUploadModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{isTa ? "படம் பதிவேற்று (அதிகபட்சம் 5MB)" : "Upload Asset (Max 5MB)"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Active Usage Warning Alert */}
        {protectionWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-amber-900 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {isTa ? "நேரலை இணையதள பாதுகாப்பு எச்சரிக்கை" : "Live Storefront Protection Warning"}
                </p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {protectionWarning}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setProtectionWarning(null)}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {mediaCategories.map((cat) => {
            const active = filterCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#287A45] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              {isTa ? "இப்பிரிவில் ஊடகக் கோப்புகள் எதுவும் இல்லை" : "No media assets found in this category"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isTa ? "உயர்தர JPG, PNG அல்லது WebP படங்களைப் பதிவேற்றவும்." : "Upload high-resolution JPG, PNG, or WebP files."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-[#C7E4CA] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold shadow-sm"
                        title={isTa ? "முன்னோட்டம்" : "Preview"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProtectionWarning(null);
                          setDeleteTarget(item);
                        }}
                        className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold shadow-sm"
                        title={isTa ? "படத்தை நீக்கு" : "Delete Image"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-900 truncate" title={item.title}>
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span className="capitalize">{item.category}</span>
                      <span>{item.dimensions || "High Res"}</span>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1 truncate font-mono">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setUploadModal(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isTa ? "ஊடகக் கோப்பைப் பதிவேற்றவும்" : "Upload Media Asset"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTa
                    ? "5 MB வரையிலான JPG, PNG மற்றும் WebP படங்களை ஆதரிக்கிறது."
                    : "Supports JPG, PNG, and WebP images up to 5 MB."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSaveModal} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "கோப்பின் தலைப்பு / பெயர் *" : "File Title / Label *"}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isTa ? "எ.கா: எலும்பில்லா சிக்கன் பிரஸ்ட் வெட்டு" : "e.g. Boneless Chicken Breast Cut"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "இலக்குப் பிரிவு" : "Target Category"}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MediaCategory)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="products">{isTa ? "பொருட்கள் (Products)" : "Products"}</option>
                  <option value="banners">{isTa ? "பேனர்கள் (Banners)" : "Banners"}</option>
                  <option value="categories">{isTa ? "பிரிவுகள் (Categories)" : "Categories"}</option>
                  <option value="about">{isTa ? "எங்களைப் பற்றி & கடை (About & Shop)" : "About & Store"}</option>
                  <option value="branding">{isTa ? "பிராண்டிங் & லோகோ (Branding)" : "Branding & Logos"}</option>
                </select>
              </div>

              {/* Upload Drop Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isTa ? "படக் கோப்பைத் தேர்ந்தெடுக்கவும் (அதிகபட்சம் 5MB)" : "Select Image File (Max 5MB)"}
                </label>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleUploadFile}
                  className="hidden"
                />
                <div
                  onClick={() => uploadInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#287A45] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#EDF7EE]"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-[#287A45] animate-spin mb-2" />
                      <p className="text-xs font-bold text-slate-700">{isTa ? "பதிவேற்றப்படுகிறது..." : "Uploading..."}</p>
                    </div>
                  ) : uploadedUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={uploadedUrl}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 mb-2"
                      />
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" /> {isTa ? "சேமிக்கத் தயார்" : "Ready to save"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#EDF7EE] border border-[#C7E4CA] text-[#287A45] flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {isTa ? "உங்கள் சாதனத்திலிருந்து கோப்பைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்" : "Click to select a file from your device"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isTa ? "JPG, JPEG, PNG, அல்லது WebP (அதிகபட்சம் 5 MB)" : "JPG, JPEG, PNG, or WebP (max 5 MB)"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isTa ? "ரத்து செய்" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={!uploadedUrl || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-[#287A45]/20"
                >
                  {isTa ? "ஊடக நூலகத்தில் சேமி" : "Save to Media Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewItem(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewItem.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{previewItem.url}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-[60vh] flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={isTa ? "ஊடகக் கோப்பை நீக்கவா?" : "Delete Media Asset?"}
        description={
          isTa
            ? `"${deleteTarget?.title}" கோப்பை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இது இணையதளத்தில் ஏதேனும் பகுதியில் பயன்பாட்டில் உள்ளதா என சரிபார்க்கப்பட்டு நீக்கப்படும்.`
            : `Are you sure you want to delete "${deleteTarget?.title}"? Please ensure it is not active on public pages before removing.`
        }
        confirmLabel={isTa ? "நீக்குவதை உறுதிசெய்" : "Confirm Delete"}
        variant="danger"
        onConfirm={handleDeleteAttempt}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
