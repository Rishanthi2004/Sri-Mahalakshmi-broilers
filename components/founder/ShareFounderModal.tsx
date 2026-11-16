"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, Globe, Share2, Sparkles, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";

interface ShareFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderName?: string;
  founderDesignation?: string;
  founderPhoto?: string;
}

export function ShareFounderModal({
  isOpen,
  onClose,
  founderName = "Paramasivam Masanaicker",
  founderDesignation = "Founder, Sri Mahalakshmi Broilers",
  founderPhoto = "/images/founder.jpg",
}: ShareFounderModalProps) {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("/founder");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/founder`);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast(t("founderLinkCopied"), {
        description: shareUrl,
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Unable to copy link automatically.", { type: "danger" });
    }
  };

  const shareToWhatsApp = () => {
    const text =
      language === "ta"
        ? `*${founderName}* — ${founderDesignation}\nஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனரின் 20+ வருட பயணம் மற்றும் தொலைநோக்குப் பார்வை:\n👉 ${shareUrl}`
        : `*${founderName}* — ${founderDesignation}\nMeet the Founder of Sri Mahalakshmi Broilers with 20+ years of trust in poultry:\n👉 ${shareUrl}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${founderName} - ${founderDesignation}`,
          text:
            language === "ta"
              ? `ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனர் திரு. ${founderName} அவர்களின் சுயவிவரம்`
              : `Meet ${founderName}, Founder of Sri Mahalakshmi Broilers (20+ Years in Poultry)`,
          url: shareUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
      showToast(t("nativeShareFallbackNotice"), { type: "info" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-founder-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: "spring", duration: 0.26, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[#C7E4CA] shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDF7EE] bg-[#F8FCF8]">
              <div className="flex items-center gap-2 text-[#287A45]">
                <Share2 className="w-5 h-5 shrink-0" />
                <h3
                  id="share-founder-modal-title"
                  className="font-extrabold text-base sm:text-lg text-[#26352B]"
                >
                  {t("shareFounderModalTitle")}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#516357] hover:text-[#26352B] hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Founder Mini Card Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDF7EE] border border-[#C7E4CA]">
                <img
                  src={founderPhoto}
                  alt={founderName}
                  className="w-13 h-13 rounded-full object-cover object-center border-2 border-[#287A45] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-[#26352B] truncate">
                      {founderName}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#287A45] shrink-0" />
                  </div>
                  <p className="text-xs text-[#287A45] font-semibold truncate">
                    {founderDesignation}
                  </p>
                  <p className="text-[11px] text-[#516357] font-medium">
                    20+ Years • Sri Mahalakshmi Broilers
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#516357] leading-relaxed">
                {t("shareFounderModalDesc")}
              </p>

              {/* URL Display with inline Copy */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#516357]">
                  {language === "ta" ? "நேரடி சுயவிவர இணைப்பு (Direct Link)" : "Profile Link (URL)"}
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#C7E4CA] bg-[#F8FCF8]">
                  <div className="pl-2 text-[#287A45]">
                    <Globe className="w-4 h-4 shrink-0" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-transparent text-xs text-[#26352B] font-mono outline-hidden truncate selection:bg-[#287A45] selection:text-white"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      copied
                        ? "bg-[#287A45] text-white"
                        : "bg-white border border-[#C7E4CA] text-[#26352B] hover:bg-[#EDF7EE] hover:text-[#287A45]"
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
                        <span>{language === "ta" ? "நகலெடு" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Three Main Share Actions: WhatsApp, Copy Link, Native Share */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {/* 1. WhatsApp Share */}
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <WhatsAppIcon className="w-5 h-5 rounded" />
                    <span>{t("shareViaWhatsApp")}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>

                {/* 2. Copy Link Button */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border font-bold text-sm transition-all active:scale-[0.99] cursor-pointer ${
                    copied
                      ? "border-[#287A45] bg-[#EDF7EE] text-[#287A45]"
                      : "border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {copied ? (
                      <Check className="w-5 h-5 text-[#287A45]" />
                    ) : (
                      <Copy className="w-5 h-5 text-[#287A45]" />
                    )}
                    <span>{copied ? t("founderLinkCopied") : t("copyFounderLink")}</span>
                  </div>
                  <span className="text-xs text-[#516357]">
                    {language === "ta" ? "கிளிப்போர்டு" : "Clipboard"}
                  </span>
                </button>

                {/* 3. Device Native Share */}
                <button
                  type="button"
                  onClick={shareNative}
                  className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border border-[#C7E4CA] bg-[#F8FCF8] hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] font-bold text-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-5 h-5 text-[#287A45]" />
                    <span>{t("nativeShareBtn")}</span>
                  </div>
                  <span className="text-xs text-[#516357]">
                    {language === "ta" ? "மெசேஜ் / ஆப்" : "Apps / More"}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-[#F8FCF8] border-t border-[#EDF7EE] flex items-center justify-between text-xs text-[#516357]">
              <span>URL: /founder</span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg border border-[#C7E4CA] bg-white hover:bg-slate-50 font-semibold text-[#26352B] transition-colors cursor-pointer"
              >
                {language === "ta" ? "மூடுக" : "Close"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

