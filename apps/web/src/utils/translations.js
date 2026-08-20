// SmartKisan Complete Multilingual Translation Dictionary (7 Supported Languages)

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'bho', label: 'भोजपुरी (Bhojpuri)', flag: '🇮🇳' },
  { code: 'awa', label: 'अवधी (Awadhi)', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇮🇳' }
];

export const TRANSLATIONS = {
  hi: {
    app_title: "स्मार्टकिसान कृषि सलाह",
    app_subtitle: "भारत का अपना कृषि ऐप",

    nav_home: "होम",
    nav_my_field: "मेरा खेत",
    nav_gap_crop: "गैप फसल",
    nav_mandi: "मंडी भाव",
    nav_weather: "मौसम",
    nav_crop_school: "क्रॉप स्कूल",
    nav_schemes: "सरकारी योजनाएं",
    nav_profile: "प्रोफाइल",
    nav_menu: "मुख्य मेनू",

    select_language: "अपनी भाषा चुनें",
    active_location: "वर्तमान स्थान",
    farmer_greeting_header: "नमस्ते किसान जी! 🙏",
    good_day: "आज आपका दिन शुभ हो! 🌻",
    hero_sub: "आपके खेत की मिट्टी और अवधि के अनुसार प्रमाणिक वैज्ञानिक सुझाव और मौसम जानकारी।",
    hero_cta: "मेरे खेत के लिए फसल सुझाएं",
    hero_cta_sub: "Gap Crop Recommendation • सिर्फ 2 मिनट में",

    my_field_summary: "आपका खेत सारांश",
    field_name: "खेत का नाम",
    area: "क्षेत्रफल",
    previous_crop: "पिछली फसल",
    next_crop: "अगली फसल (प्लानिंग)",
    irrigation_facility: "सिंचाई सुविधा",
    view_full_field: "खेत की पूरी जानकारी देखें",

    main_services: "मुख्य सेवाएं (Main Services)",
    gap_crop_card_title: "🌱 Gap Crop सुझाव",
    gap_crop_card_desc: "खेत के बीच की अवधि (30-90 दिन) में सही फसल पाएं और आमदनी बढ़ाएं।",
    gap_crop_card_cta: "फसल चुनें",

    weather_card_title: "🌦 मौसम जानकारी",
    weather_card_desc: "सटीक मौसम जानकारी, तापमान और बारिश का 7 दिन का फोरकास्ट।",
    weather_card_cta: "मौसम देखें",

    mandi_card_title: "💰 मंडी भाव",
    mandi_card_desc: "आपके पास की मंडी के आज के भाव और बाजार के ट्रेंड्स।",
    mandi_card_cta: "भाव देखें",

    crop_school_card_title: "📚 क्रॉप स्कूल",
    crop_school_card_desc: "फसल खेती की जानकारी, वैज्ञानिक गाइड और किसान सलाह।",
    crop_school_card_cta: "पढ़ें और सीखें",

    recommendations_title: "आपके खेत के लिए सुझाव",
    new_recommendation_cta: "नया Recommendation रन करें",
    why_recommended: "क्यों सुझाई गई (Why Recommended):",
    rotational_benefit: "🌱 चक्रानुक्रम लाभ (Rotational Benefit):",
    expected_yield: "अनुमानित उपज:",
    official_source: "प्रमाणिक स्त्रोत:",

    gap_form_title: "आपके खेत की जानकारी",
    step_1_location: "📍 Step 1: आपका खेत कहां है? (Location)",
    step_2_prev_crop: "🌾 Step 2: पिछली फसल कौन सी थी? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: फसल कब कटी या कटेगी? (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: अगली फसल कब लगानी है? (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: सिंचाई की क्या सुविधा है? (Irrigation System)",
    step_6_area: "📐 Step 6: खेत का एरिया (Land Area in Acres)",

    btn_next: "आगे बढ़ें (Next)",
    btn_prev: "पीछे (Back)",
    btn_submit_crop: "🌱 फसल सुझाएं (Get Recommendations)",

    no_suitable_crop_title: "🌾 इस गैप में suitable crop नहीं मिली",
    no_suitable_crop_desc: "आपके द्वारा चुनी गई अवधि किसी भी गैप फसल की न्यूनतम अवधि से कम है।",
    rejection_reasons_title: "फसल न मिलने के कारण:",
    try_again_cta: "दोबारा चेक करें",

    error_date_range: "फसल की कटाई की तारीख (Harvest Date) अगली बुवाई की तारीख (Next Sowing Date) के बाद नहीं हो सकती।",
    error_validation: "कृपया सभी जरूरी जानकारी सही तरह से भरें।",
    error_network: "अभी recommendation service से कनेक्शन नहीं हो पा रहा। कृपया थोड़ी देर बाद दोबारा ट्राई करें।",

    available_gap: "उपलब्ध अवधि (Available Gap):",
    days: "दिन",
    save: "सहेजें",
    close: "बंद करें"
  },
  bho: {
    app_title: "स्मार्टकिसान किसानी सलाह",
    app_subtitle: "भारत के अपना किसानी ऐप",

    nav_home: "होम",
    nav_my_field: "हमर खेत",
    nav_gap_crop: "गैप फसल",
    nav_mandi: "मंडी भाव",
    nav_weather: "मौसम",
    nav_crop_school: "क्रॉप स्कूल",
    nav_schemes: "सरकारी योजना",
    nav_profile: "प्रोफाइल",
    nav_menu: "मेनू",

    select_language: "अपन भाषा चुनीं",
    active_location: "स्थान",
    farmer_greeting_header: "नमस्ते किसान जी! 🙏",
    good_day: "आज राउर दिन शुभ होखे! 🌻",
    hero_sub: "रउआ खेत के माटी आ समय के हिसाब से सही वैज्ञानिक सलाह।",
    hero_cta: "हमरा खेत खातिर फसल बताईं",
    hero_cta_sub: "Gap Crop Recommendation • सिर्फ 2 मिनट में",

    my_field_summary: "रउआ खेत के ब्योरा",
    field_name: "खेत के नाम",
    area: "क्षेत्रफल",
    previous_crop: "पिछला फसल",
    next_crop: "अगिला फसल",
    irrigation_facility: "सिंचाई सुविधा",
    view_full_field: "खेत के पूरा ब्योरा देखीं",

    main_services: "मुख्य सेवा",
    gap_crop_card_title: "🌱 Gap Crop सलाह",
    gap_crop_card_desc: "खेत के खाली समय में सही फसल लगा के कमाई बढ़ाईं।",
    gap_crop_card_cta: "फसल चुनीं",

    weather_card_title: "🌦 मौसम जानकारी",
    weather_card_desc: "मौसम के सही हाल आ 7 दिन के फोरकास्ट।",
    weather_card_cta: "मौसम देखीं",

    mandi_card_title: "💰 मंडी भाव",
    mandi_card_desc: "नजदीकी मंडी के आजु के भाव।",
    mandi_card_cta: "भाव देखीं",

    crop_school_card_title: "📚 क्रॉप स्कूल",
    crop_school_card_desc: "खेती के वैज्ञानिक तरीका आ गाइड।",
    crop_school_card_cta: "सीखीं",

    recommendations_title: "रउआ खेत खातिर सलाह",
    new_recommendation_cta: "नया सुझाव देखीं",
    why_recommended: "काहे चुनल गइल:",
    rotational_benefit: "🌱 चक्रानुक्रम लाभ:",
    expected_yield: "अनुमानित पैदावार:",
    official_source: "सरकारी/सत्यापित स्त्रोत:",

    gap_form_title: "खेत के ब्योरा",
    step_1_location: "📍 Step 1: खेत कहाँ बा? (Location)",
    step_2_prev_crop: "🌾 Step 2: पिछला फसल कौन रहे? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: कटाई के तारीख (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: अगिला बोआई के तारीख (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: सिंचाई साधन (Irrigation System)",
    step_6_area: "📐 Step 6: खेत के रकबा (Land Area in Acres)",

    btn_next: "आगे बढ़ीं (Next)",
    btn_prev: "पाछे (Back)",
    btn_submit_crop: "🌱 फसल बताईं (Get Recommendations)",

    no_suitable_crop_title: "🌾 एह समय खातिर कवनो फसल ना मिलल",
    no_suitable_crop_desc: "रउआ चुनल समय कम बा।",
    rejection_reasons_title: "कारण:",
    try_again_cta: "दोबारा देखीं",

    error_date_range: "कटाई के तारीख बोआई के तारीख के बाद ना हो सकेला।",
    error_validation: "सब जानकारी सही से भरीं।",
    error_network: "नेटवर्क समस्या बा, तनि देर बाद कोशिश करीं।",

    available_gap: "खाली समय:",
    days: "दिन",
    save: "सहेजीं",
    close: "बंद करीं"
  },
  awa: {
    app_title: "स्मार्टकिसान किसानी सलाह",
    app_subtitle: "भारत का अपना किसानी ऐप",

    nav_home: "होम",
    nav_my_field: "मोर खेत",
    nav_gap_crop: "गैप फसल",
    nav_mandi: "मंडी भाव",
    nav_weather: "मौसम",
    nav_crop_school: "क्रॉप स्कूल",
    nav_schemes: "सरकारी योजना",
    nav_profile: "प्रोफाइल",
    nav_menu: "मेनू",

    select_language: "अपनी भाषा चुनें",
    active_location: "स्थान",
    farmer_greeting_header: "राम राम किसान भाई! 🙏",
    good_day: "आज आपका दिन शुभ होय! 🌻",
    hero_sub: "खेत के माटी अउर समय के हिसाब से सही वैज्ञानिक सलाह।",
    hero_cta: "मारे खेत बदे फसल बतावा",
    hero_cta_sub: "Gap Crop Recommendation • सिर्फ 2 मिनट मां",

    my_field_summary: "खेत का सारांश",
    field_name: "खेत का नाम",
    area: "क्षेत्रफल",
    previous_crop: "पिछली फसल",
    next_crop: "अगली फसल",
    irrigation_facility: "सिंचाई सुविधा",
    view_full_field: "खेत कै पूरी जानकारी देखा",

    main_services: "मुख्य सेवा",
    gap_crop_card_title: "🌱 Gap Crop सलाह",
    gap_crop_card_desc: "बीच के समय मां सही फसल लगाय के कमाई बढ़ावा।",
    gap_crop_card_cta: "फसल चुना",

    weather_card_title: "🌦 मौसम जानकारी",
    weather_card_desc: "मौसम का सही हाल अउर 7 दिन का फोरकास्ट।",
    weather_card_cta: "मौसम देखा",

    mandi_card_title: "💰 मंडी भाव",
    mandi_card_desc: "नजदीकी मंडी का आज का भाव।",
    mandi_card_cta: "भाव देखा",

    crop_school_card_title: "📚 क्रॉप स्कूल",
    crop_school_card_desc: "खेती की वैज्ञानिक जानकारी।",
    crop_school_card_cta: "सीखा",

    recommendations_title: "आपके खेत बदे सलाह",
    new_recommendation_cta: "नया सलाह देखा",
    why_recommended: "काहे चुनी गइ:",
    rotational_benefit: "🌱 चक्रानुक्रम लाभ:",
    expected_yield: "अनुमानित उपज:",
    official_source: "प्रमाणिक स्त्रोत:",

    gap_form_title: "खेत की जानकारी",
    step_1_location: "📍 Step 1: खेत कहां है? (Location)",
    step_2_prev_crop: "🌾 Step 2: पिछली फसल कौन रही? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: कटाई की तारीख (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: अगली बोआई की तारीख (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: सिंचाई साधन (Irrigation System)",
    step_6_area: "📐 Step 6: खेत का रकबा (Land Area in Acres)",

    btn_next: "आगे बढ़ा (Next)",
    btn_prev: "पाछे (Back)",
    btn_submit_crop: "🌱 फसल बतावा (Get Recommendations)",

    no_suitable_crop_title: "🌾 यह समय मां कउनो फसल नाइ मिली",
    no_suitable_crop_desc: "आपका चुना समय कम है।",
    rejection_reasons_title: "कारण:",
    try_again_cta: "दोबारा देखा",

    error_date_range: "कटाई की तारीख बोआई की तारीख के बाद नाइ होइ सकत।",
    error_validation: "सब जानकारी सही से भरा।",
    error_network: "कनेक्शन नाइ होइ पावत, थोड़ी देर बाद देखा।",

    available_gap: "उपलब्ध समय:",
    days: "दिन",
    save: "सहेजा",
    close: "बंद करा"
  },
  pa: {
    app_title: "ਸਮਾਰਟਕਿਸਾਨ ਖੇਤੀ ਸਲਾਹ",
    app_subtitle: "ਭਾਰਤ ਦੀ ਆਪਣੀ ਖੇਤੀ ਐਪ",

    nav_home: "ਹੋਮ",
    nav_my_field: "ਮੇਰਾ ਖੇਤ",
    nav_gap_crop: "ਗੈਪ ਫ਼ਸਲ",
    nav_mandi: "ਮੰਡੀ ਭਾਅ",
    nav_weather: "ਮੌਸਮ",
    nav_crop_school: "ਕ੍ਰੌਪ ਸਕੂਲ",
    nav_schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    nav_profile: "ਪ੍ਰੋਫਾਈਲ",
    nav_menu: "ਮੁੱਖ ਮੀਨੂ",

    select_language: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    active_location: "ਮੌਜੂਦਾ ਸਥਾਨ",
    farmer_greeting_header: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਜੀ! 🙏",
    good_day: "ਅੱਜ ਤੁਹਾਡਾ ਦਿਨ ਸ਼ੁਭ ਹੋਵੇ! 🌻",
    hero_sub: "ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਮਿੱਟੀ ਅਤੇ ਸਮੇਂ ਅਨੁਸਾਰ ਪ੍ਰਮਾਣਿਕ ਖੇਤੀਬਾੜੀ ਸਲਾਹ।",
    hero_cta: "ਮੇਰੇ ਖੇਤ ਲਈ ਫ਼ਸਲ ਸੁਝਾਓ",
    hero_cta_sub: "Gap Crop Recommendation • ਸਿਰਫ਼ 2 ਮਿੰਟ ਵਿੱਚ",

    my_field_summary: "ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਵੇਰਵਾ",
    field_name: "ਖੇਤ ਦਾ ਨਾਂ",
    area: "ਖੇਤਰਫਲ",
    previous_crop: "ਪਿਛਲੀ ਫ਼ਸਲ",
    next_crop: "ਅਗਲੀ ਫ਼ਸਲ",
    irrigation_facility: "ਸਿੰਚਾਈ ਸਹੂਲਤ",
    view_full_field: "ਖੇਤ ਦੀ ਪੂਰੀ ਜਾਣਕਾਰੀ ਵੇਖੋ",

    main_services: "ਮੁੱਖ ਸੇਵਾਵਾਂ",
    gap_crop_card_title: "🌱 Gap Crop ਸੁਝਾਅ",
    gap_crop_card_desc: "ਖੇਤ ਦੇ ਖਾਲੀ ਸਮੇਂ ਵਿੱਚ ਸਹੀ ਫ਼ਸਲ ਬੀਜ ਕੇ ਆਮਦਨ ਵਧਾਓ।",
    gap_crop_card_cta: "ਫ਼ਸਲ ਚੁਣੋ",

    weather_card_title: "🌦 ਮੌਸਮ ਜਾਣਕਾਰੀ",
    weather_card_desc: "ਸਹੀ ਮੌਸਮ ਜਾਣਕਾਰੀ ਅਤੇ 7 ਦਿਨਾਂ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ।",
    weather_card_cta: "ਮੌਸਮ ਵੇਖੋ",

    mandi_card_title: "💰 ਮੰਡੀ ਭਾਅ",
    mandi_card_desc: "ਨੇੜਲੀ ਮੰਡੀ ਦੇ ਅੱਜ ਦੇ ਭਾਅ।",
    mandi_card_cta: "ਭਾਅ ਵੇਖੋ",

    crop_school_card_title: "📚 ਕ੍ਰੌਪ ਸਕੂਲ",
    crop_school_card_desc: "ਖੇਤੀਬਾੜੀ ਦੀਆਂ ਵਿਗਿਆਨਕ ਗਾਈਡਾਂ।",
    crop_school_card_cta: "ਸਿੱਖੋ",

    recommendations_title: "ਤੁਹਾਡੇ ਖੇਤ ਲਈ ਸੁਝਾਅ",
    new_recommendation_cta: "ਨਵਾਂ ਸੁਝਾਅ ਵੇਖੋ",
    why_recommended: "ਕਿਉਂ ਸੁਝਾਈ ਗਈ:",
    rotational_benefit: "🌱 ਫ਼ਸਲੀ ਚੱਕਰ ਲਾਭ:",
    expected_yield: "ਅਨੁਮਾਨਿਤ ਝਾੜ:",
    official_source: "ਪ੍ਰਮਾਣਿਕ ਸਰੋਤ:",

    gap_form_title: "ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ",
    step_1_location: "📍 Step 1: ਤੁਹਾਡਾ ਖੇਤ ਕਿੱਥੇ ਹੈ? (Location)",
    step_2_prev_crop: "🌾 Step 2: ਪਿਛਲੀ ਫ਼ਸਲ ਕਿਹੜੀ ਸੀ? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: ਫ਼ਸਲ ਕਟਾਈ ਦੀ ਮਿਤੀ (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: ਅਗਲੀ ਬੀਜਾਈ ਦੀ ਮਿਤੀ (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: ਸਿੰਚਾਈ ਦਾ ਸਾਧਨ (Irrigation System)",
    step_6_area: "📐 Step 6: ਖੇਤ ਦਾ ਰਕਬਾ (Land Area in Acres)",

    btn_next: "ਅੱਗੇ ਵਧੋ (Next)",
    btn_prev: "ਪਿੱਛੇ (Back)",
    btn_submit_crop: "🌱 ਫ਼ਸਲ ਸੁਝਾਓ (Get Recommendations)",

    no_suitable_crop_title: "🌾 ਇਸ ਸਮੇਂ ਲਈ ਕੋਈ ਫ਼ਸਲ ਨਹੀਂ ਮਿਲੀ",
    no_suitable_crop_desc: "ਤੁਹਾਡਾ ਚੁਣਿਆ ਸਮਾਂ ਘੱਟ ਹੈ।",
    rejection_reasons_title: "ਕਾਰਨ:",
    try_again_cta: "ਦੁਬਾਰਾ ਵੇਖੋ",

    error_date_range: "ਕਟਾਈ ਦੀ ਮਿਤੀ ਬੀਜਾਈ ਦੀ ਮਿਤੀ ਤੋਂ ਬਾਅਦ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
    error_validation: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸਹੀ ਭਰੋ।",
    error_network: "ਨੈੱਟਵਰਕ ਸਮੱਸਿਆ ਹੈ, ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",

    available_gap: "ਉਪਲਬਧ ਸਮਾਂ:",
    days: "ਦਿਨ",
    save: "ਸਾਂਭੋ",
    close: "ਬੰਦ ਕਰੋ"
  },
  mr: {
    app_title: "स्मार्टकिसान कृषी सल्ला",
    app_subtitle: "भारताचे आपले कृषी ॲप",

    nav_home: "होम",
    nav_my_field: "माझे शेत",
    nav_gap_crop: "गॅप पीक",
    nav_mandi: "बाजार भाव",
    nav_weather: "हवामान",
    nav_crop_school: "क्रॉप स्कूल",
    nav_schemes: "शासकीय योजना",
    nav_profile: "प्रोफाइल",
    nav_menu: "मुख्य मेनू",

    select_language: "आपली भाषा निवडा",
    active_location: "सध्याचे स्थान",
    farmer_greeting_header: "नमस्कार शेतकरी जी! 🙏",
    good_day: "आजचा दिवस शुभ जावो! 🌻",
    hero_sub: "तुमच्या शेताच्या मातीनुसार आणि कालावधीनुसार प्रमाणित कृषी सल्ला।",
    hero_cta: "माझ्या शेतासाठी पीक सुचवा",
    hero_cta_sub: "Gap Crop Recommendation • फक्त २ मिनिटात",

    my_field_summary: "तुमच्या शेताचा तपशील",
    field_name: "शेताचे नाव",
    area: "क्षेत्रफळ",
    previous_crop: "मागील पीक",
    next_crop: "पुढील पीक",
    irrigation_facility: "सिंचन सुविधा",
    view_full_field: "शेताची पूर्ण माहिती पहा",

    main_services: "मुख्य सेवा",
    gap_crop_card_title: "🌱 Gap Crop सल्ला",
    gap_crop_card_desc: "शेताच्या मोकळ्या कालावधीत योग्य पीक घेऊन उत्पन्न वाढवा।",
    gap_crop_card_cta: "पीक निवडा",

    weather_card_title: "🌦 हवामान माहिती",
    weather_card_desc: "अचूक हवामान अंदाज आणि ७ दिवसांचा अंदाज।",
    weather_card_cta: "हवामान पहा",

    mandi_card_title: "💰 बाजार भाव",
    mandi_card_desc: "जवळच्या बाजारातील आजचे दर।",
    mandi_card_cta: "भाव पहा",

    crop_school_card_title: "📚 क्रॉप स्कूल",
    crop_school_card_desc: "शास्त्रीय शेती मार्गदर्शक।",
    crop_school_card_cta: "शिका",

    recommendations_title: "तुमच्या शेतासाठी शिफारसी",
    new_recommendation_cta: "नवीन शिफारस पहा",
    why_recommended: "का सुचवले गेले:",
    rotational_benefit: "🌱 पिकांच्या फेरपालटीचा फायदा:",
    expected_yield: "अंदाजित उत्पादन:",
    official_source: "प्रमाणित स्त्रोत:",

    gap_form_title: "शेताची माहिती",
    step_1_location: "📍 Step 1: तुमचे शेत कोठे आहे? (Location)",
    step_2_prev_crop: "🌾 Step 2: मागील पीक कोणते होते? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: काढणीची तारीख (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: पुढील पेरणीची तारीख (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: सिंचन सुविधा (Irrigation System)",
    step_6_area: "📐 Step 6: शेताचे क्षेत्रफळ (Land Area in Acres)",

    btn_next: "पुढे जा (Next)",
    btn_prev: "मागे (Back)",
    btn_submit_crop: "🌱 पीक सुचवा (Get Recommendations)",

    no_suitable_crop_title: "🌾 या कालावधीत योग्य पीक आढळले नाही",
    no_suitable_crop_desc: "तुमचा निवडलेला कालावधी कमी आहे।",
    rejection_reasons_title: "कारणे:",
    try_again_cta: "पुन्हा तपासा",

    error_date_range: "काढणीची तारीख पेरणीच्या तारखेच्या नंतर असू शकत नाही।",
    error_validation: "कृपया सर्व माहिती अचूक भरा।",
    error_network: "सर्व्हरशी संपर्क होत नाही, थोड्या वेळाने प्रयत्न करा।",

    available_gap: "उपलब्ध कालावधी:",
    days: "दिवस",
    save: "जतन करा",
    close: "बंद करा"
  },
  bn: {
    app_title: "স্মার্টকিসান কৃষি পরামর্শ",
    app_subtitle: "ভারতের নিজস্ব কৃষি অ্যাপ",

    nav_home: "হোম",
    nav_my_field: "আমার জমি",
    nav_gap_crop: "গ্যাপ ফসল",
    nav_mandi: "মন্ডি দর",
    nav_weather: "আবহাওয়া",
    nav_crop_school: "ক্রপ স্কুল",
    nav_schemes: "সরকারি প্রকল্প",
    nav_profile: "প্রোফাইল",
    nav_menu: "প্রধান মেনু",

    select_language: "আপনার ভাষা নির্বাচন করুন",
    active_location: "বর্তমান অবস্থান",
    farmer_greeting_header: "নমস্কার কৃষক ভাই! 🙏",
    good_day: "আজ আপনার দিনটি শুভ হোক! 🌻",
    hero_sub: "আপনার জমির মাটি এবং সময়কাল অনুযায়ী প্রমাণিত বৈজ্ঞানিক পরামর্শ।",
    hero_cta: "আমার জমির জন্য ফসল পছন্দ করুন",
    hero_cta_sub: "Gap Crop Recommendation • মাত্র ২ মিনিটে",

    my_field_summary: "আপনার জমির বিবরণ",
    field_name: "জমির নাম",
    area: "ক্ষেত্রফল",
    previous_crop: "পূর্ববর্তী ফসল",
    next_crop: "পরবর্তী ফসল",
    irrigation_facility: "সেচ ব্যবস্থা",
    view_full_field: "জমির সম্পূর্ণ তথ্য দেখুন",

    main_services: "প্রধান পরিষেবাসমূহ",
    gap_crop_card_title: "🌱 Gap Crop পরামর্শ",
    gap_crop_card_desc: "জমির খালি সময়ে সঠিক ফসল ফলিয়ে আয় বাড়ান।",
    gap_crop_card_cta: "ফসল বাছুন",

    weather_card_title: "🌦 আবহাওয়ার তথ্য",
    weather_card_desc: "সঠিক আবহাওয়ার পূর্বাভাস ও ৭ দিনের তথ্য।",
    weather_card_cta: "আবহাওয়া দেখুন",

    mandi_card_title: "💰ন্ডি দর",
    mandi_card_desc: "নিকটস্থ বাজার দর ও দামের প্রবণতা।",
    mandi_card_cta: "দর দেখুন",

    crop_school_card_title: "📚 ক্রপ স্কুল",
    crop_school_card_desc: "কৃষিবিদ্যার বৈজ্ঞানিক গাইড।",
    crop_school_card_cta: "শিখুন",

    recommendations_title: "আপনার জমির জন্য পরামর্শ",
    new_recommendation_cta: "নতুন পরামর্শ দেখুন",
    why_recommended: "কেন সুপারিশ করা হলো:",
    rotational_benefit: "🌱 ফসল পর্যায়ক্রমিক লাভ:",
    expected_yield: "আনুমানিক ফলন:",
    official_source: "প্রমাণিত উৎস:",

    gap_form_title: "জমির বিবরণ",
    step_1_location: "📍 Step 1: আপনার জমি কোথায়? (Location)",
    step_2_prev_crop: "🌾 Step 2: পূর্ববর্তী ফসল কী ছিল? (Previous Crop)",
    step_3_harvest_date: "📅 Step 3: ফসল কাটার তারিখ (Harvest Date)",
    step_4_sowing_date: "🌱 Step 4: পরবর্তী বোনার তারিখ (Next Sowing Date)",
    step_5_irrigation: "💧 Step 5: সেচ ব্যবস্থা (Irrigation System)",
    step_6_area: "📐 Step 6: জমির পরিমাণ (Land Area in Acres)",

    btn_next: "এগিয়ে যান (Next)",
    btn_prev: "পেছনে (Back)",
    btn_submit_crop: "🌱 ফসল পছন্দ করুন (Get Recommendations)",

    no_suitable_crop_title: "🌾 এই সময়ে কোনো উপযুক্ত ফসল পাওয়া যায়নি",
    no_suitable_crop_desc: "আপনার নির্বাচিত সময়কাল কম।",
    rejection_reasons_title: "কারণসমূহ:",
    try_again_cta: "পুনরায় চেষ্টা করুন",

    error_date_range: "কাটার তারিখ বোনার তারিখের পরে হতে পারে না।",
    error_validation: "অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।",
    error_network: "নেটওয়ার্ক সমস্যা রয়েছে, কিছুক্ষণ পর চেষ্টা করুন।",

    available_gap: "উপলব্ধ সময়:",
    days: "দিন",
    save: "সংরক্ষণ করুন",
    close: "বন্ধ করুন"
  },
  en: {
    app_title: "SmartKisan Agriculture Advisor",
    app_subtitle: "India's Own Farmer Platform",

    nav_home: "Home",
    nav_my_field: "My Field",
    nav_gap_crop: "Gap Crop",
    nav_mandi: "Mandi Rates",
    nav_weather: "Weather",
    nav_crop_school: "Crop School",
    nav_schemes: "Government Schemes",
    nav_profile: "Profile",
    nav_menu: "Main Menu",

    select_language: "Choose your language",
    active_location: "Current Location",
    farmer_greeting_header: "Namaste Kisan ji! 🙏",
    good_day: "Have a blessed farming day! 🌻",
    hero_sub: "Verified agricultural recommendations tailored to your soil, location, and rotation window.",
    hero_cta: "Recommend Crop for My Field",
    hero_cta_sub: "Gap Crop Recommendation • In just 2 minutes",

    my_field_summary: "Your Field Summary",
    field_name: "Field Name",
    area: "Area",
    previous_crop: "Previous Crop",
    next_crop: "Planned Next Crop",
    irrigation_facility: "Irrigation System",
    view_full_field: "View Complete Field Details",

    main_services: "Main Services",
    gap_crop_card_title: "🌱 Gap Crop Advisor",
    gap_crop_card_desc: "Identify suitable short-duration rotational crops during 30-90 day idle windows.",
    gap_crop_card_cta: "Get Recommendation",

    weather_card_title: "🌦 Weather Forecast",
    weather_card_desc: "Accurate local temperature, rainfall, and 7-day agricultural forecast.",
    weather_card_cta: "View Weather",

    mandi_card_title: "💰 Mandi Prices",
    mandi_card_desc: "Today's market rates and price trends at your nearest mandi.",
    mandi_card_cta: "View Mandi Rates",

    crop_school_card_title: "📚 Crop School",
    crop_school_card_desc: "Scientific farming guides, best practices, and expert advice.",
    crop_school_card_cta: "Read & Learn",

    recommendations_title: "Recommendations for Your Field",
    new_recommendation_cta: "Run New Recommendation",
    why_recommended: "Why Recommended:",
    rotational_benefit: "🌱 Rotational Benefit:",
    expected_yield: "Expected Yield:",
    official_source: "Verified Source:",

    gap_form_title: "Farm Rotation Input",
    step_1_location: "📍 Step 1: Field Location",
    step_2_prev_crop: "🌾 Step 2: Previous Harvested Crop",
    step_3_harvest_date: "📅 Step 3: Harvest Date",
    step_4_sowing_date: "🌱 Step 4: Next Planned Sowing Date",
    step_5_irrigation: "💧 Step 5: Irrigation System",
    step_6_area: "📐 Step 6: Cultivable Land Area (Acres)",

    btn_next: "Next",
    btn_prev: "Back",
    btn_submit_crop: "🌱 Get Recommendations",

    no_suitable_crop_title: "🌾 No Suitable Crop Found",
    no_suitable_crop_desc: "The available rotation duration is shorter than the minimum required crop duration.",
    rejection_reasons_title: "Rejection Reasons:",
    try_again_cta: "Try Again",

    error_date_range: "Harvest date cannot be after next sowing date.",
    error_validation: "Please fill all required fields correctly.",
    error_network: "Unable to connect to recommendation service. Please try again shortly.",

    available_gap: "Available Window:",
    days: "Days",
    save: "Save",
    close: "Close"
  }
};

export function getTranslation(lang, key) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en'][key] || TRANSLATIONS['hi'][key] || key;
}
