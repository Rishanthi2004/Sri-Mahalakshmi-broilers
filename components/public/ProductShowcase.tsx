"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { contentService } from "@/services/content-service";
import { Product } from "@/types";

interface ProductShowcaseProps {
  products: Product[];
  categoryMap: Map<string, string>;
  whatsappNumber: string;
  shopName: string;
}

export function ProductShowcase({
  products,
  categoryMap,
  whatsappNumber,
  shopName,
}: ProductShowcaseProps) {
  // Up to 7 items (matching the 7 floating cuts)
  const showcaseItems = products.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= showcaseItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, showcaseItems.length]);

  if (showcaseItems.length === 0) return null;

  const selected = showcaseItems[activeIndex] ?? showcaseItems[0];
  const isAvailable = selected.availability === "available";
  const categoryName = categoryMap.get(selected.categoryId) ?? "புதிய கோழிக்கறி";

  const whatsappUrl = contentService.buildWhatsAppUrl(
    whatsappNumber,
    `வணக்கம் ${shopName}, நான் பின்வரும் பொருளை ஆர்டர் செய்ய விரும்புகிறேன்:\n• பொருள்: ${selected.name}\n• அளவு: ${selected.unit}\n• விலை: ₹${selected.price}`
  );

  return (
    <section className="py-6 sm:py-12 lg:py-16 bg-white border-y border-[#C7E4CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#F5FAF6] via-white to-[#EAF6ED] border border-[#C7E4CA] shadow-sm p-4 sm:p-8 lg:p-10">
          
          {/* Main Showcase Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            
            {/* Left: Section Header (compact on mobile) */}
            <div className="lg:col-span-3 text-center lg:text-left space-y-1.5 sm:space-y-3">
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#287A45]">
                இன்றைய புதிய வரவு
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#26352B] leading-tight">
                சிறப்பு{" "}
                <span className="block font-serif italic font-semibold text-[#287A45]">
                  கோழிக்கறி &amp; முட்டைகள்.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#516357] leading-relaxed max-w-xs mx-auto lg:mx-0 hidden sm:block">
                எங்களின் மிகவும் பிரபலமான தினசரி கறிக்கட்டுகள், சுத்தமாக வெட்டப்பட்டு உடனே எடுத்துச் செல்ல அல்லது வாட்ஸ்அப் ஆர்டருக்கு தயார்.
              </p>
              <div className="pt-1 hidden sm:block">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#C7E4CA] bg-[#DDF3DF]/60 hover:bg-[#DDF3DF] text-[#287A45] text-xs font-semibold transition-colors"
                >
                  <span>அனைத்து கறிக்கட்டுகளையும் காண்க</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Center: FLOATING PRODUCT CUTOUT WITH SOFT SHADOW */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center py-2 sm:py-4">
              <div className="relative flex flex-col items-center justify-center">
                {/* Floating animation container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -12 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.5,
                        ease: "easeInOut",
                      }}
                      className="w-48 h-40 sm:w-64 sm:h-56 lg:w-72 lg:h-64 flex items-center justify-center"
                    >
                      <img
                        src={selected.image}
                        alt={selected.name}
                        className={`max-w-full max-h-full object-contain filter drop-shadow-[0_18px_24px_rgba(40,122,69,0.18)] transition-all ${
                          !isAvailable ? "opacity-75 grayscale-[30%]" : ""
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Soft natural radial shadow underneath floating item */}
                <motion.div
                  animate={{ scale: [1, 0.92, 1], opacity: [0.35, 0.22, 0.35] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: "easeInOut",
                  }}
                  className="w-36 sm:w-48 lg:w-56 h-4 sm:h-5 rounded-full bg-gradient-to-r from-transparent via-[#26352B]/40 to-transparent blur-sm -mt-2"
                />
              </div>
            </div>

            {/* Right: Selected Cut Details (compact & clean on mobile) */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5 sm:space-y-3.5 text-center lg:text-left"
                >
                  <div className="flex flex-col sm:flex-row lg:flex-row items-center lg:items-baseline justify-between gap-1 sm:gap-3 border-b border-[#C7E4CA] pb-2 sm:pb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#26352B] leading-tight">
                      {selected.name}
                    </h3>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="text-2xl font-extrabold text-[#287A45]">
                        ₹{selected.price}
                      </span>
                      <span className="text-xs text-[#516357]">/ {selected.unit}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#516357] leading-relaxed line-clamp-2">
                    {selected.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#C7E4CA] text-[#26352B] font-medium">
                      {categoryName}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#C7E4CA] text-[#516357]">
                      0°C–4°C குளிரூட்டப்பட்டது
                    </span>
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DDF3DF] text-[#287A45] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        இருப்பில் உள்ளது
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-100 text-red-700 font-semibold">
                        <XCircle className="w-3 h-3" />
                        இருப்பு இல்லை
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-center lg:justify-start gap-2">
                    {isAvailable ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <WhatsAppIcon className="w-5 h-5 rounded" />
                        <span>வாட்ஸ்அப் ஆர்டர் செய்க</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#EDF7EE] text-[#516357] text-xs font-bold uppercase cursor-not-allowed"
                      >
                        இருப்பு இல்லை
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Interactive Floating Selector Strip (Horizontal scroll on mobile, clean row on desktop) */}
          <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-[#C7E4CA]">
            <div className="flex items-center justify-between mb-2 sm:hidden text-[11px] text-[#516357]">
              <span>கறிக்கட்டுகளைப் பார்க்க தொடவும்</span>
              <span>{activeIndex + 1} / {showcaseItems.length}</span>
            </div>

            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {showcaseItems.map((item, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`group shrink-0 w-24 sm:w-auto relative flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                      active
                        ? "bg-white border border-[#287A45] shadow-sm"
                        : "bg-white/60 hover:bg-white border border-[#C7E4CA]/60"
                    }`}
                  >
                    {/* Floating mini item */}
                    <div className="w-14 h-12 sm:w-16 sm:h-14 flex items-center justify-center relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`max-w-full max-h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)] transition-transform duration-200 ${
                          active ? "scale-110 -translate-y-0.5" : "group-hover:scale-105"
                        }`}
                      />
                    </div>
                    <span
                      className={`mt-1 text-[11px] sm:text-xs font-bold truncate w-full ${
                        active ? "text-[#287A45]" : "text-[#26352B]"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[11px] font-semibold text-[#516357]">
                      ₹{item.price}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="featured-showcase-bar"
                        className="mt-1 h-0.5 w-8 rounded-full bg-[#287A45]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
