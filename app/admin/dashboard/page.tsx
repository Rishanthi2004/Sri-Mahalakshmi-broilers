"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FolderTree,
  ImageIcon,
  MessageSquareText,
  Package,
  PauseCircle,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useToast } from "@/components/common/ToastProvider";
import { authService } from "@/services/auth-service";
import { bannerService } from "@/services/banner-service";
import { categoryService } from "@/services/category-service";
import { enquiryService, mediaService } from "@/services/media-enquiry-service";
import { productService } from "@/services/product-service";
import { AdminUser, Category, Product } from "@/types";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;
  totalCategories: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalBanners: number;
  totalMedia: number;
  recentEnquiries: Array<{
    id: string;
    customerName: string;
    phoneNumber: string;
    message: string;
    status: string;
    submittedAt: string;
  }>;
  outOfStockItems: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    categoryName: string;
  }>;
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  const calculateDemoStats = useCallback(() => {
    const products = productService.getAll().filter((p) => !p.isDeleted);
    const categories = categoryService.getAll();
    const enquiries = enquiryService.getAll();
    const banners = bannerService.getAll();
    const media = mediaService.getAll();

    const catMap = new Map<string, string>(categories.map((c: Category) => [c.id, c.name]));

    const outOfStockList = products.filter((p: Product) => p.availability === "out_of_stock");

    const newStats: DashboardStats = {
      totalProducts: products.length,
      activeProducts: products.length > 0 ? products.filter((p: Product) => p.isActive).length : 0,
      inactiveProducts: products.length > 0 ? products.filter((p: Product) => !p.isActive).length : 0,
      outOfStock: outOfStockList.length,
      totalCategories: categories.length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((e) => e.status === "new").length,
      totalBanners: banners.length,
      totalMedia: media.length,
      recentEnquiries: enquiries.slice(0, 5).map((e) => ({
        id: e.id,
        customerName: e.customerName,
        phoneNumber: e.phoneNumber,
        message: e.message,
        status: e.status,
        submittedAt: e.submittedAt,
      })),
      outOfStockItems: outOfStockList.map((p: Product) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        image: p.image,
        categoryName: catMap.get(p.categoryId) || "கோழிக்கறி",
      })),
    };

    setStats(newStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    setUser(authService.getSession());
    calculateDemoStats();
  }, [calculateDemoStats]);

  const handleRefresh = () => {
    setLoading(true);
    calculateDemoStats();
    showToast("புள்ளிவிவரங்கள் புதுப்பிக்கப்பட்டன", { type: "info" });
  };

  const isStaff = user?.role === "staff_admin";

  const statCards = [
    {
      label: "மொத்த பொருட்கள்",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      accent: "bg-[#EDF7EE] text-[#287A45] border-[#C7E4CA]",
    },
    {
      label: "செயலில் உள்ளவை",
      value: stats?.activeProducts ?? 0,
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "செயலற்றவை",
      value: stats?.inactiveProducts ?? 0,
      icon: PauseCircle,
      accent: "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      label: "மொத்த பிரிவுகள்",
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      accent: "bg-[#EDF7EE] text-[#287A45] border-[#C7E4CA]",
    },
    {
      label: "இருப்பில் இல்லாதவை",
      value: stats?.outOfStock ?? 0,
      icon: AlertTriangle,
      accent: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      label: "மொத்த விசாரணைகள்",
      value: stats?.totalEnquiries ?? 0,
      badge: stats?.newEnquiries ? `${stats.newEnquiries} புதியது` : undefined,
      icon: MessageSquareText,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  const adminQuickActions = [
    {
      label: "புதிய பொருள் சேர்க்க",
      description: "புதிய கறிக்கட்டு, நெஞ்சுக்கறி அல்லது முட்டை வகை உருவாக்கவும்",
      href: "/admin/products?new=1",
      icon: Plus,
      primary: true,
    },
    {
      label: "பொருட்கள் மேலாண்மை",
      description: "விலைகள், இருப்பு நிலை மற்றும் படங்களை மாற்றவும்",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "பேனர் பதிவேற்ற",
      description: "முகப்பு விளம்பர பேனர்களை சேர்க்க அல்லது மாற்றவும்",
      href: "/admin/banners",
      icon: Sparkles,
    },
    {
      label: "கடை அமைப்புகள்",
      description: "தொலைபேசி, வாட்ஸ்அப் மற்றும் வேலை நேரத்தை மாற்றவும்",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      label: "பிரிவுகளை நிர்வகிக்க",
      description: "கோழிக்கறி மற்றும் முட்டை பிரிவுகளை ஒழுங்கமைக்கவும்",
      href: "/admin/categories",
      icon: FolderTree,
    },
  ];

  const staffQuickActions = [
    {
      label: "புதிய பொருள் சேர்க்க",
      description: "புதிய கறிக்கட்டு, நெஞ்சுக்கறி அல்லது முட்டை வகை உருவாக்கவும்",
      href: "/admin/products?new=1",
      icon: Plus,
      primary: true,
    },
    {
      label: "பொருட்கள் மேலாண்மை",
      description: "விலைகள், இருப்பு நிலை மற்றும் படங்களை மாற்றவும்",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "விசாரணைகளைக் காண்க",
      description: "வாடிக்கையாளர் செய்திகள் மற்றும் வாட்ஸ்அப் தொடர்புகள்",
      href: "/admin/enquiries",
      icon: MessageSquareText,
    },
    {
      label: "ஊடக நூலகம்",
      description: "பொருட்கள் மற்றும் கடையின் புகைப்படங்களை பதிவேற்றவும்",
      href: "/admin/media",
      icon: ImageIcon,
    },
    {
      label: "பிரிவுகளை நிர்வகிக்க",
      description: "கோழிக்கறி மற்றும் முட்டை பிரிவுகளை ஒழுங்கமைக்கவும்",
      href: "/admin/categories",
      icon: FolderTree,
    },
  ];

  const currentQuickActions = isStaff ? staffQuickActions : adminQuickActions;

  return (
    <AdminShell
      title={isStaff ? "பணியாளர் கட்டுப்பாட்டு அறை (Staff Dashboard)" : "முதன்மை கட்டுப்பாட்டு அறை (Admin Dashboard)"}
      subtitle={
        isStaff
          ? "சரக்கு இருப்பு நிலவரம், பொருட்கள் மேலாண்மை மற்றும் வாடிக்கையாளர் விசாரணைகள்"
          : "நேரலை விற்பனை புள்ளிவிவரங்கள், சரக்கு இருப்பு மற்றும் கடை மேலாண்மை"
      }
      actions={
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          <span>புள்ளிவிவரங்களை புதுப்பி</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {stat.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {loading ? "..." : stat.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              விரைவுச் செயல்பாடுகள் {isStaff && "(பணியாளர்)"}
            </h2>
            <span className="text-xs text-slate-400">
              {isStaff ? "பணியாளர் அனுமதியுள்ள செயல்பாடுகள்" : "அனைத்து நிர்வாக குறுக்குவழிகள்"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentQuickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`group p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    action.primary
                      ? "bg-[#287A45] border-[#287A45] text-white shadow-md shadow-[#287A45]/20 hover:bg-[#1E5F35]"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-[#EDF7EE] hover:border-[#C7E4CA] text-slate-800"
                  }`}
                >
                  <div>
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                        action.primary
                          ? "bg-white/20 text-white"
                          : "bg-white border border-slate-200 text-[#287A45] group-hover:scale-105 transition-transform"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p
                      className={`text-sm font-bold ${
                        action.primary ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {action.label}
                    </p>
                    <p
                      className={`text-xs mt-1 leading-snug ${
                        action.primary ? "text-emerald-100" : "text-slate-500"
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                  <div
                    className={`mt-4 flex items-center gap-1 text-xs font-semibold ${
                      action.primary
                        ? "text-white"
                        : "text-[#287A45] group-hover:translate-x-0.5 transition-transform"
                    }`}
                  >
                    <span>தொடர</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Split Section: Out of Stock Alerts + Recent Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Out of Stock Items */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">இருப்பில் இல்லாதவை எச்சரிக்கை</h3>
              </div>
              <Link
                href="/admin/products?availability=out_of_stock"
                className="text-xs font-semibold text-[#287A45] hover:text-[#1E5F35]"
              >
                பொருட்கள் பக்கத்தில் காண்க
              </Link>
            </div>

            {(!stats?.outOfStockItems || stats.outOfStockItems.length === 0) ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">அனைத்துப் பொருட்களும் தற்போது இருப்பில் உள்ளன!</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  வாடிக்கையாளர்கள் அனைத்து கறிக்கட்டுகளையும் தடையின்றி ஆர்டர் செய்யலாம்.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 flex-1">
                {stats.outOfStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.categoryName} • ₹{item.price} / {item.unit}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/products"
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-[#287A45] hover:bg-[#EDF7EE] shrink-0"
                    >
                      இருப்பை மாற்று
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Contact Enquiries */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <MessageSquareText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">சமீபத்திய வாடிக்கையாளர் விசாரணைகள்</h3>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-semibold text-[#287A45] hover:text-[#1E5F35]"
              >
                அனைத்தையும் பார்க்க ({stats?.totalEnquiries ?? 0})
              </Link>
            </div>

            {(!stats?.recentEnquiries || stats.recentEnquiries.length === 0) ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-auto">
                <MessageSquareText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">விசாரணைகள் எதுவும் இதுவரை வரவில்லை.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  தொடர்பு பக்கம் வழியாக வாடிக்கையாளர்கள் அனுப்பும் செய்திகள் இங்கு தோன்றும்.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 flex-1">
                {stats.recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {enq.customerName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.status === "new"
                              ? "bg-rose-100 text-rose-700"
                              : enq.status === "contacted"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {enq.status === "new"
                            ? "புதியது"
                            : enq.status === "contacted"
                            ? "தொடர்புகொள்ளப்பட்டது"
                            : "தீர்க்கப்பட்டது"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{enq.message}</p>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 sm:text-right shrink-0">
                      {enq.phoneNumber}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
