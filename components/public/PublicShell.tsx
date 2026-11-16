"use client";

import React from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const { content } = useWebsiteContent();
  const { language, t } = useLanguage();

  const whatsappMessage =
    language === "en"
      ? `Hello ${content.shopName}, I would like to order fresh farm chicken.`
      : `வணக்கம் ${content.shopName}, எனக்கு புதிய பண்ணைக் கோழிக்கறி ஆர்டர் செய்ய வேண்டும்.`;

  const whatsappUrl = contentService.buildWhatsAppUrl(
    content.contact.whatsappNumber,
    whatsappMessage
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#DDF3DF] text-[#26352B]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />

      {/* Floating Quick WhatsApp Click-to-Chat Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("orderWhatsApp")}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/30 text-xs sm:text-sm font-bold tracking-wide active:scale-95 transition-all duration-200 hover:-translate-y-0.5 border border-white/20"
      >
        <WhatsAppIcon className="w-5 h-5 rounded" />
        <span>{t("orderWhatsApp")}</span>
      </a>
    </div>
  );
}
