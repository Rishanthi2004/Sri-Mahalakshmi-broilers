import { Enquiry, MediaItem } from "@/types";

export const ENQUIRY_TRANSLATIONS: Record<string, { nameEn: string; messageEn: string }> = {
  "enq-1": {
    nameEn: "Ananya Sharma",
    messageEn:
      "Need 5 kg skinless curry cut and 2 kg boneless tikka cubes for a Saturday family feast. Can you deliver by 10 AM?",
  },
  "enq-2": {
    nameEn: "Vikram Menon",
    messageEn:
      "Can you supply weekly bulk orders of fresh chicken breast and country eggs for our fitness eatery?",
  },
  "enq-3": {
    nameEn: "Priya Deshmukh",
    messageEn:
      "Would like to inquire if traditional country chicken (Nattu Kozhi) curry cuts will be available tomorrow morning.",
  },
  "அனன்யா சர்மா": {
    nameEn: "Ananya Sharma",
    messageEn:
      "Need 5 kg skinless curry cut and 2 kg boneless tikka cubes for a Saturday family feast. Can you deliver by 10 AM?",
  },
  "விக்ரம் மேனன்": {
    nameEn: "Vikram Menon",
    messageEn:
      "Can you supply weekly bulk orders of fresh chicken breast and country eggs for our fitness eatery?",
  },
  "பிரியா தேஷ்முக்": {
    nameEn: "Priya Deshmukh",
    messageEn:
      "Would like to inquire if traditional country chicken (Nattu Kozhi) curry cuts will be available tomorrow morning.",
  },
};

export const MEDIA_TRANSLATIONS: Record<string, string> = {
  "media-1": "Fresh Poultry Showcase Display (Hero)",
  "media-2": "Hygienic Meat Counter & Prep Station",
  "media-3": "Store Founder Rajesh Nair",
  "media-4": "Curry Cut Chicken Preparation",
  "media-5": "Whole Dressed Chicken Display",
  "media-6": "Boneless Chicken Breast Fillets",
  "media-7": "Chicken Leg Pieces & Drumsticks",
  "media-8": "Boneless Chicken Tikka Cubes",
  "media-9": "Fresh Chicken Wings",
  "media-10": "Farm Fresh Brown & White Eggs",
  "புதிய கோழிக்கறி காட்சி அரங்கு (Hero)": "Fresh Poultry Showcase Display (Hero)",
  "சுகாதாரமான இறைச்சி விற்பனை கவுண்டர்": "Hygienic Meat Counter & Prep Station",
  "கடை உரிமையாளர் ராஜேஷ் நாயர்": "Store Founder Rajesh Nair",
  "கறிக்கட் சிக்கன் தயாரிப்பு": "Curry Cut Chicken Preparation",
  "முழு கோழி காட்சி": "Whole Dressed Chicken Display",
  "எலும்பில்லா சிக்கன் பிரஸ்ட் ஃபில்லட்ஸ்": "Boneless Chicken Breast Fillets",
  "சிக்கன் லெக் பீஸ் டிரம்ஸ்டிக்ஸ்": "Chicken Leg Pieces & Drumsticks",
  "எலும்பில்லா சிக்கன் டிக்கா க்யூப்ஸ்": "Boneless Chicken Tikka Cubes",
  "புதிய சிக்கன் விங்ஸ்": "Fresh Chicken Wings",
  "பண்ணை பிரவுன் & வெள்ளை முட்டைகள்": "Farm Fresh Brown & White Eggs",
};

export const USER_NAME_TRANSLATIONS: Record<string, string> = {
  "user-superadmin": "Rajesh Nair (Owner)",
  "user-demo-admin": "Store Admin (Demo)",
  "user-staff": "Pooja Sharma (Staff)",
  "demo-super-admin": "Rajesh Nair (Owner)",
  "ராஜேஷ் நாயர் (உரிமையாளர்)": "Rajesh Nair (Owner)",
  "கடை நிர்வாகி (Admin)": "Store Admin (Demo)",
  "பூஜா சர்மா (பணியாளர்)": "Pooja Sharma (Staff)",
};

export const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-1",
    customerName: "அனன்யா சர்மா",
    customerNameEn: "Ananya Sharma",
    phoneNumber: "+91 98450 11223",
    message:
      "சனிக்கிழமை குடும்ப விருந்திற்கு 5 கிலோ தோல் நீக்கிய கறிக்கட் மற்றும் 2 கிலோ எலும்பில்லா டிக்கா க்யூப்ஸ் தேவைப்படுகிறது. காலை 10 மணிக்குள் டெலிவரி செய்ய முடியுமா?",
    messageEn:
      "Need 5 kg skinless curry cut and 2 kg boneless tikka cubes for a Saturday family feast. Can you deliver by 10 AM?",
    submittedAt: "2026-11-11T09:15:00Z",
    status: "new",
  },
  {
    id: "enq-2",
    customerName: "விக்ரம் மேனன்",
    customerNameEn: "Vikram Menon",
    phoneNumber: "+91 99001 44556",
    message:
      "எங்கள் ஃபிட்னஸ் உணவகத்திற்கு வாரந்தோறும் சிக்கன் பிரஸ்ட் மற்றும் நாட்டுக்கோழி முட்டைகள் மொத்தமாக சப்ளை செய்ய இயலுமா?",
    messageEn:
      "Can you supply weekly bulk orders of fresh chicken breast and country eggs for our fitness eatery?",
    submittedAt: "2026-11-10T14:40:00Z",
    status: "contacted",
  },
  {
    id: "enq-3",
    customerName: "பிரியா தேஷ்முக்",
    customerNameEn: "Priya Deshmukh",
    phoneNumber: "+91 97312 77889",
    message:
      "நாளை காலையில் பாரம்பரிய நாட்டுக்கோழி கறிக்கட் இருப்பு இருக்குமா என்று அறிய விரும்புகிறேன்.",
    messageEn:
      "Would like to inquire if traditional country chicken (Nattu Kozhi) curry cuts will be available tomorrow morning.",
    submittedAt: "2026-11-08T11:20:00Z",
    status: "resolved",
  },
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "media-1",
    title: "புதிய கோழிக்கறி காட்சி அரங்கு (Hero)",
    titleEn: "Fresh Poultry Showcase Display (Hero)",
    url: "/images/hero-banner.jpg",
    category: "banners",
    uploadedAt: "2026-10-01T08:00:00Z",
    dimensions: "1280 × 720",
  },
  {
    id: "media-2",
    title: "சுகாதாரமான இறைச்சி விற்பனை கவுண்டர்",
    titleEn: "Hygienic Meat Counter & Prep Station",
    url: "/images/about-shop.jpg",
    category: "about",
    uploadedAt: "2026-10-02T09:30:00Z",
    dimensions: "1280 × 653",
  },
  {
    id: "media-3",
    title: "கடை உரிமையாளர் ராஜேஷ் நாயர்",
    titleEn: "Store Founder Rajesh Nair",
    url: "/images/owner-portrait.jpg",
    category: "about",
    uploadedAt: "2026-10-03T10:15:00Z",
    dimensions: "1280 × 1280",
  },
  {
    id: "media-4",
    title: "கறிக்கட் சிக்கன் தயாரிப்பு",
    titleEn: "Curry Cut Chicken Preparation",
    url: "/images/float-curry-cut.png",
    category: "products",
    uploadedAt: "2026-10-04T11:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-5",
    title: "முழு கோழி காட்சி",
    titleEn: "Whole Dressed Chicken Display",
    url: "/images/float-whole-chicken.png",
    category: "products",
    uploadedAt: "2026-10-05T12:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-6",
    title: "எலும்பில்லா சிக்கன் பிரஸ்ட் ஃபில்லட்ஸ்",
    titleEn: "Boneless Chicken Breast Fillets",
    url: "/images/float-breast.png",
    category: "products",
    uploadedAt: "2026-10-06T13:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-7",
    title: "சிக்கன் லெக் பீஸ் டிரம்ஸ்டிக்ஸ்",
    titleEn: "Chicken Leg Pieces & Drumsticks",
    url: "/images/float-legs.png",
    category: "products",
    uploadedAt: "2026-10-07T14:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-8",
    title: "எலும்பில்லா சிக்கன் டிக்கா க்யூப்ஸ்",
    titleEn: "Boneless Chicken Tikka Cubes",
    url: "/images/float-boneless.png",
    category: "products",
    uploadedAt: "2026-10-08T15:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-9",
    title: "புதிய சிக்கன் விங்ஸ்",
    titleEn: "Fresh Chicken Wings",
    url: "/images/float-wings.png",
    category: "products",
    uploadedAt: "2026-10-09T16:00:00Z",
    dimensions: "1024 × 1024",
  },
  {
    id: "media-10",
    title: "பண்ணை பிரவுன் & வெள்ளை முட்டைகள்",
    titleEn: "Farm Fresh Brown & White Eggs",
    url: "/images/float-eggs.png",
    category: "products",
    uploadedAt: "2026-10-10T17:00:00Z",
    dimensions: "1024 × 1024",
  },
];
