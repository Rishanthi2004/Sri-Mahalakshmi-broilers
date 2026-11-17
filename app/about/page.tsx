"use client";

import React from "react";
import {
  Award,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { AnimatedCard, FadeInSection } from "@/components/common/MotionPrimitives";
import { PublicShell } from "@/components/public/PublicShell";
import { MeetFounderSection } from "@/components/founder/MeetFounderSection";
import { useLanguage } from "@/context/LanguageContext";
import { useWebsiteContent } from "@/services/use-store-data";

export default function AboutPage() {
  const { content } = useWebsiteContent();
  const { about } = content;
  const { language, t } = useLanguage();

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
                    {language === "ta"
                      ? "20+ ஆண்டுகள்"
                      : about.businessExperienceYears || "20+ Years"}
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

      {/* Meet Our Founder - Dedicated Professional Showcase */}
      <MeetFounderSection />

      {/* Business Information & Owner Profile */}
      <section className="py-8 sm:py-14 bg-[#DDF3DF]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {/* Business Info */}
          <AnimatedCard hoverLift={false}>
            <div className="bg-white rounded-2xl border border-[#C7E4CA] p-5 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
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
                        {language === "ta"
                          ? (content.contact.addressTa || content.contact.address || "ஈ.பி. காலனி பேருந்து நிறுத்தம், பரமத்தி சாலை, நாமக்கல்")
                          : (content.contact.address || "EB Colony Bus stop, Paramathi Road, Namakkal")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#26352B]">
                    <Phone className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#516357]">
                        {language === "ta" ? "தொடர்பு எண்" : "Contact No"}
                      </span>
                      <a
                        href={`tel:${(content.contact.phone || "+919487203778").replace(/\s+/g, "")}`}
                        className="font-semibold hover:text-[#287A45] transition-colors"
                      >
                        {content.contact.phone || "+91 94872 03778"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* 3 Editorial Pillars with animated interactive hover */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <AnimatedCard delay={0.03}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] hover:border-[#287A45]/50 p-4 sm:p-6 shadow-xs hover:shadow-md transition-all h-full cursor-pointer select-none">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("qualityCommitmentHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {qualityCommitment}
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.06}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] hover:border-[#287A45]/50 p-4 sm:p-6 shadow-xs hover:shadow-md transition-all h-full cursor-pointer select-none">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("hygienePracticesHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {hygienePractices}
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.09}>
              <div className="bg-white rounded-xl border border-[#C7E4CA] hover:border-[#287A45]/50 p-4 sm:p-6 shadow-xs hover:shadow-md transition-all h-full cursor-pointer select-none">
                <div className="w-9 h-9 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center mb-2.5">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#26352B]">{t("customerSatisfactionHeading")}</h3>
                <p className="text-xs sm:text-sm text-[#516357] mt-1 leading-relaxed">
                  {customerSatisfaction}
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
