// SmartKisan Dignified Multilingual Translation Dictionary (Clean UTF-8)

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'bho', label: 'भोजपुरी (Bhojpuri)', flag: '🇮🇳' },
  { code: 'awa', label: 'अवधी (Awadhi)', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

export const TRANSLATIONS = {
  hi: {
    app_title: "स्मार्टकिसान कमांड सेंटर",
    app_subtitle: "किसान समृद्धि एवं निर्णय प्रणाली",

    nav_home: "होम",
    nav_my_field: "मेरा खेत",
    nav_quick_add: "त्वरित जानकारी",
    nav_mandi: "मंडी भाव",
    nav_gap_crop: "जायद फसल सलाहकार",
    nav_weather: "मौसम सलाह",
    nav_crop_school: "कृषि पाठशाला",
    nav_profile: "किसान प्रोफाइल",
    nav_schemes: "योजना मित्र",
    nav_disease: "फसल स्वास्थ्य रक्षक",
    nav_voice: "किसान वाणी",
    nav_menu: "मुख्य मेनू",

    select_language: "भाषा चुनें",
    active_location: "वर्तमान स्थान",
    farmer_greeting_header: "नमस्ते किसान भाई!",
    good_morning: "शुभ प्रभात! 🌾",
    hero_sub: "आपकी भूमि, आपकी फसल और आपका समृद्ध भविष्य - स्मार्टकिसान AI के साथ।",

    gap_crop_section_title: "🌱 जायद एवं अंतर-फसल समृद्धि सलाहकार",
    gap_crop_subtitle: "गेहूं कटाई के बाद खेत को खाली न छोड़ें - 60 से 90 दिनों में अतिरिक्त लाभ कमाएं।",
    available_gap: "उपलब्ध अंतर-अवधि:",
    days: "दिन",
    most_suitable: "सर्वश्रेष्ठ लाभदायक विकल्प",
    good_option: "उत्कृष्ट विकल्प",
    possible_option: "संभावित विकल्प",
    why_recommended: "यह फसल क्यों अनुशंसित है?",

    profit_section_title: "📈 फसल आय एवं मंडी भाव पूर्वानुमान",
    profit_subtitle: "बुआई से पहले लागत, अनुमानित पैदावार और शुद्ध लाभ का सटीक विश्लेषण करें।",

    voice_section_title: "🎙️ किसान वाणी एआई सलाहकार",
    voice_subtitle: "हिंदी, भोजपुरी, अवधी, पंजाबी, मराठी और बंगाली में अपनी बोली में सवाल पूछें।",

    scheme_section_title: "📜 किसान योजना मित्र",
    scheme_subtitle: "पीएम-किसान, फसल बीमा, केसीसी और सरकारी योजनाओं की सीधी पात्रता जांचें।",

    weather_section_title: "⛅ सूक्ष्म-जलवायु एवं फसल सुरक्षा सलाह",
    weather_subtitle: "मौसम के अनुसार छिड़काव, सिंचाई और कटाई के सटीक कृषि निर्देश।",

    disease_section_title: "🔬 फसल स्वास्थ्य Sentinel एवं निदान",
    disease_subtitle: "पत्तियों की फोटो खींचें और एआई से पाएँ तुरंत जैविक व रासायनिक उपचार।",

    land_unit_title: "📏 स्मार्ट भूमि मापक केंद्र",
    land_unit_subtitle: "बीघा, एकड़, हेक्टेयर, गुंठा, मरला और कनाल का सटीक रूपांतरण।",

    today_mandi_prices: "आज के प्रमुख मंडी भाव (लाइव अपडेट)",
    per_quintal: "/क्विंटल",
    loading: "लोड हो रहा है...",
    save: "सुरक्षित करें",
    close: "बंद करें"
  },
  en: {
    app_title: "SmartKisan Command Center",
    app_subtitle: "Farmer Prosperity & Decision Intelligence Platform",

    nav_home: "Home",
    nav_my_field: "My Field",
    nav_quick_add: "Quick Input",
    nav_mandi: "Mandi Rates",
    nav_gap_crop: "Crop Rotation AI",
    nav_weather: "Micro-Climate AI",
    nav_crop_school: "Agro Academy",
    nav_profile: "Farmer Profile",
    nav_schemes: "Yojana Mitra",
    nav_disease: "Crop Health",
    nav_voice: "Kisan Vani AI",
    nav_menu: "Menu",

    select_language: "Select Language",
    active_location: "Active Location",
    farmer_greeting_header: "Welcome, Respected Farmer!",
    good_morning: "Good Morning! 🌾",
    hero_sub: "Empowering your land, crops, and financial future with AI Decision Intelligence.",

    gap_crop_section_title: "🌱 Inter-Season Rotation & Zaid Crop Advisor",
    gap_crop_subtitle: "Optimize 30–90 day land windows after harvest for maximum rotational profit.",
    available_gap: "Available Inter-Season Window:",
    days: "Days",
    most_suitable: "Most Recommended High-Profit Choice",
    good_option: "Excellent Choice",
    possible_option: "Viable Choice",
    why_recommended: "Why is this crop recommended?",

    profit_section_title: "📈 Harvest Revenue Simulator & Profit Forecaster",
    profit_subtitle: "Pre-sowing financial simulator predicting costs, yield, and net profit.",

    voice_section_title: "🎙️ Kisan Vani AI Voice Agronomist",
    voice_subtitle: "Speak naturally in Hindi, Bhojpuri, Awadhi, Punjabi, Marathi, or Bengali.",

    scheme_section_title: "📜 Kisan Yojana Mitra (Government Benefits Matchmaker)",
    scheme_subtitle: "Instantly check eligibility for PM-KISAN, PMFBY, KCC, and equipment subsidies.",

    weather_section_title: "⛅ Micro-Climate & Agro-Weather Directives",
    weather_subtitle: "Actionable spray, irrigation, and harvest advisories based on hyper-local weather.",

    disease_section_title: "🔬 Crop Health Sentinel & Plant Diagnostics",
    disease_subtitle: "Scan crop leaves for instant AI detection, organic remedies, and chemical dosages.",

    land_unit_title: "📏 Smart Land Measurement Hub",
    land_unit_subtitle: "Seamless conversion between Bigha, Acre, Hectare, Guntha, and Kanal.",

    today_mandi_prices: "Live Agricultural Mandi Price Ticker",
    per_quintal: "/Quintal",
    loading: "Loading...",
    save: "Save",
    close: "Close"
  }
};

export function getTranslation(langCode, key) {
  const dict = TRANSLATIONS[langCode] || TRANSLATIONS.hi;
  return dict[key] || TRANSLATIONS.hi[key] || TRANSLATIONS.en[key] || key;
}
