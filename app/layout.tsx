import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/ToastProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Sri Mahalakshmi Broilers | Fresh Farm Chicken & Eggs",
  description:
    "Freshly and hygienically cut farm chicken, boneless breast, curry cuts and healthy farm eggs every morning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#DDF3DF] text-[#26352B] antialiased selection:bg-[#287A45] selection:text-white">
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
