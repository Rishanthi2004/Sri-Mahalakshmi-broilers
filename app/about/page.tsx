"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  HeartHandshake,
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
  const ownerBio = t("aboutOwnerBio");
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
              <div className="rounded-2xl overflow-hidden border border-[#C7E4CA] shadow-xs bg-[#EDF7EE] aspect-[16/9] sm:aspect-[4/3]">
                <img
                  src={about.shopImage}
                  alt={`${content.shopName} சுகாதாரமான விற்பனை அரங்கு`}
                  className="w-full h-full object-cover"
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
              <div className="max-w-3xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#287A45]">
                  {t("businessInfoTag")}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#26352B]">
                  {businessInfoTitle}
                </h2>
                <p className="text-xs sm:text-base text-[#516357] leading-relaxed">
                  {businessInfoBody}
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Owner Spotlight */}
          <FadeInSection>
            <div className="bg-white rounded-2xl border border-[#C7E4CA] overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <div className="md:col-span-5 h-48 sm:h-72 md:h-full bg-[#EDF7EE]">
                  <img
                    src={about.ownerPhoto}
                    alt={about.ownerName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="md:col-span-7 p-5 sm:p-8 space-y-2.5 sm:space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#DDF3DF] text-[#287A45] text-[11px] font-semibold">
                    {t("meetOwnerTag")}
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#26352B]">
                      {about.ownerName}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#287A45] mt-0.5">
                      {language === "ta"
                        ? `${about.ownerDesignation} • ${about.businessExperienceYears} அனுபவம்`
                        : `${t("ownerDesignation")} • ${about.businessExperienceYears} Experience`}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-[#516357] leading-relaxed">
                    {ownerBio}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2.5">
                    <Link
                      href="/products"
                      className="px-4 py-2 rounded-lg bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-semibold transition-colors"
                    >
                      {t("viewOurCutsBtn")}
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-colors"
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
