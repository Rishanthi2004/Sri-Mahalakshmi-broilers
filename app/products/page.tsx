"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicShell } from "@/components/public/PublicShell";
import { useLanguage } from "@/context/LanguageContext";
import {
  useCategories,
  useProducts,
  useWebsiteContent,
} from "@/services/use-store-data";

export default function ProductsPage() {
  const { products, loading, error, reload } = useProducts();
  const { categories } = useCategories();
  const { content } = useWebsiteContent();
  const { language, t, localizeCategoryName, localizeProductName } = useLanguage();

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
        const rawCat = categoryNameMap.get(product.categoryId) ?? "";
        const localizedCat = localizeCategoryName(rawCat).toLowerCase();
        const localizedProd = localizeProductName(product.name).toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          localizedProd.includes(query) ||
          product.description.toLowerCase().includes(query) ||
          rawCat.toLowerCase().includes(query) ||
          localizedCat.includes(query)
        );
      }
      return true;
    });
  }, [activeProducts, categoryNameMap, localizeCategoryName, localizeProductName, onlyAvailable, searchQuery, selectedCategoryId]);

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
                {t("productsCatalogBadge")}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#26352B] mt-0.5">
                {t("productsPageTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-[#516357] mt-0.5 hidden sm:block max-w-xl">
                {t("productsPageDesc")}
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
                placeholder={t("searchPlaceholder")}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#C7E4CA] bg-[#EDF7EE]/50 text-xs sm:text-sm text-[#26352B] placeholder:text-[#516357]/70 focus:outline-none focus:ring-2 focus:ring-[#287A45] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#516357] hover:text-[#26352B]"
                  aria-label={t("clearFilters")}
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
              <span>{t("inStockOnly")}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategoryId("all")}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 z-0 cursor-pointer ${
                selectedCategoryId === "all"
                  ? "text-white shadow-xs"
                  : "bg-[#EDF7EE] text-[#26352B] hover:bg-[#DDF3DF]"
              }`}
            >
              {selectedCategoryId === "all" && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#287A45] rounded-lg -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {t("allCategories")} ({activeProducts.length})
            </button>
            {activeCategories.map((cat) => {
              const count = activeProducts.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;
              const catTitle = localizeCategoryName(cat.name);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 z-0 cursor-pointer ${
                    isSelected
                      ? "text-white font-semibold shadow-xs"
                      : "bg-[#EDF7EE] text-[#26352B] hover:bg-[#DDF3DF]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[#287A45] rounded-lg -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {catTitle} ({count})
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
              {language === "ta" ? (
                <>
                  மொத்தம் <span className="font-semibold text-[#26352B]">{filteredProducts.length}</span> பொருட்கள் காட்டப்படுகின்றன
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-[#26352B]">{filteredProducts.length}</span> {t("totalProductsShown")}
                </>
              )}
              {selectedCategoryId !== "all" && (
                <>
                  {" "}
                  ({t("categoryLabel")}:{" "}
                  <span className="font-semibold text-[#287A45]">
                    {localizeCategoryName(categoryNameMap.get(selectedCategoryId) || "")}
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
                {t("resetFilter")}
              </button>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#C7E4CA] p-3 sm:p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-square sm:aspect-[4/3] bg-slate-100 rounded-lg" />
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  <div className="h-8 bg-[#EDF7EE] rounded-lg mt-2" />
                </div>
              ))}
            </div>
          ) : error && products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-sm mx-auto shadow-xs">
              <p className="text-sm font-bold text-rose-700">
                {language === "ta" ? "பொருட்களை ஏற்றுவதில் பிழை ஏற்பட்டது" : "Failed to load products"}
              </p>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-3.5 px-4 py-2 rounded-lg bg-[#287A45] text-white text-xs font-semibold hover:bg-[#1E5F35] cursor-pointer"
              >
                {language === "ta" ? "மீண்டும் முயற்சி செய்" : "Retry"}
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#C7E4CA] p-8 text-center max-w-sm mx-auto">
              <p className="text-sm font-bold text-[#26352B]">{t("noProductsFound")}</p>
              <p className="text-xs text-[#516357] mt-1">
                {t("changeSearchOrCategory")}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3.5 px-4 py-2 rounded-lg bg-[#287A45] text-white text-xs font-semibold"
              >
                {t("showAll")}
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={categoryNameMap.get(product.categoryId)}
                    whatsappNumber={content.contact.whatsappNumber}
                    shopName={content.shopName}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
