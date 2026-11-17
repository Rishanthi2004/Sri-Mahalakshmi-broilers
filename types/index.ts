export type ProductAvailability = "available" | "out_of_stock";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  galleryImages: string[];
  availability: ProductAvailability;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  position: "hero_main" | "promo_strip" | "offer_popup";
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: "ShieldCheck" | "Sparkles" | "Award" | "HeartHandshake";
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
  isClosed?: boolean;
}

export interface WebsiteContent {
  shopName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    bannerImage: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  featuredProductIds: string[];
  whyChooseUs: WhyChooseUsItem[];
  ctaBanner: {
    headline: string;
    description: string;
    buttonText: string;
  };
  about: {
    introBadge: string;
    introTitle: string;
    introDescription: string;
    shopImage: string;
    businessExperienceYears: string;
    businessInfoTitle: string;
    businessInfoBody: string;
    ownerName: string;
    ownerDesignation: string;
    ownerPhoto: string;
    ownerBio: string;
    founderExperience?: string;
    founderVision?: string;
    qualityCommitment: string;
    hygienePractices: string;
    customerSatisfaction: string;
  };
  contact: {
    phone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    googleMapsUrl: string;
    googleMapsEmbedPlaceholder: string;
    openingHours: OpeningHour[];
  };
  socialLinks: SocialLinks;
  footer: {
    description: string;
    copyrightText: string;
  };
}

export type MediaCategory =
  | "products"
  | "banners"
  | "categories"
  | "about"
  | "branding";

export interface MediaItem {
  id: string;
  title: string;
  titleEn?: string;
  url: string;
  category: MediaCategory;
  uploadedAt: string;
  dimensions?: string;
}

export type EnquiryStatus = "new" | "contacted" | "resolved";

export interface Enquiry {
  id: string;
  customerName: string;
  customerNameEn?: string;
  phoneNumber: string;
  message: string;
  messageEn?: string;
  submittedAt: string;
  status: EnquiryStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "staff_admin" | string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

