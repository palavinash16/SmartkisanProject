// SmartKisan Real-World Agricultural Datasets & Mock Engines (Clean UTF-8)

export const MANDI_PRICES = [
  { crop: "Wheat (गेहूं)", price: 2275, change: "+2.4%", location: "Khanna Mandi, PB", trend: "up" },
  { crop: "Paddy (धान)", price: 2183, change: "+1.1%", location: "Karnal Mandi, HR", trend: "up" },
  { crop: "Moong (मूंग)", price: 8550, change: "+4.8%", location: "Latur Mandi, MH", trend: "up" },
  { crop: "Tomato (टमाटर)", price: 1850, change: "-5.2%", location: "Azadpur Mandi, DL", trend: "down" },
  { crop: "Onion (प्याज)", price: 2400, change: "+3.0%", location: "Nashik Mandi, MH", trend: "up" },
  { crop: "Maize (मक्का)", price: 2090, change: "0.0%", location: "Gorakhpur Mandi, UP", trend: "neutral" }
];

export const GAP_CROPS_DATABASE = [
  {
    id: "moong",
    name: "Summer Moong Bean (समर मूंग)",
    duration: 65,
    suitableSoil: ["Alluvial", "Loamy", "Clay-Loam"],
    waterReq: "Low (2-3 Light Irrigations)",
    investmentPerAcre: 6500,
    expectedYieldPerAcre: 6.5, // Quintals
    marketPricePerQuintal: 8550,
    grossRevenue: 55575,
    netProfit: 49075,
    riskScore: 18, // 0-100 (Low risk)
    nitrogenFixation: "18-25 kg N/ha saved for next crop",
    pros: ["Fixes atmospheric nitrogen into soil", "Extremely short 60-65 day maturity", "High MSP support"],
    bestGapWindow: "Mid-April to End-June (After Wheat harvest)"
  },
  {
    id: "zaid_maize",
    name: "Zaid Sweet Corn / Fodder Maize (ज़ैद मक्का)",
    duration: 70,
    suitableSoil: ["Alluvial", "Sandy Loam"],
    waterReq: "Moderate (4 Irrigations)",
    investmentPerAcre: 9200,
    expectedYieldPerAcre: 18.0,
    marketPricePerQuintal: 2090,
    grossRevenue: 37620,
    netProfit: 28420,
    riskScore: 24,
    nitrogenFixation: "Organic residue incorporation",
    pros: ["Dual revenue from green cob & livestock fodder", "High demand in urban markets"],
    bestGapWindow: "April to June"
  },
  {
    id: "cucumber",
    name: "Short-Duration Cucumber / Kakri (खीरा/ककड़ी)",
    duration: 50,
    suitableSoil: ["Sandy Loam", "Riverbed Soil"],
    waterReq: "Moderate-High (Drip Preferred)",
    investmentPerAcre: 14000,
    expectedYieldPerAcre: 45.0,
    marketPricePerQuintal: 1400,
    grossRevenue: 63000,
    netProfit: 49000,
    riskScore: 38,
    nitrogenFixation: "None",
    pros: ["Fastest cash turnaround (Harvest starts at day 40)", "High summer city demand"],
    bestGapWindow: "Late April to Mid-June"
  },
  {
    id: "urad",
    name: "Summer Urad (उड़द)",
    duration: 75,
    suitableSoil: ["Black Cotton Soil", "Loam"],
    waterReq: "Low (3 Irrigations)",
    investmentPerAcre: 7200,
    expectedYieldPerAcre: 5.5,
    marketPricePerQuintal: 7400,
    grossRevenue: 40700,
    netProfit: 33500,
    riskScore: 22,
    nitrogenFixation: "Improves soil health for Kharif Paddy",
    pros: ["Low input cost", "Drought tolerant"],
    bestGapWindow: "Mid-April to Early July"
  }
];

export const ML_MODEL_COMPARISON = {
  models: [
    {
      name: "XGBoost Regressor (Selected Primary)",
      mae: "1.42 Quintals/acre",
      r2Score: 0.942,
      inferenceSpeed: "12 ms",
      pros: "Best handling of sparse tabular Mandi & soil data, handles non-linear weather interactions natively",
      status: "Recommended Production Model"
    },
    {
      name: "Random Forest Regressor",
      mae: "1.85 Quintals/acre",
      r2Score: 0.905,
      inferenceSpeed: "28 ms",
      pros: "Robust baseline, immune to extreme outliers",
      status: "Secondary Validation Model"
    },
    {
      name: "LightGBM",
      mae: "1.51 Quintals/acre",
      r2Score: 0.936,
      inferenceSpeed: "6 ms",
      pros: "Fastest inference speed, ideal for real-time API latency",
      status: "High-Throughput Candidate"
    },
    {
      name: "Deep Neural Network (MLP)",
      mae: "2.10 Quintals/acre",
      r2Score: 0.864,
      inferenceSpeed: "45 ms",
      pros: "Good for temporal Mandi price sequences (LSTM mode)",
      status: "Complex / High Data Requirement"
    }
  ]
};

export const SCHEMES_DATABASE = [
  {
    id: "pmkisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Direct Income Support",
    benefit: "₹6,000 / year in 3 equal installments of ₹2,000 directly into NPCI linked bank account.",
    eligibility: "Small & Marginal Farmer families owning cultivable land up to 2 Hectares.",
    documents: ["Aadhaar Card", "Land Ownership Record (Khasra/Khatauni)", "Bank Account Details with NPCI Link"],
    state: "All India (Central)",
    matchScore: 98,
    ragConfidence: 0.96,
    link: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Crop Insurance & Risk Coverage",
    benefit: "Full financial cover against non-preventable crop damage (Only 1.5% premium for Rabi, 2% for Kharif)",
    eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
    documents: ["Land Possession Certificate", "Sowing Certificate issued by Patwari", "Aadhaar Card", "Cancelled Cheque"],
    state: "All India (Central)",
    matchScore: 94,
    ragConfidence: 0.94,
    link: "https://pmfby.gov.in"
  },
  {
    id: "kcc",
    title: "Kisan Credit Card (KCC) Scheme",
    category: "Institutional Agriculture Credit",
    benefit: "Concessional credit at 4% effective interest rate (with 3% prompt repayment subvention) up to ₹3 Lakhs",
    eligibility: "Individual farmers, Joint Borrowers, Tenant Farmers, SHGs.",
    documents: ["Application Form", "Pahani / Land Revenue Record", "Identity Proof", "Address Proof"],
    state: "All India (Central)",
    matchScore: 91,
    ragConfidence: 0.91,
    link: "https://rbi.org.in"
  },
  {
    id: "soilhealth",
    title: "Soil Health Card Scheme",
    category: "Soil Wellness & Nutrient Management",
    benefit: "Free comprehensive 12-parameter soil testing report + customized crop fertilizer advisory",
    eligibility: "All agricultural land-owning farmers across all states.",
    documents: ["Aadhaar Card", "Soil Sample Collection Tag"],
    state: "All India (Central)",
    matchScore: 89,
    ragConfidence: 0.89,
    link: "https://soilhealth.dac.gov.in"
  },
  {
    id: "smam",
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    category: "Equipment Subsidy",
    benefit: "40% to 80% financial subsidy on tractors, rotavators, combined harvesters, and spray drones",
    eligibility: "Small, Marginal, SC/ST, and Women Farmers.",
    documents: ["Aadhaar", "Land Records", "Bank Passbook", "Caste Certificate (if applicable)"],
    state: "State-specific (UP, Bihar, Punjab, MH, MP)",
    matchScore: 85,
    ragConfidence: 0.87,
    link: "https://agrimachinery.nic.in"
  }
];

export const WEATHER_ADVISORIES = [
  {
    type: "CRITICAL_WARNING",
    category: "Pesticide Spray Advisory",
    icon: "AlertTriangle",
    headline: "⚠️ DO NOT SPRAY CHEMICAL PESTICIDES TODAY",
    reason: "Precipitation probability is 82% over the next 8 hours with surface wind speed reaching 18 km/h.",
    action: "Delay chemical application until Monday morning. Spraying today will result in 100% pesticide runoff and soil toxicity without leaf absorption.",
    severity: "high"
  },
  {
    type: "IRRIGATION_ADVISORY",
    category: "Water Management",
    icon: "Droplets",
    headline: "💧 SKIP IRRIGATION FOR WHEAT / MOONG CROP",
    reason: "Soil moisture sensors report 74% volumetric water content; rain expected tonight.",
    action: "Save pumping electricity/diesel. Inspect drainage channels to prevent waterlogging in young seedlings.",
    severity: "medium"
  },
  {
    type: "DISEASE_ALERT",
    category: "Micro-climate Risk Alert",
    icon: "ShieldAlert",
    headline: "🦠 FUNGAL BLAST RISK ELEVATED (92% Humidity)",
    reason: "Night temp dropped to 22°C with persistent morning fog and relative humidity >90%.",
    action: "Monitor Paddy/Wheat leaves for elliptical spindle-shaped spots. Keep Trichoderma viride organic bio-fungicide ready.",
    severity: "high"
  }
];

export const PLANT_DISEASES_DB = [
  {
    id: "leaf_blast",
    crop: "Paddy / Rice (धान)",
    diseaseName: "Rice Blast (Magnaporthe oryzae)",
    confidence: 96.8,
    severity: "Moderate-High (Stage 2)",
    symptoms: "Diamond or spindle-shaped lesions on leaf blades with gray or white center and reddish-brown margin.",
    organicRemedy: "Spray Neem Seed Kernel Extract (NSKE 5%) or Pseudomonas fluorescens @ 10g/liter water.",
    chemicalTreatment: "Tebuconazole 50% + Trifloxystrobin 25% WG @ 0.4g/liter water during early morning.",
    preventiveTips: "Avoid excessive nitrogenous fertilizer application; maintain balanced N-P-K (4:2:1)."
  },
  {
    id: "yellow_rust",
    crop: "Wheat (गेहूं)",
    diseaseName: "Stripe / Yellow Rust (Puccinia striiformis)",
    confidence: 94.2,
    severity: "High Risk (Spreading)",
    symptoms: "Yellow pustules arranged in linear stripes along the veins of leaf blades.",
    organicRemedy: "Foliar spray of Fermented Butter Milk (Lassi) + Copper Wire extract solution.",
    chemicalTreatment: "Propiconazole 25% EC (Tilt) @ 1 ml/liter of water.",
    preventiveTips: "Grow resistant varieties like HD-2967, DBW-187, or PBW-725."
  },
  {
    id: "early_blight",
    crop: "Tomato (टमाटर)",
    diseaseName: "Early Blight (Alternaria solani)",
    confidence: 98.1,
    severity: "Mild (Early Stage)",
    symptoms: "Concentric rings forming target-like dark spots on lower mature leaves.",
    organicRemedy: "Trichoderma viride 1% WP @ 5g/liter foliar spray.",
    chemicalTreatment: "Mancozeb 75% WP @ 2.5g/liter water.",
    preventiveTips: "Ensure proper plant spacing for aeration; avoid overhead sprinkler irrigation."
  }
];

export const VOICE_SAMPLE_QUERIES = [
  {
    language: "Hindi (हिंदी)",
    code: "hi",
    query: "गेहूं की कटाई के बाद 60 दिन में कौन सी फसल लगाकर ज्यादा मुनाफा कमाया जा सकता है?",
    translated: "Which crop can yield high profit in 60 days after wheat harvest?",
    answer: "गेहूं के बाद आप 'समर मूंग' (Summer Moong) लगा सकते हैं। यह 60-65 दिनों में तैयार हो जाती है। 1 एकड़ में लगभग ₹6,500 की लागत आएगी और ₹45,000 से ₹49,000 तक शुद्ध मुनाफा हो सकता है।"
  },
  {
    language: "Bhojpuri (भोजपुरी)",
    code: "bho",
    query: "रउआ बताइब कि आज खेत में दवाई छिड़के के चाही कि ना?",
    translated: "Can you tell if I should spray medicine in the field today?",
    answer: "ना बाबू! आज खेत में दवाई मत छिड़कीं। आज संझवा के 80% पानी बरसे के संभावना बा। दवाई पानी में बह जाई और अकारथ खर्चा हो जाई।"
  },
  {
    language: "Punjabi (ਪੰਜਾਬੀ)",
    code: "pa",
    query: "ਮੈਨੂੰ ਛੋਟੇ ਕਿਸਾਨਾਂ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਦੱਸੋ।",
    translated: "Tell me about government schemes for small farmers.",
    answer: "ਤੁਹਾਡੇ ਲਈ PM-KISAN (ਸਾਲਾਨਾ ₹6,000), PM-FASAL BIMA (ਫ਼ਸਲ ਬੀਮਾ), ਅਤੇ KCC (4% ਵਿਆਜ 'ਤੇ ਕਰਜ਼ਾ) ਸਭ ਤੋਂ ਵਧੀਆ ਯੋਜਨਾਵਾਂ ਹਨ।"
  },
  {
    language: "Bengali (বাংলা)",
    code: "bn",
    query: "টমেটো গাছের পাতায় কালো দাগ দেখা যাচ্ছে, কি করবো?",
    translated: "Black spots are showing on tomato leaves, what should I do?",
    answer: "এটি 'আর্লি ব্লাইট' (Early Blight) রোগ হতে পারে। প্রতিকার হিসেবে ট্রাইকোডার্মা ভিরিডি বা ম্যানকোজেব ২.৫ গ্রাম প্রতি লিটার জলে মিশিয়ে স্প্রে করুন।"
  }
];

export const MANDI_PRICES_DETAILED = MANDI_PRICES;

export const DISTRICT_WEATHER_DATA = {
  'Gorakhpur': { temp: '34°C', humidity: '85%', rainProb: '82%', status: 'Pre-Monsoon Rain' },
  'Karnal': { temp: '33°C', humidity: '78%', rainProb: '45%', status: 'Partly Cloudy' },
  'Khanna': { temp: '35°C', humidity: '65%', rainProb: '10%', status: 'Sunny' },
  'Nashik': { temp: '31°C', humidity: '88%', rainProb: '90%', status: 'Heavy Rain Alert' },
  'Latur': { temp: '32°C', humidity: '70%', rainProb: '30%', status: 'Clear Sky' }
};

export const STATES_AND_DISTRICTS = {
  'Uttar Pradesh': ['Gorakhpur', 'Varanasi', 'Lucknow', 'Kanpur', 'Prayagraj'],
  'Punjab': ['Khanna', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
  'Haryana': ['Karnal', 'Ambala', 'Hisar', 'Rohtak', 'Kurukshetra'],
  'Maharashtra': ['Nashik', 'Latur', 'Pune', 'Nagpur', 'Aurangabad'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga']
};
