import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/ToastProvider";

export const metadata: Metadata = {
  title: "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் | புதிய பண்ணை சிக்கன் & முட்டைகள்",
  description:
    "தினசரி பண்ணையிலிருந்து பெறப்படும் புதிய கோழிக்கறி, எலும்பில்லா நெஞ்சுக்கறி, கறிக்கட் மற்றும் ஆரோக்கியமான முட்டைகள்.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <body className="min-h-screen bg-[#DDF3DF] text-[#26352B] antialiased selection:bg-[#287A45] selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
