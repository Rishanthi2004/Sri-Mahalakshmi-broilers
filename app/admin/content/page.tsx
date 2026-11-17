"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RotateCcw, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { contentService } from "@/services/content-service";
import { useProducts, useWebsiteContent } from "@/services/use-store-data";
import { WebsiteContent } from "@/types";

type ContentTab =
  | "hero"
  | "featured"
  | "why"
  | "about"
  | "contact"
  | "branding";

function WebsiteContentInner() {
  const searchParams = useSearchParams();
  const { content, reload } = useWebsiteContent();
  const { products } = useProducts();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const tabs: { id: ContentTab; label: string }[] = [
    { id: "hero", label: isTa ? "முகப்பு பேனர் & தலைப்பு" : "Hero Banner & Headline" },
    { id: "featured", label: isTa ? "சிறப்புப் பொருட்கள்" : "Featured Products" },
    { id: "why", label: isTa ? "எங்கள் சிறப்புகள் & அழைப்பு" : "Why Choose Us & CTA" },
    { id: "about", label: isTa ? "எங்களைப் பற்றி & உரிமையாளர்" : "About Us & Founder" },
    { id: "contact", label: isTa ? "தொடர்பு, நேரம் & சமூகம்" : "Contact, Hours & Social" },
    { id: "branding", label: isTa ? "லோகோ & அடிக்குறிப்பு (Footer)" : "Branding & Footer" },
  ];

  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  const [draft, setDraft] = useState<WebsiteContent>(content);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    const paramTab = searchParams.get("tab") as ContentTab | null;
    if (paramTab && ["hero", "featured", "why", "about", "contact", "branding"].includes(paramTab)) {
      setActiveTab(paramTab);
    }
  }, [searchParams]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      contentService.update(draft);
      showToast(isTa ? "வலைத்தள உள்ளடக்கம் சேமிக்கப்பட்டது" : "Website content saved successfully", {
        description: isTa
          ? "வாடிக்கையாளர் தளத்தில் மாற்றங்கள் உடனடியாகத் தோன்றும்."
          : "Changes are now live on the public storefront.",
      });
      await reload();
    } catch {
      showToast(isTa ? "பிழை ஏற்பட்டது" : "Failed to save content", { type: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    contentService.reset();
    setDraft(DEFAULT_WEBSITE_CONTENT);
    setResetOpen(false);
    showToast(isTa ? "முன்னிருப்பு உள்ளடக்கத்திற்கு மீட்டமைக்கப்பட்டது" : "Reset to default website content", { type: "info" });
    await reload();
  };

  const toggleFeaturedProduct = (id: string) => {
    setDraft((prev) => {
      const exists = prev.featuredProductIds.includes(id);
      return {
        ...prev,
        featuredProductIds: exists
          ? prev.featuredProductIds.filter((fid) => fid !== id)
          : [...prev.featuredProductIds, id],
      };
    });
  };

  return (
    <AdminShell
      title={isTa ? "வலைத்தள உள்ளடக்கம் மேலாண்மை" : "Website Content Management"}
      subtitle={
        isTa
          ? "முகப்பு உரை, சிறப்பு கறிக்கட்டுகள், எங்களைப் பற்றி, உரிமையாளர் சுயவிவரம் மற்றும் பிராண்டிங் ஆகியவற்றைத் திருத்துதல்"
          : "Customize homepage copy, featured chicken cuts, about us, founder profile, and branding"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{isTa ? "முன்னிருப்புக்கு மாற்று" : "Reset to Defaults"}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>
              {saving
                ? isTa
                  ? "சேமிக்கப்படுகிறது..."
                  : "Saving..."
                : isTa
                ? "மாற்றங்களைச் சேமி"
                : "Save Changes"}
            </span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#287A45] text-white shadow-sm"
                  : "text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          {activeTab === "hero" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">
                {isTa ? "முகப்பு பேனர் & முதன்மைத் தலைப்பு" : "Hero Banner & Main Headline"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "மேல் பேட்ஜ் உரை" : "Top Badge Text"}
                  </label>
                  <input
                    type="text"
                    value={draft.hero.badge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        hero: { ...draft.hero, badge: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "முதன்மை பொத்தான் பெயர்" : "Primary Button Text"}
                  </label>
                  <input
                    type="text"
                    value={draft.hero.primaryCtaText}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        hero: { ...draft.hero, primaryCtaText: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "முதன்மைத் தலைப்பு" : "Main Headline"}
                </label>
                <input
                  type="text"
                  value={draft.hero.headline}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...draft.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "விளக்க உரை" : "Subheadline / Description"}
                </label>
                <textarea
                  rows={3}
                  value={draft.hero.subheadline}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...draft.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "வாட்ஸ்அப் பொத்தான் பெயர்" : "WhatsApp Button Text"}
                </label>
                <input
                  type="text"
                  value={draft.hero.secondaryCtaText}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...draft.hero, secondaryCtaText: e.target.value },
                    })
                  }
                  className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <ImagePickerInput
                label={isTa ? "முகப்பு பேனர் புகைப்படம்" : "Hero Banner Image"}
                value={draft.hero.bannerImage}
                onChange={(url) =>
                  setDraft({
                    ...draft,
                    hero: { ...draft.hero, bannerImage: url },
                  })
                }
                helperText={
                  isTa
                    ? "அகலமான லேண்ட்ஸ்கேப் புகைப்படம் பரிந்துரைக்கப்படுகிறது (16:9 அல்லது 21:9)."
                    : "Wide landscape photo recommended (16:9 or 21:9)."
                }
                category="banners"
              />
            </div>
          )}

          {activeTab === "featured" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isTa ? "முகப்பில் காட்டப்படும் சிறப்புப் பொருட்கள்" : "Featured Products on Homepage"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTa
                    ? "முகப்பின் மிதக்கும் காட்சிப் பகுதியில் காட்டப்பட வேண்டிய பொருட்களைத் தேர்ந்தெடுக்கவும்."
                    : "Select products to feature on the homepage cuts showcase."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products
                  .filter((p) => p.isActive)
                  .map((product) => {
                    const selected = draft.featuredProductIds.includes(product.id);
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => toggleFeaturedProduct(product.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          selected
                            ? "border-[#287A45] bg-[#EDF7EE] shadow-xs"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            ₹{product.price} / {product.unit}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            selected
                              ? "bg-[#287A45] text-white"
                              : "border border-slate-300 text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {activeTab === "why" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isTa ? "எங்கள் சிறப்புகள் (4 தூண்கள்)" : "Why Choose Us (4 Core Pillars)"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTa
                    ? "வாடிக்கையாளர் முகப்புப் பக்கத்தில் தர உறுதிப்பாட்டு கட்டத்தில் தோன்றும்."
                    : "Displayed in the trust and commitment section of the homepage."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.whyChooseUs.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#287A45]">
                        {isTa ? `சிறப்பம்சம் #${idx + 1}` : `Core Pillar #${idx + 1}`}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {isTa ? "தலைப்பு" : "Headline"}
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...draft.whyChooseUs];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setDraft({ ...draft, whyChooseUs: copy });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {isTa ? "விளக்கம்" : "Description"}
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...draft.whyChooseUs];
                          copy[idx] = { ...copy[idx], description: e.target.value };
                          setDraft({ ...draft, whyChooseUs: copy });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTa ? "நடவடிக்கை அழைப்புப் பட்டி (Call to Action)" : "Call to Action (CTA) Strip"}
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "தலைப்பு" : "Headline"}
                  </label>
                  <input
                    type="text"
                    value={draft.ctaBanner.headline}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        ctaBanner: { ...draft.ctaBanner, headline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "விளக்கம்" : "Description"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.ctaBanner.description}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        ctaBanner: { ...draft.ctaBanner, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "பொத்தான் பெயர்" : "Button Text"}
                  </label>
                  <input
                    type="text"
                    value={draft.ctaBanner.buttonText}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        ctaBanner: { ...draft.ctaBanner, buttonText: e.target.value },
                      })
                    }
                    className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">
                {isTa ? "எங்களைப் பற்றி & உரிமையாளர் சுயவிவரம்" : "About Us & Founder Profile"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "அறிமுக பேட்ஜ்" : "Intro Badge"}
                  </label>
                  <input
                    type="text"
                    value={draft.about.introBadge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, introBadge: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "அனுபவ ஆண்டுகள்" : "Experience Years"}
                  </label>
                  <input
                    type="text"
                    value={draft.about.businessExperienceYears}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, businessExperienceYears: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "அறிமுகத் தலைப்பு" : "Intro Headline"}
                </label>
                <input
                  type="text"
                  value={draft.about.introTitle}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      about: { ...draft.about, introTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "அறிமுக விளக்கம்" : "Intro Description"}
                </label>
                <textarea
                  rows={3}
                  value={draft.about.introDescription}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      about: { ...draft.about, introDescription: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <ImagePickerInput
                label={isTa ? "கடை முகப்புப் புகைப்படம்" : "Storefront / Shop Photo"}
                value={draft.about.shopImage}
                onChange={(url) =>
                  setDraft({ ...draft, about: { ...draft.about, shopImage: url } })
                }
                category="about"
              />

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTa ? "உரிமையாளர் சுயவிவரத் தகவல்கள்" : "Founder Profile Details"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {isTa ? "உரிமையாளர் பெயர்" : "Founder / Owner Name"}
                    </label>
                    <input
                      type="text"
                      value={draft.about.ownerName}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          about: { ...draft.about, ownerName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {isTa ? "பதவி / பொறுப்பு" : "Designation / Role"}
                    </label>
                    <input
                      type="text"
                      value={draft.about.ownerDesignation}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          about: { ...draft.about, ownerDesignation: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "உரிமையாளர் வாழ்க்கைச் சுருக்கம்" : "Founder Biography"}
                  </label>
                  <textarea
                    rows={3}
                    value={draft.about.ownerBio}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, ownerBio: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <ImagePickerInput
                  label={isTa ? "உரிமையாளர் உருவப்படம்" : "Founder Portrait Photo"}
                  value={draft.about.ownerPhoto}
                  onChange={(url) =>
                    setDraft({ ...draft, about: { ...draft.about, ownerPhoto: url } })
                  }
                  category="about"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa
                      ? "நிறுவனர் அனுபவம் & கிளைகள் (Founder Experience)"
                      : "Founder Experience & Achievements"}
                  </label>
                  <input
                    type="text"
                    value={draft.about.founderExperience || ""}
                    placeholder="20+ Years in Poultry & Farming • 20+ Retail Outlets"
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, founderExperience: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa
                      ? "நிறுவனரின் தொலைநோக்கு பார்வை (Founder Vision)"
                      : "Founder Vision Statement"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.about.founderVision || ""}
                    placeholder="Providing hospital-grade cleanliness, 100% daily farm freshness..."
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, founderVision: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTa ? "தரம், சுகாதாரம் மற்றும் வாடிக்கையாளர் திருப்தி" : "Quality, Hygiene & Customer Commitments"}
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "தர உறுதிப்பாடு" : "Quality Commitment"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.about.qualityCommitment}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, qualityCommitment: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "சுகாதார நடைமுறைகள்" : "Hygiene Practices"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.about.hygienePractices}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, hygienePractices: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "வாடிக்கையாளர் திருப்தி" : "Customer Satisfaction"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.about.customerSatisfaction}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        about: { ...draft.about, customerSatisfaction: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">
                {isTa
                  ? "தொடர்பு விவரங்கள், வேலை நேரம் & சமூக வலைத்தளங்கள்"
                  : "Contact Details, Opening Hours & Social Channels"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "தொலைபேசி எண்" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.phone}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        contact: { ...draft.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "வாட்ஸ்அப் எண் (நேரடி சாட்)" : "WhatsApp Number (Direct Order Chat)"}
                  </label>
                  <input
                    type="text"
                    value={draft.contact.whatsappNumber}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        contact: { ...draft.contact, whatsappNumber: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "மின்னஞ்சல் முகவரி" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    value={draft.contact.email}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        contact: { ...draft.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "கூகிள் மேப்ஸ் URL" : "Google Maps Store Location URL"}
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
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "கடையின் முழு முகவரி" : "Full Shop Address"}
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTa ? "சமூக வலைத்தள பக்கங்கள்" : "Social Media Links"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={draft.socialLinks.instagram}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          socialLinks: { ...draft.socialLinks, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={draft.socialLinks.facebook}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          socialLinks: { ...draft.socialLinks, facebook: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      YouTube
                    </label>
                    <input
                      type="text"
                      value={draft.socialLinks.youtube}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          socialLinks: { ...draft.socialLinks, youtube: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">
                {isTa ? "பிராண்டிங், லோகோ & அடிக்குறிப்பு (Footer)" : "Branding, Logo & Footer"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "கடை / பிராண்ட் பெயர்" : "Shop / Brand Name"}
                  </label>
                  <input
                    type="text"
                    value={draft.shopName}
                    onChange={(e) => setDraft({ ...draft, shopName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "குறியீட்டு வாக்கியம் (Tagline)" : "Tagline"}
                  </label>
                  <input
                    type="text"
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <ImagePickerInput
                label={isTa ? "கடையின் லோகோ புகைப்படம்" : "Shop Logo"}
                value={draft.logoUrl}
                onChange={(url) => setDraft({ ...draft, logoUrl: url })}
                helperText={
                  isTa
                    ? "சதுர வடிவ PNG அல்லது வெளிப்படையான பின்னணி கொண்ட SVG படம் சிறந்தது."
                    : "Square PNG or transparent SVG image recommended."
                }
                category="branding"
              />

              <ImagePickerInput
                label="Favicon"
                value={draft.faviconUrl}
                onChange={(url) => setDraft({ ...draft, faviconUrl: url })}
                category="branding"
              />

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTa ? "அடிக்குறிப்பு உரை (Footer Text)" : "Footer Text"}
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "அடிக்குறிப்பு விளக்கம்" : "Footer Description"}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.footer.description}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        footer: { ...draft.footer, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTa ? "பதிப்புரிமை வரிகள் (Copyright)" : "Copyright Text"}
                  </label>
                  <input
                    type="text"
                    value={draft.footer.copyrightText}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        footer: { ...draft.footer, copyrightText: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetOpen}
        title={isTa ? "முன்னிருப்பு உள்ளடக்கத்திற்கு மீட்டமைக்கவா?" : "Reset to default website content?"}
        description={
          isTa
            ? "அனைத்து ஆரம்ப உரை, தலைப்புகள் மற்றும் அமைப்புகள் மீட்டமைக்கப்படும். உங்கள் தனிப்பயன் மாற்றங்கள் மாற்றப்படும்."
            : "All text, headlines, and settings will be restored to original defaults. Custom changes will be overwritten."
        }
        confirmLabel={isTa ? "முன்னிருப்புக்கு மாற்று" : "Reset to Defaults"}
        variant="primary"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </AdminShell>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading content editor...</div>}>
      <WebsiteContentInner />
    </Suspense>
  );
}
