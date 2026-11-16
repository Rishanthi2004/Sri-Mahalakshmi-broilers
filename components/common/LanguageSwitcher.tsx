"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "buttons" | "dropdown";
}

export function LanguageSwitcher({
  className = "",
  variant = "pill",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "buttons") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("ta")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            language === "ta"
              ? "bg-[#287A45] text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] border border-slate-200"
          }`}
        >
          தமிழ்
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            language === "en"
              ? "bg-[#287A45] text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] border border-slate-200"
          }`}
        >
          English
        </button>
      </div>
    );
  }

  // Responsive Pill Design: Full on desktop (Globe + தமிழ் | English), Ultra-compact on mobile (தமிழ் | EN)
  return (
    <>
      {/* Desktop / Tablet version: Full with globe */}
      <div
        className={`hidden sm:inline-flex items-center p-0.5 rounded-full border border-[#C7E4CA] bg-[#EDF7EE] text-xs font-bold select-none ${className}`}
        role="group"
        aria-label="Language selection"
      >
        <div className="pl-2 pr-1 text-[#287A45] flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <button
          type="button"
          onClick={() => setLanguage("ta")}
          aria-pressed={language === "ta"}
          className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
            language === "ta"
              ? "bg-[#287A45] text-white font-bold shadow-xs"
              : "text-[#26352B] hover:text-[#287A45]"
          }`}
        >
          தமிழ்
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
            language === "en"
              ? "bg-[#287A45] text-white font-bold shadow-xs"
              : "text-[#26352B] hover:text-[#287A45]"
          }`}
        >
          English
        </button>
      </div>

      {/* Mobile-optimized compact version: Perfect fit without pushing logo */}
      <div
        className={`inline-flex sm:hidden items-center p-0.5 rounded-full border border-[#C7E4CA] bg-[#EDF7EE] text-[11px] font-bold select-none shrink-0 shadow-2xs ${className}`}
        role="group"
        aria-label="Language selection"
      >
        <button
          type="button"
          onClick={() => setLanguage("ta")}
          aria-pressed={language === "ta"}
          className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
            language === "ta"
              ? "bg-[#287A45] text-white font-bold shadow-2xs"
              : "text-[#26352B] hover:text-[#287A45]"
          }`}
        >
          தமிழ்
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
            language === "en"
              ? "bg-[#287A45] text-white font-bold shadow-2xs"
              : "text-[#26352B] hover:text-[#287A45]"
          }`}
        >
          EN
        </button>
      </div>
    </>
  );
}
