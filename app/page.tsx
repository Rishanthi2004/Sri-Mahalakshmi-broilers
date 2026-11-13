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
import { FadeInSection } from "@/components/common/MotionPrimitives";
import { ProductShowcase } from "@/components/public/ProductShowcase";
import { PublicShell } from "@/components/public/PublicShell";
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

  const categoryMap = new Map((categories || []).map((c) => [c.id, c.name]));

  // Match featuredProductIds order, falling back to products flagged isFeatured
  const activeProducts = (products || []).filter((p) => p?.isActive);
  const selectedFeatured = (content?.featuredProductIds || [])
    .map((id) => activeProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const featuredProducts =
    selectedFeatured.length > 0
      ? selectedFeatured.slice(0, 7)
      : activeProducts.filter((p) => p.isFeatured).slice(0, 7);

  const heroWhatsAppUrl = contentService.buildWhatsAppUrl(
    content?.contact?.whatsappNumber || "919876543210",
    `வணக்கம் ${content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"}, நான் புதிய சிக்கன் கறிக்கட்டுகள் ஆர்டர் செய்ய விரும்புகிறேன்.`
  );

  const ctaWhatsAppUrl = contentService.buildWhatsAppUrl(
    content?.contact?.whatsappNumber || "919876543210",
    `வணக்கம் ${content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"}, நான் முன்கூட்டியே ஆர்டர் பதிவு செய்ய விரும்புகிறேன்.`
  );

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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#287A45] text-[11px] sm:text-xs font-semibold tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {content?.hero?.badge || "100% தினசரி புதிய பண்ணை வரவு"}
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#26352B] leading-tight">
                  {content?.hero?.headline || "தினமும் காலையில் சுகாதாரமாக வெட்டப்பட்ட புதிய கோழிக்கறி"}
                </h1>

                <p className="text-xs sm:text-base lg:text-lg text-[#516357] leading-relaxed max-w-xl">
                  {content?.hero?.subheadline || "மென்மையான கறிக்கட், கொழுப்பற்ற எலும்பில்லா நெஞ்சுக்கறி முதல் பண்ணை முட்டைகள் வரை."}
                </p>

                <div className="flex flex-row flex-wrap items-center gap-2.5 pt-1">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200"
                  >
                    <span>{content?.hero?.primaryCtaText || "பொருட்களைப் பார்க்க"}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>

                  <a
                    href={heroWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                    <span>வாட்ஸ்அப் ஆர்டர்</span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="lg:col-span-6 h-48 sm:h-64 lg:h-[420px] relative bg-[#EDF7EE]"
              >
                <img
                  src={content?.hero?.bannerImage || "/images/hero-banner.jpg"}
                  alt={`${content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"} புதிய கோழிக்கறி கவுண்டர்`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26352B]/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/20 lg:via-transparent lg:to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE - Floating Showcase */}
      <ProductShowcase
        products={featuredProducts}
        categoryMap={categoryMap}
        whatsappNumber={content?.contact?.whatsappNumber || "919876543210"}
        shopName={content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"}
      />

      {/* WHY CHOOSE US - Compact 2x2 on Mobile */}
      <section className="py-8 sm:py-14 lg:py-16 bg-[#DDF3DF]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <FadeInSection className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#287A45]">
              எங்கள் தரக் கொள்கைகள்
            </span>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[#26352B] mt-0.5">
              குடும்பங்கள் ஏன் {content?.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"}யை தேர்ந்தெடுக்கிறார்கள்?
            </h2>
            <p className="text-xs sm:text-sm text-[#516357] mt-1 hidden sm:block">
              சீரான தூய்மை, நேர்மையான எடை மற்றும் தினசரி புதிய காலைப் பண்ணை வரவு.
            </p>
          </FadeInSection>

          {/* 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {(content?.whyChooseUs || []).map((item, idx) => (
              <FadeInSection key={item.id} delay={idx * 0.05}>
                <div className="bg-white rounded-xl border border-[#C7E4CA] p-3.5 sm:p-5 shadow-xs hover:shadow-sm transition-shadow h-full flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#DDF3DF] flex items-center justify-center mb-2.5 sm:mb-3">
                      {WHY_ICONS[item.iconName] || <Sparkles className="w-5 h-5 text-[#287A45]" />}
                    </div>
                    <h3 className="text-xs sm:text-base font-bold text-[#26352B] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#516357] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
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
                  {content?.ctaBanner?.headline || "நீங்கள் வருவதற்கு முன்பே கறி வெட்டித் தயார் செய்து வைக்க வேண்டுமா?"}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {content?.ctaBanner?.description || "உங்களுக்குத் தேவையான கறிக்கட்டு வகை மற்றும் எடையை வாட்ஸ்அப்பில் அனுப்புங்கள்."}
                </p>
              </div>
              <a
                href={ctaWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3.5 rounded-xl bg-white text-[#287A45] hover:bg-[#EDF7EE] font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 shrink-0 w-full sm:w-auto"
              >
                <WhatsAppIcon className="w-5 h-5 rounded" />
                <span>{content?.ctaBanner?.buttonText || "வாட்ஸ்அப்பில் உடனே ஆர்டர் செய்க"}</span>
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>
    </PublicShell>
  );
}
