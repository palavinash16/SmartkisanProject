// SmartKisan Centralized India-Wide Language Registry & State Recommendation Mapping

export const LANGUAGE_REGISTRY = [
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'bho', englishName: 'Bhojpuri', nativeName: 'भोजपुरी', script: 'Devanagari', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'awa', englishName: 'Awadhi', nativeName: 'अवधी', script: 'Devanagari', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'pa', englishName: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'mr', englishName: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'en', englishName: 'English', nativeName: 'English', script: 'Latin', status: 'SUPPORTED', flag: '🇮🇳' },
  { code: 'gu', englishName: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'ta', englishName: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'te', englishName: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'kn', englishName: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'ml', englishName: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'or', englishName: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو', script: 'Arabic', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'ks', englishName: 'Kashmiri', nativeName: 'कश्मीरी / کٲشُر', script: 'Devanagari / Arabic', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'ne', englishName: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'sd', englishName: 'Sindhi', nativeName: 'सिन्धी / سنڌي', script: 'Devanagari / Arabic', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'mai', englishName: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'sat', englishName: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'doi', englishName: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'kok', englishName: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', status: 'PARTIAL', flag: '🇮🇳' },
  { code: 'mni', englishName: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meitei Mayek', status: 'PARTIAL', flag: '🇮🇳' }
];

export const STATE_RECOMMENDED_LANGUAGES = {
  'Uttar Pradesh': ['hi', 'awa', 'bho', 'ur', 'en'],
  'Punjab': ['pa', 'hi', 'en'],
  'Tamil Nadu': ['ta', 'en', 'hi'],
  'Maharashtra': ['mr', 'hi', 'en'],
  'West Bengal': ['bn', 'hi', 'en'],
  'Gujarat': ['gu', 'hi', 'en'],
  'Karnataka': ['kn', 'hi', 'en'],
  'Andhra Pradesh': ['te', 'hi', 'en'],
  'Telangana': ['te', 'hi', 'en'],
  'Kerala': ['ml', 'en', 'hi'],
  'Assam': ['as', 'bn', 'hi', 'en'],
  'Odisha': ['or', 'hi', 'en'],
  'Bihar': ['hi', 'bho', 'mai', 'en'],
  'Rajasthan': ['hi', 'en'],
  'Madhya Pradesh': ['hi', 'en'],
  'Haryana': ['hi', 'pa', 'en'],
  'Jammu and Kashmir': ['ks', 'ur', 'doi', 'hi', 'en'],
  'Ladakh': ['ks', 'hi', 'en'],
  'Himachal Pradesh': ['hi', 'pa', 'en'],
  'Uttarakhand': ['hi', 'en'],
  'Goa': ['kok', 'mr', 'hi', 'en'],
  'Jharkhand': ['hi', 'sat', 'bho', 'en'],
  'Chhattisgarh': ['hi', 'en'],
  'Delhi': ['hi', 'pa', 'ur', 'en'],
  'Chandigarh': ['pa', 'hi', 'en'],
  'Puducherry': ['ta', 'en', 'hi'],
  'Tripura': ['bn', 'hi', 'en'],
  'Meghalaya': ['en', 'hi', 'bn'],
  'Nagaland': ['en', 'hi'],
  'Manipur': ['mni', 'en', 'hi'],
  'Mizoram': ['en', 'hi'],
  'Arunachal Pradesh': ['en', 'hi'],
  'Sikkim': ['ne', 'hi', 'en']
};

export function getRecommendedLanguagesForState(stateName) {
  const recommendedCodes = STATE_RECOMMENDED_LANGUAGES[stateName] || ['hi', 'en'];
  return recommendedCodes
    .map((code) => LANGUAGE_REGISTRY.find((l) => l.code === code))
    .filter(Boolean);
}

export function searchLanguages(query) {
  if (!query || !query.trim()) return LANGUAGE_REGISTRY;
  const q = query.trim().toLowerCase();

  return LANGUAGE_REGISTRY.filter((lang) => {
    return (
      lang.code.toLowerCase().includes(q) ||
      lang.englishName.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.script.toLowerCase().includes(q)
    );
  });
}