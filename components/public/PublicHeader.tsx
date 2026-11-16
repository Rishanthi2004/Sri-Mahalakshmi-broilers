"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Info, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";

export function PublicHeader() {
  const pathname = usePathname();
  const { content } = useWebsiteContent();
  const { t, language } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/products", label: t("products"), icon: ShoppingBag },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: Phone },
  ];

  const whatsappMessage =
    language === "en"
      ? `Hello ${content.shopName}, I would like to order fresh chicken & eggs.`
      : `வணக்கம் ${content.shopName}, நான் புதிய கோழிக்கறி ஆர்டர் செய்ய விரும்புகிறேன்.`;

  const whatsappUrl = contentService.buildWhatsAppUrl(
    content.contact.whatsappNumber,
    whatsappMessage
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C7E4CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 py-3 flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Left Side: Mobile Hamburger Menu Button (Left-aligned on Mobile) + Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger on Mobile (Left side) */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-xl border border-[#C7E4CA] text-[#26352B] hover:bg-[#EDF7EE] hover:text-[#287A45] active:scale-95 transition-all md:hidden shrink-0 cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-[#287A45]" />
              ) : (
                <Menu className="w-5 h-5 text-[#26352B]" />
              )}
            </button>

            {/* Logo & Brand */}
            <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
              <BrandLogo
                shopName="ஸ்ரீ மகாலட்சுமி"
                logoUrl={content.logoUrl}
                subtitle="பிராய்லர்ஸ்"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#DDF3DF] text-[#287A45] font-semibold"
                      : "text-[#26352B] hover:bg-[#EDF7EE] hover:text-[#287A45]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items: Language Switcher, Phone, WhatsApp */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher Pill */}
            <LanguageSwitcher />

            <a
              href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-[#26352B] hover:text-[#287A45] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#287A45]" />
              <span>{content.contact.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-5 h-5 rounded" />
              <span>{t("orderWhatsApp")}</span>
            </a>
          </div>

          {/* Mobile Right Bar: Language Switcher only */}
          <div className="flex md:hidden items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-[#C7E4CA] shadow-lg"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#DDF3DF] text-[#287A45] font-bold shadow-2xs"
                        : "text-[#26352B] hover:bg-[#EDF7EE]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#287A45]" />
                      <span>{link.label}</span>
                    </div>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#287A45]" />}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-[#EDF7EE] flex flex-col gap-2">
                <a
                  href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C7E4CA] text-sm font-medium text-[#26352B] hover:bg-[#EDF7EE] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#287A45]" />
                  <span>
                    {t("callUs")}: {content.contact.phone}
                  </span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="w-5 h-5 rounded" />
                  <span>{t("orderWhatsApp")}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
