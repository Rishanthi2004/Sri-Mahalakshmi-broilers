"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Check,
  Copy,
  HeartHandshake,
  MapPin,
  Phone,
  Quote,
  Share2,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { AnimatedCard, FadeInSection } from "@/components/common/MotionPrimitives";
import { PublicShell } from "@/components/public/PublicShell";
import { ShareFounderModal } from "@/components/founder/ShareFounderModal";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";

export default function FounderProfilePage() {
  const { content } = useWebsiteContent();
  const { about, contact } = content;
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("/founder");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}/founder`);
    }
  }, []);

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

  const handleCopyLink = async () => {
    try {
      let copySuccess = false;
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(currentUrl);
          copySuccess = true;
        } catch {
          copySuccess = false;
        }
      }

      if (!copySuccess) {
        const textarea = document.createElement("textarea");
        textarea.value = currentUrl;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        copySuccess = document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast(t("founderLinkCopied"), {
        description: currentUrl,
        type: "success",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("Unable to copy link.", { type: "danger" });
    }
  };

  const shareText =
    language === "ta"
      ? `*${founderName}* — ${founderDesignation}\nஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனர் திரு. ${founderName} அவர்களின் சுயவிவரம் மற்றும் 20+ வருட பயணம்:\n\n${currentUrl}`
      : `*${founderName}* — ${founderDesignation}\nMeet the Founder of Sri Mahalakshmi Broilers with 20+ years of trust in poultry.\n\n${currentUrl}`;

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <PublicShell>
      {/* Top Breadcrumb & Share Header */}
      <section className="bg-white border-b border-[#C7E4CA] py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[#516357]">
              <Link href="/" className="hover:text-[#287A45] transition-colors">
                {t("home")}
              </Link>
              <span>/</span>
              <Link href="/about" className="hover:text-[#287A45] transition-colors">
                {t("about")}
              </Link>
              <span>/</span>
              <span className="font-bold text-[#26352B]">{t("founderBreadcrumb")}</span>
            </div>

            {/* Back to About link */}
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#287A45] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("backToAbout")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Founder Profile Container */}
      <main className="py-6 sm:py-12 bg-[#DDF3DF]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

          {/* Primary Founder Profile Showcase Card */}
          <AnimatedCard hoverLift={false}>
            <div className="bg-white rounded-3xl border border-[#C7E4CA] overflow-hidden shadow-sm">
              
              {/* Profile Header Banner */}
              <div className="bg-gradient-to-r from-[#287A45] to-[#1E5F35] p-5 sm:p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-[11px] font-extrabold tracking-wider uppercase border border-white/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t("meetOurFounderBadge")}
                    </span>
                    <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                      {t("meetOurFounder")}
                    </h1>
                  </div>

                  {/* Share Founder Profile Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShareModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#287A45] hover:bg-[#EDF7EE] text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{t("shareFounderProfile")}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Grid: Photo & Biography */}
              <div className="p-5 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                  
                  {/* Photo Column */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#287A45]/30 shadow-md bg-[#EDF7EE] aspect-[4/5] mx-auto">
                      <img
                        src={founderPhoto}
                        alt={`${founderName} - ${founderDesignation}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-[#25D366]" />
                          {language === "ta" ? "சரிபார்க்கப்பட்ட நிறுவனர்" : "Verified Founder"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Metric Badges */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 rounded-xl bg-[#EDF7EE] border border-[#C7E4CA]">
                        <span className="block text-base sm:text-lg font-extrabold text-[#287A45]">
                          20+
                        </span>
                        <span className="text-[11px] font-semibold text-[#516357]">
                          {language === "ta" ? "ஆண்டுகள் அனுபவம்" : "Years Experience"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#EDF7EE] border border-[#C7E4CA]">
                        <span className="block text-base sm:text-lg font-extrabold text-[#287A45]">
                          20+
                        </span>
                        <span className="text-[11px] font-semibold text-[#516357]">
                          {language === "ta" ? "விற்பனை கிளைகள்" : "Outlets & Shops"}
                        </span>
                      </div>
                    </div>

                    {/* Quick 1-Click Sharing Bar for Mobile/Desktop */}
                    <div className="p-3.5 rounded-xl bg-[#F8FCF8] border border-[#C7E4CA] space-y-2">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#516357]">
                        {language === "ta" ? "சுயவிவரத்தை உடனே பகிருங்கள்" : "Share Profile"}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={waShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 rounded" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
                            copied
                              ? "bg-[#287A45] text-white border-[#287A45]"
                              : "bg-white hover:bg-[#EDF7EE] text-[#26352B] border-[#C7E4CA]"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{t("founderLinkCopied")}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{language === "ta" ? "இணைப்பு" : "Copy Link"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="md:col-span-7 space-y-5">
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full bg-[#DDF3DF] text-[#287A45] text-xs font-bold mb-2">
                        {founderExperience}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#26352B] tracking-tight">
                        {founderName}
                      </h2>
                      <p className="text-sm sm:text-base font-bold text-[#287A45] mt-1">
                        {founderDesignation}
                      </p>
                    </div>

                    {/* Vision Highlight Card */}
                    <div className="rounded-2xl border-l-4 border-[#287A45] bg-[#F8FCF8] p-4 sm:p-5 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-[#287A45]">
                        <Quote className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          {t("founderVisionTitle")}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#26352B] font-semibold italic leading-relaxed">
                        &ldquo;{founderVision}&rdquo;
                      </p>
                    </div>

                    {/* Biography & Story */}
                    <div className="space-y-3">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#26352B]">
                        {t("founderBioLabel")}
                      </span>
                      <div className="text-xs sm:text-sm text-[#516357] leading-relaxed space-y-3 whitespace-pre-line bg-[#EDF7EE]/50 p-4 rounded-2xl border border-[#C7E4CA]/50">
                        {founderBio}
                      </div>
                    </div>

                    {/* Office Address & Direct Contact Card */}
                    <div className="p-4 rounded-2xl bg-white border border-[#C7E4CA] space-y-3">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#26352B]">
                        {language === "ta" ? "அலுவலக தொடர்பு விவரங்கள்" : "Official Contact & Location"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#26352B]">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                          <div>
                            <span className="block text-[10px] font-bold text-[#516357] uppercase">
                              {t("founderOfficeAddress")}
                            </span>
                            <span className="font-semibold">
                              {language === "ta"
                                ? (content.contact.addressTa || content.contact.address || "ஈ.பி. காலனி பேருந்து நிறுத்தம், பரமத்தி சாலை, நாமக்கல்")
                                : (content.contact.address || "EB Colony Bus stop, Paramathi Road, Namakkal")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Phone className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                          <div>
                            <span className="block text-[10px] font-bold text-[#516357] uppercase">
                              {t("founderContactNo")}
                            </span>
                            <a
                              href={`tel:${(content.contact.phone || "+919487203778").replace(/\s+/g, "")}`}
                              className="font-bold hover:text-[#287A45] transition-colors"
                            >
                              {content.contact.phone || "+91 94872 03778"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShareModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{t("shareFounderProfile")}</span>
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 rounded" />
                        <span>{t("orderWhatsApp")}</span>
                      </a>

                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-[#287A45]" />
                        <span>{t("heroPrimaryCta")}</span>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Core Leadership Principles */}
          <FadeInSection>
            <div className="space-y-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#287A45]">
                  {language === "ta" ? "தலைமைக் கொள்கைகள்" : "Core Values"}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
                  {t("founderCorePrinciples")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl border border-[#C7E4CA] p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#DDF3DF] text-[#287A45] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#26352B]">
                    {t("founderPrinciple1Title")}
                  </h4>
                  <p className="text-xs text-[#516357] leading-relaxed">
                    {t("founderPrinciple1Desc")}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#C7E4CA] p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#DDF3DF] text-[#287A45] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#26352B]">
                    {t("founderPrinciple2Title")}
                  </h4>
                  <p className="text-xs text-[#516357] leading-relaxed">
                    {t("founderPrinciple2Desc")}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#C7E4CA] p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#DDF3DF] text-[#287A45] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#26352B]">
                    {t("founderPrinciple3Title")}
                  </h4>
                  <p className="text-xs text-[#516357] leading-relaxed">
                    {t("founderPrinciple3Desc")}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#C7E4CA] p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#DDF3DF] text-[#287A45] flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#26352B]">
                    {t("founderPrinciple4Title")}
                  </h4>
                  <p className="text-xs text-[#516357] leading-relaxed">
                    {t("founderPrinciple4Desc")}
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Bottom Navigation Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#C7E4CA] text-xs text-[#516357]">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-bold text-[#287A45] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("backToAbout")}</span>
            </Link>

            <span>
              © 2026 Sri Mahalakshmi Broilers • Paramathi Road, Namakkal
            </span>
          </div>

        </div>
      </main>

      {/* Share Founder Profile Modal */}
      <ShareFounderModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        founderName={founderName}
        founderDesignation={founderDesignation}
        founderPhoto={founderPhoto}
      />
    </PublicShell>
  );
}

