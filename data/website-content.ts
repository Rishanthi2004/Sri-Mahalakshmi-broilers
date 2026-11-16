import { WebsiteContent } from "@/types";

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  shopName: "Sri Mahalakshmi Broilers",
  tagline: "Daily Fresh, Hygienically Cut Farm Chicken & Eggs",
  logoUrl: "",
  faviconUrl: "/favicon.ico",
  hero: {
    badge: "100% Daily Fresh Farm Supply",
    headline: "Freshly & Hygienically Cut Farm Chicken Every Morning",
    subheadline:
      "Tender curry cuts, lean boneless breast, whole chicken, and farm-fresh eggs — antibiotic-free, cleanly trimmed, and prepped fresh to your exact recipe preference.",
    bannerImage: "/images/hero-banner.jpg",
    primaryCtaText: "Explore Our Cuts",
    secondaryCtaText: "Order on WhatsApp",
  },
  featuredProductIds: ["prod-1", "prod-2", "prod-3", "prod-4", "prod-6", "prod-7"],
  whyChooseUs: [
    {
      id: "why-1",
      title: "Fresh Quality",
      description:
        "Birds arrive fresh from certified regional farms every morning and are chilled between 0°C to 4°C — never frozen, never carried over.",
      iconName: "Sparkles",
    },
    {
      id: "why-2",
      title: "Hygienic Handling",
      description:
        "Food-grade stainless steel cutting tables, sterilized knives, clean gloves, and RO purified water washing ensure pristine cleanliness.",
      iconName: "ShieldCheck",
    },
    {
      id: "why-3",
      title: "Custom Precision Cuts",
      description:
        "Cut precisely to your cooking preference (biryani, curry, fry), accurately weighed, and packed safely in leak-proof sealed trays.",
      iconName: "Award",
    },
    {
      id: "why-4",
      title: "Trusted by Families",
      description:
        "Hundreds of neighborhood families, home chefs, and caterers rely on our honest weighing, transparent service, and daily freshness.",
      iconName: "HeartHandshake",
    },
  ],
  ctaBanner: {
    headline: "Want your fresh chicken cuts prepped before you arrive?",
    description:
      "Send your preferred cut and quantity on WhatsApp — we will have it cleanly prepped, packed, and ready for instant pickup or fast delivery.",
    buttonText: "Order Instantly on WhatsApp",
  },
  about: {
    introBadge: "Traditional Quality & Trust",
    introTitle: "A Neighborhood Poultry Butcher Built on Cleanliness & Trust",
    introDescription:
      "Sri Mahalakshmi Broilers was founded on a simple promise: providing every family with hospital-grade cleanliness, transparent sourcing, and genuine care in every cut.",
    shopImage: "/images/about-shop.jpg",
    businessExperienceYears: "15+ Years",
    businessInfoTitle: "Direct Farm Sourcing to Kitchens Since 2011",
    businessInfoBody:
      "We partner directly with certified regional farms following natural grain feed and antibiotic-free standards. Birds arrive early morning, undergo strict quality checks, and are prepped hygienically in chilled rooms.",
    ownerName: "Rajesh Nair",
    ownerDesignation: "Founder & Master Butcher",
    ownerPhoto: "/images/owner-portrait.jpg",
    ownerBio:
      "With over 15 years of hands-on expertise in hygienic poultry butchery and cold-chain standards, Rajesh founded Sri Mahalakshmi Broilers as a pristine, transparent alternative to crowded markets.",
    qualityCommitment:
      "Every cut is inspected prior to weighing. Excess skin, bone splinters, and unwanted fat are trimmed away cleanly so you pay only for prime, usable meat.",
    hygienePractices:
      "Our stainless steel cutting tables are sanitized every two hours. All handlers wear food-grade hairnets, aprons, and sanitized gloves.",
    customerSatisfaction:
      "Whether it is a 250g finely minced keema for weekday dinner or 10kg party cuts for family celebrations, every single order is treated with identical high care.",
  },
  contact: {
    phone: "+91 98765 43210",
    whatsappNumber: "919876543210",
    email: "orders@greenpasturepoultry.example",
    address: "Shop No. 14, Maple Arcade, M.G. Road, Indiranagar, Bengaluru 560038",
    googleMapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru+560038",
    googleMapsEmbedPlaceholder:
      "Maple Arcade, M.G. Road, Indiranagar — 15 minutes free customer parking available right in front of the store.",
    openingHours: [
      { day: "Monday – Friday", hours: "7:00 AM – 8:30 PM" },
      { day: "Saturday", hours: "6:30 AM – 9:00 PM" },
      { day: "Sunday", hours: "6:30 AM – 2:30 PM" },
    ],
  },
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  footer: {
    description:
      "Your trusted neighborhood destination for daily fresh farm chicken, hygienic customized cuts, and healthy eggs.",
    copyrightText: "© 2026 Sri Mahalakshmi Broilers. All rights reserved.",
  },
};
