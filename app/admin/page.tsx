"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export default function AdminIndexPage() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#DDF3DF] flex items-center justify-center p-6 text-sm text-[#26352B]">
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 text-[#287A45] animate-spin" />
        <span>
          {language === "ta"
            ? "நிர்வாக கட்டுப்பாட்டு அறைக்குத் திருப்பப்படுகிறது..."
            : "Redirecting to admin dashboard..."}
        </span>
      </div>
    </div>
  );
}
