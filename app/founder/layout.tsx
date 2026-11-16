import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Our Founder - Paramasivam Masanaicker | Sri Mahalakshmi Broilers",
  description:
    "Meet Paramasivam Masanaicker, Founder of Sri Mahalakshmi Broilers. 20+ years of trust, hospital-grade hygiene, and premium farm poultry supply in Namakkal.",
  openGraph: {
    title: "Paramasivam Masanaicker | Founder, Sri Mahalakshmi Broilers",
    description:
      "20+ Years in Poultry & Farming • 20+ Retail Outlets. Dedicated to farm freshness and hygiene.",
    url: "/founder",
    siteName: "Sri Mahalakshmi Broilers",
    images: [
      {
        url: "/images/founder.jpg",
        width: 800,
        height: 1000,
        alt: "Paramasivam Masanaicker - Founder, Sri Mahalakshmi Broilers",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Founder - Paramasivam Masanaicker | Sri Mahalakshmi Broilers",
    description:
      "20+ Years in Poultry & Farming • 20+ Retail Outlets. Dedicated to farm freshness and hygiene.",
    images: ["/images/founder.jpg"],
  },
};

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

