"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useCategories } from "@/services/use-store-data";
import { Product, ProductAvailability } from "@/types";

interface ProductFormState {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  unit: string;
  image: string;
  galleryImages: string[];
  availability: ProductAvailability;
  isFeatured: boolean;
  isActive: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  categoryId: "cat-curry-cut",
  description: "",
  price: "",
  unit: "1 கிலோ",
  image: "/images/float-curry-cut.png",
  galleryImages: [],
  availability: "available",
  isFeatured: false,
  isActive: true,
};

function ProductsManagerContent() {
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"catalog" | "trash">("catalog");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<Product | null>(null);

  const extraFileRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resCatalog, resTrash] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/products?only_deleted=1"),
      ]);

      if (resCatalog.ok) {
        const catData = await resCatalog.json();
        setProducts(catData);
      }
      if (resTrash.ok) {
        const trashData = await resTrash.json();
        setDeletedProducts(trashData);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingId(null);
      setForm({
        ...EMPTY_FORM,
        categoryId: categories[0]?.id ?? "cat-curry-cut",
      });
      setFormError("");
      setModalOpen(true);
    }
    if (searchParams.get("availability") === "out_of_stock") {
      setAvailabilityFilter("out_of_stock");
    }
  }, [searchParams, categories]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = activeTab === "catalog" ? products : deletedProducts;

    return list.filter((p) => {
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (availabilityFilter !== "all" && p.availability !== availabilityFilter) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;

      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (categoryMap.get(p.categoryId) ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, deletedProducts, activeTab, categoryFilter, availabilityFilter, statusFilter, search, categoryMap]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? "cat-curry-cut",
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      categoryId: p.categoryId,
      description: p.description,
      price: String(p.price),
      unit: p.unit,
      image: p.image,
      galleryImages: p.galleryImages || [p.image],
      availability: p.availability,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("பொருளின் பெயரை உள்ளிடவும்.");
      return;
    }
    const numPrice = parseFloat(form.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("சரியான விலையை உள்ளிடவும்.");
      return;
    }
    if (!form.image) {
      setFormError("பொருளின் முக்கியப் புகைப்படம் தேவை.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        description: form.description.trim(),
        price: numPrice,
        unit: form.unit.trim() || "1 கிலோ",
        image: form.image,
        galleryImages: form.galleryImages.length > 0 ? form.galleryImages : [form.image],
        availability: form.availability,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update product");
        showToast("பொருள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது", { description: form.name });
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create product");
        showToast("பொருள் பட்டியலில் சேர்க்கப்பட்டது", { description: form.name });
      }

      setModalOpen(false);
      await loadData();
    } catch {
      setFormError("பொருளைச் சேமிப்பதில் பிழை ஏற்பட்டது.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("பொருள் குப்பைத் தொட்டிக்கு நகர்த்தப்பட்டது", {
          description: `${deleteTarget.name} எப்போது வேண்டுமானாலும் மீட்டெடுக்கப்படலாம்.`,
          type: "info",
        });
        await loadData();
      }
    } catch {
      showToast("பொருளை நீக்குவதில் பிழை ஏற்பட்டது", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRestore = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}/restore`, { method: "POST" });
      if (res.ok) {
        showToast("பொருள் மீண்டும் பட்டியலில் சேர்க்கப்பட்டது", {
          description: p.name,
          type: "success",
        });
        await loadData();
      }
    } catch {
      showToast("பொருளை மீட்டெடுப்பதில் பிழை", { type: "danger" });
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    try {
      const res = await fetch(`/api/products/${permanentDeleteTarget.id}?force=1`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("பொருள் நிரந்தரமாக நீக்கப்பட்டது", {
          description: permanentDeleteTarget.name,
          type: "info",
        });
        await loadData();
      }
    } catch {
      showToast("பொருளை நீக்குவதில் பிழை", { type: "danger" });
    } finally {
      setPermanentDeleteTarget(null);
    }
  };

  // Gallery Helpers inside modal
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("படத்தின் அளவு 5 MB வரம்பை விட அதிகமாக உள்ளது.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "products");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, data.url],
        }));
      }
    } catch {
      setFormError("புகைப்படத்தைப் பதிவேற்ற முடியவில்லை.");
    } finally {
      if (extraFileRef.current) extraFileRef.current.value = "";
    }
  };

  const removeGalleryImage = (idx: number) => {
    setForm((prev) => {
      const copy = [...prev.galleryImages];
      copy.splice(idx, 1);
      return { ...prev, galleryImages: copy };
    });
  };

  const moveGalleryImage = (from: number, to: number) => {
    setForm((prev) => {
      if (to < 0 || to >= prev.galleryImages.length) return prev;
      const copy = [...prev.galleryImages];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return { ...prev, galleryImages: copy };
    });
  };

  const setAsMainImage = (url: string) => {
    setForm((prev) => ({ ...prev, image: url }));
    showToast("முக்கியப் படமாக அமைக்கப்பட்டது", { type: "info" });
  };

  return (
    <AdminShell
      title="பொருட்கள் மேலாண்மை"
      subtitle="கறிக்கட்டுகள், விலைகள், அலகுகள், புகைப்படங்கள் மற்றும் சரக்கு இருப்பு முழுமையான கட்டுப்பாடு"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="புதுப்பி"
          >
            <RefreshCw className={`w-4 h-4 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>புதிய பொருள் சேர்க்க</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Navigation Tabs: Catalog vs Trash */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "catalog"
                  ? "bg-[#287A45] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              செயலில் உள்ள பட்டியல் ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trash")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "trash"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>குப்பைத் தொட்டி ({deletedProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="பெயர், கறிக்கட்டு அல்லது விளக்கம் கொண்டு தேடுங்கள்..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#287A45] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="பிரிவு வாரியாக வடிகட்டு"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
            >
              <option value="all">அனைத்துப் பிரிவுகளும்</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              aria-label="இருப்பு நிலை வாரியாக வடிகட்டு"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
            >
              <option value="all">அனைத்து இருப்பு நிலைகளும்</option>
              <option value="available">இருப்பில் உள்ளவை மட்டும்</option>
              <option value="out_of_stock">இருப்பு இல்லாதவை மட்டும்</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="காட்சி நிலை வாரியாக வடிகட்டு"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
            >
              <option value="all">அனைத்து நிலைகளும்</option>
              <option value="active">செயலில் உள்ளவை</option>
              <option value="inactive">செயலற்றவை</option>
            </select>

            {(search || categoryFilter !== "all" || availabilityFilter !== "all" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setAvailabilityFilter("all");
                  setStatusFilter("all");
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent"
              >
                வடிகட்டிகளை மீட்டமை
              </button>
            )}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                {activeTab === "trash" ? "குப்பைத் தொட்டி காலியாக உள்ளது" : "பொருட்கள் எதுவும் கிடைக்கவில்லை"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === "trash"
                  ? "நீக்கப்பட்ட பொருட்கள் இங்கு தோன்றும்; எப்போது வேண்டுமானாலும் மீட்டெடுக்கலாம்."
                  : "தேடல் வார்த்தையை மாற்றவும் அல்லது புதிய பொருளைச் சேர்க்கவும்."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">பொருள்</th>
                    <th className="py-3 px-4">பிரிவு</th>
                    <th className="py-3 px-4">விலை / அலகு</th>
                    <th className="py-3 px-4">இருப்பு</th>
                    <th className="py-3 px-4">சிறப்பு</th>
                    <th className="py-3 px-4">நிலை</th>
                    <th className="py-3 px-4 text-right">செயல்கள்</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const catName = categoryMap.get(p.categoryId) ?? "பிரிவு இல்லை";
                    const isOutOfStock = p.availability === "out_of_stock";

                    return (
                      <tr key={p.id} className="hover:bg-[#EDF7EE]/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{p.name}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-xs">
                                {p.description || "தினசரி புதிய வெட்டு"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
                          {catName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">₹{p.price}</span>
                          <span className="text-[11px] text-slate-500 ml-1">/ {p.unit}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isOutOfStock
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isOutOfStock ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {isOutOfStock ? "இருப்பு இல்லை" : "இருப்பில் உள்ளது"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {p.isFeatured ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              <span>சிறப்பு</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                              p.isActive
                                ? "bg-slate-100 text-slate-800"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {p.isActive ? "செயலில்" : "செயலற்றது"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {activeTab === "catalog" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(p)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                                title="பொருளைத் திருத்து"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(p)}
                                className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                                title="குப்பைத் தொட்டிக்கு நகர்த்து"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRestore(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold"
                                title="மீட்டெடு"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>மீட்டெடு</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPermanentDeleteTarget(p)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
                                title="நிரந்தரமாக நீக்கு"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "பொருளைத் திருத்து" : "புதிய கோழிக்கறி பொருள் சேர்க்க"}
                </h2>
                <p className="text-xs text-slate-500">
                  கறிக்கட்டு விவரங்கள், விலை, இருப்பு நிலை மற்றும் படங்களைச் சேமிக்கவும்.
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

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    பொருளின் பெயர் *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="எ.கா: பண்ணை புதிய கறிக்கட் சிக்கன்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    பிரிவு *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    விலை (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="260"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    அலகு (Unit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="1 கிலோ, 500 கிராம், 6 முட்டைகள்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  விளக்கம்
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="வீட்டுக் குழம்பு மற்றும் கிரேவிக்கு ஏற்ற சுத்தமான துண்டுகள்..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              {/* Main Image */}
              <ImagePickerInput
                label="முக்கியப் புகைப்படம் *"
                value={form.image}
                onChange={(img) => setForm({ ...form, image: img })}
                helperText="தெளிவான இறைச்சிப் புகைப்படம் அல்லது PNG கட்அவுட் (அதிகபட்சம் 5MB)."
                category="products"
              />

              {/* Additional Gallery Photographs & Reordering */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    கூடுதல் புகைப்படங்கள் ({form.galleryImages.length})
                  </label>
                  <input
                    ref={extraFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAddGalleryImage}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => extraFileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-[#287A45] hover:bg-[#EDF7EE]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>படம் பதிவேற்று</span>
                  </button>
                </div>

                {form.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {form.galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white"
                      >
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setAsMainImage(imgUrl)}
                              title="முக்கிய படமாக அமை"
                              className="text-[10px] bg-[#287A45] px-1.5 py-0.5 rounded font-bold"
                            >
                              Main
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              title="நீக்கு"
                              className="p-1 rounded bg-rose-600 text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveGalleryImage(idx, idx - 1)}
                              className="p-1 rounded bg-white/30 hover:bg-white/50 disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === form.galleryImages.length - 1}
                              onClick={() => moveGalleryImage(idx, idx + 1)}
                              className="p-1 rounded bg-white/30 hover:bg-white/50 disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    இருப்பு நிலை
                  </label>
                  <select
                    value={form.availability}
                    onChange={(e) =>
                      setForm({ ...form, availability: e.target.value as ProductAvailability })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="available">இருப்பில் உள்ளது (Available)</option>
                    <option value="out_of_stock">இருப்பு இல்லை (Out of Stock)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#287A45] focus:ring-[#287A45] border-slate-300"
                  />
                  <label htmlFor="featured-toggle" className="text-xs font-bold text-slate-700">
                    முகப்பில் சிறப்பித்துக் காட்டு
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="active-toggle"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#287A45] focus:ring-[#287A45] border-slate-300"
                  />
                  <label htmlFor="active-toggle" className="text-xs font-bold text-slate-700">
                    கடை முகப்பில் நேரலையாகக் காட்டு
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ரத்து செய்
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-[#287A45]/20"
                >
                  {submitting ? "சேமிக்கப்படுகிறது..." : editingId ? "மாற்றங்களைச் சேமி" : "பொருளைச் சேமி"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Soft Delete */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="பொருளை குப்பைத் தொட்டிக்கு நகர்த்தவா?"
        description={`"${deleteTarget?.name}" வாடிக்கையாளர் தளத்தில் இருந்து மறைக்கப்படும். குப்பைத் தொட்டி பிரிவில் இருந்து எப்போது வேண்டுமானாலும் மீட்டெடுக்கலாம்.`}
        confirmLabel="குப்பைத் தொட்டிக்கு நகர்த்து"
        variant="danger"
        onConfirm={handleSoftDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Confirmation Dialog for Permanent Delete */}
      <ConfirmDialog
        open={Boolean(permanentDeleteTarget)}
        title="பொருளை நிரந்தரமாக நீக்கவா?"
        description={`"${permanentDeleteTarget?.name}" தரவுத்தளத்தில் இருந்து நிரந்தரமாக நீக்கப்படும். இந்தச் செயலை மாற்றியமைக்க முடியாது.`}
        confirmLabel="நிரந்தரமாக நீக்கு"
        variant="danger"
        onConfirm={handlePermanentDelete}
        onCancel={() => setPermanentDeleteTarget(null)}
      />
    </AdminShell>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">பொருட்கள் பட்டியல் ஏற்றப்படுகிறது...</div>}>
      <ProductsManagerContent />
    </Suspense>
  );
}
