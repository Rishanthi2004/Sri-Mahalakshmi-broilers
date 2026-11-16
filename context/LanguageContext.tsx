"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "ta" | "en";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof TRANSLATIONS["ta"]) => string;
  localizeCategoryName: (name: string) => string;
  localizeProductName: (name: string) => string;
  localizeUnit: (unit: string) => string;
  localizeDescription: (taText: string, enText?: string) => string;
}

export const TRANSLATIONS = {
  ta: {
    // Navigation
    home: "முகப்பு",
    products: "எங்கள் பொருட்கள்",
    about: "எங்களைப் பற்றி",
    contact: "தொடர்பு கொள்ள",
    admin: "நிர்வாக போர்டல்",
    orderWhatsApp: "வாட்ஸ்அப் ஆர்டர்",
    callUs: "அழையுங்கள்",
    dailyFreshSubtitle: "தினசரி புதிய கறிக்கட்டுகள்",

    // Hero
    heroBadge: "100% தினசரி புதிய பண்ணை வரவு",
    heroHeadline: "தினமும் காலையில் சுகாதாரமாக வெட்டப்பட்ட புதிய கோழிக்கறி",
    heroSubheadline:
      "மென்மையான கறிக்கட், கொழுப்பற்ற எலும்பில்லா நெஞ்சுக்கறி முதல் பண்ணை முட்டைகள் வரை.",
    heroPrimaryCta: "பொருட்களைப் பார்க்க",
    heroSecondaryCta: "வாட்ஸ்அப் ஆர்டர்",

    // Featured Showcase
    showcaseBadge: "இன்றைய புதிய வரவு",
    showcaseTitle1: "சிறப்பு",
    showcaseTitle2: "கோழிக்கறி & முட்டைகள்.",
    showcaseDesc:
      "எங்களின் மிகவும் பிரபலமான தினசரி கறிக்கட்டுகள், சுத்தமாக வெட்டப்பட்டு உடனே எடுத்துச் செல்ல அல்லது வாட்ஸ்அப் ஆர்டருக்கு தயார்.",
    showcaseAllCuts: "அனைத்து கறிக்கட்டுகளையும் காண்க",
    showcaseTouchToView: "கறிக்கட்டுகளைப் பார்க்க தொடவும்",
    inStock: "இருப்பில் உள்ளது",
    outOfStock: "இருப்பு இல்லை",
    chilledTemp: "0°C–4°C குளிரூட்டப்பட்டது",
    orderWhatsAppBtn: "வாட்ஸ்அப் ஆர்டர் செய்க",

    // Why Choose Us
    whyTitle: "குடும்பங்கள் ஏன் ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸை தேர்ந்தெடுக்கிறார்கள்?",
    whySubtitle: "எங்கள் தரக் கொள்கைகள்",
    whyDesc: "சீரான தூய்மை, நேர்மையான எடை மற்றும் தினசரி புதிய காலைப் பண்ணை வரவு.",
    whyFreshTitle: "புதிய தரம்",
    whyFreshDesc: "தினமும் காலையில் பண்ணையிலிருந்து வரும் கோழிகள் உடனே 0°C முதல் 4°C வரை குளிரூட்டப்படுகிறது — ஒருபோதும் உறைநிலையில் வைப்பதோ மறுநாள் விற்பதோ இல்லை.",
    whyHygieneTitle: "சுகாதாரமான கையாளுதல்",
    whyHygieneDesc: "உணவுத் தரம் கொண்ட துருப்பிடிக்காத ஸ்டெயின்லெஸ் ஸ்டீல் மேஜைகள், சுத்திகரிக்கப்பட்ட கத்திகள், கையுறைகள் மற்றும் RO நீரினால் கழுவப்பட்டு சுத்தம் செய்யப்படுகிறது.",
    whyServiceTitle: "தரமான சேவை",
    whyServiceDesc: "உங்கள் சமையல் முறைக்கேற்ப விரும்பிய துண்டுகளாக வெட்டி, துல்லியமாக எடைபோட்டு, பாதுகாப்பான லீக்-ப்ரூஃப் டிரேயில் பேக் செய்து தருகிறோம்.",
    whyTrustTitle: "வாடிக்கையாளர் திருப்தி",
    whyTrustDesc: "நூற்றுக்கணக்கான குடும்பங்கள், வீட்டு சமையலறைகள் மற்றும் உணவகங்கள் எங்கள் நேர்மையான விலை மற்றும் தரமான சேவையை முழுமையாக நம்புகின்றன.",

    // Call to action banner
    ctaHeadline: "நீங்கள் வருவதற்கு முன்பே கறி வெட்டித் தயார் செய்து வைக்க வேண்டுமா?",
    ctaDesc: "உங்களுக்குத் தேவையான கறிக்கட்டு வகை மற்றும் எடையை வாட்ஸ்அப்பில் அனுப்புங்கள் — உடனே சுத்தமாக வெட்டி பேக் செய்து தயார் நிலையில் வைத்திருப்போம்.",
    ctaButton: "வாட்ஸ்அப்பில் உடனே ஆர்டர் செய்க",

    // Products Page
    productsCatalogBadge: "புதிய பொருட்கள் பட்டியல்",
    productsPageTitle: "புதிய கோழிக்கறி & பண்ணை முட்டைகள்",
    productsPageDesc:
      "சுகாதாரமாக வெட்டப்பட்ட அனைத்து கறிக்கட்டுகள் மற்றும் பண்ணை முட்டைகளைப் பார்வையிடுங்கள். பிரிவு வாரியாக வடிகட்டி, வாட்ஸ்அப்பில் எளிதாக ஆர்டர் செய்யுங்கள்.",
    searchPlaceholder: "கறிக்கட்டுகளைத் தேடுங்கள்...",
    allCategories: "அனைத்தும்",
    inStockOnly: "இருப்பில் உள்ளவை மட்டும்",
    activeFilters: "தேர்வு செய்யப்பட்டவை",
    clearFilters: "வடிகட்டிகளை அழிக்க",
    noProductsFound: "பொருட்கள் எதுவும் கிடைக்கவில்லை",
    noProductsDesc: "உங்கள் தேடலுக்கு ஏற்ற கறிக்கட்டுகள் அல்லது முட்டை வகைகள் எதுவும் பொருந்தவில்லை.",
    viewAllCutsBtn: "அனைத்து கறிக்கட்டுகளையும் காண்க",
    totalProductsShown: "பொருட்கள் காட்டப்படுகின்றன",
    categoryLabel: "பிரிவு",
    resetFilter: "மீட்டமை",
    showAll: "அனைத்தையும் காட்டு",
    changeSearchOrCategory: "தேடல் வார்த்தையை மாற்றவும் அல்லது வேறு பிரிவைத் தேர்ந்தெடுக்கவும்.",

    // About Us Page
    aboutBadge: "பாரம்பரிய தரம் & நம்பிக்கை",
    aboutTitle: "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் பற்றி",
    aboutIntro:
      "ஒவ்வொரு நாளும் புதிய பண்ணை வரவு, சுகாதாரமான வெட்டுதல் முறை மற்றும் வாடிக்கையாளர் திருப்தி.",
    yearsExp: "ஆண்டுகள் நேரடி அனுபவம்",
    aboutExperience: "அனுபவம்",
    aboutChilled: "குளிரூட்டப்பட்டது",
    aboutHygienic: "சுகாதாரமானது",
    ownerTitle: "கடை உரிமையாளர் & நிர்வாகம்",
    ownerDesignation: "நிறுவனர் & தலைமை நிர்வாகி",
    qualityCommitmentTitle: "எங்கள் தர உத்தரவாதம்",
    hygieneTitle: "சுகாதார நடைமுறைகள்",
    businessInfoTag: "வணிகத் தகவல்கள்",
    meetOwnerTag: "உரிமையாளரைச் சந்தியுங்கள்",
    qualityCommitmentHeading: "தர உறுதிப்பாடு",
    hygienePracticesHeading: "சுகாதார நடைமுறைகள்",
    customerSatisfactionHeading: "வாடிக்கையாளர் திருப்தி",
    viewOurCutsBtn: "எங்கள் கறிக்கட்டுகளைப் பார்க்க",
    aboutIntroTitle: "தூய்மை மற்றும் நம்பிக்கையின் அடிப்படையில் உருவான பகுதி கோழி அங்காடி",
    aboutIntroDesc:
      "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் ஒரு எளிய வாக்குறுதியுடன் தொடங்கப்பட்டது: ஒவ்வொரு குடும்பத்திற்கும் மருத்துவமனை அளவிலான தூய்மை, வெளிப்படையான கொள்முதல் மற்றும் உண்மையான கவனிப்புடன் கோழிக்கறி கிடைக்க வேண்டும்.",
    aboutBusinessTitle: "2011 முதல் பண்ணையிலிருந்து நேரடியாக வாடிக்கையாளர்களுக்கு",
    aboutBusinessBody:
      "இயற்கையான தானிய உணவு மற்றும் ஆண்டிபயாடிக் இல்லாத நெறிமுறைகளைப் பின்பற்றும் சான்றளிக்கப்பட்ட பிராந்திய பண்ணைகளுடன் நாங்கள் நேரடியாக இணைந்துள்ளோம். தினசரி அதிகாலையில் கோழிகள் வரவழைக்கப்பட்டு, தரப் பரிசோதனைக்குப் பின் குளிரூட்டப்பட்ட அறையில் சுகாதாரமாக தயார் செய்யப்படுகின்றன.",
    aboutOwnerBio:
      "சுகாதாரமான கோழிக்கறி சில்லறை வர்த்தகம் மற்றும் கோல்ட்-செயின் உணவு கையாளுதலில் 15 ஆண்டுகளுக்கும் மேலான அனுபவம் கொண்ட ராஜேஷ், அவசர நெரிசல் நிறைந்த சந்தைகளுக்கு மாற்றாக சுத்தமான, வெளிப்படையான, வாடிக்கையாளரை முதன்மையாகக் கொண்ட ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் அங்காடியை நிறுவினார்.",
    aboutQualityCommitmentText:
      "எடை போடுவதற்கு முன்பே ஒவ்வொரு துண்டும் பரிசோதிக்கப்படுகிறது. அதிகப்படியான தோல், எலும்பு விளிம்புகள் மற்றும் தேவையற்ற கொழுப்புகளை நீக்கி, நீங்கள் செலுத்தும் பணத்திற்கு முழுமையான சதைப்பற்றான புதிய கறியை மட்டுமே வழங்குகிறோம்.",
    aboutHygieneText:
      "எங்கள் ஸ்டெயின்லெஸ் ஸ்டீல் வெட்டும் மேஜைகள் இரண்டு மணி நேரத்திற்கு ஒருமுறை கிருமிநாசினி கொண்டு தூய்மைப்படுத்தப்படுகின்றன. ஊழியர்கள் அனைவரும் தலைக்கவசம், ஏப்ரன் மற்றும் கையுறைகளை அணிகின்றனர்.",
    aboutSatisfactionText:
      "வார weekdays நாட்களில் சமைக்க 250 கிராம் பொடியாக வெட்டிய கீமாவாக இருந்தாலும், குடும்ப விசேஷங்களுக்கு 10 கிலோ கறிக்கட்டாக இருந்தாலும், ஒவ்வொரு ஆர்டரும் ஒரே உயர்ந்த தரத்துடன் கவனிக்கப்படுகிறது.",

    // Meet Our Founder & Profile
    meetOurFounder: "எங்கள் நிறுவனரைச் சந்தியுங்கள்",
    meetOurFounderBadge: "தலைமை & தொலைநோக்கு",
    meetOurFounderSubtitle: "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸின் 20+ வருட வளர்ச்சி மற்றும் தரத்தின் பின்னணியில் உள்ள தொலைநோக்கு",
    founderDesignationDefault: "நிறுவனர், ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ்",
    founderExperienceDefault: "கோழிப்பண்ணைத் துறையில் 20+ வருட அனுபவம் • 20+ கிளைகள்",
    founderVisionTitle: "நிறுவனரின் தொலைநோக்கு பார்வை",
    founderVisionDefault:
      "ஒவ்வொரு குடும்பத்திற்கும் தூய்மையான, மருத்துவமனை அளவிலான சுகாதாரத்துடன் கூடிய பண்ணைக் கோழிக்கறியை நேர்மையான விலையில் தினசரி வழங்குவதே எங்கள் இலக்கு.",
    founderBioDefault:
      "கோழிப்பண்ணைத் துறையில் 20 ஆண்டுகளுக்கும் மேலான அனுபவத்துடனும், 20-க்கும் மேற்பட்ட கிளைகளின் விரிவான வலையமைப்புடனும் எங்கள் பயணம் எப்போதும் ஒரு வலுவான அடித்தளத்தின் மீதே கட்டமைக்கப்பட்டுள்ளது — நம்பிக்கை மற்றும் தரம். உங்கள் நம்பிக்கையே எங்கள் பலம், உங்களுக்கு இன்னும் சிறப்பாகச் சேவையாற்றுவதே எங்கள் உறுதிப்பாடு. எங்கள் பயணத்தின் ஒரு பகுதியாக இருப்பதற்கு நன்றி.",
    shareFounderProfile: "நிறுவனர் சுயவிவரத்தைப் பகிரவும்",
    shareFounderModalTitle: "நிறுவனர் சுயவிவரத்தைப் பகிருங்கள்",
    shareFounderModalDesc: "ஸ்ரீ மகாலட்சுமி பிராய்லர்ஸ் நிறுவனர் திரு. பரமசிவம் மாசாநாயக்கர் அவர்களின் சுயவிவரத்தை வாட்ஸ்அப் அல்லது சமூக வலைத்தளங்களில் பகிருங்கள்.",
    shareViaWhatsApp: "வாட்ஸ்அப்பில் பகிர்க",
    copyFounderLink: "சுயவிவர இணைப்பை நகலெடு",
    founderLinkCopied: "இணைப்பு நகலெடுக்கப்பட்டது!",
    nativeShareBtn: "பிற வழிகளில் பகிர்க",
    nativeShareFallbackNotice: "இந்த உலாவியில் நேரடி பகிர்வு இல்லை. இணைப்பு நகலெடுக்கப்பட்டது!",
    viewFullFounderProfile: "முழு சுயவிவரப் பக்கம்",
    backToAbout: "எங்களைப் பற்றி பக்கத்திற்குத் திரும்புக",
    founderBreadcrumb: "நிறுவனர் சுயவிவரம்",
    founderCorePrinciples: "முக்கிய வழிகாட்டும் கோட்பாடுகள்",
    founderPrinciple1Title: "சமரசம் இல்லாத சுகாதாரம்",
    founderPrinciple1Desc: "அனைத்து கடைகளிலும் நவீன ஸ்டெயின்லெஸ் ஸ்டீல் வெட்டும் தளங்கள் மற்றும் RO நீரினால் சுத்திகரிக்கப்படுகிறது.",
    founderPrinciple2Title: "தினசரி புதிய பண்ணை வரவு",
    founderPrinciple2Desc: "நேரடியாக பண்ணையிலிருந்து அதிகாலையில் வரும் ஆரோக்கியமான கோழிகள் மட்டுமே விற்பனைக்கு வைக்கப்படுகின்றன.",
    founderPrinciple3Title: "நேர்மையான எடை & சேவை",
    founderPrinciple3Desc: "துல்லியமான டிஜிட்டல் எடை மற்றும் வாடிக்கையாளர் விருப்பத்திற்கேற்ப பிரத்யேக கறிக்கட்டுகள்.",
    founderPrinciple4Title: "வாடிக்கையாளர் நம்பிக்கை",
    founderPrinciple4Desc: "20 ஆண்டுகளுக்கும் மேலாக ஆயிரக்கணக்கான குடும்பங்களின் நம்பிக்கையைப் பெற்ற நற்பெயர்.",
    founderBioLabel: "வாழ்க்கை வரலாறு & பயணம்",
    founderOfficeAddress: "அலுவலக முகவரி",
    founderContactNo: "தொடர்பு எண்",

    // Contact Page
    contactBadge: "நேரடி தொடர்பு & கடை அமைவிடம்",
    contactTitle: "தொடர்பு கொள்ள",
    contactSubtitle: "நேரடி வாங்குதல், வாட்ஸ்அப் ஆர்டர் மற்றும் மொத்த ஆர்டர்களுக்கு எங்களை அணுகவும்.",
    sendEnquiryTitle: "எங்களுக்கு செய்தி அனுப்புங்கள்",
    sendEnquirySubtitle: "உங்கள் கருத்துக்கள் அல்லது பிரத்யேக ஆர்டர் விவரங்களை கீழே உள்ளிடவும்.",
    fullNameLabel: "முழு பெயர்",
    fullNamePlaceholder: "உங்கள் பெயர் (எ.கா. கார்த்திக்)",
    phoneLabel: "அலைபேசி எண்",
    phonePlaceholder: "10 இலக்க எண் (எ.கா. 98765 43210)",
    messageLabel: "செய்தி / ஆர்டர் விவரங்கள்",
    messagePlaceholder: "உங்களுக்கு தேவையான கறிக்கட்டு அல்லது முட்டை அளவு...",
    sendMessageBtn: "செய்தியை அனுப்பவும்",
    sendingBtn: "அனுப்பப்படுகிறது...",
    enquirySuccessTitle: "உங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!",
    enquirySuccessDesc: "எங்கள் குழுவினர் விரைவில் உங்களைத் தொடர்பு கொள்வார்கள்.",
    sendAnotherBtn: "மற்றொரு செய்தி அனுப்ப",
    openingHoursTitle: "வேலை நேரம்",
    allDaysOpen: "வாரத்தின் அனைத்து நாட்களும் திறந்திருக்கும்",
    openNow: "தற்போது திறந்துள்ளது",
    getDirectionsBtn: "கூகுள் மேப்ஸில் வழிகாட்டல்",
    contactPhoneLabel: "தொலைபேசி",
    contactWhatsAppLabel: "வாட்ஸ்அப்",
    contactAddressLabel: "முகவரி",
    contactCallNow: "உடனே அழைக்க",
    contactCallShort: "அழைக்க",
    contactDirections: "வழித்தடம்",
    contactClosed: "விடுமுறை",
    contactStoreAddress: "EB காலனி பஸ் ஸ்டாப், பரமத்தி ரோடு, நாமக்கல்",
    contactTagline: "தினசரி புதிய, சுகாதாரமாக வெட்டப்பட்ட பண்ணை சிக்கன் & முட்டைகள்",
    contactEnquirySubmitted: "விசாரணை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    contactStaffWillContact: "எங்கள் கடை ஊழியர்கள் விரைவில் உங்களைத் தொடர்புகொள்வார்கள்.",
    contactNameRequired: "உங்கள் முழு பெயரை உள்ளிடவும்.",
    contactPhoneRequired: "சரியான அலைபேசி எண்ணை உள்ளிடவும் (8–15 இலக்கங்கள்).",
    contactMessageRequired: "தயவுசெய்து உங்கள் செய்தி அல்லது ஆர்டர் விவரங்களை உள்ளிடவும்.",
    contactQuickMsg: "தினசரி புதிய இறைச்சி பெற எங்கள் கடைக்கு நேரில் வரலாம், அழைத்துப் பேசலாம் அல்லது வாட்ஸ்அப் மூலம் உடனடியாக ஆர்டர் செய்யலாம்.",

    // Footer
    footerTagline: "தினசரி புதிய பண்ணைக் கோழிக்கறி, சுகாதாரமான கறிக்கட்டுகள் மற்றும் பண்ணை முட்டைகள்.",
    quickLinks: "விரைவு இணைப்புகள்",
    storeLocation: "கடை முகவரி",
    workingHours: "வேலை நேரம்",
    copyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    adminLink: "நிர்வாக உள்நுழைவு",
    languageChoice: "மொழி / Language",

    // Admin Common
    adminDashboard: "கட்டுப்பாட்டு அறை",
    adminProducts: "பொருட்கள் மேலாண்மை",
    adminCategories: "பிரிவுகள்",
    adminBanners: "பேனர்கள்",
    adminMedia: "ஊடக நூலகம்",
    adminContent: "வலைத்தள உள்ளடக்கம்",
    adminEnquiries: "விசாரணைகள்",
    adminUsers: "நிர்வாக பயனர்கள்",
    adminSettings: "அமைப்புகள்",
    adminLiveStore: "நேரலை கடையைக் காண்க",
    adminLogout: "வெளியேறு",
    adminSuperAdmin: "முதன்மை நிர்வாகி",
    adminStaff: "பணியாளர்",
    demoModeText: "டெமோ பயன்முறை • DEMO MODE",
    demoVersion: "டெமோ பதிப்பு",
    adminLoginTitle: "நிர்வாகி உள்நுழைவு",
    adminLoginSubtitle: "கோழி அங்காடி மேலாண்மை மற்றும் சரக்கு இருப்பு கட்டுப்பாட்டு அறை.",
    loginBtn: "நிர்வாகப் பலகையில் உள்நுழைக",
    quickLoginTitle: "விரைவு டெமோ உள்நுழைவு (1-கிளிக்)",
  },
  en: {
    // Navigation
    home: "Home",
    products: "Our Products",
    about: "About Us",
    contact: "Contact Us",
    admin: "Admin Portal",
    orderWhatsApp: "WhatsApp Order",
    callUs: "Call Us",
    dailyFreshSubtitle: "Daily Fresh Farm Cuts",

    // Hero
    heroBadge: "100% Daily Fresh Farm Supply",
    heroHeadline: "Freshly & Hygienically Cut Farm Chicken Every Morning",
    heroSubheadline:
      "Tender curry cuts, lean boneless breast, whole chicken and farm fresh eggs.",
    heroPrimaryCta: "Explore Our Cuts",
    heroSecondaryCta: "WhatsApp Order",

    // Featured Showcase
    showcaseBadge: "Today's Fresh Cut Showcase",
    showcaseTitle1: "Featured",
    showcaseTitle2: "Chicken Cuts & Eggs.",
    showcaseDesc:
      "Our most popular daily cuts, cleanly prepped and ready for immediate in-store pick-up or fast WhatsApp delivery.",
    showcaseAllCuts: "View All Cuts",
    showcaseTouchToView: "Tap cuts to preview",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    chilledTemp: "Chilled 0°C–4°C",
    orderWhatsAppBtn: "Order on WhatsApp",

    // Why Choose Us
    whyTitle: "Why Families Choose Sri Mahalakshmi Broilers?",
    whySubtitle: "Our Quality Standards",
    whyDesc: "Consistent cleanliness, transparent weight, and fresh daily farm arrivals every single morning.",
    whyFreshTitle: "Fresh Quality",
    whyFreshDesc: "Farm chickens arriving fresh every morning and kept chilled at 0°C–4°C — never frozen, never carried over.",
    whyHygieneTitle: "Hygienic Handling",
    whyHygieneDesc: "Food-grade stainless steel cutting tables, sterilized knives, gloves, and RO purified water washing.",
    whyServiceTitle: "Custom Precision Cuts",
    whyServiceDesc: "Cut precisely to your recipe preference, accurately weighed, and packed in leak-proof sealed trays.",
    whyTrustTitle: "Family Trust",
    whyTrustDesc: "Hundreds of families and home chefs rely on our honest weighing, clean standards, and daily freshness.",

    // Call to action banner
    ctaHeadline: "Want your fresh chicken cuts prepped before you arrive?",
    ctaDesc: "Send your preferred cut and weight on WhatsApp — we'll cut, pack, and have it ready for instant pickup or delivery.",
    ctaButton: "Order Instantly on WhatsApp",

    // Products Page
    productsCatalogBadge: "Fresh Cuts Catalog",
    productsPageTitle: "Fresh Farm Chicken & Healthy Eggs",
    productsPageDesc:
      "Browse our complete range of cleanly cut chicken and farm eggs. Filter by cut category and order effortlessly via WhatsApp.",
    searchPlaceholder: "Search fresh cuts...",
    allCategories: "All Categories",
    inStockOnly: "In Stock Only",
    activeFilters: "Active Filters",
    clearFilters: "Clear Filters",
    noProductsFound: "No Products Found",
    noProductsDesc: "No chicken cuts or egg packages match your search filter criteria.",
    viewAllCutsBtn: "View All Cuts",
    totalProductsShown: "products displayed",
    categoryLabel: "Category",
    resetFilter: "Reset",
    showAll: "Show All",
    changeSearchOrCategory: "Try modifying your search query or selecting a different category.",

    // About Us Page
    aboutBadge: "Traditional Quality & Trust",
    aboutTitle: "About Sri Mahalakshmi Broilers",
    aboutIntro:
      "Daily fresh farm sourcing, hygienic cutting standards, and dedicated customer satisfaction.",
    yearsExp: "Years Direct Experience",
    aboutExperience: "Experience",
    aboutChilled: "Chilled Fresh",
    aboutHygienic: "100% Hygienic",
    ownerTitle: "Store Owner & Management",
    ownerDesignation: "Founder & Chief Executive",
    qualityCommitmentTitle: "Our Quality Commitment",
    hygieneTitle: "Hygiene Standards",
    businessInfoTag: "Business Heritage",
    meetOwnerTag: "Meet The Owner",
    qualityCommitmentHeading: "Quality Commitment",
    hygienePracticesHeading: "Hygiene Standards",
    customerSatisfactionHeading: "Customer Satisfaction",
    viewOurCutsBtn: "Explore Our Cuts",
    aboutIntroTitle: "A Neighborhood Poultry Butcher Built on Cleanliness & Trust",
    aboutIntroDesc:
      "Sri Mahalakshmi Broilers was founded on a simple promise: providing every family with hospital-grade cleanliness, transparent sourcing, and genuine care in every cut.",
    aboutBusinessTitle: "Direct Farm Sourcing to Kitchens Since 2011",
    aboutBusinessBody:
      "We partner directly with certified regional farms following natural grain feed and antibiotic-free standards. Birds arrive early morning, undergo strict quality checks, and are prepped hygienically in chilled rooms.",
    aboutOwnerBio:
      "With over 15 years of hands-on expertise in hygienic poultry butchery and cold-chain standards, Rajesh founded Sri Mahalakshmi Broilers as a pristine, transparent alternative to crowded markets.",
    aboutQualityCommitmentText:
      "Every cut is inspected prior to weighing. Excess skin, bone splinters, and unwanted fat are trimmed away cleanly so you pay only for prime, usable meat.",
    aboutHygieneText:
      "Our stainless steel cutting tables are sanitized every two hours. All handlers wear food-grade hairnets, aprons, and sanitized gloves.",
    aboutSatisfactionText:
      "Whether it is a 250g finely minced keema for weekday dinner or 10kg party cuts for family celebrations, every single order is treated with identical high care.",

    // Meet Our Founder & Profile
    meetOurFounder: "Meet Our Founder",
    meetOurFounderBadge: "Leadership & Vision",
    meetOurFounderSubtitle: "The vision, integrity, and dedication driving over two decades of poultry excellence",
    founderDesignationDefault: "Founder, Sri Mahalakshmi Broilers",
    founderExperienceDefault: "20+ Years in Poultry & Farming • 20+ Retail Outlets",
    founderVisionTitle: "Founder's Vision",
    founderVisionDefault:
      "To provide hospital-grade cleanliness, 100% daily farm freshness, and ethical poultry care to every neighborhood family at fair prices.",
    founderBioDefault:
      "With over 20 years of experience in the poultry industry and a growing network of 20+ chicken shops, our journey has always been built on one foundation — Trust and Quality. Your trust is our strength, and serving you better is our commitment. Thank you for being part of our journey.",
    shareFounderProfile: "Share Founder Profile",
    shareFounderModalTitle: "Share Founder Profile",
    shareFounderModalDesc: "Share the profile of Paramasivam Masanaicker, Founder of Sri Mahalakshmi Broilers, across WhatsApp and social platforms.",
    shareViaWhatsApp: "Share on WhatsApp",
    copyFounderLink: "Copy Profile Link",
    founderLinkCopied: "Link Copied!",
    nativeShareBtn: "More Share Options",
    nativeShareFallbackNotice: "Native share unavailable on this device. Link copied to clipboard!",
    viewFullFounderProfile: "View Full Profile",
    backToAbout: "Back to About Us",
    founderBreadcrumb: "Founder Profile",
    founderCorePrinciples: "Core Guiding Principles",
    founderPrinciple1Title: "Uncompromising Hygiene",
    founderPrinciple1Desc: "Food-grade stainless steel preparation tables, sterile knives, and RO purified water washing in every outlet.",
    founderPrinciple2Title: "Daily Morning Farm Supply",
    founderPrinciple2Desc: "Direct farm sourcing every dawn, strictly chilled between 0°C–4°C and never carried over.",
    founderPrinciple3Title: "Honest Weighing & Custom Cuts",
    founderPrinciple3Desc: "Accurate digital scales and precision cuts tailored to your family's favorite recipes.",
    founderPrinciple4Title: "Deep Community Trust",
    founderPrinciple4Desc: "Built on 20+ years of relentless customer care, family relationships, and reliable service.",
    founderBioLabel: "Biography & Journey",
    founderOfficeAddress: "Office Address",
    founderContactNo: "Contact No",

    // Contact Page
    contactBadge: "Direct Contact & Location",
    contactTitle: "Contact Us",
    contactSubtitle: "Reach out to us for in-store purchases, WhatsApp delivery, and bulk poultry orders.",
    sendEnquiryTitle: "Send Us a Message",
    sendEnquirySubtitle: "Enter your feedback, custom cut requirements, or general enquiries below.",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Your Name (e.g. Karthik)",
    phoneLabel: "Phone Number",
    phonePlaceholder: "10-digit number (e.g. 98765 43210)",
    messageLabel: "Message / Order Details",
    messagePlaceholder: "Mention required cuts, quantity, or questions...",
    sendMessageBtn: "Send Message",
    sendingBtn: "Sending...",
    enquirySuccessTitle: "Your Message Has Been Sent!",
    enquirySuccessDesc: "Our team will review your enquiry and get back to you promptly.",
    sendAnotherBtn: "Send Another Message",
    openingHoursTitle: "Opening Hours",
    allDaysOpen: "Open All 7 Days a Week",
    openNow: "Open Now",
    getDirectionsBtn: "Get Directions on Google Maps",
    contactPhoneLabel: "Phone",
    contactWhatsAppLabel: "WhatsApp",
    contactAddressLabel: "Store Address",
    contactCallNow: "Call Now",
    contactCallShort: "Call",
    contactDirections: "Directions",
    contactClosed: "Closed",
    contactStoreAddress: "EB Colony Bus stop, Paramathi Road, Namakkal",
    contactTagline: "Daily fresh, hygienically prepped farm chicken & eggs",
    contactEnquirySubmitted: "Enquiry submitted successfully!",
    contactStaffWillContact: "Our store staff will contact you shortly.",
    contactNameRequired: "Please enter your full name.",
    contactPhoneRequired: "Please enter a valid phone number (8–15 digits).",
    contactMessageRequired: "Please enter your message or order cut details.",
    contactQuickMsg: "Visit our butcher counter for fresh cuts, call us directly, or order instantly via WhatsApp.",

    // Footer
    footerTagline: "Daily fresh farm chicken, hygienic customized cuts, and healthy eggs.",
    quickLinks: "Quick Links",
    storeLocation: "Store Address",
    workingHours: "Working Hours",
    copyright: "All rights reserved.",
    adminLink: "Admin Portal",
    languageChoice: "Language / மொழி",

    // Admin Common
    adminDashboard: "Dashboard",
    adminProducts: "Products",
    adminCategories: "Categories",
    adminBanners: "Banners",
    adminMedia: "Media Library",
    adminContent: "Website Content",
    adminEnquiries: "Enquiries",
    adminUsers: "Admin Users",
    adminSettings: "Settings",
    adminLiveStore: "View Live Store",
    adminLogout: "Logout",
    adminSuperAdmin: "Super Admin",
    adminStaff: "Staff Admin",
    demoModeText: "DEMO MODE",
    demoVersion: "Demo Version",
    adminLoginTitle: "Admin Sign In",
    adminLoginSubtitle: "Chicken shop management & inventory control portal.",
    loginBtn: "Sign in to Dashboard",
    quickLoginTitle: "Quick Demo Sign In (1-Click)",
  },
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "முழு கோழி (Whole Chicken)": "Whole Chicken",
  "கறிக்கட் சிக்கன் (Curry Cut)": "Curry Cut Chicken",
  "எலும்பில்லா சிக்கன் (Boneless)": "Boneless Chicken",
  "சிக்கன் பிரஸ்ட் (Chicken Breast)": "Chicken Breast",
  "சிக்கன் லெக் பீஸ் (Chicken Legs)": "Chicken Leg Pieces",
  "சிக்கன் விங்ஸ் (Chicken Wings)": "Chicken Wings",
  "பண்ணை முட்டைகள் (Farm Fresh Eggs)": "Farm Fresh Eggs",
  "நாட்டுக்கோழி முட்டை (Country Eggs)": "Farm Fresh Country Eggs",
  "புதிய கோழிக்கறி": "Fresh Farm Chicken",
  "முழு கோழி": "Whole Chicken",
  "கறிக்கட் சிக்கன்": "Curry Cut Chicken",
  "எலும்பில்லா சிக்கன்": "Boneless Chicken",
  "சிக்கன் பிரஸ்ட்": "Chicken Breast",
  "சிக்கன் லெக் பீஸ்": "Chicken Leg Pieces",
  "சிக்கன் விங்ஸ்": "Chicken Wings",
  "பண்ணை முட்டைகள்": "Farm Fresh Eggs",
};

const PRODUCT_TRANSLATIONS: Record<string, string> = {
  "பண்ணை புதிய கறிக்கட் சிக்கன் (தோல் நீக்கியது)": "Farm Fresh Curry Cut Chicken (Skinless)",
  "ப்ரீமியம் எலும்பில்லா சிக்கன் பிரஸ்ட்": "Premium Boneless Chicken Breast",
  "முழு கோழி (தோலுடன் சுத்தம் செய்யப்பட்டது)": "Whole Cleaned Chicken (Skin-on)",
  "சுவையான சிக்கன் லெக் பீஸ் (டிரம்ஸ்டிக்ஸ்)": "Juicy Chicken Drumsticks",
  "சிக்கன் லெக் பீஸ் (டிரம்ஸ்டிக்ஸ் & தொடை)": "Chicken Drumsticks & Thigh Cuts",
  "எலும்பில்லா சிக்கன் டிக்கா க்யூப்ஸ்": "Boneless Chicken Tikka Cubes",
  "எலும்பில்லா சிக்கன் க்யூப்ஸ் (டிக்கா & ஃப்ரை)": "Tender Boneless Chicken Cubes",
  "புதிய முழு சிக்கன் விங்ஸ் (இறக்கைகள்)": "Fresh Whole Chicken Wings",
  "சிக்கன் விங்ஸ் (சூப் & ஃப்ரைக்கு சிறந்தது)": "Chicken Wings (Prime Cut)",
  "இயற்கை நாட்டுக்கோழி பிரவுன் முட்டைகள்": "Free-Range Brown Country Eggs",
  "பண்ணை புதிய நாட்டுக்கோழி முட்டைகள் (6 முட்டைகள் பேக்)": "Farm Fresh Country Eggs (Pack of 6)",
  "தினசரி பண்ணை வெள்ளை முட்டைகள் (தட்டு)": "Classic White Farm Eggs (Tray)",
  "பண்ணை முட்டைகள் (30 முட்டைகள் ட்ரே)": "Farm Fresh Eggs (Tray of 30)",
  "முழு கோழி (தோல் நீக்கியது)": "Skinless Whole Dressed Chicken",
  "பாரம்பரிய நாட்டுக்கோழி கறிக்கட்": "Authentic Country Chicken Curry Cut",
  "நாட்டுக்கோழி கறிக்கட் (பாரம்பரிய சுவை)": "Country Chicken Curry Cut (Nattu Kozhi)",
  "மசாலா ஊறவைத்த தந்தூரி லெக் குவார்ட்டர்ஸ்": "Marinated Tandoori Leg Quarters",
  "புதிய சிக்கன் ஈரல் (சுத்தம் செய்யப்பட்டது)": "Fresh Cleaned Chicken Liver",
  "சிக்கன் ஈரல் & கிட்னி (புதிய வரவு)": "Fresh Chicken Liver & Gizzard",
  "எலும்பில்லா சிக்கன் தொடைக்கறி (தாய் ஃபில்லட்ஸ்)": "Boneless Chicken Thigh Fillets",
  "மசாலா பார்ட்டி விங்ஸ் (வரைவு)": "Seasoned Party Wings",
  "சிக்கன் லொலிபாப் பீஸ்": "Chicken Lollipop Cuts",
  "சிக்கன் கீமா (கொத்துக்கறி)": "Fresh Minced Chicken (Keema)",
};

const UNIT_TRANSLATIONS: Record<string, string> = {
  "1 கிலோ": "1 Kg",
  "500 கிராம்": "500 g",
  "சுமார் 1.4 கிலோ": "Approx 1.4 Kg",
  "சுமார் 1.2 கிலோ": "Approx 1.2 Kg",
  "500 கிராம் (5–6 துண்டுகள்)": "500 g (5–6 pcs)",
  "500 கிராம் (5-6 துண்டுகள்)": "500 g (5–6 pcs)",
  "6 முட்டைகள் பேக்": "Pack of 6 Eggs",
  "12 முட்டைகள் பேக்": "Pack of 12 Eggs",
  "6 முட்டைகள்": "6 Pieces",
  "30 முட்டைகள் (1 ட்ரே)": "30 Pieces (1 Tray)",
  "1 ட்ரே (30 முட்டைகள்)": "1 Tray (30 Eggs)",
};

const PRODUCT_DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  "12 முதல் 16 சீரான எலும்புடன் கூடிய துண்டுகள். அதிகப்படியான கொழுப்புகள் நீக்கப்பட்டு, உடனே சமைக்க ஏற்றவாறு சுகாதாரமாக தயார் செய்யப்பட்டது.":
    "12 to 16 uniform bone-in pieces. Excess fat and skin trimmed away, hygienically prepped and ready to cook.",
  "கொழுப்பற்ற, அதிக புரதம் கொண்ட தோல் நீக்கப்பட்ட சிக்கன் நெஞ்சுக்கறி. உடற்பயிற்சி உணவு, கிரில் மற்றும் சாலட்களுக்கு மிகவும் சிறந்தது.":
    "Lean, high-protein skinless chicken breast fillet. Perfect for healthy fitness diets, grilling, and fresh salads.",
  "முழுமையாக சுத்தம் செய்யப்பட்டு, இயற்கையான சாறுத்தன்மை மாறாமல் குளிரூட்டப்பட்ட முழு கோழி - முழு ரோஸ்ட் மற்றும் தனிப்பயன் வெட்டுகளுக்கு ஏற்றது.":
    "Fully cleaned, juicy whole dressed chicken with skin on — ideal for whole roasts, tandoori, and custom home carving.",
  "தந்தூரி, ஓவன் பேக்கிங் அல்லது க்ரிஸ்பி ஃப்ரை செய்ய ஏற்றவாறு சுத்தமாக செதுக்கப்பட்ட சுவையான கீழ் தொடைக்கறி துண்டுகள்.":
    "Juicy, cleanly trimmed drumsticks and leg portions. Ideal for tandoori, oven roasting, or crispy frying.",
  "சீரான அளவில் வெட்டப்பட்ட எலும்பில்லா சிக்கன் துண்டுகள். சிக்கன் டிக்கா, கபாப், ஃப்ரைடு ரைஸ் மற்றும் பிரியாணிக்கு உடனடியாக சமைக்க தயார்.":
    "Uniform bite-sized boneless chicken cubes. Ready to marinate for tikka, kebabs, fried rice, and biryani.",
  "பார்பிக்யூ சாஸ், ஹாட் விங்ஸ் மற்றும் ஏர் ஃப்ரை ஸ்நாக்ஸுக்கு ஏற்ற சதைப்பற்றுள்ள புதிய சிக்கன் இறக்கைகள்.":
    "Meaty, fresh chicken wings perfect for BBQ glaze, hot wings, and crispy air-fryer appetizers.",
  "இயற்கையான முறையில் வளர்க்கப்பட்ட கோழிகளிலிருந்து பெறப்படும் ஆரோக்கியமான, சத்துமிக்க நாட்டுக்கோழி முட்டைகள்.":
    "Healthy, nutrient-rich free-range brown farm eggs sourced from trusted country poultry farms.",
  "தினசரி புதிய பண்ணை வரவு. சுத்தமான ஓடுகள் மற்றும் சீரான தரம் கொண்ட ஆரோக்கியமான பண்ணை முட்டைகள்.":
    "Daily fresh farm arrival. Clean shells, consistent high grade, and wholesome everyday eggs.",
  "ஆர்டரின் பேரில் உடனே தயார் செய்து தரப்படும் தோல் நீக்கிய சுத்தமான முழு கோழி - வீடுகளில் உங்கள் விருப்பப்படி வெட்ட சிறந்தது.":
    "Hygienically dressed skinless whole chicken prepared fresh to order — ready for custom home carving.",
  "பாரம்பரிய கிராமத்து சுவையும் கெட்டியான சதையும் கொண்ட நாட்டுக்கோழி கறி - மெதுவாக வேகவைத்து சமைக்கும் குழம்புகளுக்கு மிகச்சிறந்தது.":
    "Authentic country chicken (Nattu Kozhi) with robust texture and traditional rich flavor — ideal for slow-cooked curries.",
  "முழு தொடை மற்றும் லெக் துண்டுகள் நம் கைமண மசாலாக்களுடன் ஊறவைக்கப்பட்டு கிரில் அல்லது தந்தூரி செய்ய தயார்.":
    "Whole chicken leg and thigh quarters pre-marinated in house spices, ready for oven roasting or tandoori grilling.",
  "இரும்புச்சத்து நிறைந்த, சுகாதாரமாக சுத்தம் செய்யப்பட்டு குளிரூட்டப்பட்ட டிரேயில் பேக் செய்யப்பட்ட புதிய கோழி ஈரல்.":
    "Iron-rich, cleanly washed and chilled chicken liver packed safely in hygienic leak-proof trays.",
  "இயற்கையான சாறுத்தன்மை கொண்ட தோல் மற்றும் எலும்பு நீக்கிய தொடைக்கறி - அதிக சுவையும் மென்மையும் கொண்டது.":
    "Juicy skinless, boneless chicken thigh fillets — tender, flavorful, and succulent when seared or braised.",
  "வார இறுதி சிறப்பு சலுகைக்காக மூலிகைகள் மற்றும் மிளகு கலவையில் ஊறவைக்கப்பட்ட புதிய சிக்கன் விங்ஸ் துண்டுகள்.":
    "Weekend special marinated wings tossed in aromatic herbs and cracked pepper blend.",
};

const CATEGORY_EN_TO_TA: Record<string, string> = {
  "Whole Chicken": "முழு கோழி",
  "Curry Cut Chicken": "கறிக்கட் சிக்கன்",
  "Boneless Chicken": "எலும்பில்லா சிக்கன்",
  "Chicken Breast": "சிக்கன் பிரஸ்ட்",
  "Chicken Leg Pieces": "சிக்கன் லெக் பீஸ்",
  "Chicken Wings": "சிக்கன் விங்ஸ்",
  "Farm Fresh Eggs": "பண்ணை முட்டைகள்",
  "Farm Fresh Country Eggs": "நாட்டுக்கோழி முட்டை",
  "Fresh Farm Chicken": "புதிய கோழிக்கறி",
  "Other Cuts & Organs": "இதர பாகங்கள்",
};

const PRODUCT_EN_TO_TA: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_TRANSLATIONS).map(([ta, en]) => [en, ta])
);

const UNIT_EN_TO_TA: Record<string, string> = Object.fromEntries(
  Object.entries(UNIT_TRANSLATIONS).map(([ta, en]) => [en, ta])
);

const PRODUCT_DESCRIPTION_EN_TO_TA: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_DESCRIPTION_TRANSLATIONS).map(([ta, en]) => [en, ta])
);

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = "gp_poultry_lang_v2";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === "en" || saved === "ta") {
        setLangState(saved);
        document.documentElement.lang = saved;
      } else {
        setLangState("en");
        document.documentElement.lang = "en";
      }
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    try {
      window.localStorage.setItem(STORAGE_LANG_KEY, lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === "ta" ? "en" : "ta");
  };

  const t = (key: keyof typeof TRANSLATIONS["ta"]): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || TRANSLATIONS.ta[key] || "";
  };

  const localizeCategoryName = (name: string): string => {
    if (!name) return "";
    const trimmed = name.trim();
    if (language === "en") {
      if (CATEGORY_TRANSLATIONS[trimmed]) return CATEGORY_TRANSLATIONS[trimmed];
      const match = trimmed.match(/\(([^)]+)\)/);
      if (match && match[1]) return match[1].trim();
      return trimmed;
    } else {
      if (CATEGORY_EN_TO_TA[trimmed]) return CATEGORY_EN_TO_TA[trimmed];
      for (const [enKey, taVal] of Object.entries(CATEGORY_EN_TO_TA)) {
        if (trimmed.toLowerCase().includes(enKey.toLowerCase())) {
          return taVal;
        }
      }
      return trimmed;
    }
  };

  const localizeProductName = (name: string): string => {
    if (!name) return "";
    const trimmed = name.trim();
    if (language === "en") {
      if (PRODUCT_TRANSLATIONS[trimmed]) return PRODUCT_TRANSLATIONS[trimmed];
      for (const [taKey, enVal] of Object.entries(PRODUCT_TRANSLATIONS)) {
        if (trimmed.includes(taKey) || taKey.includes(trimmed)) {
          return enVal;
        }
      }
      return trimmed;
    } else {
      if (PRODUCT_EN_TO_TA[trimmed]) return PRODUCT_EN_TO_TA[trimmed];
      for (const [enKey, taVal] of Object.entries(PRODUCT_EN_TO_TA)) {
        if (trimmed.toLowerCase().includes(enKey.toLowerCase()) || enKey.toLowerCase().includes(trimmed.toLowerCase())) {
          return taVal;
        }
      }
      return trimmed;
    }
  };

  const localizeUnit = (unit: string): string => {
    if (!unit) return "";
    const trimmed = unit.trim();
    if (language === "en") {
      if (UNIT_TRANSLATIONS[trimmed]) return UNIT_TRANSLATIONS[trimmed];
      return trimmed
        .replace(/கிலோ/g, "Kg")
        .replace(/கிராம்/g, "g")
        .replace(/சுமார்/g, "Approx")
        .replace(/துண்டுகள்/g, "Pieces")
        .replace(/முட்டைகள்/g, "Eggs")
        .replace(/பேக்/g, "Pack")
        .replace(/ட்ரே/g, "Tray")
        .replace(/தட்டு/g, "Tray");
    } else {
      if (UNIT_EN_TO_TA[trimmed]) return UNIT_EN_TO_TA[trimmed];
      return trimmed
        .replace(/Approx/gi, "சுமார்")
        .replace(/Kg/gi, "கிலோ")
        .replace(/Pack of 6 Eggs/gi, "6 முட்டைகள் பேக்")
        .replace(/Pack of 12 Eggs/gi, "12 முட்டைகள் பேக்")
        .replace(/Tray of 30/gi, "30 முட்டைகள் ட்ரே")
        .replace(/Tray/gi, "ட்ரே")
        .replace(/Pieces|pcs/gi, "துண்டுகள்")
        .replace(/g/g, "கிராம்");
    }
  };

  const localizeDescription = (taText: string, enText?: string): string => {
    if (!taText) return "";
    const trimmed = taText.trim();
    if (language === "en") {
      if (enText) return enText;
      if (/^[A-Za-z0-9\s.,!?:;'"()\–\-–%°C–]+$/.test(trimmed)) {
        return trimmed;
      }
      if (PRODUCT_DESCRIPTION_TRANSLATIONS[trimmed]) {
        return PRODUCT_DESCRIPTION_TRANSLATIONS[trimmed];
      }
      for (const [taKey, enVal] of Object.entries(PRODUCT_DESCRIPTION_TRANSLATIONS)) {
        if (trimmed.includes(taKey.slice(0, 15)) || taKey.includes(trimmed.slice(0, 15))) {
          return enVal;
        }
      }
      return trimmed;
    } else {
      if (PRODUCT_DESCRIPTION_EN_TO_TA[trimmed]) {
        return PRODUCT_DESCRIPTION_EN_TO_TA[trimmed];
      }
      for (const [enKey, taVal] of Object.entries(PRODUCT_DESCRIPTION_EN_TO_TA)) {
        if (
          trimmed.toLowerCase().includes(enKey.slice(0, 15).toLowerCase()) ||
          enKey.toLowerCase().includes(trimmed.slice(0, 15).toLowerCase())
        ) {
          return taVal;
        }
      }
      return trimmed;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        localizeCategoryName,
        localizeProductName,
        localizeUnit,
        localizeDescription,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
