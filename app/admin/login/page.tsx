"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { authService, DEMO_CREDENTIALS } from "@/services/auth-service";
import { useWebsiteContent } from "@/services/use-store-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { content } = useWebsiteContent();
  const { language, t } = useLanguage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handlePerformLogin = async (loginUser: string, loginPass: string) => {
    setError("");
    setIsLoading(true);

    const res = await authService.login(loginUser, loginPass);
    if (!res.ok) {
      setError(
        res.error ??
          (language === "ta" ? "தவறான நிர்வாகி சான்றுகள்." : "Invalid admin credentials.")
      );
      setIsLoading(false);
      return;
    }

    const isSuper = res.user?.role === "super_admin";
    showToast(
      language === "ta"
        ? "நிர்வாக போர்டலில் உள்நுழைந்தீர்கள் (டெமோ முறை)"
        : "Signed in to Admin Portal (Demo Mode)",
      {
        description:
          language === "ta"
            ? `நல்வரவு, ${res.user?.name} [${isSuper ? "முதன்மை நிர்வாகி" : "பணியாளர் நிர்வாகி"}].`
            : `Welcome, ${res.user?.name} [${isSuper ? "Super Admin" : "Staff Admin"}].`,
      }
    );
    router.replace("/admin/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePerformLogin(username, password);
  };

  const quickLoginAs = async (role: "superAdmin" | "staffAdmin") => {
    const creds = DEMO_CREDENTIALS[role];
    setUsername(creds.username);
    setPassword(creds.password);
    await handlePerformLogin(creds.username, creds.password);
  };

  return (
    <div className="min-h-screen bg-[#DDF3DF] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 relative">
      {/* Top Bar with Language Switcher */}
      <div className="w-full max-w-md flex justify-end mb-2">
        <LanguageSwitcher className="bg-white/90 shadow-2xs border-[#C7E4CA]" />
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Header Icon & Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <img
            src={content.logoUrl || "/images/logo.png"}
            alt={content.shopName || "Sri Mahalakshmi Broilers"}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#287A45] shadow-lg shadow-[#287A45]/25 bg-white shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold text-[#26352B]">
              {content.shopName || "Sri Mahalakshmi Broilers"}
            </h2>
            <p className="text-xs font-bold text-[#287A45] uppercase tracking-widest mt-0.5">
              {language === "ta" ? "நிர்வாக கட்டுப்பாட்டு மையம்" : "Admin Operations Portal"}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-[#C7E4CA] shadow-xl shadow-emerald-950/5 p-7 sm:p-8"
        >
          {/* DEMO MODE Pill Indicator */}
          <div className="mb-4 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{language === "ta" ? "டெமோ பயன்முறை • DEMO MODE" : "DEMO MODE"}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200/70 font-semibold text-amber-950">
              {language === "ta" ? "முன்முனை மாதிரி" : "Frontend Demo"}
            </span>
          </div>

          <div className="space-y-1.5 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#287A45] bg-[#EDF7EE] w-fit px-2.5 py-1 rounded-md border border-[#C7E4CA]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === "ta" ? "நேரடி டெமோ நிர்வாக அணுகல்" : "Instant Demo Admin Access"}
            </div>
            <h1 className="text-2xl font-bold text-[#26352B] pt-1">{t("adminLoginTitle")}</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t("adminLoginSubtitle")}
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {language === "ta" ? "பயனர் பெயர் அல்லது மின்னஞ்சல்" : "Username or Email"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@greenpasture.com"
                  autoComplete="username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#287A45] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  {language === "ta" ? "கடவுச்சொல்" : "Password"}
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#287A45] hover:text-[#1E5F35] transition-colors"
                >
                  {language === "ta" ? "கடவுச்சொல் உதவி" : "Credentials Guide"}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#287A45] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "கடவுச்சொல்லை மறைக்க" : "கடவுச்சொல்லைக் காட்ட"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-[#287A45]/25 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>
                {isLoading
                  ? (language === "ta" ? "உள்நுழைகிறது..." : "Signing in...")
                  : t("loginBtn")}
              </span>
            </button>
          </form>

          {/* Quick Demo Credentials 1-Click Login */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("quickLoginTitle")}</span>
              </p>
              <span className="text-[10px] text-slate-400">
                {language === "ta" ? "கிளிக் செய்து நுழையலாம்" : "Click to sign in"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLoginAs("superAdmin")}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-[#C7E4CA] bg-[#EDF7EE] hover:bg-[#DDF3DF] text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#287A45]">
                    <KeyRound className="w-3 h-3 text-[#287A45]" />
                    {t("adminSuperAdmin")}
                  </div>
                  <span className="text-[9px] font-bold uppercase bg-[#287A45] text-white px-1.5 py-0.2 rounded group-hover:bg-[#1E5F35]">
                    Admin
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-mono mt-1 font-semibold truncate">
                  admin@greenpasture.com
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  {language === "ta" ? "முழு நிர்வாக அணுகல்" : "Full Admin Access"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs("staffAdmin")}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-800">
                    <KeyRound className="w-3 h-3 text-blue-600" />
                    {t("adminStaff")}
                  </div>
                  <span className="text-[9px] font-bold uppercase bg-blue-600 text-white px-1.5 py-0.2 rounded group-hover:bg-blue-700">
                    Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-mono mt-1 font-semibold truncate">
                  staff@greenpasture.com
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5">
                  {language === "ta" ? "பொருட்கள் & விசாரணைகள்" : "Products & Orders"}
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Return to Public Website */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26352B] hover:text-[#287A45] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === "ta" ? "கடை முகப்புக்குத் திரும்பு" : "Return to Storefront"}</span>
          </Link>
        </div>
      </div>

      {/* Forgot Password / Demo Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF7EE] text-[#287A45] flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === "ta" ? "டெமோ உள்நுழைவு வழிகாட்டி" : "Demo Sign In Guide"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "ta" ? "முன்முனை காட்சி முறை சான்றுகள்" : "Frontend Demo Mode Credentials"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <p>
                  {language === "ta"
                    ? "இது ஒரு முன்முனை டெமோ பதிப்பு. சேவையகம் அல்லது தரவுத்தள இணைப்பு தேவையின்றி உடனடி அணுகல் வழங்கப்பட்டுள்ளது."
                    : "This is a frontend demo mode. Instant 1-click access is provided without requiring a backend database."}
                </p>
                <div className="p-3 rounded-xl bg-[#EDF7EE] border border-[#C7E4CA] text-xs text-[#26352B] space-y-2">
                  <div className="font-bold text-[#287A45]">
                    {language === "ta" ? "முதன்மை நிர்வாகி (Super Admin):" : "Super Admin:"}
                  </div>
                  <div><strong>{language === "ta" ? "மின்னஞ்சல்:" : "Email:"}</strong> admin@greenpasture.com</div>
                  <div><strong>{language === "ta" ? "அணுகல்:" : "Access:"}</strong> {language === "ta" ? "முழு கட்டுப்பாட்டு அறை, அமைப்புகள் & பயனர்கள்" : "Full Dashboard, Settings & Users"}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
                  <div className="font-bold text-blue-800">
                    {language === "ta" ? "பணியாளர் நிர்வாகி (Staff Admin):" : "Staff Admin:"}
                  </div>
                  <div><strong>{language === "ta" ? "மின்னஞ்சல்:" : "Email:"}</strong> staff@greenpasture.com</div>
                  <div><strong>{language === "ta" ? "அணுகல்:" : "Access:"}</strong> {language === "ta" ? "பொருட்கள், பிரிவுகள், பேனர்கள் & விசாரணைகள்" : "Products, Categories, Banners & Enquiries"}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#287A45] text-white text-xs font-semibold hover:bg-[#1E5F35]"
                >
                  {language === "ta" ? "புரிந்தது" : "Got it"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
