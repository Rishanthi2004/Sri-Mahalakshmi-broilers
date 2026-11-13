"use client";

import React from "react";

interface BrandLogoProps {
  shopName?: string;
  logoUrl?: string;
  subtitle?: string;
  size?: "sm" | "md";
}

export function BrandLogo({
  shopName = "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்",
  logoUrl,
  subtitle = "தினசரி புதிய கோழிக்கறி",
  size = "md",
}: BrandLogoProps) {
  const iconBox = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const titleSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={shopName}
          className={`${iconBox} rounded-lg object-cover border border-[#C7E4CA] bg-white`}
        />
      ) : (
        <div
          className={`${iconBox} rounded-lg bg-[#287A45] text-white flex items-center justify-center shadow-sm shrink-0`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              d="M12 3C7.5 3 4 6.5 4 11c0 4.5 3.5 9 8 10 4.5-1 8-5.5 8-10 0-4.5-3.5-8-8-8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7v10M8.5 11.5C9.5 10.5 10.8 10 12 10s2.5.5 3.5 1.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      <div className="leading-tight">
        <span className={`block font-bold tracking-tight text-[#26352B] ${titleSize}`}>
          {shopName}
        </span>
        {subtitle && (
          <span className="block text-[11px] font-medium text-[#287A45] tracking-wide uppercase">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

