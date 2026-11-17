"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Edit2,
  Package,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { Category } from "@/types";

interface ExtendedCategory extends Category {
  productCount?: number;
}

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/float-curry-cut.png");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ExtendedCategory | null>(null);
  const [dependencyError, setDependencyError] = useState<string | null>(null);

  const loadCategories = () => {
    setLoading(true);
    try {
      const cats = categoryService.getAll();
      const prods = productService.getAll().filter((p) => !p.isDeleted);
      const withCounts: ExtendedCategory[] = cats.map((c) => ({
        ...c,
        productCount: prods.filter((p) => p.categoryId === c.id).length,
      }));
      setCategories(withCounts);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNew = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setImage("/images/float-curry-cut.png");
    setIsActive(true);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIsActive(cat.isActive);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isTa ? "பிரிவின் பெயரை உள்ளிடவும்." : "Please enter a category name.");
      return;
    }
    if (!image) {
      setError(isTa ? "பிரிவுக்கான புகைப்படம் தேவை." : "Category image is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || (isTa ? "புதிய கோழிக்கறி பிரிவு கறிக்கட்டுகள்." : "Fresh poultry cuts and products."),
        image,
        isActive,
      };

      if (editing) {
        categoryService.update(editing.id, payload);
        showToast(isTa ? "பிரிவு புதுப்பிக்கப்பட்டது" : "Category updated successfully", { description: name.trim() });
      } else {
        categoryService.create(payload);
        showToast(isTa ? "புதிய பிரிவு உருவாக்கப்பட்டது" : "New category created successfully", { description: name.trim() });
      }

      setModalOpen(false);
      loadCategories();
    } catch {
      setError(isTa ? "பிரிவைச் சேமிப்பதில் பிழை ஏற்பட்டது." : "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCheck = (cat: ExtendedCategory) => {
    setDependencyError(null);
    if ((cat.productCount ?? 0) > 0) {
      setDependencyError(
        isTa
          ? `"${cat.name}" பிரிவை நீக்க முடியாது: இதில் ${cat.productCount} செயலில் உள்ள பொருட்கள் இணைக்கப்பட்டுள்ளன. முதலில் அப்பொருட்களை வேறு பிரிவுக்கு மாற்றவும் அல்லது நீக்கவும்.`
          : `Cannot delete "${cat.name}": ${cat.productCount} active products are linked to this category. Please reassign or delete those products first.`
      );
      return;
    }
    setDeleteTarget(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      categoryService.remove(deleteTarget.id);
      showToast(isTa ? "பிரிவு நீக்கப்பட்டது" : "Category deleted", { description: deleteTarget.name, type: "info" });
      loadCategories();
    } catch {
      showToast(isTa ? "பிரிவை நீக்குவதில் பிழை" : "Error deleting category", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const current = categories[index];
    categoryService.move(current.id, direction);
    showToast(isTa ? "பிரிவு வரிசை மாற்றப்பட்டது" : "Category order updated", { type: "info" });
    loadCategories();
  };

  return (
    <AdminShell
      title={isTa ? "பிரிவுகள் மேலாண்மை" : "Category Management"}
      subtitle={
        isTa
          ? "கடை முகப்புக்கான கோழிக்கறி மற்றும் முட்டை பிரிவுகளை ஒழுங்கமைத்தல்"
          : "Organize poultry and egg categories for the customer storefront"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCategories}
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
            <span>{isTa ? "புதிய பிரிவு சேர்க்க" : "Add New Category"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Dependency Alert Banner */}
        {dependencyError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-amber-900 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">{isTa ? "பிரிவு நீக்குவது தடுக்கப்பட்டது" : "Category Deletion Blocked"}</p>
                <p className="text-xs text-amber-800 mt-0.5">{dependencyError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDependencyError(null)}
              className="p-1 rounded-lg text-amber-600 hover:bg-amber-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-[#C7E4CA] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                      <span className="font-mono text-[11px] text-slate-400">/{cat.slug}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cat.isActive
                        ? "bg-[#EDF7EE] text-[#287A45] border border-[#C7E4CA]"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {cat.isActive ? (isTa ? "செயலில்" : "Active") : (isTa ? "மறைக்கப்பட்டது" : "Hidden")}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {cat.description || (isTa ? "விளக்கம் சேர்க்கப்படவில்லை." : "No description provided.")}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                  <Package className="w-3.5 h-3.5 text-[#287A45]" />
                  <span>
                    {isTa
                      ? `${cat.productCount ?? 0} பொருட்கள் இணைக்கப்பட்டுள்ளன`
                      : `${cat.productCount ?? 0} products linked`}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                    title={isTa ? "மேலே நகர்த்து" : "Move up"}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                    title={isTa ? "கீழே நகர்த்து" : "Move down"}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isTa ? "திருத்து" : "Edit"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCheck(cat)}
                    className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title={isTa ? "பிரிவை நீக்கு" : "Delete category"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editing
                    ? isTa
                      ? "பிரிவைத் திருத்து"
                      : "Edit Category"
                    : isTa
                    ? "புதிய பிரிவு சேர்க்க"
                    : "Add New Category"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTa
                    ? "கோழிக்கறி பிரிவு பெயர், விளக்கம், புகைப்படம் மற்றும் நிலையை உள்ளமைக்கவும்."
                    : "Configure category name, description, photo, and display status."}
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

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "பிரிவின் பெயர் *" : "Category Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isTa ? "எ.கா: சிக்கன் விங்ஸ், பண்ணை முட்டைகள்" : "e.g. Chicken Wings, Farm Eggs"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "விளக்கம்" : "Description"}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isTa
                      ? "வாடிக்கையாளர்களுக்கான சுருக்கமான விளக்கம்..."
                      : "Brief description for customers..."
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <ImagePickerInput
                label={isTa ? "பிரிவுக்கான பிரதிநிதித்துவ புகைப்படம் *" : "Category Featured Photo *"}
                value={image}
                onChange={setImage}
                helperText={isTa ? "பிரிவு அட்டைக்கான புகைப்படம் அல்லது PNG கட்அவுட்." : "Image or PNG cutout for category card display."}
                category="categories"
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#287A45] focus:ring-[#287A45] border-slate-300"
                />
                <label htmlFor="cat-active-toggle" className="text-xs font-bold text-slate-700">
                  {isTa ? "இப்பிரிவை இணையதளத்தில் செயலில் காட்டவும்" : "Display this category actively on storefront"}
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
                    : editing
                    ? isTa
                      ? "மாற்றங்களைச் சேமி"
                      : "Save Changes"
                    : isTa
                    ? "பிரிவை உருவாக்கு"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={isTa ? "பிரிவை நீக்கவா?" : "Delete Category?"}
        description={
          isTa
            ? `"${deleteTarget?.name}" பிரிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இது நிரந்தரமாக நீக்கப்படும்.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This will be permanently removed.`
        }
        confirmLabel={isTa ? "நீக்குவதை உறுதிசெய்" : "Confirm Delete"}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
