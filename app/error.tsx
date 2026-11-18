"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const isTa = language === "ta";

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#DDF3DF]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#C7E4CA] p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#26352B]">
          {isTa ? "ஏதோ பிழை ஏற்பட்டது" : "Something went wrong"}
        </h2>
        <p className="text-xs sm:text-sm text-[#516357]">
          {error?.message ||
            (isTa
              ? "இந்தப் பக்கத்தை ஏற்றுவதில் எதிர்பாராத பிழை ஏற்பட்டது."
              : "An unexpected error occurred while loading this page.")}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>{isTa ? "மீண்டும் முயற்சி செய்" : "Try Again"}</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] text-xs sm:text-sm font-semibold transition-colors"
          >
            {isTa ? "முகப்பு" : "Go Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}

