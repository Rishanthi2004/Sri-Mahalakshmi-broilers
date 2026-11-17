"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { AnimatedCard, FadeInSection } from "@/components/common/MotionPrimitives";
import { ProductShowcase } from "@/components/public/ProductShowcase";
import { PublicShell } from "@/components/public/PublicShell";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import {
  useCategories,
  useProducts,
  useWebsiteContent,
} from "@/services/use-store-data";
import { WhyChooseUsItem } from "@/types";

const WHY_ICONS: Record<WhyChooseUsItem["iconName"], React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#287A45]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#287A45]" />,
  Award: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#287A45]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#287A45]" />,
};

export default function HomePage() {
  const { content } = useWebsiteContent();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { language, t } = useLanguage();

  const categoryMap = new Map((categories || []).map((c) => [c.id, c.name]));

  // Match featuredProductIds order, falling back to products flagged isFeatured
  const activeProducts = (products || []).filter((p) => p?.isActive && !p?.isDeleted);
  const selectedFeatured = (content?.featuredProductIds || [])
    .map((id) => activeProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const featuredProducts =
    selectedFeatured.length > 0
      ? selectedFeatured.slice(0, 7)
      : activeProducts.filter((p) => p.isFeatured).slice(0, 7);

  const shopDisplayName =
    language === "ta"
      ? (content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்")
      : (content?.shopNameEn || "Sri Mahalakshmi Broilers");

  const heroWhatsAppMessage =
    language === "ta"
      ? `வணக்கம் ${shopDisplayName}, நான் புதிய சிக்கன் கறிக்கட்டுகள் ஆர்டர் செய்ய விரும்புகிறேன்.`
      : `Hello ${shopDisplayName}, I would like to order fresh chicken cuts.`;

  const heroWhatsAppUrl = contentService.buildWhatsAppUrl(
    content?.contact?.whatsappNumber || "919487203778",
    heroWhatsAppMessage
  );

  const ctaWhatsAppMessage =
    language === "ta"
      ? `வணக்கம் ${shopDisplayName}, நான் முன்கூட்டியே ஆர்டர் பதிவு செய்ய விரும்புகிறேன்.`
      : `Hello ${shopDisplayName}, I would like to pre-book an order for chicken cuts.`;

  const ctaWhatsAppUrl = contentService.buildWhatsAppUrl(
    content?.contact?.whatsappNumber || "919487203778",
    ctaWhatsAppMessage
  );

  const getWhyItem = (idx: number, item: WhyChooseUsItem) => {
    if (idx === 0) return { title: t("whyFreshTitle"), description: t("whyFreshDesc") };
    if (idx === 1) return { title: t("whyHygieneTitle"), description: t("whyHygieneDesc") };
    if (idx === 2) return { title: t("whyServiceTitle"), description: t("whyServiceDesc") };
    if (idx === 3) return { title: t("whyTrustTitle"), description: t("whyTrustDesc") };
    return { title: item.title, description: item.description };
  };

  return (
    <PublicShell>
      {/* HERO SECTION - Streamlined on Mobile */}
      <section className="relative overflow-hidden bg-[#DDF3DF] pt-4 pb-6 sm:pt-8 sm:pb-14 lg:pt-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#C7E4CA] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-6 p-5 sm:p-8 lg:p-12 space-y-3.5 sm:space-y-5"
              >
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#287A45] text-[11px] sm:text-xs font-semibold tracking-wide ${language === "ta" ? "font-tamil" : ""}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t("heroBadge")}
                </span>

                <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#26352B] leading-tight ${language === "ta" ? "font-tamil-hero" : ""}`}>
                  {t("heroHeadline")}
                </h1>

                <p className={`text-xs sm:text-base lg:text-lg text-[#516357] leading-relaxed max-w-xl ${language === "ta" ? "font-tamil" : ""}`}>
                  {t("heroSubheadline")}
                </p>

                <div className="flex flex-row flex-wrap items-center gap-2.5 pt-1">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200"
                  >
                    <span>{t("heroPrimaryCta")}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>

                  <a
                    href={heroWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                    <span>{t("heroSecondaryCta")}</span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="lg:col-span-6 h-48 sm:h-64 lg:h-[420px] relative bg-[#EDF7EE] overflow-hidden"
              >
                <picture className="w-full h-full block">
                  <source srcSet="/images/hero-banner.avif" type="image/avif" />
                  <img
                    src={content?.hero?.bannerImage || "/images/hero-banner.jpg"}
                    alt={`${content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"} புதிய பண்ணை கோழிக்கறி வரவு`}
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE - Floating Showcase */}
      <ProductShowcase
        products={featuredProducts}
        categoryMap={categoryMap}
        whatsappNumber={content?.contact?.whatsappNumber || "919487203778"}
        shopName={shopDisplayName}
      />

      {/* WHY CHOOSE US - Compact 2x2 on Mobile */}
      <section className="py-8 sm:py-14 lg:py-16 bg-[#DDF3DF]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <FadeInSection className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#287A45]">
              {t("whySubtitle")}
            </span>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[#26352B] mt-0.5">
              {t("whyTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-[#516357] mt-1 hidden sm:block">
              {t("whyDesc")}
            </p>
          </FadeInSection>

          {/* 2 columns on mobile, 4 on desktop with interactive card animation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {(content?.whyChooseUs || []).map((item, idx) => {
              const localized = getWhyItem(idx, item);
              return (
                <AnimatedCard key={item.id} delay={idx * 0.05} className="h-full">
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-[#C7E4CA] hover:border-[#287A45]/50 p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between cursor-pointer select-none">
                    <div>
                      <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#DDF3DF] flex items-center justify-center mb-2.5 sm:mb-3">
                        {WHY_ICONS[item.iconName] || <Sparkles className="w-5 h-5 text-[#287A45]" />}
                      </div>
                      <h3 className="text-xs sm:text-base font-bold text-[#26352B] leading-tight">
                        {localized.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#516357] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {localized.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-6 sm:py-12 bg-[#DDF3DF] pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="bg-[#287A45] rounded-2xl p-5 sm:p-8 lg:p-10 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="max-w-xl space-y-1.5">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-snug">
                  {t("ctaHeadline")}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {t("ctaDesc")}
                </p>
              </div>
              <a
                href={ctaWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3.5 rounded-xl bg-white text-[#287A45] hover:bg-[#EDF7EE] font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 shrink-0 w-full sm:w-auto"
              >
                <WhatsAppIcon className="w-5 h-5 rounded" />
                <span>{t("ctaButton")}</span>
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>
    </PublicShell>
  );
}
