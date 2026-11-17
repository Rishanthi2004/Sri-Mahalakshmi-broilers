"use client";

import React from "react";

interface BrandLogoProps {
  shopName?: string;
  logoUrl?: string;
  subtitle?: string;
  size?: "sm" | "md";
  showDivider?: boolean;
}

export function BrandLogo({
  shopName = "ஸ்ரீ மகாலட்சுமி",
  logoUrl = "/images/logo.png",
  subtitle = "பிராய்லர்ஸ்",
  size = "md",
  showDivider = true,
}: BrandLogoProps) {
  const iconBox = size === "sm" ? "h-7 w-7 sm:h-9 sm:w-9" : "h-8 w-8 sm:h-11 sm:w-11";
  const titleSize = size === "sm" ? "text-xs sm:text-base" : "text-xs min-[360px]:text-[13px] sm:text-lg lg:text-xl";
  const dividerHeight = size === "sm" ? "h-6 sm:h-7" : "h-7 sm:h-9";
  const resolvedLogo = logoUrl && logoUrl.trim() !== "" ? logoUrl : "/images/logo.png";

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 select-none min-w-0">
      <img
        src={resolvedLogo}
        alt={shopName}
        className={`${iconBox} rounded-full object-cover border-2 border-[#287A45]/30 shadow-xs bg-white shrink-0`}
      />
      {showDivider && (
        <div className={`w-[1px] ${dividerHeight} bg-slate-300 shrink-0`} />
      )}
      <div className="leading-tight min-w-0">
        <span className={`block font-extrabold tracking-tight text-[#26352B] ${titleSize} whitespace-nowrap`}>
          {shopName}
        </span>
        {subtitle && (
          <span className="block text-[9px] sm:text-xs font-bold text-[#287A45] tracking-wide">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

