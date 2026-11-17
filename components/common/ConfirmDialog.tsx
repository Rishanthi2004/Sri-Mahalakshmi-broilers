"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { language } = useLanguage();
  const resolvedConfirm = confirmLabel || (language === "ta" ? "நீக்குவதை உறுதிசெய்" : "Confirm");
  const resolvedCancel = cancelLabel || (language === "ta" ? "ரத்து செய்" : "Cancel");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-[#26352B]/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md bg-white rounded-xl border border-[#C7E4CA] shadow-xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    variant === "danger"
                      ? "bg-red-50 text-red-600"
                      : "bg-[#DDF3DF] text-[#287A45]"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#26352B]">{title}</h3>
                  <p className="text-sm text-[#516357] mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="p-1 rounded-md text-[#516357] hover:bg-[#EDF7EE] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[#C7E4CA] text-[#26352B] hover:bg-[#EDF7EE] transition-colors"
              >
                {resolvedCancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#287A45] hover:bg-[#1E5F35]"
                }`}
              >
                {resolvedConfirm}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

