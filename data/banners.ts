import { Banner } from "@/types";

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "தினமும் காலையில் சுகாதாரமாக வெட்டப்பட்ட புதிய கோழிக்கறி",
    subtitle:
      "மென்மையான கறிக்கட், கொழுப்பற்ற எலும்பில்லா நெஞ்சுக்கறி முதல் பண்ணை முட்டைகள் வரை — உங்கள் தேவைக்கேற்ப சுத்தமாக வெட்டித் தருகிறோம்.",
    image: "/images/hero-banner.jpg",
    ctaText: "பொருட்களைப் பார்க்க",
    ctaLink: "/products",
    position: "hero_main",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-11-13T00:00:00.000Z",
    updatedAt: "2026-11-13T00:00:00.000Z",
  },
  {
    id: "banner-2",
    title: "வார இறுதி சிறப்பு: பண்ணை நாட்டுக்கோழி கறிக்கட்",
    subtitle:
      "பாரம்பரிய சுவையும் தரமும் கொண்ட நாட்டுக்கோழி ஒவ்வொரு சனி & ஞாயிறு காலை கிடைக்கும்.",
    image: "/images/float-whole-chicken.png",
    ctaText: "வாட்ஸ்அப்பில் ஆர்டர்",
    ctaLink: "/products",
    position: "promo_strip",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-11-13T00:00:00.000Z",
    updatedAt: "2026-11-13T00:00:00.000Z",
  },
];

