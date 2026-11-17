"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  ExternalLink,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { useLanguage } from "@/context/LanguageContext";
import { contentService } from "@/services/content-service";
import { useWebsiteContent } from "@/services/use-store-data";
import { WebsiteContent } from "@/types";

const DAY_NAMES_EN: Record<string, string> = {
  "திங்கள்": "Monday",
  "செவ்வாய்": "Tuesday",
  "புதன்": "Wednesday",
  "வியாழன்": "Thursday",
  "வெள்ளி": "Friday",
  "சனி": "Saturday",
  "ஞாயிறு": "Sunday",
};

const DAY_NAMES_TA: Record<string, string> = {
  "Monday": "திங்கள்",
  "Tuesday": "செவ்வாய்",
  "Wednesday": "புதன்",
  "Thursday": "வியாழன்",
  "Friday": "வெள்ளி",
  "Saturday": "சனி",
  "Sunday": "ஞாயிறு",
};

export default function AdminSettingsPage() {
  const { content, reload } = useWebsiteContent();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const [draft, setDraft] = useState<WebsiteContent>(content);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.shopName.trim()) {
      showToast(isTa ? "கடையின் பெயர் காலியாக இருக்க முடியாது" : "Shop name cannot be empty", { type: "danger" });
      return;
    }

    setSaving(true);
    try {
      contentService.update(draft);
      showToast(isTa ? "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன" : "Settings saved successfully", {
        description: isTa
          ? "தொடர்பு விவரங்கள், வேலை நேரம் மற்றும் வாட்ஸ்அப் ஆர்டர் எண் புதுப்பிக்கப்பட்டது."
          : "Contact details, opening hours, and WhatsApp ordering number updated.",
      });
      await reload();
    } catch {
      showToast(isTa ? "அமைப்புகளைச் சேமிப்பதில் பிழை ஏற்பட்டது" : "Failed to save settings", { type: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    contentService.reset();
    setDraft(DEFAULT_WEBSITE_CONTENT);
    setResetOpen(false);
    showToast(isTa ? "அமைப்புகள் இயல்பு நிலைக்கு மீட்டமைக்கப்பட்டன" : "Settings reset to defaults", { type: "info" });
    await reload();
  };

  const cleanWhatsapp = draft.contact.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappPreviewUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    isTa
      ? `வணக்கம் ${draft.shopName}, எனக்கு புதிய பண்ணைக் கோழிக்கறி ஆர்டர் செய்ய வேண்டும்!`
      : `Hello ${draft.shopName}, I would like to order fresh farm chicken!`
  )}`;

  return (
    <AdminShell
      title={isTa ? "கடை அமைப்புகள் & வாட்ஸ்அப் ஒருங்கிணைப்பு" : "Store Settings & WhatsApp Integration"}
      subtitle={
        isTa
          ? "கடையின் இருப்பிடம், வாட்ஸ்அப் நேரடி ஆர்டர் எண், வேலை நேரம் மற்றும் பாதுகாப்பு அமைப்புகளை நிர்வகிக்கவும்"
          : "Manage store location, direct WhatsApp ordering number, opening hours, and security settings"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{isTa ? "இயல்பு நிலைக்கு மீட்டமை" : "Reset to Defaults"}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? (isTa ? "சேமிக்கப்படுகிறது..." : "Saving...") : (isTa ? "அமைப்புகளைச் சேமி" : "Save Settings")}</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Shop Info & Branding */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900">
            {isTa ? "கடையின் அடையாளம் & பிராண்டிங்" : "Store Identity & Branding"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isTa ? "கடையின் பெயர் *" : "Shop Name *"}
              </label>
              <input
                type="text"
                required
                value={draft.shopName}
                onChange={(e) => setDraft({ ...draft, shopName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isTa ? "குறியீட்டு வாக்கியம் / முழக்கம்" : "Tagline / Slogan"}
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
              />
            </div>
          </div>

          <ImagePickerInput
            label={isTa ? "கடையின் லோகோ" : "Shop Logo"}
            value={draft.logoUrl}
            onChange={(url) => setDraft({ ...draft, logoUrl: url })}
            category="branding"
          />
        </section>

        {/* WhatsApp Click-to-Chat Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EDF7EE] text-[#287A45] flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4 rounded" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {isTa ? "வாட்ஸ்அப் நேரடி ஆர்டர் ஒருங்கிணைப்பு" : "WhatsApp Direct Ordering Integration"}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isTa
                  ? "இந்த எண் வாடிக்கையாளர் மிதக்கும் வாட்ஸ்அப் பொத்தான் மற்றும் நேரடி தயாரிப்பு ஆர்டர் கிளிக்குகளுக்குப் பயன்படுத்தப்படுகிறது."
                  : "This phone number is used for floating WhatsApp buttons and 1-click product orders."}
              </p>
            </div>

            {draft.contact.whatsappNumber && (
              <a
                href={whatsappPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C7E4CA] bg-[#EDF7EE] text-[#287A45] hover:bg-[#C7E4CA]/40 text-xs font-semibold shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isTa ? "நேரலை சோதிக்க" : "Test Live"}</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isTa ? "வாட்ஸ்அப் எண் (நாட்டுக் குறியீட்டுடன்) *" : "WhatsApp Number (with Country Code) *"}
              </label>
              <input
                type="text"
                required
                value={draft.contact.whatsappNumber}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, whatsappNumber: e.target.value },
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isTa ? "வடிவம்: +91 9876543210 அல்லது 9876543210" : "Format: +91 9876543210 or 9876543210"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isTa ? "வாடிக்கையாளர் நேரடி அழைப்பு எண் *" : "Direct Phone / Call Number *"}
              </label>
              <input
                type="text"
                required
                value={draft.contact.phone}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, phone: e.target.value },
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
              />
            </div>
          </div>
        </section>

        {/* Physical Address & Google Maps */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EDF7EE] text-[#287A45] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {isTa ? "நேரடி கடை முகவரி & கூகிள் மேப்ஸ்" : "Store Address & Google Maps"}
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isTa ? "கடையின் முழு முகவரி" : "Full Store Address"}
            </label>
            <textarea
              rows={2}
              value={draft.contact.address}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: { ...draft.contact, address: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isTa ? "கூகிள் மேப்ஸ் இணைப்பு / வழித்தட முகவரி" : "Google Maps Link / Directions URL"}
            </label>
            <input
              type="text"
              value={draft.contact.googleMapsUrl}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: { ...draft.contact, googleMapsUrl: e.target.value },
                })
              }
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
            />
          </div>
        </section>

        {/* Store Opening Hours */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EDF7EE] text-[#287A45] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {isTa ? "வாராந்திர வேலை நேரம்" : "Weekly Operating Hours"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {draft.contact.openingHours.map((hour, idx) => {
              const displayDay = isTa
                ? (DAY_NAMES_TA[hour.day] || hour.day)
                : (DAY_NAMES_EN[hour.day] || hour.day);

              return (
                <div
                  key={hour.day}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{displayDay}</span>
                    <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(hour.isClosed)}
                        onChange={(e) => {
                          const copy = [...draft.contact.openingHours];
                          copy[idx] = {
                            ...copy[idx],
                            isClosed: e.target.checked,
                            hours: e.target.checked
                              ? (isTa ? "விடுமுறை" : "Closed")
                              : (isTa ? "காலை 7:00 – இரவு 9:00" : "7:00 AM – 9:00 PM"),
                          };
                          setDraft({
                            ...draft,
                            contact: { ...draft.contact, openingHours: copy },
                          });
                        }}
                        className="rounded text-[#287A45] focus:ring-[#287A45] w-3.5 h-3.5"
                      />
                      <span>{isTa ? "விடுமுறை" : "Closed"}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={Boolean(hour.isClosed)}
                    value={hour.hours}
                    onChange={(e) => {
                      const copy = [...draft.contact.openingHours];
                      copy[idx] = { ...copy[idx], hours: e.target.value };
                      setDraft({
                        ...draft,
                        contact: { ...draft.contact, openingHours: copy },
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white disabled:bg-slate-100 text-xs text-slate-700 font-mono"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Security & Credentials Notice */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF7EE] border border-[#C7E4CA] text-[#287A45] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              {isTa ? "நிர்வாக உள்நுழைவு அங்கீகாரம் & கடவுச்சொல் பாதுகாப்பு" : "Admin Authentication & Password Security"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isTa ? (
                <>
                  நிர்வாகி கடவுச்சொற்கள் உள்ளூர் SQLite தரவுத்தளத்தில் சால்ட் செய்யப்பட்ட <code className="text-[#287A45] bg-[#EDF7EE] px-1 py-0.5 rounded">scryptSync</code> வழிமுறையில் மிக பாதுகாப்பாக மறைகுறியாக்கப்பட்டுள்ளன.
                  புதிய நிர்வாகிகளைச் சேர்க்க அல்லது கடவுச்சொற்களை மாற்ற,{" "}
                  <a href="/admin/users" className="text-[#287A45] font-semibold hover:underline">
                    நிர்வாகப் பயனர்கள்
                  </a>{" "}
                  பக்கத்திற்குச் செல்லவும்.
                </>
              ) : (
                <>
                  Admin passwords are securely encrypted using salted <code className="text-[#287A45] bg-[#EDF7EE] px-1 py-0.5 rounded">scryptSync</code> in the local database.
                  To add new administrators or manage credentials, visit the{" "}
                  <a href="/admin/users" className="text-[#287A45] font-semibold hover:underline">
                    Admin Users
                  </a>{" "}
                  page.
                </>
              )}
            </p>
          </div>
        </section>
      </form>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetOpen}
        title={isTa ? "கடை அமைப்புகளை இயல்பு நிலைக்கு மீட்டமைக்கவா?" : "Reset Store Settings to Defaults?"}
        description={
          isTa
            ? "இது இயல்புநிலை தொலைபேசி எண்கள், வேலை நேரம் மற்றும் முகவரிகளை மீட்டமைக்கும். சேமிக்கப்படாத மாற்றங்கள் இழக்கப்படும்."
            : "This will reset all store phone numbers, operating hours, and addresses to default values. Any unsaved changes will be lost."
        }
        confirmLabel={isTa ? "இயல்புநிலைக்கு மீட்டமை" : "Reset to Defaults"}
        cancelLabel={isTa ? "ரத்து செய்" : "Cancel"}
        variant="primary"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </AdminShell>
  );
}
