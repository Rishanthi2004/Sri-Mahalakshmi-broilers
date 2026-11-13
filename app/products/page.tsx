"use client";

import React, { useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicShell } from "@/components/public/PublicShell";
import {
  useCategories,
  useProducts,
  useWebsiteContent,
} from "@/services/use-store-data";

export default function ProductsPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { content } = useWebsiteContent();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive),
    [categories]
  );

  const categoryNameMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activeProducts.filter((product) => {
      if (selectedCategoryId !== "all" && product.categoryId !== selectedCategoryId) {
        return false;
      }
      if (onlyAvailable && product.availability !== "available") {
        return false;
      }
      if (query) {
        const catName = (categoryNameMap.get(product.categoryId) ?? "").toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          catName.includes(query)
        );
      }
      return true;
    });
  }, [activeProducts, categoryNameMap, onlyAvailable, searchQuery, selectedCategoryId]);

  const resetFilters = () => {
    setSelectedCategoryId("all");
    setSearchQuery("");
    setOnlyAvailable(false);
  };

  return (
    <PublicShell>
      {/* Page Header & Filters */}
      <section className="bg-white border-b border-[#C7E4CA] py-5 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#287A45]">
                புதிய பொருட்கள் பட்டியல்
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#26352B] mt-0.5">
                புதிய கோழிக்கறி &amp; பண்ணை முட்டைகள்
              </h1>
              <p className="text-xs sm:text-sm text-[#516357] mt-0.5 hidden sm:block max-w-xl">
                சுகாதாரமாக வெட்டப்பட்ட அனைத்து கறிக்கட்டுகள் மற்றும் பண்ணை முட்டைகளைப் பார்வையிடுங்கள். பிரிவு வாரியாக வடிகட்டி, வாட்ஸ்அப்பில் எளிதாக ஆர்டர் செய்யுங்கள்.
              </p>
            </div>
          </div>

          {/* Search & In Stock Filter Row */}
          <div className="mt-3.5 sm:mt-5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#516357] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="கறிக்கட்டுகளைத் தேடுங்கள்..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#C7E4CA] bg-[#EDF7EE]/50 text-xs sm:text-sm text-[#26352B] placeholder:text-[#516357]/70 focus:outline-none focus:ring-2 focus:ring-[#287A45] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#516357] hover:text-[#26352B]"
                  aria-label="தேடலை அழிக்க"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOnlyAvailable((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                onlyAvailable
                  ? "bg-[#287A45] border-[#287A45] text-white"
                  : "bg-white border-[#C7E4CA] text-[#26352B] hover:bg-[#EDF7EE]"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>இருப்பில் உள்ளவை</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategoryId("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategoryId === "all"
                  ? "bg-[#287A45] text-white shadow-xs"
                  : "bg-[#EDF7EE] text-[#26352B] hover:bg-[#DDF3DF]"
              }`}
            >
              அனைத்தும் ({activeProducts.length})
            </button>
            {activeCategories.map((cat) => {
              const count = activeProducts.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? "bg-[#287A45] text-white font-semibold shadow-xs"
                      : "bg-[#EDF7EE] text-[#26352B] hover:bg-[#DDF3DF]"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-5 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3.5 sm:mb-5 text-xs sm:text-sm text-[#516357]">
            <p>
              மொத்தம் <span className="font-semibold text-[#26352B]">{filteredProducts.length}</span> பொருட்கள் காட்டப்படுகின்றன
              {selectedCategoryId !== "all" && (
                <>
                  {" "}
                  (பிரிவு:{" "}
                  <span className="font-semibold text-[#287A45]">
                    {categoryNameMap.get(selectedCategoryId)}
                  </span>
                  )
                </>
              )}
            </p>
            {(selectedCategoryId !== "all" || searchQuery || onlyAvailable) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[#287A45] font-semibold hover:underline"
              >
                மீட்டமை
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#C7E4CA] p-8 text-center max-w-sm mx-auto">
              <p className="text-sm font-bold text-[#26352B]">பொருட்கள் எதுவும் கிடைக்கவில்லை</p>
              <p className="text-xs text-[#516357] mt-1">
                தேடல் வார்த்தையை மாற்றவும் அல்லது வேறு பிரிவைத் தேர்ந்தெடுக்கவும்.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3.5 px-4 py-2 rounded-lg bg-[#287A45] text-white text-xs font-semibold"
              >
                அனைத்தையும் காட்டு
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNameMap.get(product.categoryId)}
                  whatsappNumber={content.contact.whatsappNumber}
                  shopName={content.shopName}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
