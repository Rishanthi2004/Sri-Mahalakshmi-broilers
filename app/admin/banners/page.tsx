"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { bannerService } from "@/services/banner-service";
import { Banner } from "@/types";

interface BannerFormState {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  position: "hero_main" | "promo_strip" | "offer_popup";
  isActive: boolean;
  sortOrder: number;
}

const EMPTY_FORM: BannerFormState = {
  title: "",
  subtitle: "",
  image: "/images/hero-banner.jpg",
  ctaText: "பொருட்களைப் பார்க்க",
  ctaLink: "/products",
  position: "hero_main",
  isActive: true,
  sortOrder: 1,
};

export default function AdminBannersPage() {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const loadBanners = () => {
    setLoading(true);
    try {
      setBanners(bannerService.getAll());
    } catch (e) {
      console.error("Failed to fetch banners", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image,
      ctaText: b.ctaText || (isTa ? "பொருட்களைப் பார்க்க" : "Explore Cuts"),
      ctaLink: b.ctaLink || "/products",
      position: b.position,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image) {
      setFormError(isTa ? "பேனர் தலைப்பு மற்றும் புகைப்படம் தேவை." : "Banner headline and photo are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingId) {
        bannerService.update(editingId, form);
        showToast(isTa ? "பேனர் வெற்றிகரமாக புதுப்பிக்கப்பட்டது" : "Banner updated successfully");
      } else {
        bannerService.create(form);
        showToast(isTa ? "புதிய பேனர் சேர்க்கப்பட்டது" : "New banner created successfully");
      }

      setModalOpen(false);
      loadBanners();
    } catch {
      setFormError(isTa ? "பேனரைச் சேமிப்பதில் பிழை ஏற்பட்டது." : "Failed to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      bannerService.remove(deleteTarget.id);
      showToast(isTa ? "பேனர் நீக்கப்பட்டது" : "Banner deleted", { type: "info" });
      loadBanners();
    } catch {
      showToast(isTa ? "பேனரை நீக்குவதில் பிழை" : "Error deleting banner", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminShell
      title={isTa ? "பேனர்கள் மேலாண்மை" : "Banners Management"}
      subtitle={
        isTa
          ? "முகப்பு ஹீரோ பேனர்கள், விளம்பரப் பட்டிகள் மற்றும் நடவடிக்கை அழைப்புகளை உள்ளமைத்தல்"
          : "Configure homepage hero banners, promotional strips, and call-to-actions"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBanners}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
            title={isTa ? "புதுப்பி" : "Refresh"}
          >
            <RefreshCw className={`w-4 h-4 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isTa ? "புதிய பேனர் சேர்க்க" : "Add New Banner"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {banners.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              {isTa ? "பேனர்கள் எதுவும் அமைக்கப்படவில்லை" : "No banners configured"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isTa
                ? "புதிய இறைச்சி வகைகளை முன்னிலைப்படுத்த விளம்பர பேனர்களைச் சேர்க்கவும்."
                : "Add promotional banners to highlight fresh chicken cuts and special offers."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#C7E4CA] transition-colors"
              >
                <div>
                  <div className="relative aspect-21/9 bg-slate-900 overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                        {b.position === "hero_main"
                          ? isTa
                            ? "முகப்பு முதன்மை பேனர்"
                            : "Hero Main Banner"
                          : isTa
                          ? "விளம்பரப் பட்டி"
                          : "Promo Strip"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          b.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                        }`}
                      >
                        {b.isActive ? (isTa ? "செயலில்" : "Active") : (isTa ? "செயலற்றது" : "Inactive")}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                    {b.subtitle && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.subtitle}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {b.ctaText && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDF7EE] border border-[#C7E4CA] text-[#287A45] font-semibold">
                          <ExternalLink className="w-3 h-3 text-[#287A45]" />
                          <span>
                            {isTa ? "பொத்தான்" : "Button"}: &quot;{b.ctaText}&quot; ({b.ctaLink})
                          </span>
                        </div>
                      )}
                      <div className="text-[11px] font-mono text-slate-400">
                        {isTa ? `வரிசை #${b.sortOrder}` : `Order #${b.sortOrder}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isTa ? "பேனரைத் திருத்து" : "Edit Banner"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(b)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title={isTa ? "பேனரை நீக்கு" : "Delete Banner"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? isTa
                      ? "பேனரைத் திருத்து"
                      : "Edit Banner"
                    : isTa
                    ? "புதிய பேனர் உருவாக்கு"
                    : "Create New Banner"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTa
                    ? "தலைப்பு, துணை உரை, புகைப்படம், நிலை மற்றும் பொத்தான் இணைப்பை அமைக்கவும்."
                    : "Configure headline, subtitle, image, status, and button link."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "தலைப்பு *" : "Headline *"}
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={
                    isTa
                      ? "எ.கா: தினமும் காலையில் சுகாதாரமாக வெட்டப்பட்ட புதிய கோழிக்கறி"
                      : "e.g. Daily Fresh & Hygienic Farm Chicken Every Morning"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "துணை உரை / விளக்க உரை" : "Subtitle / Description"}
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder={
                    isTa
                      ? "பேனர் தலைப்பின் கீழ் தோன்றும் சுருக்கமான விளக்கம்..."
                      : "Short description shown below the banner headline..."
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <ImagePickerInput
                label={isTa ? "பேனர் புகைப்படம் *" : "Banner Photo *"}
                value={form.image}
                onChange={(img) => setForm({ ...form, image: img })}
                helperText={
                  isTa
                    ? "அகலமான லேண்ட்ஸ்கேப் பேனர் படம் (அதிகபட்சம் 5MB, JPG/PNG/WebP)."
                    : "Wide landscape banner image (max 5MB, JPG/PNG/WebP)."
                }
                category="banners"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "பொத்தான் உரை" : "Button Text"}
                  </label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    placeholder={isTa ? "பொருட்களைப் பார்க்க" : "Explore Cuts"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "பொத்தான் இணைப்பு" : "Button Link"}
                  </label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    placeholder="/products"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "காட்சி அமைவிடம்" : "Display Position"}
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value as "hero_main" | "promo_strip" })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="hero_main">{isTa ? "முகப்பு முதன்மை பேனர்" : "Hero Main Banner"}</option>
                    <option value="promo_strip">{isTa ? "விளம்பரப் பட்டி" : "Promo Strip"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "வரிசை முன்னுரிமை" : "Sort Order"}
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banner-active-toggle"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#287A45] focus:ring-[#287A45] border-slate-300"
                />
                <label htmlFor="banner-active-toggle" className="text-xs font-bold text-slate-700">
                  {isTa ? "இப்பேனரை வாடிக்கையாளர்களுக்கு செயலில் காட்டவும்" : "Display this banner actively to customers"}
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isTa ? "ரத்து செய்" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-[#287A45]/20"
                >
                  {submitting
                    ? isTa
                      ? "சேமிக்கப்படுகிறது..."
                      : "Saving..."
                    : editingId
                    ? isTa
                      ? "மாற்றங்களைச் சேமி"
                      : "Save Changes"
                    : isTa
                    ? "பேனரைச் சேமி"
                    : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={isTa ? "பேனரை நீக்கவா?" : "Delete Banner?"}
        description={
          isTa
            ? `"${deleteTarget?.title}" பேனரை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`
            : `Are you sure you want to delete banner "${deleteTarget?.title}"?`
        }
        confirmLabel={isTa ? "பேனரை நீக்கு" : "Delete Banner"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
