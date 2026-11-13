"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Shield,
  Youtube,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useWebsiteContent } from "@/services/use-store-data";

export function PublicFooter() {
  const { content } = useWebsiteContent();

  return (
    <footer className="bg-white border-t border-[#C7E4CA] text-[#26352B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <BrandLogo
              shopName={content.shopName}
              logoUrl={content.logoUrl}
              subtitle="தினசரி புதிய கோழிக்கறி"
              size="sm"
            />
            <p className="text-xs sm:text-sm text-[#516357] leading-relaxed line-clamp-3 sm:line-clamp-none">
              {content.footer.description}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {content.socialLinks.facebook && (
                <a
                  href={content.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-[#EDF7EE] text-[#287A45] hover:bg-[#287A45] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {content.socialLinks.instagram && (
                <a
                  href={content.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-[#EDF7EE] text-[#287A45] hover:bg-[#287A45] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {content.socialLinks.youtube && (
                <a
                  href={content.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-[#EDF7EE] text-[#287A45] hover:bg-[#287A45] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#26352B] mb-2.5 sm:mb-3">
              தள வழிகாட்டி
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-[#516357] hover:text-[#287A45] transition-colors">
                  முகப்பு
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#516357] hover:text-[#287A45] transition-colors"
                >
                  எங்கள் பொருட்கள்
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#516357] hover:text-[#287A45] transition-colors"
                >
                  எங்களைப் பற்றி
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#516357] hover:text-[#287A45] transition-colors"
                >
                  தொடர்பு கொள்ள
                </Link>
              </li>
              <li className="col-span-2 sm:col-span-1 pt-1">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#287A45] hover:underline"
                >
                  <Shield className="w-3 h-3" />
                  நிர்வாக மையம் (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#26352B] mb-2.5 sm:mb-3">
              தொடர்பு விவரங்கள்
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#516357]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#287A45] shrink-0" />
                <a
                  href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
                  className="hover:text-[#287A45] transition-colors font-medium text-[#26352B]"
                >
                  {content.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#287A45] shrink-0" />
                <a
                  href={`mailto:${content.contact.email}`}
                  className="hover:text-[#287A45] transition-colors truncate"
                >
                  {content.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#287A45] shrink-0 mt-0.5" />
                <span className="leading-snug line-clamp-2">{content.contact.address}</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="hidden sm:block">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#26352B] mb-2.5 sm:mb-3">
              வேலை நேரம்
            </h3>
            <ul className="space-y-2 text-xs text-[#516357]">
              {content.contact.openingHours.map((item) => (
                <li key={item.day} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#287A45]" />
                    <span className="font-medium text-[#26352B]">{item.day}</span>
                  </div>
                  <span>{item.isClosed ? "விடுமுறை" : item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#EDF7EE] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#516357]">
          <p>{content.footer.copyrightText}</p>
          <p>தினசரி புதிய பண்ணை இறைச்சி • ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்</p>
        </div>
      </div>
    </footer>
  );
}
