"use client";

import React from "react";

interface BrandLogoProps {
  shopName?: string;
  logoUrl?: string;
  subtitle?: string;
  size?: "sm" | "md";
}

export function BrandLogo({
  shopName = "ஸ்ரீ மகாலட்சுமி",
  logoUrl = "/images/logo.png",
  subtitle = "பிராய்லர்ஸ்",
  size = "md",
}: BrandLogoProps) {
  const iconBox = size === "sm" ? "h-9 w-9 sm:h-10 sm:w-10" : "h-11 w-11 sm:h-12 sm:w-12";
  const titleSize = size === "sm" ? "text-base" : "text-lg sm:text-xl";
  const resolvedLogo = logoUrl && logoUrl.trim() !== "" ? logoUrl : "/images/logo.png";

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      <img
        src={resolvedLogo}
        alt={shopName}
        className={`${iconBox} rounded-full object-cover border-2 border-[#287A45]/30 shadow-xs bg-white shrink-0`}
      />
      <div className="leading-tight">
        <span className={`block font-extrabold tracking-tight text-[#26352B] ${titleSize}`}>
          {shopName}
        </span>
        {subtitle && (
          <span className="block text-xs sm:text-[13px] font-bold text-[#287A45] tracking-wide">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

