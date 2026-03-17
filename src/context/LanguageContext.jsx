import React, { createContext, useContext, useState, useEffect } from 'react';

// All supported languages with their native names
export const SUPPORTED_LANGUAGES = [
    { code: 'hi',  name: 'हिंदी',     nativeName: 'हिंदी',          flag: '🇮🇳' },
    { code: 'en',  name: 'English',   nativeName: 'English',        flag: '🇬🇧' },
    { code: 'bn',  name: 'Bengali',   nativeName: 'বাংলা',          flag: '🇮🇳' },
    { code: 'or',  name: 'Odia',      nativeName: 'ଓଡ଼ିଆ',          flag: '🇮🇳' },
    { code: 'mai', name: 'Maithili',  nativeName: 'मैथिली',         flag: '🇮🇳' },
    { code: 'pa',  name: 'Punjabi',   nativeName: 'ਪੰਜਾਬੀ',         flag: '🇮🇳' },
    { code: 'mr',  name: 'Marathi',   nativeName: 'मराठी',           flag: '🇮🇳' },
    { code: 'gu',  name: 'Gujarati',  nativeName: 'ગુજરાતી',        flag: '🇮🇳' },
    { code: 'ta',  name: 'Tamil',     nativeName: 'தமிழ்',           flag: '🇮🇳' },
    { code: 'te',  name: 'Telugu',    nativeName: 'తెలుగు',          flag: '🇮🇳' },
];

const translations = {
    en: {
        // Navigation
        nav_home: "Home", nav_dashboard: "Dashboard", nav_mandi: "Mandi",
        nav_community: "Community", nav_profile: "Profile", nav_chat: "Chat",
        // Common
        greeting: "Namaste", location: "Rohtas, Bihar", loading: "Loading...",
        search: "Search", filter: "Filter", save: "Save", cancel: "Cancel",
        delete: "Delete", edit: "Edit", submit: "Submit", back: "Back", next: "Next", done: "Done",
        // Home
        weather_main: "Today's Weather", rain_alert: "Heavy Rain Alert",
        rain_alert_desc: "Possibility of heavy rain in next 24 hours.",
        ai_sahayak: "AI Assistant", ai_desc: "Speak your problem",
        photo_upload: "Upload Photo", photo_desc: "Identify Disease",
        doc_connect: "Doctor Connect", doc_desc: "Talk to Expert",
        helpline: "Helpline", call_now: "Call Now",
        other_services: "Other Services", soil_test: "Soil Test",
        rent: "Rent Equipment", training: "Training & Safety",
        // Profile
        profile: "Profile", settings: "Settings", language: "Language",
        app_theme: "App Theme", light_mode: "Light Mode", dark_mode: "Dark Mode",
        help_center: "Help Center", logout: "Logout", posts: "Posts",
        questions: "Questions", consultations: "Consultations", farmer_id: "Farmer ID",
        // Mandi
        mandi_prices: "Mandi Prices", today_prices: "Today's Prices",
        search_crop: "Search crop...", trend_up: "Up", trend_down: "Down",
        trend_stable: "Stable", per_quintal: "/quintal", view_trend: "View Trend", sell_now: "Sell Now",
        // Doctor
        find_doctor: "Find Doctor", all_doctors: "All Doctors",
        crop_expert: "Crop Expert", animal_expert: "Animal Expert",
        online: "Online", years_exp: "years exp", consultations_done: "consultations",
        chat: "Chat", audio_call: "Audio", video_call: "Video",
        // Community
        feed: "Feed", live_chat: "Live Chat", my_posts: "My Posts", new_post: "New Post",
        like: "Like", comment: "Comment", share: "Share", expert: "Expert",
        // CreatePost
        create_post_title: "Create New Post", edit_post_title: "Edit Post",
        select_category: "-- Select Topic (Required) --",
        share_placeholder: "What would you like to share with farmer friends?",
        add_tags: "Add tags (#)...", expert_help: "Request Expert Help",
        expert_help_sub: "Verify & Get Advice", posting: "Posting...", post_btn: "Post",
        update_btn: "Update", your_post_language: "Post Language",
        // Training
        videos: "Videos", safety: "Safety Tips", blogs: "Blogs",
        watch_now: "Watch Now", read_more: "Read More", emergency_helpline: "Emergency Helpline",
        // Rog Detector
        disease_detector: "Disease Detector", upload_photo: "Upload Photo",
        take_photo: "Take Photo", choose_gallery: "Choose from Gallery",
        analyzing: "Analyzing...", disease_detected: "Disease Detected", no_disease: "No Disease Found",
        confidence: "Confidence", symptoms: "Symptoms", treatment: "Treatment",
        medicine: "Medicine", consult_doctor: "Consult Doctor",
        // Login
        login_title: "BhumiPutra Sathi", login_subtitle: "Your Digital Farming Partner",
        enter_mobile: "Enter Mobile Number", enter_otp: "Enter 4 digit OTP",
        send_otp: "Send OTP", verify_login: "Verify & Login", resend_otp: "Resend OTP",
        // Chat
        type_message: "Type your message...", send: "Send", ai_typing: "AI is typing...",
        // Weather
        weather_details: "Weather Details", current_temp: "Current Temperature",
        feels_like: "Feels Like", humidity: "Humidity", wind_speed: "Wind Speed",
        pressure: "Pressure", visibility: "Visibility", sunrise: "Sunrise", sunset: "Sunset",
        hourly_forecast: "Hourly Forecast", weekly_forecast: "7-Day Forecast", farming_advice: "Farming Advice",
        // Notifications
        notifications: "Notifications", all: "All", unread: "Unread", read: "Read",
        mark_all_read: "Mark all as read", clear_all: "Clear all",
        no_notifications: "No notifications", new_notification: "When something new happens, it will appear here",
        // Soil Test
        soil_test_title: "Soil Test Application", step: "Step", farmer_details: "Farmer Details",
        full_name: "Full Name", mobile_number: "Mobile Number", email: "Email",
        gender: "Gender", male: "Male", female: "Female", other: "Other", optional: "Optional",
        location_address: "Location & Address", state: "State", district: "District",
        block_tehsil: "Block / Tehsil", village: "Village", select_state: "Select State",
        select_district: "Select District", get_gps_location: "Get GPS Location",
        location_captured: "Location Captured", land_crop_details: "Land & Crop Details",
        land_ownership: "Land Ownership", own: "Own", lease: "Lease",
        total_land_area: "Total Land Area", unit: "Unit", acre: "Acre", bigha: "Bigha",
        hectare: "Hectare", soil_type: "Soil Type", current_crop: "Current Crop",
        planned_crop: "Planned Crop", select_crop: "Select Crop",
        soil_sample_details: "Soil Sample Details", sample_collection_method: "Sample Collection Method",
        home_pickup: "Home Pickup", self_submit: "Self Submit", soil_photo: "Soil Photo",
        take_upload_photo: "Take or Upload Photo", preferred_lab: "Preferred Lab",
        govt_lab: "Government Lab", auto_assign: "Auto Assign",
        consent_text: "I agree to data usage and terms & conditions", previous: "Previous",
        application_successful: "Application Successful!", application_id: "Application ID",
        application_submitted: "Your soil test application has been submitted successfully.",
        application_status: "Application Status", received: "Received",
        sample_collection: "Sample Collection", testing: "Testing", report_ready: "Report Ready",
        go_home: "Go to Home", enter_name: "Enter your name", enter_mobile_10: "10 digit number",
        block_name: "Block name", village_name: "Village name", select: "Select"
    },

    hi: {
        nav_home: "घर", nav_dashboard: "डैशबोर्ड", nav_mandi: "मंडी",
        nav_community: "समुदाय", nav_profile: "प्रोफाइल", nav_chat: "चैट",
        greeting: "नमस्ते", location: "रोहतास, बिहार", loading: "लोड हो रहा है...",
        search: "खोजें", filter: "फ़िल्टर", save: "सेव करें", cancel: "रद्द करें",
        delete: "हटाएं", edit: "संपादित करें", submit: "जमा करें",
        back: "वापस", next: "आगे", done: "हो गया",
        weather_main: "आज का मौसम", rain_alert: "तेज बारिश अलर्ट",
        rain_alert_desc: "अगले 24 घंटे में भारी बारिश की संभावना।",
        ai_sahayak: "AI सहायक", ai_desc: "बोलकर समस्या बताएं",
        photo_upload: "फोटो अपलोड", photo_desc: "रोग पहचानें",
        doc_connect: "डॉक्टर कनेक्ट", doc_desc: "एक्सपर्ट से बात करें",
        helpline: "हेल्पलाइन", call_now: "कॉल करें",
        other_services: "अन्य सुविधाएं", soil_test: "मिट्टी परीक्षण",
        rent: "किराए पर लें", training: "प्रशिक्षण और सुरक्षा",
        profile: "प्रोफाइल", settings: "सेटिंग्स", language: "भाषा (Language)",
        app_theme: "ऐप थीम", light_mode: "लाइट मोड", dark_mode: "डार्क मोड",
        help_center: "मदद केंद्र (Help)", logout: "लॉगआउट", posts: "पोस्ट",
        questions: "सवाल", consultations: "परामर्श", farmer_id: "किसान आईडी",
        mandi_prices: "मंडी भाव", today_prices: "आज के भाव",
        search_crop: "फसल खोजें...", trend_up: "बढ़ा", trend_down: "घटा",
        trend_stable: "स्थिर", per_quintal: "/क्विंटल", view_trend: "ट्रेंड देखें", sell_now: "अभी बेचें",
        find_doctor: "डॉक्टर खोजें", all_doctors: "सभी डॉक्टर",
        crop_expert: "फसल विशेषज्ञ", animal_expert: "पशु विशेषज्ञ",
        online: "ऑनलाइन", years_exp: "साल का अनुभव", consultations_done: "परामर्श",
        chat: "चैट", audio_call: "ऑडियो", video_call: "वीडियो",
        feed: "फीड", live_chat: "लाइव चैट", my_posts: "मेरी पोस्ट", new_post: "नई पोस्ट",
        like: "लाइक", comment: "कमेंट", share: "शेयर", expert: "विशेषज्ञ",
        create_post_title: "नई पोस्ट बनाएं", edit_post_title: "पोस्ट अपडेट करें",
        select_category: "-- विषय चुनें (अनिवार्य) --",
        share_placeholder: "किसान भाइयों के साथ क्या साझा करना चाहेंगे?",
        add_tags: "टैग जोड़ें (#)...", expert_help: "विशेषज्ञ से सलाह लें",
        expert_help_sub: "वेरिफाई और सलाह पाएं", posting: "पोस्ट हो रहा है...", post_btn: "पोस्ट करें",
        update_btn: "अपडेट करें", your_post_language: "पोस्ट की भाषा",
        videos: "वीडियो", safety: "सुरक्षा टिप्स", blogs: "ब्लॉग",
        watch_now: "अभी देखें", read_more: "और पढ़ें", emergency_helpline: "आपातकालीन हेल्पलाइन",
        disease_detector: "रोग पहचानकर्ता", upload_photo: "फोटो अपलोड करें",
        take_photo: "फोटो लें", choose_gallery: "गैलरी से चुनें",
        analyzing: "विश्लेषण हो रहा है...", disease_detected: "रोग पाया गया", no_disease: "कोई रोग नहीं मिला",
        confidence: "विश्वास", symptoms: "लक्षण", treatment: "उपचार",
        medicine: "दवा", consult_doctor: "डॉक्टर से परामर्श लें",
        login_title: "भूमिपुत्र साथी", login_subtitle: "आपका डिजिटल खेती साथी",
        enter_mobile: "मोबाइल नंबर दर्ज करें", enter_otp: "4 अंक का OTP दर्ज करें",
        send_otp: "OTP भेजें", verify_login: "वेरिफाई और लॉगिन", resend_otp: "OTP फिर से भेजें",
        type_message: "अपना संदेश लिखें...", send: "भेजें", ai_typing: "AI टाइप कर रहा है...",
        weather_details: "मौसम विवरण", current_temp: "वर्तमान तापमान",
        feels_like: "महसूस होता है", humidity: "नमी", wind_speed: "हवा की गति",
        pressure: "दबाव", visibility: "दृश्यता", sunrise: "सूर्योदय", sunset: "सूर्यास्त",
        hourly_forecast: "प्रति घंटा पूर्वानुमान", weekly_forecast: "7-दिन का पूर्वानुमान", farming_advice: "खेती सलाह",
        notifications: "सूचनाएं", all: "सभी", unread: "नया", read: "पढ़ा हुआ",
        mark_all_read: "सभी को पढ़ा हुआ करें", clear_all: "सभी हटाएं",
        no_notifications: "कोई सूचना नहीं", new_notification: "जब कुछ नया होगा, यहाँ दिखेगा",
        soil_test_title: "मिट्टी परीक्षण आवेदन", step: "चरण", farmer_details: "किसान विवरण",
        full_name: "पूरा नाम", mobile_number: "मोबाइल नंबर", email: "ईमेल",
        gender: "लिंग", male: "पुरुष", female: "महिला", other: "अन्य", optional: "वैकल्पिक",
        location_address: "स्थान और पता", state: "राज्य", district: "जिला",
        block_tehsil: "ब्लॉक / तहसील", village: "गांव", select_state: "राज्य चुनें",
        select_district: "जिला चुनें", get_gps_location: "GPS स्थान प्राप्त करें",
        location_captured: "स्थान प्राप्त हो गया", land_crop_details: "भूमि और फसल विवरण",
        land_ownership: "भूमि स्वामित्व", own: "स्वयं की", lease: "पट्टे पर",
        total_land_area: "कुल भूमि क्षेत्र", unit: "इकाई", acre: "एकड़", bigha: "बीघा",
        hectare: "हेक्टेयर", soil_type: "मिट्टी का प्रकार", current_crop: "वर्तमान फसल",
        planned_crop: "योजनाबद्ध फसल", select_crop: "फसल चुनें",
        soil_sample_details: "मिट्टी नमूना विवरण", sample_collection_method: "नमूना संग्रह विधि",
        home_pickup: "घर से पिकअप", self_submit: "स्वयं जमा करें", soil_photo: "मिट्टी की फोटो",
        take_upload_photo: "फोटो लें या अपलोड करें", preferred_lab: "पसंदीदा प्रयोगशाला",
        govt_lab: "सरकारी लैब", auto_assign: "स्वतः आवंटित",
        consent_text: "मैं डेटा उपयोग और नियम व शर्तों से सहमत हूं", previous: "पिछला",
        application_successful: "आवेदन सफल!", application_id: "आवेदन संख्या",
        application_submitted: "आपका मिट्टी परीक्षण आवेदन सफलतापूर्वक जमा हो गया है।",
        application_status: "आवेदन स्थिति", received: "प्राप्त",
        sample_collection: "नमूना संग्रह", testing: "परीक्षण", report_ready: "रिपोर्ट तैयार",
        go_home: "होम पर जाएं", enter_name: "अपना नाम दर्ज करें", enter_mobile_10: "10 अंक का नंबर",
        block_name: "ब्लॉक का नाम", village_name: "गांव का नाम", select: "चुनें"
    },

    bn: {
        nav_home: "হোম", nav_dashboard: "ড্যাশবোর্ড", nav_mandi: "মান্ডি",
        nav_community: "সম্প্রদায়", nav_profile: "প্রোফাইল", nav_chat: "চ্যাট",
        greeting: "নমস্কার", location: "রোহতাস, বিহার", loading: "লোড হচ্ছে...",
        search: "খুঁজুন", filter: "ফিল্টার", save: "সংরক্ষণ", cancel: "বাতিল",
        delete: "মুছুন", edit: "সম্পাদনা", submit: "জমা দিন",
        back: "পিছনে", next: "পরবর্তী", done: "সম্পন্ন",
        weather_main: "আজকের আবহাওয়া", ai_sahayak: "AI সহায়ক", ai_desc: "আপনার সমস্যা বলুন",
        photo_upload: "ছবি আপলোড", photo_desc: "রোগ শনাক্ত করুন",
        doc_connect: "ডাক্তার সংযোগ", doc_desc: "বিশেষজ্ঞের সাথে কথা বলুন",
        helpline: "হেল্পলাইন", call_now: "এখনই কল করুন",
        profile: "প্রোফাইল", settings: "সেটিংস", language: "ভাষা",
        logout: "লগআউট", posts: "পোস্ট", consultations: "পরামর্শ",
        find_doctor: "ডাক্তার খুঁজুন", chat: "চ্যাট",
        feed: "ফিড", live_chat: "লাইভ চ্যাট", new_post: "নতুন পোস্ট",
        like: "লাইক", comment: "মন্তব্য", share: "শেয়ার", expert: "বিশেষজ্ঞ",
        create_post_title: "নতুন পোস্ট তৈরি করুন", edit_post_title: "পোস্ট আপডেট করুন",
        select_category: "-- বিষয় নির্বাচন করুন (প্রয়োজনীয়) --",
        share_placeholder: "কৃষক ভাইদের সাথে কী শেয়ার করতে চান?",
        add_tags: "ট্যাগ যোগ করুন (#)...", expert_help: "বিশেষজ্ঞের পরামর্শ নিন",
        expert_help_sub: "যাচাই করুন এবং পরামর্শ পান",
        posting: "পোস্ট হচ্ছে...", post_btn: "পোস্ট করুন", update_btn: "আপডেট করুন",
        your_post_language: "পোস্টের ভাষা",
        send: "পাঠান", type_message: "আপনার বার্তা লিখুন...",
        soil_test: "মাটি পরীক্ষা", mandi_prices: "মান্ডি মূল্য", select: "নির্বাচন করুন",
        all: "সব", other: "অন্যান্য", online: "অনলাইন"
    },

    or: {
        nav_home: "ହୋମ", nav_dashboard: "ଡ୍ୟାଶବୋର୍ଡ", nav_mandi: "ମଣ୍ଡି",
        nav_community: "ସମ୍ପ୍ରଦାୟ", nav_profile: "ପ୍ରୋଫାଇଲ", nav_chat: "ଚ୍ୟାଟ",
        greeting: "ନମସ୍କାର", location: "ରୋହତାସ, ବିହାର", loading: "ଲୋଡ ହେଉଛି...",
        search: "ଖୋଜନ୍ତୁ", filter: "ଫିଲ୍ଟର", save: "ସଞ୍ଚୟ", cancel: "ବାତିଲ",
        delete: "ଡିଲିଟ", edit: "ସଂପାଦନ", submit: "ଦାଖଲ", back: "ଫେରନ୍ତୁ", next: "ପରବର୍ତ୍ତୀ",
        done: "ସମ୍ପୂର୍ଣ", weather_main: "ଆଜିର ପାଣିପାଗ",
        ai_sahayak: "AI ସହାୟକ", ai_desc: "ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ",
        photo_upload: "ଫଟୋ ଅପଲୋଡ", photo_desc: "ରୋଗ ଚିହ୍ନଟ",
        doc_connect: "ଡାକ୍ତର ସଂଯୋଗ", doc_desc: "ବିଶେଷଜ୍ଞଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
        helpline: "ହେଲ୍ପଲାଇନ", call_now: "ଏବେ ଡାକ",
        profile: "ପ୍ରୋଫାଇଲ", settings: "ସେଟିଙ୍ଗ", language: "ଭାଷା",
        logout: "ଲଗଆଉଟ", posts: "ପୋଷ୍ଟ", consultations: "ପରାମର୍ଶ",
        feed: "ଫିଡ", live_chat: "ଲାଇଭ ଚ୍ୟାଟ", new_post: "ନୂଆ ପୋଷ୍ଟ",
        like: "ଲାଇକ", comment: "ମନ୍ତବ୍ୟ", share: "ଶେୟାର", expert: "ବିଶେଷଜ୍ଞ",
        create_post_title: "ନୂଆ ପୋଷ୍ଟ ତିଆରି", edit_post_title: "ପୋଷ୍ଟ ଅପଡେଟ",
        select_category: "-- ବିଷୟ ବାଛନ୍ତୁ (ଆବଶ୍ୟକ) --",
        share_placeholder: "କୃଷକ ଭାଇଙ୍କ ସହ କ'ଣ ଶେୟାର କରିବେ?",
        add_tags: "ଟ୍ୟାଗ ଯୋଡନ୍ତୁ (#)...", expert_help: "ବିଶେଷଜ୍ଞ ପରାମର୍ଶ ନିଅନ୍ତୁ",
        expert_help_sub: "ଯାଞ୍ଚ ଏବଂ ପରାମର୍ଶ ପାଆନ୍ତୁ",
        posting: "ପୋଷ୍ଟ ହେଉଛି...", post_btn: "ପୋଷ୍ଟ କରନ୍ତୁ", update_btn: "ଅପଡେଟ କରନ୍ତୁ",
        your_post_language: "ପୋଷ୍ଟ ଭାଷା",
        send: "ପଠାନ୍ତୁ", type_message: "ଆପଣଙ୍କ ସନ୍ଦେଶ ଲେଖନ୍ତୁ...",
        soil_test: "ମାଟି ପରୀକ୍ଷା", mandi_prices: "ମଣ୍ଡି ମୂଲ୍ୟ", select: "ବାଛନ୍ତୁ",
        all: "ସମସ୍ତ", other: "ଅନ୍ୟ", online: "ଅନ୍ଲାଇନ"
    },

    mai: {
        nav_home: "घर", nav_dashboard: "डैशबोर्ड", nav_mandi: "मंडी",
        nav_community: "समुदाय", nav_profile: "प्रोफाइल", nav_chat: "चैट",
        greeting: "प्रणाम", location: "रोहतास, बिहार", loading: "लोड भऽ रहल अछि...",
        search: "खोजू", filter: "फिल्टर", save: "सेव करू", cancel: "रद्द करू",
        delete: "हटाउ", edit: "संपादित करू", submit: "जमा करू",
        back: "पाछाँ", next: "आगाँ", done: "भेल",
        weather_main: "आइक मौसम", ai_sahayak: "AI सहायक", ai_desc: "अपन समस्या बताउ",
        photo_upload: "फोटो अपलोड", photo_desc: "रोग पहचानू",
        doc_connect: "डॉक्टर कनेक्ट", doc_desc: "विशेषज्ञसँ गप्प करू",
        helpline: "हेल्पलाइन", call_now: "कॉल करू",
        profile: "प्रोफाइल", settings: "सेटिंग्स", language: "भाषा",
        logout: "लॉगआउट", posts: "पोस्ट", consultations: "परामर्श",
        feed: "फीड", live_chat: "लाइव चैट", new_post: "नव पोस्ट",
        like: "लाइक", comment: "टिप्पणी", share: "शेयर", expert: "विशेषज्ञ",
        create_post_title: "नव पोस्ट बनाउ", edit_post_title: "पोस्ट अपडेट करू",
        select_category: "-- विषय चुनू (जरूरी) --",
        share_placeholder: "किसान भाइसँ की साझा करए चाहैत छी?",
        add_tags: "टैग जोड़ू (#)...", expert_help: "विशेषज्ञसँ सला लिअ",
        expert_help_sub: "वेरिफाई करू आ सला पाउ",
        posting: "पोस्ट भऽ रहल अछि...", post_btn: "पोस्ट करू", update_btn: "अपडेट करू",
        your_post_language: "पोस्टक भाषा",
        send: "पठाउ", type_message: "संदेश लिखू...",
        soil_test: "माटि परीक्षण", mandi_prices: "मंडी भाव", select: "चुनू",
        all: "सभ", other: "अन्य", online: "ऑनलाइन"
    },

    pa: {
        nav_home: "ਘਰ", nav_dashboard: "ਡੈਸ਼ਬੋਰਡ", nav_mandi: "ਮੰਡੀ",
        nav_community: "ਭਾਈਚਾਰਾ", nav_profile: "ਪ੍ਰੋਫਾਈਲ", nav_chat: "ਚੈਟ",
        greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", location: "ਰੋਹਤਾਸ, ਬਿਹਾਰ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
        search: "ਖੋਜੋ", filter: "ਫਿਲਟਰ", save: "ਸੁਰੱਖਿਅਤ", cancel: "ਰੱਦ",
        delete: "ਮਿਟਾਓ", edit: "ਸੰਪਾਦਿਤ", submit: "ਜਮਾ ਕਰੋ",
        back: "ਪਿੱਛੇ", next: "ਅਗਲਾ", done: "ਹੋਇਆ",
        weather_main: "ਅੱਜ ਦਾ ਮੌਸਮ", ai_sahayak: "AI ਸਹਾਇਕ", ai_desc: "ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ",
        photo_upload: "ਫੋਟੋ ਅਪਲੋਡ", photo_desc: "ਬਿਮਾਰੀ ਪਛਾਣੋ",
        doc_connect: "ਡਾਕਟਰ ਕਨੈਕਟ", doc_desc: "ਮਾਹਿਰ ਨਾਲ ਗੱਲ ਕਰੋ",
        helpline: "ਹੈਲਪਲਾਈਨ", call_now: "ਹੁਣ ਕਾਲ ਕਰੋ",
        profile: "ਪ੍ਰੋਫਾਈਲ", settings: "ਸੈਟਿੰਗਜ਼", language: "ਭਾਸ਼ਾ",
        logout: "ਲੌਗਆਊਟ", posts: "ਪੋਸਟ", consultations: "ਸਲਾਹ",
        feed: "ਫੀਡ", live_chat: "ਲਾਈਵ ਚੈਟ", new_post: "ਨਵੀਂ ਪੋਸਟ",
        like: "ਲਾਈਕ", comment: "ਟਿੱਪਣੀ", share: "ਸ਼ੇਅਰ", expert: "ਮਾਹਿਰ",
        create_post_title: "ਨਵੀਂ ਪੋਸਟ ਬਣਾਓ", edit_post_title: "ਪੋਸਟ ਅੱਪਡੇਟ",
        select_category: "-- ਵਿਸ਼ਾ ਚੁਣੋ (ਲਾਜ਼ਮੀ) --",
        share_placeholder: "ਕਿਸਾਨ ਭਰਾਵਾਂ ਨਾਲ ਕੀ ਸਾਂਝਾ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
        add_tags: "ਟੈਗ ਜੋੜੋ (#)...", expert_help: "ਮਾਹਿਰ ਦੀ ਸਲਾਹ ਲਓ",
        expert_help_sub: "ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਸਲਾਹ ਪਾਓ",
        posting: "ਪੋਸਟ ਹੋ ਰਿਹਾ ਹੈ...", post_btn: "ਪੋਸਟ ਕਰੋ", update_btn: "ਅੱਪਡੇਟ ਕਰੋ",
        your_post_language: "ਪੋਸਟ ਭਾਸ਼ਾ",
        send: "ਭੇਜੋ", type_message: "ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...",
        soil_test: "ਮਿੱਟੀ ਟੈਸਟ", mandi_prices: "ਮੰਡੀ ਭਾਅ", select: "ਚੁਣੋ",
        all: "ਸਭ", other: "ਹੋਰ", online: "ਔਨਲਾਈਨ"
    },

    mr: {
        nav_home: "मुखपृष्ठ", nav_dashboard: "डॅशबोर्ड", nav_mandi: "मंडी",
        nav_community: "समुदाय", nav_profile: "प्रोफाइल", nav_chat: "चॅट",
        greeting: "नमस्कार", location: "रोहतास, बिहार", loading: "लोड होत आहे...",
        search: "शोधा", filter: "फिल्टर", save: "जतन करा", cancel: "रद्द करा",
        delete: "हटवा", edit: "संपादित करा", submit: "सबमिट करा",
        back: "मागे", next: "पुढे", done: "झाले",
        weather_main: "आजचे हवामान", ai_sahayak: "AI सहाय्यक", ai_desc: "आपली समस्या सांगा",
        photo_upload: "फोटो अपलोड", photo_desc: "रोग ओळखा",
        doc_connect: "डॉक्टर कनेक्ट", doc_desc: "तज्ञाशी बोला",
        helpline: "हेल्पलाइन", call_now: "आता कॉल करा",
        profile: "प्रोफाइल", settings: "सेटिंग्ज", language: "भाषा",
        logout: "लॉगआउट", posts: "पोस्ट", consultations: "सल्लामसलत",
        feed: "फीड", live_chat: "लाइव्ह चॅट", new_post: "नवीन पोस्ट",
        like: "लाइक", comment: "टिप्पणी", share: "शेअर", expert: "तज्ञ",
        create_post_title: "नवीन पोस्ट तयार करा", edit_post_title: "पोस्ट अपडेट करा",
        select_category: "-- विषय निवडा (आवश्यक) --",
        share_placeholder: "शेतकरी बांधवांसोबत काय शेअर करायचे आहे?",
        add_tags: "टॅग जोडा (#)...", expert_help: "तज्ञांचा सल्ला घ्या",
        expert_help_sub: "सत्यापित करा आणि सल्ला घ्या",
        posting: "पोस्ट होत आहे...", post_btn: "पोस्ट करा", update_btn: "अपडेट करा",
        your_post_language: "पोस्टची भाषा",
        send: "पाठवा", type_message: "तुमचा संदेश लिहा...",
        soil_test: "माती चाचणी", mandi_prices: "मंडी भाव", select: "निवडा",
        all: "सर्व", other: "इतर", online: "ऑनलाइन"
    },

    gu: {
        nav_home: "હોમ", nav_dashboard: "ડૅશ્બોર્ડ", nav_mandi: "મંડી",
        nav_community: "સમુદાય", nav_profile: "પ્રોફાઇલ", nav_chat: "ચેટ",
        greeting: "નમસ્તે", location: "રોહતાસ, બિહાર", loading: "લોડ થઈ રહ્યું છે...",
        search: "શોધો", filter: "ફિલ્ટર", save: "સાચવો", cancel: "રદ કરો",
        delete: "ભૂંસો", edit: "સંપાદિત", submit: "સબમિટ", back: "પાછળ", next: "આગળ", done: "થઈ ગયું",
        weather_main: "આજનું હવામાન", ai_sahayak: "AI સહાયક", ai_desc: "તમારી સમસ્યા જણાવો",
        photo_upload: "ફોટો અપલોડ", photo_desc: "રોગ ઓળખો",
        doc_connect: "ડૉક્ટર કનેક્ટ", doc_desc: "નિષ્ણાત સાથે વાત",
        helpline: "હેલ્પલાઇન", call_now: "હવે કૉલ કરો",
        profile: "પ્રોફાઇલ", settings: "સેટિંગ", language: "ભાષા",
        logout: "લૉગ આઉટ", posts: "પોસ્ટ", consultations: "સલાહ",
        feed: "ફીડ", live_chat: "લાઇવ ચેટ", new_post: "નવી પોસ્ટ",
        like: "લાઇક", comment: "ટિપ્પણી", share: "શેર", expert: "નિષ્ણાત",
        create_post_title: "નવી પોસ્ટ બનાવો", edit_post_title: "પોસ્ટ અપડેટ",
        select_category: "-- વિષય પસંદ કરો (જરૂરી) --",
        share_placeholder: "ખેડૂત ભાઈઓ સાથે શું શેર કરવા માગો છો?",
        add_tags: "ટૅગ ઉમેરો (#)...", expert_help: "નિષ્ણાત સલાહ",
        expert_help_sub: "ચકાસો અને સલાહ મેળવો",
        posting: "પોસ્ટ થઈ રહ્યું છે...", post_btn: "પોસ્ટ કરો", update_btn: "અપડેટ કરો",
        your_post_language: "પોસ્ટ ભાષા",
        send: "મોકલો", type_message: "તમારો સંદેશ લખો...",
        soil_test: "માટી પરીક્ષણ", mandi_prices: "મંડી ભાવ", select: "પસંદ કરો",
        all: "બધા", other: "અન્ય", online: "ઓનલાઇન"
    },

    ta: {
        nav_home: "முகப்பு", nav_dashboard: "டாஷ்போர்டு", nav_mandi: "மண்டி",
        nav_community: "சமூகம்", nav_profile: "சுயவிவரம்", nav_chat: "அரட்டை",
        greeting: "வணக்கம்", location: "ரோஹ்தாஸ், பீகார்", loading: "ஏற்றுகிறது...",
        search: "தேடு", filter: "வடிகட்டி", save: "சேமி", cancel: "ரத்து",
        delete: "நீக்கு", edit: "திருத்து", submit: "சமர்ப்பி",
        back: "பின்னால்", next: "அடுத்து", done: "முடிந்தது",
        weather_main: "இன்றைய வானிலை", ai_sahayak: "AI உதவியாளர்", ai_desc: "உங்கள் பிரச்சனை சொல்லுங்கள்",
        photo_upload: "புகைப்படம் பதிவேற்று", photo_desc: "நோய் கண்டறி",
        doc_connect: "மருத்துவர் இணைப்பு", doc_desc: "நிபுணரிடம் பேசுங்கள்",
        helpline: "உதவி எண்", call_now: "இப்போது அழையுங்கள்",
        profile: "சுயவிவரம்", settings: "அமைப்புகள்", language: "மொழி",
        logout: "வெளியேறு", posts: "பதிவுகள்", consultations: "ஆலோசனைகள்",
        feed: "ஃபீட்", live_chat: "நேரலை அரட்டை", new_post: "புதிய பதிவு",
        like: "விரும்பு", comment: "கருத்து", share: "பகிர்", expert: "நிபுணர்",
        create_post_title: "புதிய பதிவு உருவாக்கு", edit_post_title: "பதிவு புதுப்பி",
        select_category: "-- தலைப்பு தேர்ந்தெடுக்கவும் (தேவை) --",
        share_placeholder: "விவசாயி சகோதரர்களுடன் என்ன பகிர விரும்புகிறீர்கள்?",
        add_tags: "குறிச்சொல் சேர்க்கவும் (#)...", expert_help: "நிபுணர் ஆலோசனை",
        expert_help_sub: "சரிபார்த்து ஆலோசனை பெறுங்கள்",
        posting: "பதிவிடுகிறது...", post_btn: "பதிவிடு", update_btn: "புதுப்பி",
        your_post_language: "பதிவு மொழி",
        send: "அனுப்பு", type_message: "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...",
        soil_test: "மண் சோதனை", mandi_prices: "மண்டி விலை", select: "தேர்ந்தெடு",
        all: "அனைத்தும்", other: "மற்றவை", online: "ஆன்லைன்"
    },

    te: {
        nav_home: "హోమ్", nav_dashboard: "డాష్‌బోర్డ్", nav_mandi: "మండి",
        nav_community: "సమాజం", nav_profile: "ప్రొఫైల్", nav_chat: "చాట్",
        greeting: "నమస్కారం", location: "రోహ్తాస్, బీహార్", loading: "లోడ్ అవుతోంది...",
        search: "వెతకండి", filter: "ఫిల్టర్", save: "సేవ్ చేయండి", cancel: "రద్దు",
        delete: "తొలగించు", edit: "సవరించు", submit: "సమర్పించు",
        back: "వెనుకకు", next: "తర్వాత", done: "పూర్తైంది",
        weather_main: "నేటి వాతావరణం", ai_sahayak: "AI సహాయకుడు", ai_desc: "మీ సమస్య చెప్పండి",
        photo_upload: "ఫోటో అప్‌లోడ్", photo_desc: "వ్యాధి గుర్తించండి",
        doc_connect: "డాక్టర్ కనెక్ట్", doc_desc: "నిపుణుడితో మాట్లాడండి",
        helpline: "హెల్ప్‌లైన్", call_now: "ఇప్పుడు కాల్ చేయండి",
        profile: "ప్రొఫైల్", settings: "సెట్టింగ్‌లు", language: "భాష",
        logout: "లాగ్అవుట్", posts: "పోస్ట్‌లు", consultations: "సంప్రదింపులు",
        feed: "ఫీడ్", live_chat: "లైవ్ చాట్", new_post: "కొత్త పోస్ట్",
        like: "లైక్", comment: "వ్యాఖ్య", share: "షేర్", expert: "నిపుణుడు",
        create_post_title: "కొత్త పోస్ట్ సృష్టించు", edit_post_title: "పోస్ట్ అప్‌డేట్",
        select_category: "-- విషయం ఎంచుకో (తప్పనిసరి) --",
        share_placeholder: "రైతు సోదరులతో ఏమి పంచుకోవాలనుకుంటున్నారు?",
        add_tags: "ట్యాగ్‌లు జోడించు (#)...", expert_help: "నిపుణుడి సలహా తీసుకోండి",
        expert_help_sub: "ధృవీకరించు మరియు సలహా పొందు",
        posting: "పోస్ట్ అవుతోంది...", post_btn: "పోస్ట్ చేయండి", update_btn: "అప్‌డేట్ చేయండి",
        your_post_language: "పోస్ట్ భాష",
        send: "పంపు", type_message: "మీ సందేశం రాయండి...",
        soil_test: "నేల పరీక్ష", mandi_prices: "మండీ ధరలు", select: "ఎంచుకోండి",
        all: "అన్నీ", other: "ఇతరాలు", online: "ఆన్‌లైన్"
    }
};

// Fallback: use English if key not in language
function getTranslation(lang, key) {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
}

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('bps_language');
        return saved && translations[saved] ? saved : 'hi';
    });

    useEffect(() => {
        localStorage.setItem('bps_language', lang);
    }, [lang]);

    const t = (key) => getTranslation(lang, key);

    const toggleLanguage = () => {
        setLang(prev => (prev === 'hi' ? 'en' : 'hi'));
    };

    const setLanguage = (newLang) => {
        if (translations[newLang]) setLang(newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: setLanguage, toggleLanguage, t, SUPPORTED_LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
