"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const isTa = language === "ta";

  return (
    <div className="min-h-screen bg-[#DDF3DF] flex flex-col items-center justify-center p-6 text-center text-[#26352B]">
      <img
        src="/images/logo.png"
        alt="ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்"
        className="w-16 h-16 rounded-full object-cover border-2 border-[#287A45] shadow-md mb-4 bg-white shrink-0"
      />
      <h1 className="text-3xl font-extrabold tracking-tight">
        {isTa ? "404 - பக்கம் கிடைக்கவில்லை" : "404 - Page Not Found"}
      </h1>
      <p className="text-sm text-[#516357] mt-2 max-w-sm">
        {isTa
          ? "நீங்கள் தேடும் பக்கம் அல்லது பொருள் மாற்றப்பட்டிருக்கலாம் அல்லது தற்போது இல்லை."
          : "The page or poultry cut you are looking for may have been moved or is currently unavailable."}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-sm font-semibold shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isTa ? "முகப்பு பக்கத்திற்குத் திரும்புக" : "Return to Home"}</span>
      </Link>
    </div>
  );
}
