"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Send,
} from "lucide-react";
import { AnimatedCard } from "@/components/common/MotionPrimitives";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useToast } from "@/components/common/ToastProvider";
import { PublicShell } from "@/components/public/PublicShell";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { enquiryService } from "@/services/media-enquiry-service";
import { useWebsiteContent } from "@/services/use-store-data";

export default function ContactPage() {
  const { content } = useWebsiteContent();
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    customerName?: string;
    phoneNumber?: string;
    message?: string;
  }>({});
  const [submittedDemo, setSubmittedDemo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappMessage =
    language === "ta"
      ? `வணக்கம் ${content.shopName}, எனக்கு ஒரு தகவல் தேவைப்படுகிறது.`
      : `Hello ${content.shopName}, I would like to make an enquiry regarding your products.`;

  const whatsappUrl = contentService.buildWhatsAppUrl(
    content.contact.whatsappNumber,
    whatsappMessage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = t("contactNameRequired");
    }
    const digits = phoneNumber.replace(/[^0-9]/g, "");
    if (digits.length < 8 || digits.length > 15) {
      nextErrors.phoneNumber = t("contactPhoneRequired");
    }
    if (!message.trim() || message.trim().length < 6) {
      nextErrors.message = t("contactMessageRequired");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      try {
        await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: customerName.trim(),
            phoneNumber: phoneNumber.trim(),
            message: message.trim(),
          }),
        });
      } catch (err) {
        console.warn("API route submit warning, falling back to local storage", err);
      }

      enquiryService.submit({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        message: message.trim(),
      });

      setSubmittedDemo(true);
      setCustomerName("");
      setPhoneNumber("");
      setMessage("");
      showToast(t("contactEnquirySubmitted"), {
        description: t("contactStaffWillContact"),
        type: "success",
      });
    } catch {
      showToast(language === "ta" ? "செய்தி அனுப்புவதில் பிழை ஏற்பட்டது" : "Failed to submit enquiry", {
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicShell>
      {/* Header - Compact on Mobile */}
      <section className="bg-white border-b border-[#C7E4CA] py-5 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#287A45]">
            {t("contactBadge")}
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#26352B] mt-0.5">
            {language === "ta" ? `தொடர்பு: ${content.shopName}` : `Contact: ${content.shopName}`}
          </h1>
          <p className="text-xs sm:text-sm text-[#516357] mt-0.5 hidden sm:block max-w-xl">
            {t("contactQuickMsg")}
          </p>

          {/* Quick Action Buttons directly in header on mobile */}
          <div className="mt-3 flex sm:hidden grid-cols-3 gap-2">
            <a
              href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#287A45] text-white text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t("contactCallShort")}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold shadow-2xs"
            >
              <WhatsAppIcon className="w-4 h-4 rounded" />
              <span>{t("orderWhatsApp")}</span>
            </a>
            <a
              href={content.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#C7E4CA] text-[#26352B] text-xs font-semibold"
            >
              <Navigation className="w-3.5 h-3.5 text-[#287A45]" />
              <span>{t("contactDirections")}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Shop Contact Details & Map Placeholder */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <AnimatedCard hoverLift={false}>
                <div className="bg-white rounded-2xl border border-[#C7E4CA] p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-3.5 sm:space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#26352B]">
                    {content.shopName}
                  </h2>
                  <p className="text-xs text-[#516357]">
                    {t("contactTagline")}
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#516357]">
                        {t("contactPhoneLabel")}
                      </span>
                      <a
                        href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
                        className="font-semibold text-[#26352B] hover:text-[#287A45]"
                      >
                        {content.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EDF7EE] text-[#287A45] flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-4 h-4 rounded" />
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#516357]">
                        {t("contactWhatsAppLabel")}
                      </span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#26352B] hover:text-[#287A45]"
                      >
                        +{content.contact.whatsappNumber}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#516357]">
                        {t("contactAddressLabel")}
                      </span>
                      <p className="font-medium text-[#26352B] leading-snug">
                        {t("contactStoreAddress")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF3DF] text-[#287A45] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#516357] mb-0.5">
                        {t("openingHoursTitle")}
                      </span>
                      <div className="space-y-0.5 text-xs">
                        {content.contact.openingHours.map((item) => (
                          <div
                            key={item.day}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="font-medium text-[#26352B]">{item.day}</span>
                            <span className="text-[#516357]">
                              {item.isClosed ? t("contactClosed") : item.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden sm:grid grid-cols-3 gap-2 pt-2">
                  <a
                    href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t("contactCallNow")}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 rounded" />
                    <span>{t("orderWhatsApp")}</span>
                  </a>
                  <a
                    href={content.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#C7E4CA] hover:bg-[#EDF7EE] text-[#26352B] text-xs font-semibold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#287A45]" />
                    <span>{t("contactDirections")}</span>
                  </a>
                </div>
              </div>
            </AnimatedCard>

            {/* Google Maps Landmark Preview Card */}
            <AnimatedCard delay={0.05} hoverLift={false}>
              <div className="bg-white rounded-2xl border border-[#C7E4CA] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                <div className="bg-[#EDF7EE] p-4 flex flex-col items-center justify-center text-center border-b border-[#C7E4CA]">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#C7E4CA] text-[#287A45] flex items-center justify-center mb-2 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#26352B]">
                    {language === "ta" ? "கடை அமைவிடம் & வழித்தடம்" : "Store Location & Directions"}
                  </p>
                  <p className="text-[11px] text-[#516357] mt-0.5 max-w-xs leading-relaxed">
                    {content.contact.googleMapsEmbedPlaceholder}
                  </p>
                  <a
                    href={content.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>{language === "ta" ? "வரைபடத்தில் திறக்க" : "Open in Google Maps"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <AnimatedCard delay={0.06} hoverLift={false}>
              <div className="bg-white rounded-2xl border border-[#C7E4CA] p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
                <h2 className="text-lg sm:text-2xl font-bold text-[#26352B]">
                  {t("sendEnquiryTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-[#516357] mt-0.5">
                  {t("sendEnquirySubtitle")}
                </p>

                {submittedDemo && (
                  <div className="mt-4 p-3 rounded-xl bg-[#DDF3DF] border border-[#A9D3B0] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#287A45] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#26352B]">
                      <p className="font-bold">{t("enquirySuccessTitle")}</p>
                      <p className="text-[#516357] mt-0.5">
                        {t("enquirySuccessDesc")}
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-xs sm:text-sm font-semibold text-[#26352B] mb-1"
                    >
                      {t("fullNameLabel")} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName) {
                          setErrors((prev) => ({ ...prev, customerName: undefined }));
                        }
                      }}
                      placeholder={t("fullNamePlaceholder")}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-[#26352B] bg-[#EDF7EE]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#287A45] transition-all ${
                        errors.customerName ? "border-red-500" : "border-[#C7E4CA]"
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-xs sm:text-sm font-semibold text-[#26352B] mb-1"
                    >
                      {t("phoneLabel")} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) {
                          setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                        }
                      }}
                      placeholder={t("phonePlaceholder")}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-[#26352B] bg-[#EDF7EE]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#287A45] transition-all ${
                        errors.phoneNumber ? "border-red-500" : "border-[#C7E4CA]"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-semibold text-[#26352B] mb-1"
                    >
                      {t("messageLabel")} <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) {
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder={t("messagePlaceholder")}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-[#26352B] bg-[#EDF7EE]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#287A45] transition-all resize-y ${
                        errors.message ? "border-red-500" : "border-[#C7E4CA]"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-[#516357]">
                      {language === "ta"
                        ? "டெமோ முறை: நிர்வாக மையம் → விசாரணைகளில் பதிவு செய்யப்படும்."
                        : "Demo Mode: Automatically recorded in Admin Portal → Enquiries."}
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                      <span>{isSubmitting ? (language === "ta" ? "அனுப்பப்படுகிறது..." : "Sending...") : t("sendMessageBtn")}</span>
                    </button>
                  </div>
                </form>
              </div>
            </AnimatedCard>
          </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
