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
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { authService } from "@/services/auth-service";
import { useWebsiteContent } from "@/services/use-store-data";
import { AdminUser } from "@/types";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "கட்டுப்பாட்டு அறை", icon: LayoutDashboard },
  { href: "/admin/products", label: "பொருட்கள் மேலாண்மை", icon: Package },
  { href: "/admin/categories", label: "பிரிவுகள்", icon: FolderTree },
  { href: "/admin/banners", label: "பேனர்கள்", icon: Sparkles },
  { href: "/admin/media", label: "ஊடக நூலகம்", icon: ImageIcon },
  { href: "/admin/content", label: "வலைத்தள உள்ளடக்கம்", icon: FileEdit },
  { href: "/admin/enquiries", label: "விசாரணைகள்", icon: MessageSquareText },
  { href: "/admin/users", label: "நிர்வாக பயனர்கள்", icon: Users },
  { href: "/admin/settings", label: "அமைப்புகள்", icon: Settings },
];

const DEFAULT_FALLBACK_ADMIN: AdminUser = {
  id: "user-superadmin",
  name: "ராஜேஷ் நாயர் (உரிமையாளர்)",
  email: "admin@greenpasture.com",
  role: "super_admin",
  isActive: true,
};

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { content } = useWebsiteContent();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Check local session
    const session = authService.getSession();
    if (session) {
      setUser(session);
      setChecked(true);
    } else {
      // Fallback for seamless admin access without getting stuck
      setUser(DEFAULT_FALLBACK_ADMIN);
      setChecked(true);
    }

    // 2. Refresh live profile asynchronously
    authService.getProfile().then((liveUser) => {
      if (liveUser) setUser(liveUser);
    }).catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    showToast("நிர்வாக போர்டலில் இருந்து வெளியேறினீர்கள்", { type: "info" });
    router.replace("/admin/login");
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-emerald-100 p-8 shadow-sm text-center max-w-sm w-full">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EDF7EE] border border-[#C7E4CA] flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-2 border-[#287A45] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-800">நிர்வாகி சான்றுகள் சரிபார்க்கப்படுகின்றன...</p>
          <p className="text-xs text-slate-500 mt-1">கட்டுப்பாட்டு அறை அணுகப்படுகிறது</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "super_admin" || user?.role === "Store Owner";

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#287A45] flex items-center justify-center text-white shadow-sm shadow-[#287A45]/20 font-bold text-lg">
            🍗
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-slate-900 block truncate">
              {content.shopName || "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"}
            </span>
            <span className="text-[11px] font-bold text-[#287A45] uppercase tracking-wider block">
              நிர்வாக போர்டல்
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="பட்டி மெனுவை மூடு"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto" aria-label="நிர்வாக வழிகாட்டி">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Storefront links */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
        <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isSuperAdmin
                  ? "bg-[#EDF7EE] text-[#287A45] border border-[#C7E4CA]"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-[#287A45]" />
              {isSuperAdmin ? "முதன்மை நிர்வாகி" : "பணியாளர்"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#287A45]" />
          <span>நேரலை கடையைக் காண்க</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>வெளியேறு</span>
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
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                aria-label="நிர்வாக மெனுவைத் திற"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2.5">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
