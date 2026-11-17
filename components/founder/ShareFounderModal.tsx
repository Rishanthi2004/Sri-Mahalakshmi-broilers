"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  ExternalLink,
  Facebook,
  Globe,
  Mail,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
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
  const [shareUrl, setShareUrl] = useState("https://sri-mahalakshmi-broilers.netlify.app/founder");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentOrigin =
        window.location.origin && window.location.origin !== "null"
          ? window.location.origin
          : "https://sri-mahalakshmi-broilers.netlify.app";
      setShareUrl(`${currentOrigin}/founder`);
      setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
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
      let copySuccess = false;
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          copySuccess = true;
        } catch {
          copySuccess = false;
        }
      }

      if (!copySuccess) {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
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
        description: shareUrl,
        type: "success",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("Unable to copy link automatically.", { type: "danger" });
    }
  };

  const shareText =
    language === "ta"
      ? `*${founderName}* — ${founderDesignation}\nஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனரின் 20+ வருட பயணம் மற்றும் தொலைநோக்குப் பார்வை:\n\n${shareUrl}`
      : `*${founderName}* — ${founderDesignation}\nMeet the Founder of Sri Mahalakshmi Broilers with 20+ years of trust in poultry.\n\n${shareUrl}`;

  const shareTitle = `${founderName} - ${founderDesignation}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text:
            language === "ta"
              ? `ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனர் திரு. ${founderName} அவர்களின் சுயவிவரம்`
              : `Meet ${founderName}, Founder of Sri Mahalakshmi Broilers`,
          url: shareUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    `${founderName} — ${founderDesignation}`
  )}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(
    shareTitle
  )}&body=${encodeURIComponent(shareText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-founder-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", duration: 0.25, bounce: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl border border-[#C7E4CA] shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
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
                className="p-1.5 rounded-xl text-[#516357] hover:text-[#26352B] hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Founder Mini Card */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#EDF7EE] border border-[#C7E4CA]">
                <img
                  src={founderPhoto}
                  alt={founderName}
                  className="w-14 h-14 rounded-full object-cover object-top border-2 border-[#287A45] shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-[#26352B] truncate">
                      {founderName}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#287A45] shrink-0" />
                  </div>
                  <p className="text-xs text-[#287A45] font-bold truncate">
                    {founderDesignation}
                  </p>
                  <p className="text-[11px] text-[#516357] font-medium">
                    {language === "ta"
                      ? "கோழிப்பண்ணைத் துறையில் 20+ வருட அனுபவம் • 20+ கிளைகள்"
                      : "20+ Years in Poultry & Farming • 20+ Shops"}
                  </p>
                </div>
              </div>

              {/* 1. Main WhatsApp Direct Share Banner (Direct Link - Never Blocked) */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <WhatsAppIcon className="w-6 h-6 rounded" />
                  <span>{t("shareViaWhatsApp")}</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* 2. Direct Social Share Options */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#516357]">
                  {language === "ta" ? "நேரடி சமூக பகிர்வு" : "Share Directly To"}
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Telegram */}
                  <a
                    href={tgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Send className="w-5 h-5 text-[#2AABEE]" />
                    <span className="text-xs font-bold">Telegram</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                    <span className="text-xs font-bold">Facebook</span>
                  </a>

                  {/* Email */}
                  <a
                    href={mailUrl}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-[#C7E4CA] bg-white hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Mail className="w-5 h-5 text-[#EA4335]" />
                    <span className="text-xs font-bold">Email</span>
                  </a>
                </div>
              </div>

              {/* 3. Native Mobile / Device Share Sheet (Visible on supported devices) */}
              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-[#C7E4CA] bg-[#F8FCF8] hover:bg-[#EDF7EE] text-[#26352B] hover:text-[#287A45] text-xs sm:text-sm font-bold transition-all active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#287A45]" />
                    <span>{t("deviceShareSheet")}</span>
                  </div>
                  <span className="text-xs text-[#516357]">
                    {language === "ta" ? "அனைத்து ஆப்ஸ்கள்" : "All Apps"}
                  </span>
                </button>
              )}

              {/* 4. Foolproof Copy Direct Link Section */}
              <div className="space-y-2 pt-1 border-t border-[#EDF7EE]">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#516357]">
                  <span>{language === "ta" ? "சுயவிவர இணைப்பு (Direct URL)" : "Profile Link (URL)"}</span>
                  {copied && (
                    <span className="text-[#287A45] flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      {t("founderLinkCopied")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 p-2 rounded-2xl border-2 border-[#C7E4CA] bg-[#F8FCF8] focus-within:border-[#287A45] transition-colors">
                  <div className="pl-1 text-[#287A45]">
                    <Globe className="w-4 h-4 shrink-0" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-full bg-transparent text-xs text-[#26352B] font-mono outline-hidden selection:bg-[#287A45] selection:text-white"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
                      copied
                        ? "bg-[#287A45] text-white font-bold"
                        : "bg-[#287A45] hover:bg-[#1E5F35] text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t("founderLinkCopied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{language === "ta" ? "இணைப்பை நகலெடு" : "Copy Link"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-[#F8FCF8] border-t border-[#EDF7EE] flex items-center justify-between text-xs text-[#516357]">
              <Link
                href="/founder"
                target="_blank"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[#287A45] font-bold hover:underline"
              >
                <span>{t("testOpenProfile")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl border border-[#C7E4CA] bg-white hover:bg-slate-50 font-bold text-[#26352B] transition-colors cursor-pointer"
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
