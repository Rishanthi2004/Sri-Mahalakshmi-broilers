import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#DDF3DF] flex flex-col items-center justify-center p-6 text-center text-[#26352B]">
      <div className="w-16 h-16 rounded-2xl bg-[#287A45] text-white flex items-center justify-center text-3xl font-bold shadow-md mb-4">
        🍗
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">404 - பக்கம் கிடைக்கவில்லை</h1>
      <p className="text-sm text-[#516357] mt-2 max-w-sm">
        நீங்கள் தேடும் கோழிக்கறி வகை அல்லது பக்கம் மாற்றப்பட்டிருக்கலாம் அல்லது தற்போது கிடைக்காமல் இருக்கலாம்.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-sm font-semibold shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>முகப்புப் பக்கத்திற்குத் திரும்பு</span>
      </Link>
    </div>
  );
}
