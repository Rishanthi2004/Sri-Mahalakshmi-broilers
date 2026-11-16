"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { ShareFounderModal } from "@/components/founder/ShareFounderModal";
import { useLanguage } from "@/context/LanguageContext";

interface ShareFounderButtonProps {
  founderName?: string;
  founderDesignation?: string;
  founderPhoto?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "compact";
}

export function ShareFounderButton({
  founderName,
  founderDesignation,
  founderPhoto,
  className = "",
  variant = "primary",
}: ShareFounderButtonProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  let variantStyles =
    "bg-[#287A45] hover:bg-[#1E5F35] text-white shadow-xs border border-[#287A45]";
  if (variant === "secondary") {
    variantStyles =
      "bg-[#DDF3DF] hover:bg-[#c6ecc9] text-[#287A45] border border-[#C7E4CA]";
  } else if (variant === "outline") {
    variantStyles =
      "bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] border border-[#C7E4CA]";
  } else if (variant === "compact") {
    variantStyles =
      "bg-white hover:bg-[#EDF7EE] text-[#287A45] border border-[#C7E4CA] text-xs py-1.5 px-3";
  }

  const basePadding = variant === "compact" ? "" : "px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm";

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 cursor-pointer select-none ${basePadding} ${variantStyles} ${className}`}
        aria-label="Share Founder Profile"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>{t("shareFounderProfile")}</span>
      </button>

      <ShareFounderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        founderName={founderName}
        founderDesignation={founderDesignation}
        founderPhoto={founderPhoto}
      />
    </>
  );
}

