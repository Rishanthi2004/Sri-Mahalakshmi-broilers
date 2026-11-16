"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { FadeInSection } from "@/components/common/MotionPrimitives";
import { PublicShell } from "@/components/public/PublicShell";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";

export default function AboutPage() {
  const { content } = useWebsiteContent();
  const { about } = content;
  const { language, t } = useLanguage();

  const whatsappMessage =
    language === "ta"
      ? `வணக்கம் ${content.shopName}, உங்கள் புதிய பண்ணை கோழிக்கறி விநியோகம் குறித்து அறிய விரும்புகிறேன்.`
      : `Hello ${content.shopName}, I would like to inquire about your farm fresh poultry cuts.`;

  const whatsappUrl = contentService.buildWhatsAppUrl(
    content.contact.whatsappNumber,
    whatsappMessage
  );

  const introTitle = t("aboutIntroTitle");
  const introDescription = t("aboutIntroDesc");
  const businessInfoTitle = t("aboutBusinessTitle");
  const businessInfoBody = t("aboutBusinessBody");
  const qualityCommitment = t("aboutQualityCommitmentText");
  const hygienePractices = t("aboutHygieneText");
  const customerSatisfaction = t("aboutSatisfactionText");

  return (
    <PublicShell>
      {/* Editorial Intro - Compact on Mobile */}
      <section className="bg-white border-b border-[#C7E4CA] py-6 sm:py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            <FadeInSection className="lg:col-span-6 space-y-3 sm:space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#DDF3DF] text-[#287A45] text-[11px] font-bold uppercase tracking-wider">
                {t("aboutBadge")}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#26352B] leading-tight">
                {introTitle}
              </h1>
              <p className="text-xs sm:text-base text-[#516357] leading-relaxed">
                {introDescription}
              </p>

              <div className="pt-1 flex items-center gap-2 sm:gap-4">
                <div className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#DDF3DF]/70 border border-[#C7E4CA] text-center sm:text-left">
                  <span className="block text-base sm:text-xl font-extrabold text-[#287A45]">
                    {about.businessExperienceYears}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#516357]">
                    {t("aboutExperience")}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#DDF3DF]/70 border border-[#C7E4CA] text-center sm:text-left">
                  <span className="block text-base sm:text-xl font-extrabold text-[#287A45]">
                    0°C – 4°C
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#516357]">
                    {t("aboutChilled")}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#DDF3DF]/70 border border-[#C7E4CA] text-center sm:text-left">
                  <span className="block text-base sm:text-xl font-extrabold text-[#287A45]">
                    100%
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#516357]">
                    {t("aboutHygienic")}
                  </span>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.08} className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#C7E4CA] shadow-xs bg-[#EDF7EE] aspect-[4/3]">
                <img
                  src={about.shopImage}
                  alt={`${content.shopName} கடை முகப்பு`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Business Information & Owner Profile */}
      <section className="py-8 sm:py-14 bg-[#DDF3DF]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {/* Business Info */}
          <FadeInSection>
            <div className="bg-white rounded-2xl border border-[#C7E4CA] p-5 sm:p-8 shadow-xs">
              <div className="max-w-3xl space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#287A45]">
                  {t("businessInfoTag")}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#26352B]">
                  {businessInfoTitle}
                </h2>
                <p className="text-xs sm:text-base text-[#516357] leading-relaxed">
                  {businessInfoBody}
                </p>

                <div className="pt-3 border-t border-[#EDF7EE] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-[#26352B]">
                    <MapPin className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#516357]">
                        {language === "ta" ? "அலுவலக முகவரி" : "Office Address"}
                      </span>
                      <span className="font-semibold">
                        EB Colony Bus stop, Paramathi Road, Namakkal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#26352B]">
                    <Phone className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#516357]">
                        {language === "ta" ? "தொடர்பு எண்" : "Contact No"}
                      </span>
                      <a href="tel:+919487203778" className="font-semibold hover:text-[#287A45] transition-colors">
                        +91 94872 03778
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Trust & Heritage Spotlight */}
          <FadeInSection>
            <div className="bg-white rounded-2xl border border-[#C7E4CA] overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <div className="md:col-span-5 h-72 sm:h-96 md:h-full min-h-[340px] bg-[#EDF7EE] relative">
                  <img
                    src="/images/founder.jpg"
                    alt="Paramasivam Masanaicker, Founder - Sri Mahalakshmi Broilers"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="md:col-span-7 p-5 sm:p-8 lg:p-10 space-y-3.5 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#DDF3DF] text-[#287A45] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      {language === "ta" ? "எங்கள் உறுதிப்பாடு" : "Our Commitment"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EDF7EE] text-[#516357] text-[11px] sm:text-xs font-semibold">
                      20+ Years Experience • 20+ Shops
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#26352B]">
                      {language === "ta"
                        ? "நம்பிக்கை மற்றும் தரம் — எங்கள் 20+ வருட பயணம்"
                        : "Trust & Quality — Our 20+ Year Journey"}
                    </h2>
                    <p className="text-sm sm:text-base font-bold text-[#287A45] mt-1">
                      {language === "ta"
                        ? "பரமசிவம் மாசாநாயக்கர்"
                        : "Paramasivam Masanaicker"}
                      <span className="font-normal text-xs sm:text-sm text-[#516357] ml-2">
                        {language === "ta"
                          ? "(நிறுவனர், ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்)"
                          : "(Founder, Sri Mahalakshmi Broilers)"}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-[#516357] leading-relaxed border-l-3 border-[#287A45] pl-3.5 italic bg-[#F8FCF8] p-3 rounded-r-xl">
                    <p>
                      {language === "ta"
                        ? "\"கோழிப்பண்ணைத் துறையில் 20 ஆண்டுகளுக்கும் மேலான அனுபவத்துடனும், 20-க்கும் மேற்பட்ட கிளைகளின் விரிவான வலையமைப்புடனும் எங்கள் பயணம் எப்போதும் ஒரு வலுவான அடித்தளத்தின் மீதே கட்டமைக்கப்பட்டுள்ளது — நம்பிக்கை மற்றும் தரம்.\""
                        : "\"With over 20 years of experience in the poultry industry and a growing network of 20+ chicken shops, our journey has always been built on one foundation — Trust and Quality.\""}
                    </p>
                    <p>
                      {language === "ta"
                        ? "\"உங்கள் நம்பிக்கையே எங்கள் பலம், உங்களுக்கு இன்னும் சிறப்பாகச் சேவையாற்றுவதே எங்கள் உறுதிப்பாடு.\""
                        : "\"Your trust is our strength, and serving you better is our commitment.\""}
                    </p>
                    <p className="font-semibold text-[#26352B] not-italic">
                      {language === "ta"
                        ? "\"எங்கள் பயணத்தின் ஒரு பகுதியாக இருப்பதற்கு நன்றி.\""
                        : "\"Thank you for being part of our journey.\""}
                    </p>
                  </div>

                  <div className="pt-0.5">
                    <p className="text-sm sm:text-base font-bold text-[#26352B]">
                      {language === "ta" ? "— பரமசிவம் மாசாநாயக்கர்" : "— Paramasivam Masanaicker"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#287A45]">
                      {language === "ta" ? "நிறுவனர், ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்" : "Founder, Sri Mahalakshmi Broilers"}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2.5">
                    <Link
                      href="/products"
                      className="px-4 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                    >
                      {t("viewOurCutsBtn")}
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                    >
                      <WhatsAppIcon className="w-4 h-4 rounded" />
                      <span>{t("heroSecondaryCta")}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* 3 Editorial Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <FadeInSection delay={0.03}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] p-4 sm:p-6 shadow-xs h-full">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("qualityCommitmentHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {qualityCommitment}
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.06}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] p-4 sm:p-6 shadow-xs h-full">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("hygienePracticesHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {hygienePractices}
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.09}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] p-4 sm:p-6 shadow-xs h-full">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("customerSatisfactionHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {customerSatisfaction}
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
