import { Enquiry, MediaItem } from "@/types";

export const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-1",
    customerName: "அனன்யா சர்மா",
    phoneNumber: "+91 98450 11223",
    message:
      "சனிக்கிழமை குடும்ப விருந்திற்கு 5 கிலோ தோல் நீக்கிய கறிக்கட் மற்றும் 2 கிலோ எலும்பில்லா டிக்கா க்யூப்ஸ் தேவைப்படுகிறது. காலை 10 மணிக்குள் டெலிவரி செய்ய முடியுமா?",
    submittedAt: "2026-11-11T09:15:00Z",
    status: "new",
  },
  {
    id: "enq-2",
    customerName: "விக்ரம் மேனன்",
    phoneNumber: "+91 99001 44556",
    message:
      "எங்கள் ஃபிட்னஸ் உணவகத்திற்கு வாரந்தோறும் சிக்கன் பிரஸ்ட் மற்றும் நாட்டுக்கோழி முட்டைகள் மொத்தமாக சப்ளை செய்ய இயலுமா?",
    submittedAt: "2026-11-10T14:40:00Z",
    status: "contacted",
  },
  {
    id: "enq-3",
    customerName: "பிரியா தேஷ்முக்",
    phoneNumber: "+91 97312 77889",
    message:
      "நாளை காலையில் பாரம்பரிய நாட்டுக்கோழி கறிக்கட் இருப்பு இருக்குமா என்று அறிய விரும்புகிறேன்.",
    submittedAt: "2026-11-08T11:20:00Z",
    status: "resolved",
  },
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "media-1",
    title: "புதிய கோழிக்கறி காட்சி அரங்கு (Hero)",
    url: "/images/hero-banner.jpg",
    category: "banners",
    uploadedAt: "2026-10-01T08:00:00Z",
    dimensions: "1280 × 720",
  },
  {
    id: "media-2",
    title: "சுகாதாரமான இறைச்சி விற்பனை கவுண்டர்",
    url: "/images/about-shop.jpg",
    category: "about",
    uploadedAt: "2026-10-02T09:30:00Z",
    dimensions: "1280 × 653",
  },
  {
    id: "media-3",
    title: "கடை உரிமையாளர் ராஜேஷ் நாயர்",
    url: "/images/owner-portrait.jpg",
    category: "about",
    uploadedAt: "2026-10-03T10:15:00Z",
    dimensions: "1280 × 1280",
  },
  {
    id: "media-4",
    title: "கறிக்கட் சிக்கன் தயாரிப்பு",
    url: "/images/float-curry-cut.png",
    category: "products",
    uploadedAt: "2026-10-04T11:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-5",
    title: "முழு கோழி காட்சி",
    url: "/images/float-whole-chicken.png",
    category: "products",
    uploadedAt: "2026-10-05T12:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-6",
    title: "எலும்பில்லா சிக்கன் பிரஸ்ட் ஃபில்லட்ஸ்",
    url: "/images/float-breast.png",
    category: "products",
    uploadedAt: "2026-10-06T13:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-7",
    title: "சிக்கன் லெக் பீஸ் டிரம்ஸ்டிக்ஸ்",
    url: "/images/float-legs.png",
    category: "products",
    uploadedAt: "2026-10-07T14:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-8",
    title: "எலும்பில்லா சிக்கன் டிக்கா க்யூப்ஸ்",
    url: "/images/float-boneless.png",
    category: "products",
    uploadedAt: "2026-10-08T15:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-9",
    title: "புதிய சிக்கன் விங்ஸ்",
    url: "/images/float-wings.png",
    category: "products",
    uploadedAt: "2026-10-09T16:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-10",
    title: "பண்ணை பிரவுன் & வெள்ளை முட்டைகள்",
    url: "/images/float-eggs.png",
    category: "products",
    uploadedAt: "2026-10-10T17:00:00Z",
    dimensions: "1024 × 1024",
  },
];
