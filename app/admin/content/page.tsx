"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RotateCcw, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePickerInput } from "@/components/admin/ImagePickerInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { DEFAULT_WEBSITE_CONTENT } from "@/data/website-content";
import { useProducts, useWebsiteContent } from "@/services/use-store-data";
import { WebsiteContent } from "@/types";

type ContentTab =
  | "hero"
  | "featured"
  | "why"
  | "about"
  | "contact"
  | "branding";

const TABS: { id: ContentTab; label: string }[] = [
  { id: "hero", label: "முகப்பு பேனர் & தலைப்பு" },
  { id: "featured", label: "சிறப்புப் பொருட்கள்" },
  { id: "why", label: "எங்கள் சிறப்புகள் & அழைப்பு" },
  { id: "about", label: "எங்களைப் பற்றி & உரிமையாளர்" },
  { id: "contact", label: "தொடர்பு, நேரம் & சமூகம்" },
  { id: "branding", label: "லோகோ & அடிக்குறிப்பு (Footer)" },
];

function WebsiteContentInner() {
  const searchParams = useSearchParams();
  const { content, reload } = useWebsiteContent();
  const { products } = useProducts();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  const [draft, setDraft] = useState<WebsiteContent>(content);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    const paramTab = searchParams.get("tab") as ContentTab | null;
    if (paramTab && TABS.some((t) => t.id === paramTab)) {
      setActiveTab(paramTab);
    }
  }, [searchParams]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        showToast("வலைத்தள உள்ளடக்கம் சேமிக்கப்பட்டது", {
          description: "வாடிக்கையாளர் தளத்தில் மாற்றங்கள் உடனடியாகத் தோன்றும்.",
        });
        await reload();
      } else {
        showToast("உள்ளடக்கத்தைச் சேமிப்பதில் பிழை", { type: "danger" });
      }
    } catch {
      showToast("பிழை ஏற்பட்டது", { type: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setDraft(DEFAULT_WEBSITE_CONTENT);
    setResetOpen(false);
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_WEBSITE_CONTENT),
      });
      showToast("முன்னிருப்பு உள்ளடக்கத்திற்கு மீட்டமைக்கப்பட்டது", { type: "info" });
      await reload();
    } catch {}
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
      title="வலைத்தள உள்ளடக்கம் மேலாண்மை"
      subtitle="முகப்பு உரை, சிறப்பு கறிக்கட்டுகள், எங்களைப் பற்றி, உரிமையாளர் சுயவிவரம் மற்றும் பிராண்டிங் ஆகியவற்றைத் திருத்துதல்"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">முன்னிருப்புக்கு மாற்று</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "சேமிக்கப்படுகிறது..." : "மாற்றங்களைச் சேமி"}</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {TABS.map((tab) => (
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
                முகப்பு பேனர் &amp; முதன்மைத் தலைப்பு
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    மேல் பேட்ஜ் உரை
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
                    முதன்மை பொத்தான் பெயர்
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
                  முதன்மைத் தலைப்பு
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
                  விளக்க உரை
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
                  வாட்ஸ்அப் பொத்தான் பெயர்
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
                label="முகப்பு பேனர் புகைப்படம்"
                value={draft.hero.bannerImage}
                onChange={(url) =>
                  setDraft({
                    ...draft,
                    hero: { ...draft.hero, bannerImage: url },
                  })
                }
                helperText="அகலமான லேண்ட்ஸ்கேப் புகைப்படம் பரிந்துரைக்கப்படுகிறது (16:9 அல்லது 21:9)."
                category="banners"
              />
            </div>
          )}

          {activeTab === "featured" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  முகப்பில் காட்டப்படும் சிறப்புப் பொருட்கள்
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  முகப்பின் மிதக்கும் காட்சிப் பகுதியில் காட்டப்பட வேண்டிய பொருட்களைத் தேர்ந்தெடுக்கவும்.
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
                  எங்கள் சிறப்புகள் (4 தூண்கள்)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  வாடிக்கையாளர் முகப்புப் பக்கத்தில் தர உறுதிப்பாட்டு கட்டத்தில் தோன்றும்.
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
                        சிறப்பம்சம் #{idx + 1}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        தலைப்பு
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
                        விளக்கம்
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
                <h3 className="text-sm font-bold text-slate-900">நடவடிக்கை அழைப்புப் பட்டி (Call to Action)</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    தலைப்பு
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
                    விளக்கம்
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
                    பொத்தான் பெயர்
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
              <h2 className="text-base font-bold text-slate-900">எங்களைப் பற்றி &amp; உரிமையாளர் சுயவிவரம்</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    அறிமுக பேட்ஜ்
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
                    அனுபவ ஆண்டுகள்
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
                  அறிமுகத் தலைப்பு
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
                  அறிமுக விளக்கம்
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
                label="கடை முகப்புப் புகைப்படம்"
                value={draft.about.shopImage}
                onChange={(url) =>
                  setDraft({ ...draft, about: { ...draft.about, shopImage: url } })
                }
                category="about"
              />

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">உரிமையாளர் சுயவிவரத் தகவல்கள்</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      உரிமையாளர் பெயர்
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
                      பதவி / பொறுப்பு
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
                    உரிமையாளர் வாழ்க்கைச் சுருக்கம்
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
                  label="உரிமையாளர் உருவப்படம்"
                  value={draft.about.ownerPhoto}
                  onChange={(url) =>
                    setDraft({ ...draft, about: { ...draft.about, ownerPhoto: url } })
                  }
                  category="about"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">தரம், சுகாதாரம் மற்றும் வாடிக்கையாளர் திருப்தி</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    தர உறுதிப்பாடு
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
                    சுகாதார நடைமுறைகள்
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
                    வாடிக்கையாளர் திருப்தி
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
              <h2 className="text-base font-bold text-slate-900">தொடர்பு விவரங்கள், வேலை நேரம் &amp; சமூக வலைத்தளங்கள்</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    தொலைபேசி எண்
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
                    வாட்ஸ்அப் எண் (நேரடி சாட்)
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
                    மின்னஞ்சல் முகவரி
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
                    கூகிள் மேப்ஸ் URL
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
                  கடையின் முழு முகவரி
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
                <h3 className="text-sm font-bold text-slate-900">சமூக வலைத்தள பக்கங்கள்</h3>
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
              <h2 className="text-base font-bold text-slate-900">பிராண்டிங், லோகோ &amp; அடிக்குறிப்பு (Footer)</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    கடை / பிராண்ட் பெயர்
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
                    குறியீட்டு வாக்கியம் (Tagline)
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
                label="கடையின் லோகோ புகைப்படம்"
                value={draft.logoUrl}
                onChange={(url) => setDraft({ ...draft, logoUrl: url })}
                helperText="சதுர வடிவ PNG அல்லது வெளிப்படையான பின்னணி கொண்ட SVG படம் சிறந்தது."
                category="branding"
              />

              <ImagePickerInput
                label="Favicon"
                value={draft.faviconUrl}
                onChange={(url) => setDraft({ ...draft, faviconUrl: url })}
                category="branding"
              />

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">அடிக்குறிப்பு உரை (Footer Text)</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    அடிக்குறிப்பு விளக்கம்
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
                    பதிப்புரிமை வரிகள் (Copyright)
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
        title="முன்னிருப்பு உள்ளடக்கத்திற்கு மீட்டமைக்கவா?"
        description="அனைத்து ஆரம்ப உரை, தலைப்புகள் மற்றும் அமைப்புகள் மீட்டமைக்கப்படும். உங்கள் தனிப்பயன் மாற்றங்கள் மாற்றப்படும்."
        confirmLabel="முன்னிருப்புக்கு மாற்று"
        variant="primary"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </AdminShell>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">உள்ளடக்க பதிப்பான் ஏற்றப்படுகிறது...</div>}>
      <WebsiteContentInner />
    </Suspense>
  );
}
