"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  FileEdit,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage, TRANSLATIONS } from "@/context/LanguageContext";
import { authService, DEMO_CREDENTIALS } from "@/services/auth-service";
import { USER_NAME_TRANSLATIONS } from "@/data/enquiries";
import { useWebsiteContent } from "@/services/use-store-data";
import { AdminUser } from "@/types";

const NAV_KEY_MAP: Record<string, keyof typeof TRANSLATIONS["ta"]> = {
  "/admin/dashboard": "adminDashboard",
  "/admin/products": "adminProducts",
  "/admin/categories": "adminCategories",
  "/admin/banners": "adminBanners",
  "/admin/media": "adminMedia",
  "/admin/content": "adminContent",
  "/admin/enquiries": "adminEnquiries",
  "/admin/users": "adminUsers",
  "/admin/settings": "adminSettings",
};

const ALL_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "கட்டுப்பாட்டு அறை", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/products", label: "பொருட்கள் மேலாண்மை", icon: Package, adminOnly: false },
  { href: "/admin/categories", label: "பிரிவுகள்", icon: FolderTree, adminOnly: false },
  { href: "/admin/banners", label: "பேனர்கள்", icon: Sparkles, adminOnly: false },
  { href: "/admin/media", label: "ஊடக நூலகம்", icon: ImageIcon, adminOnly: false },
  { href: "/admin/content", label: "வலைத்தள உள்ளடக்கம்", icon: FileEdit, adminOnly: true },
  { href: "/admin/enquiries", label: "விசாரணைகள்", icon: MessageSquareText, adminOnly: false },
  { href: "/admin/users", label: "நிர்வாக பயனர்கள்", icon: Users, adminOnly: true },
  { href: "/admin/settings", label: "அமைப்புகள்", icon: Settings, adminOnly: true },
];

const DEFAULT_SUPERADMIN_SESSION: AdminUser = {
  id: "demo-super-admin",
  name: DEMO_CREDENTIALS.superAdmin.name,
  email: DEMO_CREDENTIALS.superAdmin.username,
  role: "super_admin",
  isActive: true,
};

interface AdminShellProps {
  title: string;
  subtitle?: string;
  titleEn?: string;
  subtitleEn?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const ADMIN_PAGE_TITLES: Record<string, { titleEn: string; subEn: string }> = {
  "/admin/dashboard": {
    titleEn: "Operations Dashboard",
    subEn: "Overview of sales, inventory, orders, cuts, and website performance",
  },
  "/admin/products": {
    titleEn: "Products Management",
    subEn: "Manage fresh poultry cuts, stock availability, pricing, and images",
  },
  "/admin/categories": {
    titleEn: "Categories Management",
    subEn: "Organize chicken cuts, farm eggs, and specialty category classifications",
  },
  "/admin/banners": {
    titleEn: "Banners Management",
    subEn: "Manage homepage hero banners, seasonal promos, and advertising slides",
  },
  "/admin/media": {
    titleEn: "Media Library",
    subEn: "Upload, store, and manage images for products, banners, and storefront",
  },
  "/admin/content": {
    titleEn: "Website Content Management",
    subEn: "Edit hero banners, showcase cuts, About Us, founder profile, and branding",
  },
  "/admin/enquiries": {
    titleEn: "Customer Enquiries",
    subEn: "Track customer messages, cut requests, and direct WhatsApp communications",
  },
  "/admin/users": {
    titleEn: "Admin Users & Roles",
    subEn: "Manage administrator accounts, staff roles, credentials, and access control",
  },
  "/admin/settings": {
    titleEn: "Store & Business Settings",
    subEn: "Manage contact numbers, office location, store opening hours, and social media",
  },
};

export function AdminShell({
  title,
  subtitle,
  titleEn,
  subtitleEn,
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { content } = useWebsiteContent();
  const { language, t } = useLanguage();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session);
      setChecked(true);
    } else {
      // Default to Super Admin demo session if not set so user never gets blocked
      setUser(DEFAULT_SUPERADMIN_SESSION);
      setChecked(true);
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    showToast(
      language === "ta"
        ? "நிர்வாக போர்டலில் இருந்து வெளியேறினீர்கள்"
        : "Signed out of Admin Portal",
      { type: "info" }
    );
    router.replace("/admin/login");
  };

  const switchToRole = async (targetRole: "superAdmin" | "staffAdmin") => {
    const creds = DEMO_CREDENTIALS[targetRole];
    await authService.login(creds.username, creds.password);
    const updated = authService.getSession();
    if (updated) setUser(updated);
    showToast(
      language === "ta"
        ? `${creds.label} பயன்முறைக்கு மாறினீர்கள்`
        : `Switched to ${targetRole === "superAdmin" ? "Super Admin" : "Staff Admin"} mode`,
      { type: "success" }
    );
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-emerald-100 p-8 shadow-sm text-center max-w-sm w-full">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EDF7EE] border border-[#C7E4CA] flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-2 border-[#287A45] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {language === "ta"
              ? "நிர்வாகி சான்றுகள் சரிபார்க்கப்படுகின்றன..."
              : "Verifying administrator credentials..."}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === "ta" ? "கட்டுப்பாட்டு அறை அணுகப்படுகிறது" : "Accessing control panel..."}
          </p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "super_admin";
  const isStaffAdmin = user?.role === "staff_admin";

  const displayTitle =
    language === "en"
      ? titleEn || ADMIN_PAGE_TITLES[pathname]?.titleEn || title
      : title;

  const displaySubtitle =
    language === "en"
      ? subtitleEn || ADMIN_PAGE_TITLES[pathname]?.subEn || subtitle
      : subtitle;

  // Check if current route requires Super Admin access
  const currentNav = ALL_NAV_ITEMS.find((item) => item.href === pathname);
  const isRestrictedForStaff = isStaffAdmin && Boolean(currentNav?.adminOnly);

  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (isSuperAdmin) return true;
    // Staff sees all non-adminOnly items
    return !item.adminOnly;
  });

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
          <img
            src={content.logoUrl || "/images/logo.png"}
            alt={content.shopName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs bg-white shrink-0"
          />
          <div className="min-w-0">
            <span className="text-sm font-bold text-slate-900 block truncate">
              {content.shopName || "Sri Mahalakshmi Broilers"}
            </span>
            <span className="text-[11px] font-bold text-[#287A45] uppercase tracking-wider block">
              {isSuperAdmin
                ? (language === "ta" ? "நிர்வாக போர்டல் (Admin)" : "Super Admin Portal")
                : (language === "ta" ? "பணியாளர் போர்டல் (Staff)" : "Staff Portal")}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label={language === "ta" ? "பட்டி மெனுவை மூடு" : "Close sidebar menu"}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto" aria-label={language === "ta" ? "நிர்வாக வழிகாட்டி" : "Admin navigation"}>
        <div className="px-2 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isSuperAdmin
            ? (language === "ta" ? "முதன்மை நிர்வாகப் பிரிவுகள்" : "Super Admin Navigation")
            : (language === "ta" ? "பணியாளர் பணிப் பிரிவுகள்" : "Staff Navigation")}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const navLabelKey = NAV_KEY_MAP[item.href];
          const displayLabel = navLabelKey ? t(navLabelKey) : item.label;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#287A45] text-white font-semibold shadow-sm shadow-[#287A45]/30"
                  : "text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-[#287A45]"}`} />
              <span>{displayLabel}</span>
            </Link>
          );
        })}

        {/* If Staff Admin, show locked admin links indicator */}
        {isStaffAdmin && (
          <div className="pt-3 mt-3 border-t border-slate-100 px-2 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{language === "ta" ? "முதன்மை நிர்வாகி மட்டும்" : "Super Admin Only"}</span>
            </div>
            {ALL_NAV_ITEMS.filter((i) => i.adminOnly).map((i) => {
              const lockedLabelKey = NAV_KEY_MAP[i.href];
              const displayLocked = lockedLabelKey ? t(lockedLabelKey) : i.label;
              return (
                <div
                  key={i.href}
                  className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-400 rounded-lg bg-slate-50 border border-dashed border-slate-200"
                >
                  <span className="truncate">{displayLocked}</span>
                  <span className="text-[9px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                    {language === "ta" ? "பூட்டப்பட்டது" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Card, Role Switcher & Links */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-900 truncate">
              {language === "en"
                ? (USER_NAME_TRANSLATIONS[user?.id || ""] || USER_NAME_TRANSLATIONS[user?.name || ""] || user?.name)
                : user?.name}
            </p>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isSuperAdmin
                  ? "bg-[#EDF7EE] text-[#287A45] border border-[#C7E4CA]"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {isSuperAdmin ? t("adminSuperAdmin") : t("adminStaff")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate font-mono">{user?.email}</p>

          {/* Quick Demo Switcher */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-amber-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {language === "ta" ? "டெமோ முறை" : "DEMO"}
            </span>
            <button
              type="button"
              onClick={() => switchToRole(isSuperAdmin ? "staffAdmin" : "superAdmin")}
              className="text-[#287A45] hover:text-[#1E5F35] font-semibold underline underline-offset-2"
            >
              {isSuperAdmin
                ? (language === "ta" ? "பணியாளராக மாற" : "Switch to Staff")
                : (language === "ta" ? "முதன்மை நிர்வாகியாக மாற" : "Switch to Admin")}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <LanguageSwitcher className="w-full justify-center bg-white shadow-2xs border-slate-200" />
        </div>

        <Link
          href="/"
          target="_blank"
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#287A45]" />
          <span>{t("adminLiveStore")}</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t("adminLogout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                aria-label={language === "ta" ? "நிர்வாக மெனுவைத் திற" : "Open admin menu"}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {displayTitle}
                  </h1>
                </div>
                {displaySubtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    {displaySubtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Prominent DEMO MODE badge in top bar */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{language === "ta" ? "டெமோ பயன்முறை • DEMO MODE" : "DEMO MODE"}</span>
              </div>

              {/* Language Switcher in Admin Header */}
              <LanguageSwitcher className="bg-slate-50 border-slate-200" />

              {actions}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {isRestrictedForStaff ? (
            /* Staff Access Restriction Barrier */
            <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-amber-200 p-8 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {language === "ta"
                    ? "பணியாளர் அணுகல் கட்டுப்பாடு (Staff Access Restricted)"
                    : "Staff Access Restricted"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {language === "ta" ? (
                    <>
                      நீங்கள் தற்போது <strong>பணியாளர் (staff@greenpasture.com)</strong> கணக்கில் உள்ளீர்கள்.
                      வலைத்தள அமைப்புகள் மற்றும் பயனர் மேலாண்மை பகுதிகளை <strong>முதன்மை நிர்வாகி (Super Admin)</strong> மட்டுமே திருத்த முடியும்.
                    </>
                  ) : (
                    <>
                      You are currently signed in with the <strong>Staff (staff@greenpasture.com)</strong> account.
                      Website settings, content, and user management can only be modified by a <strong>Super Admin</strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => switchToRole("superAdmin")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-bold shadow-md shadow-[#287A45]/20 transition-all cursor-pointer"
                >
                  {language === "ta" ? "முதன்மை நிர்வாகியாக மாறவும் (Admin Demo)" : "Switch to Super Admin (Demo)"}
                </button>
                <Link
                  href="/admin/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all text-center"
                >
                  {language === "ta" ? "கட்டுப்பாட்டு அறைக்குத் திரும்பு" : "Return to Dashboard"}
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
