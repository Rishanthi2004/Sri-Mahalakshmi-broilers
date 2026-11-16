import { Banner } from "@/types";

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Freshly & Hygienically Cut Farm Chicken Every Morning",
    subtitle:
      "Tender curry cuts, lean boneless breast, whole chicken, and farm-fresh eggs — prepped clean to your exact preference.",
    image: "/images/hero-banner.jpg",
    ctaText: "Explore Our Cuts",
    ctaLink: "/products",
    position: "hero_main",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-11-13T00:00:00.000Z",
    updatedAt: "2026-11-13T00:00:00.000Z",
  },
  {
    id: "banner-2",
    title: "Weekend Special: Farm Fresh Country Chicken Cuts",
    subtitle:
      "Authentic country chicken (Nattu Kozhi) available fresh every Saturday & Sunday morning.",
    image: "/images/float-whole-chicken.png",
    ctaText: "Order on WhatsApp",
    ctaLink: "/products",
    position: "promo_strip",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-11-13T00:00:00.000Z",
    updatedAt: "2026-11-13T00:00:00.000Z",
  },
];
