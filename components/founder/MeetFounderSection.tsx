"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  ExternalLink,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { AnimatedCard, FadeInSection } from "@/components/common/MotionPrimitives";
import { ShareFounderButton } from "@/components/founder/ShareFounderButton";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";

export function MeetFounderSection() {
  const { content } = useWebsiteContent();
  const { about, contact } = content;
  const { language, t } = useLanguage();

  const isDefaultFounderName =
    !about.ownerName ||
    about.ownerName.trim() === "Paramasivam Masanaicker" ||
    about.ownerName.trim() === "பரமசிவம் மாசநாயக்கர்";

  const founderName =
    language === "ta"
      ? about.ownerNameTa || (isDefaultFounderName ? "பரமசிவம் மாசநாயக்கர்" : about.ownerName)
      : about.ownerName || "Paramasivam Masanaicker";

  const isDefaultDesignation =
    !about.ownerDesignation ||
    about.ownerDesignation.trim() === "Founder, Sri Mahalakshmi Broilers" ||
    about.ownerDesignation.trim() === "நிறுவனர், ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்";

  const founderDesignation =
    language === "ta"
      ? about.ownerDesignationTa ||
        (isDefaultDesignation ? "நிறுவனர், ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்" : about.ownerDesignation)
      : about.ownerDesignation || "Founder, Sri Mahalakshmi Broilers";

  const founderPhoto =
    about.ownerPhoto && about.ownerPhoto.trim() !== ""
      ? about.ownerPhoto
      : "/images/founder.jpg";

  const isDefaultExperience =
    !about.founderExperience ||
    about.founderExperience.includes("20+ Years") ||
    about.founderExperience.includes("20+ Retail") ||
    about.founderExperience.includes("20+ வருட");

  const founderExperience =
    language === "ta"
      ? about.founderExperienceTa ||
        (isDefaultExperience
          ? "கோழிப்பண்ணைத் துறையில் 20+ வருட அனுபவம் • 20+ சில்லறை கிளைகள்"
          : about.founderExperience)
      : about.founderExperience || "20+ Years in Poultry & Farming • 20+ Retail Outlets";

  const isEnglishVision =
    !about.founderVision ||
    about.founderVision.includes("hospital-grade cleanliness") ||
    /^[A-Za-z0-9\s.,!?:;'"()\–\-–%°C–]+$/.test(about.founderVision.trim());

  const founderVision =
    language === "ta"
      ? about.founderVisionTa || (isEnglishVision ? t("founderVisionDefault") : about.founderVision)
      : about.founderVision || t("founderVisionDefault");

  const isEnglishBio =
    !about.ownerBio ||
    about.ownerBio.includes("With over 20 years of experience") ||
    /^[A-Za-z0-9\s.,!?:;'"()\–\-–%°C–\n\r]+$/.test(about.ownerBio.trim());

  const founderBio =
    language === "ta"
      ? about.ownerBioTa || (isEnglishBio ? t("founderBioDefault") : about.ownerBio)
      : about.ownerBio || t("founderBioDefault");

  const whatsappMessage =
    language === "ta"
      ? `வணக்கம் ${founderName} அய்யா, ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் கோழிக்கறி விநியோகம் குறித்து பேச விரும்புகிறேன்.`
      : `Hello ${founderName}, I would like to inquire about Sri Mahalakshmi Broilers poultry supply.`;

  const whatsappUrl = contentService.buildWhatsAppUrl(
    contact.whatsappNumber,
    whatsappMessage
  );

  return (
    <section
      id="meet-our-founder"
      className="py-10 sm:py-16 bg-white border-b border-[#C7E4CA]"
      aria-labelledby="meet-our-founder-heading"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <FadeInSection className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDF3DF] text-[#287A45] text-xs font-extrabold uppercase tracking-widest border border-[#C7E4CA]">
            <Sparkles className="w-3.5 h-3.5" />
            {t("meetOurFounderBadge")}
          </span>
          <h2
            id="meet-our-founder-heading"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#26352B]"
          >
            {t("meetOurFounder")}
          </h2>
          <p className="text-xs sm:text-base text-[#516357] leading-relaxed">
            {t("meetOurFounderSubtitle")}
          </p>
        </FadeInSection>

        {/* Founder Profile Card */}
        <AnimatedCard hoverLift={false}>
          <div className="bg-[#F8FCF8] rounded-3xl border border-[#C7E4CA] p-4 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              
              {/* Left Column: Photo & Experience Highlights */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#287A45]/30 shadow-md bg-white aspect-[4/5] max-w-md mx-auto group">
                  <img
                    src={founderPhoto}
                    alt={`${founderName} - ${founderDesignation}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Photo Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#287A45] text-[11px] font-bold shadow-xs">
                        <UserCheck className="w-3 h-3" />
                        {language === "ta" ? "சரிபார்க்கப்பட்ட சுயவிவரம்" : "Verified Founder"}
                      </span>
                    </div>
                    <span className="block text-base sm:text-lg font-extrabold drop-shadow-md">
                      {founderName}
                    </span>
                    <span className="block text-xs text-white/90 font-medium drop-shadow-xs">
                      {founderDesignation}
                    </span>
                  </div>
                </div>

                {/* Quick Credentials Strip */}
                <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
                  <div className="p-3 rounded-xl bg-white border border-[#C7E4CA] flex items-center gap-2.5 shadow-2xs">
                    <Award className="w-5 h-5 text-[#287A45] shrink-0" />
                    <div>
                      <span className="block text-xs sm:text-sm font-extrabold text-[#26352B]">
                        {language === "ta" ? "20+ ஆண்டுகள்" : "20+ Years"}
                      </span>
                      <span className="block text-[10px] text-[#516357]">
                        {language === "ta" ? "பண்ணை அனுபவம்" : "Poultry Experience"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#C7E4CA] flex items-center gap-2.5 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#287A45] shrink-0" />
                    <div>
                      <span className="block text-xs sm:text-sm font-extrabold text-[#26352B]">
                        {language === "ta" ? "20+ கிளைகள்" : "20+ Shops"}
                      </span>
                      <span className="block text-[10px] text-[#516357]">
                        {language === "ta" ? "சில்லறை கிளைகள்" : "Retail Outlets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Name, Designation, Experience, Vision, Bio & Action Buttons */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-[#DDF3DF] text-[#287A45] text-xs font-bold">
                      {founderExperience}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#26352B] tracking-tight">
                    {founderName}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#287A45] mt-1">
                    {founderDesignation}
                  </p>
                </div>

                {/* Founder's Vision Box */}
                <div className="rounded-2xl border-l-4 border-[#287A45] bg-white p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-[#287A45]">
                    <Quote className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      {t("founderVisionTitle")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#26352B] font-medium italic leading-relaxed">
                    &ldquo;{founderVision}&rdquo;
                  </p>
                </div>

                {/* Biography & Story */}
                <div className="space-y-2.5 text-xs sm:text-sm text-[#516357] leading-relaxed">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#26352B]">
                    {language === "ta" ? "நிறுவனரின் பின்னணி & பயணம்" : "Background & Journey"}
                  </span>
                  <p className="whitespace-pre-line bg-white/70 p-3 sm:p-4 rounded-xl border border-[#EDF7EE]">
                    {founderBio}
                  </p>
                </div>

                {/* Address & Contact Snippet */}
                <div className="pt-2 border-t border-[#C7E4CA]/70 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-[#26352B]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                    <span>
                      {language === "ta"
                        ? "ஈ.பி. காலனி பேருந்து நிறுத்தம், பரமத்தி சாலை, நாமக்கல்"
                        : "EB Colony Bus stop, Paramathi Road, Namakkal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#287A45] shrink-0" />
                    <a href="tel:+919487203778" className="font-bold hover:text-[#287A45] transition-colors">
                      +91 94872 03778
                    </a>
                  </div>
                </div>

                {/* Action Buttons: Share Founder Profile + View Separate /founder Page + WhatsApp */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {/* Share Founder Profile Button with WhatsApp, Copy Link, Native Share options */}
                  <ShareFounderButton
                    founderName={founderName}
                    founderDesignation={founderDesignation}
                    founderPhoto={founderPhoto}
                    variant="primary"
                  />

                  {/* Dedicated /founder Page Button */}
                  <Link
                    href="/founder"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{t("viewFullFounderProfile")}</span>
                    <ExternalLink className="w-4 h-4 shrink-0 text-[#287A45]" />
                  </Link>

                  {/* Quick WhatsApp Connect */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 rounded" />
                    <span>{t("orderWhatsApp")}</span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}

