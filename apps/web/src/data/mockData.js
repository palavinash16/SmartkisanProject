// SmartKisan Real-World Agricultural Datasets & Mock Engines

export const STATES_AND_DISTRICTS = {
  "Punjab": ["Ludhiana", "Khanna", "Amritsar", "Patiala", "Bhatinda"],
  "Haryana": ["Karnal", "Ambala", "Hisar", "Rohtak", "Sirsa"],
  "Uttar Pradesh": ["Gorakhpur", "Varanasi", "Lucknow", "Agra", "Kanpur", "Bareilly"],
  "Maharashtra": ["Latur", "Nashik", "Pune", "Nagpur", "Aurangabad", "Solapur"],
  "Rajasthan": ["Kota", "Jaipur", "Sri Ganganagar", "Alwar", "Jodhpur"],
  "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Mandsaur", "Jabalpur"],
  "Bihar": ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur", "Samastipur"],
  "Gujarat": ["Rajkot", "Surat", "Ahmedabad", "Junagadh", "Mehsana"]
};

export const MANDI_PRICES = [
  { crop: "Wheat (गेहूं)", price: 2275, change: "+2.4%", location: "Khanna Mandi, PB", trend: "up", state: "Punjab", district: "Khanna" },
  { crop: "Paddy (धान)", price: 2183, change: "+1.1%", location: "Karnal Mandi, HR", trend: "up", state: "Haryana", district: "Karnal" },
  { crop: "Moong (मूंग)", price: 8550, change: "+4.8%", location: "Latur Mandi, MH", trend: "up", state: "Maharashtra", district: "Latur" },
  { crop: "Tomato (टमाटर)", price: 1850, change: "-5.2%", location: "Azadpur Mandi, DL", trend: "down", state: "Delhi", district: "Azadpur" },
  { crop: "Onion (प्याज)", price: 2400, change: "+3.0%", location: "Nashik Mandi, MH", trend: "up", state: "Maharashtra", district: "Nashik" },
  { crop: "Maize (मक्का)", price: 2090, change: "0.0%", location: "Gorakhpur Mandi, UP", trend: "neutral", state: "Uttar Pradesh", district: "Gorakhpur" }
];

export const MANDI_PRICES_DETAILED = [
  { id: "m1", cropEn: "Wheat", cropHi: "गेहूं", category: "Cereal", state: "Punjab", district: "Khanna", mandi: "Khanna Main Mandi", minPrice: 2210, maxPrice: 2320, modalPrice: 2275, change: "+2.4%", trend: "up", arrivalsQuintals: 4500, grade: "FAQ (Fair Average Quality)", date: "Today" },
  { id: "m2", cropEn: "Paddy (Basmati)", cropHi: "धान (बासमती)", category: "Cereal", state: "Haryana", district: "Karnal", mandi: "Karnal Grain Market", minPrice: 3850, maxPrice: 4200, modalPrice: 4050, change: "+1.5%", trend: "up", arrivalsQuintals: 2800, grade: "Super Fine", date: "Today" },
  { id: "m3", cropEn: "Summer Moong", cropHi: "समर मूंग", category: "Pulses", state: "Maharashtra", district: "Latur", mandi: "Latur APMC Mandi", minPrice: 8200, maxPrice: 8850, modalPrice: 8550, change: "+4.8%", trend: "up", arrivalsQuintals: 1250, grade: "Grade A Premium", date: "Today" },
  { id: "m4", cropEn: "Onion", cropHi: "प्याज", category: "Vegetables", state: "Maharashtra", district: "Nashik", mandi: "Lasalgaon Mandi", minPrice: 2100, maxPrice: 2650, modalPrice: 2400, change: "+3.0%", trend: "up", arrivalsQuintals: 8500, grade: "Medium Pink", date: "Today" },
  { id: "m5", cropEn: "Maize", cropHi: "मक्का", category: "Cereal", state: "Uttar Pradesh", district: "Gorakhpur", mandi: "Gorakhpur Sub-Mandi", minPrice: 1980, maxPrice: 2150, modalPrice: 2090, change: "0.0%", trend: "neutral", arrivalsQuintals: 1900, grade: "Yellow Commercial", date: "Today" },
  { id: "m6", cropEn: "Tomato", cropHi: "टमाटर", category: "Vegetables", state: "Uttar Pradesh", district: "Varanasi", mandi: "Varanasi Mandi Samiti", minPrice: 1600, maxPrice: 2100, modalPrice: 1850, change: "-5.2%", trend: "down", arrivalsQuintals: 3400, grade: "Hybrid Red", date: "Today" },
  { id: "m7", cropEn: "Gram / Chana", cropHi: "चना", category: "Pulses", state: "Madhya Pradesh", district: "Indore", mandi: "Indore APMC Yard", minPrice: 5650, maxPrice: 6100, modalPrice: 5880, change: "+1.8%", trend: "up", arrivalsQuintals: 2100, grade: "Desi Chana", date: "Today" },
  { id: "m8", cropEn: "Mustard", cropHi: "सरसों", category: "Oilseeds", state: "Rajasthan", district: "Kota", mandi: "Kota Anaj Mandi", minPrice: 5400, maxPrice: 5850, modalPrice: 5680, change: "+0.9%", trend: "up", arrivalsQuintals: 3100, grade: "42% Oil Content", date: "Today" },
  { id: "m9", cropEn: "Cotton", cropHi: "कपास", category: "Cash Crop", state: "Gujarat", district: "Rajkot", mandi: "Rajkot APMC", minPrice: 6900, maxPrice: 7550, modalPrice: 7300, change: "-1.2%", trend: "down", arrivalsQuintals: 4200, grade: "Long Staple", date: "Today" },
  { id: "m10", cropEn: "Potato", cropHi: "आलू", category: "Vegetables", state: "Uttar Pradesh", district: "Agra", mandi: "Agra Mandi Samiti", minPrice: 1350, maxPrice: 1650, modalPrice: 1520, change: "+2.1%", trend: "up", arrivalsQuintals: 9200, grade: "Jyoti / Chipsona", date: "Today" },
  { id: "m11", cropEn: "Soybean", cropHi: "सोयाबीन", category: "Oilseeds", state: "Madhya Pradesh", district: "Ujjain", mandi: "Ujjain Anaj Mandi", minPrice: 4400, maxPrice: 4850, modalPrice: 4680, change: "+3.2%", trend: "up", arrivalsQuintals: 5300, grade: "Yellow Soybean", date: "Today" },
  { id: "m12", cropEn: "Paddy (Common)", cropHi: "सामान्य धान", category: "Cereal", state: "Bihar", district: "Patna", mandi: "Patna Bazaar Samiti", minPrice: 2120, maxPrice: 2250, modalPrice: 2183, change: "0.5%", trend: "up", arrivalsQuintals: 3600, grade: "Grade A", date: "Today" },
  { id: "m13", cropEn: "Urad", cropHi: "उड़द", category: "Pulses", state: "Madhya Pradesh", district: "Bhopal", mandi: "Bhopal Karond Mandi", minPrice: 7100, maxPrice: 7700, modalPrice: 7400, change: "+2.0%", trend: "up", arrivalsQuintals: 890, grade: "Black Urad Bold", date: "Today" },
  { id: "m14", cropEn: "Cucumber / Kakri", cropHi: "खीरा / ककड़ी", category: "Vegetables", state: "Punjab", district: "Ludhiana", mandi: "Ludhiana Vegetable Yard", minPrice: 1200, maxPrice: 1600, modalPrice: 1400, change: "+5.5%", trend: "up", arrivalsQuintals: 750, grade: "Fresh Green", date: "Today" },
  { id: "m15", cropEn: "Wheat", cropHi: "गेहूं", category: "Cereal", state: "Madhya Pradesh", district: "Mandsaur", mandi: "Mandsaur APMC", minPrice: 2350, maxPrice: 2600, modalPrice: 2480, change: "+1.2%", trend: "up", arrivalsQuintals: 6100, grade: "Sharbati Premium", date: "Today" }
];

export const DISTRICT_WEATHER_DATA = {
  "Khanna": {
    tempCurrent: "34°C",
    condition: "Scattered Rain",
    humidity: "82%",
    wind: "18 km/h",
    soilMoisture: "76%",
    rainProb: "82%",
    advisories: [
      { type: "CRITICAL_WARNING", category: "Pesticide Spray Advisory", headline: "⚠️ DO NOT SPRAY CHEMICAL PESTICIDES TODAY", reason: "Precipitation probability is 82% over the next 8 hours with surface wind speed reaching 18 km/h.", action: "Delay chemical application until Monday morning. Spraying today will result in 100% pesticide runoff.", severity: "high" },
      { type: "IRRIGATION_ADVISORY", category: "Water Management", headline: "💧 SKIP IRRIGATION FOR WHEAT / MOONG CROP", reason: "Soil moisture sensors report 76% volumetric water content; rain expected tonight.", action: "Save pumping electricity/diesel. Inspect drainage channels to prevent waterlogging.", severity: "medium" }
    ],
    forecast: [
      { day: "Today", temp: "34°C / 24°C", humidity: "82%", rainProb: "82%", icon: "Rain" },
      { day: "Tomorrow", temp: "32°C / 23°C", humidity: "78%", rainProb: "45%", icon: "Cloudy" },
      { day: "Tuesday", temp: "35°C / 25°C", humidity: "65%", rainProb: "10%", icon: "Sunny" },
      { day: "Wednesday", temp: "36°C / 26°C", humidity: "60%", rainProb: "0%", icon: "Sunny" },
      { day: "Thursday", temp: "33°C / 24°C", humidity: "80%", rainProb: "60%", icon: "Rain" }
    ]
  },
  "Karnal": {
    tempCurrent: "33°C",
    condition: "Humid & Thunderstorms",
    humidity: "88%",
    wind: "14 km/h",
    soilMoisture: "81%",
    rainProb: "75%",
    advisories: [
      { type: "DISEASE_ALERT", category: "Micro-climate Risk Alert", headline: "🦠 RICE BLAST RISK HIGH IN KARNAL BELT", reason: "Night temp dropped to 22°C with persistent morning fog and relative humidity >88%.", action: "Monitor Paddy nursery for elliptical spindle spots. Apply Trichoderma viride bio-fungicide.", severity: "high" },
      { type: "IRRIGATION_ADVISORY", category: "Paddy Water Management", headline: "💧 MAINTAIN 2-3 CM STANDING WATER", reason: "Basmati paddy tillering stage requires regulated moisture in clay-loam soils.", action: "Regulate canal inflow; check field bunds.", severity: "low" }
    ],
    forecast: [
      { day: "Today", temp: "33°C / 24°C", humidity: "88%", rainProb: "75%", icon: "Rain" },
      { day: "Tomorrow", temp: "34°C / 25°C", humidity: "72%", rainProb: "30%", icon: "Cloudy" },
      { day: "Tuesday", temp: "36°C / 26°C", humidity: "58%", rainProb: "5%", icon: "Sunny" },
      { day: "Wednesday", temp: "37°C / 27°C", humidity: "54%", rainProb: "0%", icon: "Sunny" },
      { day: "Thursday", temp: "35°C / 25°C", humidity: "65%", rainProb: "20%", icon: "Cloudy" }
    ]
  },
  "Latur": {
    tempCurrent: "31°C",
    condition: "Partly Cloudy",
    humidity: "62%",
    wind: "22 km/h",
    soilMoisture: "52%",
    rainProb: "15%",
    advisories: [
      { type: "IRRIGATION_ADVISORY", category: "Moong Crop Drip Irrigation", headline: "💧 SCHEDULE LIGHT IRRIGATION TODAY", reason: "Soil moisture in Black Cotton soil dropped to 52% during flowering phase.", action: "Apply 2 hours of drip irrigation between 4 PM - 7 PM to prevent pod abortion.", severity: "medium" },
      { type: "PEST_ALERT", category: "Pod Borer Vigilance", headline: "🐛 CHECK FOR POD BORER LARVAE", reason: "Warm afternoon temperatures (31°C) favor helicoverpa moth egg laying.", action: "Install pheromone traps @ 5 traps per acre.", severity: "medium" }
    ],
    forecast: [
      { day: "Today", temp: "31°C / 21°C", humidity: "62%", rainProb: "15%", icon: "Cloudy" },
      { day: "Tomorrow", temp: "32°C / 22°C", humidity: "58%", rainProb: "10%", icon: "Sunny" },
      { day: "Tuesday", temp: "33°C / 22°C", humidity: "55%", rainProb: "5%", icon: "Sunny" },
      { day: "Wednesday", temp: "32°C / 21°C", humidity: "60%", rainProb: "25%", icon: "Cloudy" },
      { day: "Thursday", temp: "30°C / 20°C", humidity: "70%", rainProb: "50%", icon: "Rain" }
    ]
  },
  "Gorakhpur": {
    tempCurrent: "35°C",
    condition: "Hot & Clear Sky",
    humidity: "55%",
    wind: "10 km/h",
    soilMoisture: "48%",
    rainProb: "5%",
    advisories: [
      { type: "HEAT_WAVE_ADVISORY", category: "Zaid Crop Thermal Stress", headline: "☀️ HIGH SOLAR RADIATION & HEAT STRESS", reason: "Clear skies and 35°C peak ambient temperature causing rapid evapotranspiration.", action: "Foliar spray of 1% Potassium Nitrate (13-0-45) to enhance thermal tolerance in Maize.", severity: "medium" }
    ],
    forecast: [
      { day: "Today", temp: "35°C / 26°C", humidity: "55%", rainProb: "5%", icon: "Sunny" },
      { day: "Tomorrow", temp: "36°C / 27°C", humidity: "52%", rainProb: "0%", icon: "Sunny" },
      { day: "Tuesday", temp: "37°C / 27°C", humidity: "48%", rainProb: "0%", icon: "Sunny" },
      { day: "Wednesday", temp: "35°C / 26°C", humidity: "62%", rainProb: "35%", icon: "Cloudy" },
      { day: "Thursday", temp: "33°C / 25°C", humidity: "75%", rainProb: "65%", icon: "Rain" }
    ]
  },
  "Nashik": {
    tempCurrent: "29°C",
    condition: "Pleasant & Breezy",
    humidity: "68%",
    wind: "16 km/h",
    soilMoisture: "65%",
    rainProb: "20%",
    advisories: [
      { type: "ONION_HARVEST_ADVISORY", category: "Post-Harvest Storage", headline: "🧅 OPTIMAL WEATHER FOR ONION CURING", reason: "Moderate humidity (68%) and dry breeze suitable for shade curing harvested onions.", action: "Ensure well-ventilated field curing for 48 hours before packing in mesh bags.", severity: "low" }
    ],
    forecast: [
      { day: "Today", temp: "29°C / 20°C", humidity: "68%", rainProb: "20%", icon: "Cloudy" },
      { day: "Tomorrow", temp: "30°C / 20°C", humidity: "64%", rainProb: "10%", icon: "Sunny" },
      { day: "Tuesday", temp: "31°C / 21°C", humidity: "60%", rainProb: "5%", icon: "Sunny" },
      { day: "Wednesday", temp: "28°C / 19°C", humidity: "74%", rainProb: "40%", icon: "Rain" },
      { day: "Thursday", temp: "27°C / 19°C", humidity: "80%", rainProb: "60%", icon: "Rain" }
    ]
  }
};


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
    benefit: "₹6,000 / year in 3 equal installments",
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
