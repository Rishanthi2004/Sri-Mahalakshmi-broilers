import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/ToastProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sri-mahalakshmi-broilers.netlify.app"
  ),
  title: "Sri Mahalakshmi Broilers | Fresh Farm Chicken & Eggs",
  description:
    "Freshly and hygienically cut farm chicken, boneless breast, curry cuts and healthy farm eggs every morning.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700;800;900&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("gp_poultry_lang_v2");if(l==="ta"||l==="en"){document.documentElement.lang=l;}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#DDF3DF] text-[#26352B] antialiased selection:bg-[#287A45] selection:text-white">
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
