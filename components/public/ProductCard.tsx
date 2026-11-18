"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  whatsappNumber: string;
  shopName: string;
  compact?: boolean;
}

export function ProductCard({
  product,
  categoryName,
  whatsappNumber,
  shopName,
  compact = false,
}: ProductCardProps) {
  const {
    language,
    t,
    localizeProductName,
    localizeCategoryName,
    localizeUnit,
    localizeDescription,
  } = useLanguage();

  const isAvailable = product.availability === "available";
  const displayName = localizeProductName(product.name);
  const displayCategory = categoryName ? localizeCategoryName(categoryName) : undefined;
  const displayUnit = localizeUnit(product.unit);
  const displayDescription = localizeDescription(product.description);

  const whatsappMessage =
    language === "en"
      ? `Hello ${shopName}, I would like to order:\n• Product: ${displayName}\n• Quantity: ${displayUnit}`
      : `வணக்கம் ${shopName}, நான் பின்வரும் பொருளை ஆர்டர் செய்ய விரும்புகிறேன்:\n• பொருள்: ${displayName}\n• அளவு: ${displayUnit}`;

  const whatsappUrl = contentService.buildWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: "0 16px 32px -8px rgba(40,122,69,0.2), 0 4px 12px -2px rgba(0,0,0,0.06)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-white rounded-xl border border-[#C7E4CA] hover:border-[#287A45]/60 shadow-sm transition-colors overflow-hidden flex flex-col h-full select-none"
    >
      {/* Floating Image Showcase */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#F4FAF5] to-white flex items-center justify-center p-3 sm:p-4">
        <img
          src={product.image || "/images/float-curry-cut.png"}
          alt={displayName}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/float-curry-cut.png";
          }}
          className={`max-w-full max-h-full object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
            !isAvailable ? "opacity-75 grayscale-[25%]" : ""
          }`}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {displayCategory && (
            <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-[#26352B] shadow-xs">
              {displayCategory}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <span
              title={t("inStock")}
              aria-label={t("inStock")}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DDF3DF]/95 text-[#287A45] text-[10px] sm:text-[11px] font-semibold shadow-xs"
            >
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">{t("inStock")}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] sm:text-[11px] font-semibold shadow-xs">
              <XCircle className="w-3 h-3" />
              <span>{t("outOfStock")}</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-bold text-[#26352B] leading-snug group-hover:text-[#287A45] transition-colors line-clamp-1 sm:line-clamp-2">
          {displayName}
        </h3>
        {!compact && (
          <p className="text-xs text-[#516357] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 flex-1 hidden sm:block">
            {displayDescription}
          </p>
        )}

        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#EDF7EE] flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="inline-block text-xs sm:text-sm font-semibold text-[#287A45] bg-[#EDF7EE] px-2.5 py-1 rounded-md border border-[#C7E4CA] truncate">
              {displayUnit}
            </span>
          </div>

          {isAvailable ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 rounded" />
              <span>{language === "ta" ? "வாட்ஸ்அப்" : "WhatsApp"}</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-[#516357] text-[11px] sm:text-xs font-medium cursor-not-allowed shrink-0"
            >
              {t("outOfStock")}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
