"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
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
  const isAvailable = product.availability === "available";
  const whatsappUrl = contentService.buildWhatsAppUrl(
    whatsappNumber,
    `வணக்கம் ${shopName}, நான் பின்வரும் பொருளை ஆர்டர் செய்ய விரும்புகிறேன்:\n• பொருள்: ${product.name}\n• அளவு: ${product.unit}\n• விலை: ₹${product.price}`
  );

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl border border-[#C7E4CA] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      {/* Floating Image Showcase */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#F4FAF5] to-white flex items-center justify-center p-3 sm:p-4">
        <img
          src={product.image}
          alt={product.name}
          className={`max-w-full max-h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-105 ${
            !isAvailable ? "opacity-75 grayscale-[25%]" : ""
          }`}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {categoryName && (
            <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-[#26352B] shadow-xs">
              {categoryName}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DDF3DF]/95 text-[#287A45] text-[10px] sm:text-[11px] font-semibold shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">இருப்பில் உள்ளது</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] sm:text-[11px] font-semibold shadow-xs">
              <XCircle className="w-3 h-3" />
              <span>தீர்ந்தது</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-bold text-[#26352B] leading-snug group-hover:text-[#287A45] transition-colors line-clamp-1 sm:line-clamp-2">
          {product.name}
        </h3>
        {!compact && (
          <p className="text-xs text-[#516357] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 flex-1 hidden sm:block">
            {product.description}
          </p>
        )}

        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#EDF7EE] flex items-end justify-between gap-1.5">
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-xs font-medium text-[#516357] truncate">
              {product.unit}
            </span>
            <span className="text-base sm:text-xl font-bold text-[#26352B]">
              ₹{product.price}
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
              <span>வாட்ஸ்அப்</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-[#516357] text-[11px] sm:text-xs font-medium cursor-not-allowed shrink-0"
            >
              இருப்பு இல்லை
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
