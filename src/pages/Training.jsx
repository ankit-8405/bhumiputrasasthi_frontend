import React, { useState, useEffect } from 'react';
import { Play, Shield, BookOpen, AlertTriangle, CloudLightning, Activity, CheckCircle, X, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Training.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TRAINING_T = {
    // UI
    page_title: { hi: 'किसान पाठशाला 📚', en: 'Farmer School 📚', bn: 'কৃষক পাঠশালা 📚', or: 'କୃଷକ ପାଠଶାଳା 📚', mai: 'किसान पाठशाला 📚', pa: 'ਕਿਸਾਨ ਪਾਠਸ਼ਾਲਾ 📚', mr: 'शेतकरी शाळा 📚', gu: 'ખેડૂત શાળા 📚', ta: 'விவசாயி பள்ளி 📚', te: 'రైతు పాఠశాల 📚' },
    page_sub: { hi: 'सीखें और आगे बढ़ें', en: 'Learn and Grow', bn: 'শিখুন এবং এগিয়ে যান', or: 'ଶିଖନ୍ତୁ ଏବଂ ଆଗକୁ ବଢନ୍ତୁ', mai: 'सीखू आ आगू बढ़ू', pa: 'ਸਿੱਖੋ ਅਤੇ ਵਧੋ', mr: 'शिका आणि पुढे जा', gu: 'શીખો અને આગળ વધો', ta: 'கற்று வளருங்கள்', te: 'నేర్చుకోండి మరియు ఎదగండి' },
    tab_videos: { hi: 'वीडियो', en: 'Videos', bn: 'ভিডিও', or: 'ଭିଡିଓ', mai: 'वीडियो', pa: 'ਵੀਡੀਓ', mr: 'व्हिडिओ', gu: 'વિડિઓઝ', ta: 'காணொளிகள்', te: 'వీడియోలు' },
    tab_safety: { hi: 'सुरक्षा', en: 'Safety', bn: 'নিরাপত্তা', or: 'ସୁରକ୍ଷା', mai: 'सुरक्षा', pa: 'ਸੁਰੱਖਿਆ', mr: 'सुरक्षा', gu: 'સલામતી', ta: 'பாதுகாப்பு', te: 'భద్రత' },
    loading: { hi: 'लोड हो रहा है...', en: 'Loading...', bn: 'লোড হচ্ছে...', or: 'ଲୋଡ୍ ହେଉଛି...', mai: 'लोड भ रहल अछि...', pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...', mr: 'लोड होत आहे...', gu: 'લોડ થઈ રહ્યું છે...', ta: 'ஏற்றப்படுகிறது...', te: 'లోడ్ అవుతోంది...' },
    views: { hi: 'व्यू', en: 'views', bn: 'বার দেখা হয়েছে', or: 'ଥର ଦେଖାଯାଇଛି', mai: 'व्यू', pa: 'ਵਿਊਜ਼', mr: 'दृश्य', gu: 'વ્યુઝ', ta: 'பார்வைகள்', te: 'వ్యూస్' },
    
    // Safety & Helpline
    helpline: { hi: '🆘 आपातकालीन हेल्पलाइन', en: '🆘 Emergency Helpline', bn: '🆘 জরুরি হেল্পলাইন', or: '🆘 ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍', mai: '🆘 आपातकालीन हेल्पलाइन', pa: '🆘 ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ', mr: '🆘 आपत्कालीन हेल्पलाइन', gu: '🆘 કટોકટી હેલ્પલાઇન', ta: '🆘 அவசர உதவி எண்', te: '🆘 అత్యవసర హెల్ప్‌లైన్' },
    ambu: { hi: '🚑 एम्बुलेंस: 108', en: '🚑 Ambulance: 108', bn: '🚑 অ্যাম্বুলেন্স: 108', or: '🚑 ଆମ୍ବୁଲାନ୍ସ: 108', mai: '🚑 एम्बुलेंस: 108', pa: '🚑 ਐਂਬੂਲੈਂਸ: 108', mr: '🚑 रुग्णवाहिका: 108', gu: '🚑 એમ્બ્યુલન્સ: 108', ta: '🚑 ஆம்புலன்ஸ்: 108', te: '🚑 అంబులెన్స్: 108' },
    fire: { hi: '🚒 फायर: 101', en: '🚒 Fire: 101', bn: '🚒 ফায়ার: 101', or: '🚒 ନିଆଁ: 101', mai: '🚒 फायर: 101', pa: '🚒 ਫਾਇਰ: 101', mr: '🚒 अग्निशमन: 101', gu: '🚒 ફાયર: 101', ta: '🚒 தீயணைப்பு: 101', te: '🚒 అగ్నిమాపక: 101' },
    police: { hi: '👮 पुलिस: 112', en: '👮 Police: 112', bn: '👮 পুলিশ: 112', or: '👮 ପୋଲିସ୍: 112', mai: '👮 पुलिस: 112', pa: '👮 ਪੁਲਿਸ: 112', mr: '👮 पोलीस: 112', gu: '👮 પોલીસ: 112', ta: '👮 காவல்: 112', te: '👮 పోలీస్: 112' },

    // Quiz
    quiz_title: { hi: 'छोटी परीक्षा', en: 'Quick Quiz', bn: 'সংক্ষিপ্ত কুইজ', or: 'ସଂକ୍ଷିପ୍ତ କୁଇଜ୍', mai: 'छोट परीक्षा', pa: 'ਛੋਟੀ ਪ੍ਰੀਖਿਆ', mr: 'छोटी चाचणी', gu: 'ક્વિક ક્વિઝ', ta: 'விரைவான வினாடி வினா', te: 'చిన్న క్విజ్' },
    submit: { hi: 'जमा करें', en: 'Submit', bn: 'জমা দিন', or: 'ଦାଖଲ କରନ୍ତୁ', mai: 'जमा करू', pa: 'ਜਮ੍ਹਾਂ ਕਰੋ', mr: 'सबमिट करा', gu: 'સબમિટ કરો', ta: 'சமர்ப்பி', te: 'సమర్పించండి' },
    close: { hi: 'बंद करें', en: 'Close', bn: 'বন্ধ করুন', or: 'ବନ୍ଦ କରନ୍ତୁ', mai: 'बंद करू', pa: 'ਬੰਦ ਕਰੋ', mr: 'बंद करा', gu: 'બંધ કરો', ta: 'மூடு', te: 'మూసివేయి' },
    pass_msg: { hi: 'शाबाश! आप पास हो गए', en: 'Congratulations! You Passed!', bn: 'অভিনন্দন! আপনি পাস করেছেন!', or: 'ଅଭିନନ୍ଦନ! ଆପଣ ପାସ୍ କରିଛନ୍ତି!', mai: 'शाबाश! अहाँ पास भ गेलहुँ', pa: 'ਵਧਾਈਆਂ! ਤੁਸੀਂ ਪਾਸ ਹੋ ਗਏ!', mr: 'अभिनंदन! तुम्ही पास झालात!', gu: 'અભિનંદન! તમે પાસ થયા!', ta: 'வாழ்த்துக்கள்! நீங்கள் வெற்றி பெற்றீர்கள்!', te: 'అభినందనలు! మీరు పాస్ అయ్యారు!' },
    fail_msg: { hi: 'दोबारा कोशिश करें', en: 'Try Again', bn: 'আবার চেষ্টা করুন', or: 'ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ', mai: 'दोबारा प्रयास करू', pa: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ', mr: 'पुन्हा प्रयत्न करा', gu: 'ફરી પ્રયાસ કરો', ta: 'மீண்டும் முயற்சிக்கவும்', te: 'మళ్లీ ప్రయత్నించండి' }
};

const getT = (lang, key) => (TRAINING_T[key] && TRAINING_T[key][lang]) || (TRAINING_T[key] && TRAINING_T[key]['en']) || key;

const CATEGORIES = [
    { id: 'all', hi: 'सभी', en: 'All', bn: 'সব', or: 'ସମସ୍ତ', mai: 'सबहि', pa: 'ਸਾਰੇ', mr: 'सर्व', gu: 'તમામ', ta: 'அனைத்து', te: 'అన్ని' },
    { id: 'modern_farming', hi: 'आधुनिक खेती', en: 'Modern Farming', bn: 'আধুনিক কৃষি', or: 'ଆଧୁନିକ କୃଷି', mai: 'आधुनिक खेती', pa: 'ਆਧੁਨਿਕ ਖੇਤੀ', mr: 'आधुनिक शेती', gu: 'આધુનિક ખેતી', ta: 'நவீன விவசாயம்', te: 'ఆధునిక వ్యవసాయం' },
    { id: 'organic_farming', hi: 'जैविक खेती', en: 'Organic Farming', bn: 'জৈব কৃষি', or: 'ଜୈବ କୃଷି', mai: 'जैविक खेती', pa: 'ਜੈਵਿਕ ਖੇਤੀ', mr: 'सेंद्रिय शेती', gu: 'ઓર્ગેનિક ખેતી', ta: 'இயற்கை விவசாயம்', te: 'సేంద్రియ వ్యవసాయం' },
    { id: 'drip_irrigation', hi: 'ड्रिप सिंचाई', en: 'Drip Irrigation', bn: 'ড্রিপ সেচ', or: 'ବୁନ୍ଦା ଜଳସେଚନ', mai: 'ड्रिप सिंचाई', pa: 'ਡਰਿਪ ਸਿੰਚਾਈ', mr: 'ठिबक सिंचन', gu: 'ટપક સિંચાઈ', ta: 'சொட்டு நீர் பாசனம்', te: 'బిందు సేద్యం' },
    { id: 'pest_management', hi: 'कीट प्रबंधन', en: 'Pest Management', bn: 'কীটপতঙ্গ ব্যবস্থাপনা', or: 'କୀଟନାଶକ ପରିଚାଳନା', mai: 'कीट प्रबंधन', pa: 'ਕੀਟ ਪ੍ਰਬੰਧਨ', mr: 'कीड व्यवस्थापन', gu: 'જંતુ વ્યવસ્થાપન', ta: 'பூச்சி மேலாண்மை', te: 'తెగులు నిర్వహణ' },
    { id: 'govt_schemes', hi: 'सरकारी योजनाएं', en: 'Govt Schemes', bn: 'সরকারি প্রকল্প', or: 'ସରକାରୀ ଯୋଜନା', mai: 'सरकारी योजना सभ', pa: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ', mr: 'सरकारी योजना', gu: 'સરકારી યોજનાઓ', ta: 'அரசு திட்டங்கள்', te: 'ప్రభుత్వ పథకాలు' },
    { id: 'market_linkage', hi: 'बाजार संपर्क', en: 'Market Linkage', bn: 'বাজার সংযোগ', or: 'ବଜାର ସଂଯୋଗ', mai: 'बाजार संपर्क', pa: 'ਬਾਜ਼ਾਰ ਸੰਪਰਕ', mr: 'बाजार जोडणी', gu: 'બજાર સંપર્ક', ta: 'சந்தை இணைப்பு', te: 'మార్కెట్ అనుసంధానం' },
];

const SAFETY_TIPS = [
    {
        id: 1, icon: '⚡',
        title: { hi: 'बिजली गिरने से सुरक्षा', en: 'Lightning Safety', bn: 'বজ্রপাত থেকে নিরাপত্তা', or: 'ବଜ୍ରପାତରୁ ସୁରକ୍ଷା', mai: 'बिजली खसल सँ सुरक्षा', pa: 'ਬਿਜਲੀ ਤੋਂ ਸੁਰੱਖਿਆ', mr: 'वीज पडण्यापासून सुरक्षा', gu: 'વીજળીથી સલામતી', ta: 'மின்னல் பாதுகாப்பு', te: 'మెరుపుల నుండి భద్రత' },
        desc: { hi: 'कड़कती बिजली में खेत में काम बंद करें। पेड़ के नीचे न खड़े हों। पक्के मकान में जाएं।', en: 'Stop working in fields during lightning. Avoid standing under trees. Go to a solid building.', bn: 'বজ্রপাতের সময় মাঠে কাজ বন্ধ করুন। গাছের নিচে দাঁড়াবেন না। একটি শক্ত ভবনে যান।', or: 'ବଜ୍ରପାତ ସମୟରେ ବିଲରେ କାମ ବନ୍ଦ କରନ୍ତୁ। ଗଛ ତଳେ ଛିଡା ହୁଅନ୍ତୁ ନାହିଁ। ଏକ ପକ୍କା ଘରକୁ ଯାଆନ୍ତୁ।', mai: 'बिजली कड़कैत काल खेतमे काज बंद करू। गाछक नीचाँ ठाढ़ नहि होउ। पक्का मकानमे जाउ।', pa: 'ਬਿਜਲੀ ਚਮਕਣ ਵੇਲੇ ਖੇਤਾਂ ਵਿੱਚ ਕੰਮ ਬੰਦ ਕਰੋ। ਦਰੱਖਤਾਂ ਹੇਠਾਂ ਖੜ੍ਹਨ ਤੋਂ ਬਚੋ। ਪੱਕੀ ਇਮਾਰਤ ਵਿੱਚ ਜਾਓ।', mr: 'वीज कडाडताना शेतात काम करणे थांबवा. झाडाखाली उभे राहणे टाळा. पक्क्या इमारतीत जा.', gu: 'વીજળી વખતે ખેતરમાં કામ કરવાનું બંધ કરો. ઝાડ નીચે ઊભા રહેવાનું ટાળો. પાકા મકાનમાં જાઓ.', ta: 'மின்னலின் போது வயல்வெளியில் வேலை செய்வதை நிறுத்துங்கள். மரங்களுக்கு அடியில் நிற்பதை தவிர்க்கவும். பாதுகாப்பான கட்டிடத்திற்கு செல்லவும்.', te: 'మెరుపుల సమయంలో పొలాల్లో పని చేయడం ఆపండి. చెట్ల కింద నిలబడటం నివారించండి. పక్కా భవనానికి వెళ్లండి.' }
    },
    {
        id: 2, icon: '🐍',
        title: { hi: 'सांप काटने पर प्रथमिक उपचार', en: 'Snake Bite First Aid', bn: 'সাপে কামড়ানোর প্রাথমিক চিকিৎসা', or: 'ସାପ କାମୁଡିଲେ ପ୍ରାଥମିକ ଚିକିତ୍ସା', mai: 'साँप डसल पर प्रथमिक उपचार', pa: 'ਸੱਪ ਦੇ ਕੱਟਣ ਤੇ ਮੁਢਲੀ ਸਹਾਇতা', mr: 'साप चावल्यावर प्रथमोपचार', gu: 'સાપ કરડવા પર પ્રાથમિક સારવાર', ta: 'பாம்பு கடி முதலுதவி', te: 'పాము కాటుకు ప్రథమ చికిత్స' },
        desc: { hi: 'घबराएं नहीं। मरीज को शांत रखें और तुरंत अस्पताल ले जाएं। झाड़-फूंक में समय नष्ट न करें।', en: 'Stay calm. Keep patient still and rush to hospital immediately. Do not waste time on rituals.', bn: 'শান্ত থাকুন। রোগীকে স্থির রাখুন এবং অবিলম্বে হাসপাতালে নিয়ে যান। ঝাড়ফুঁকে সময় নষ্ট করবেন না।', or: 'ଶାନ୍ତ ରହନ୍ତୁ। ରୋଗୀଙ୍କୁ ସ୍ଥିର ରଖନ୍ତୁ ଏବଂ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ନେଇଯାଆନ୍ତୁ। ଗୁଣିଗାରେଡ଼ିରେ ସମୟ ନଷ୍ଟ କରନ୍ତୁ ନାହିଁ।', mai: 'घबराउ नहि। मरीजकेँ शांत राखू आ तुरन्त अस्पताल ल जाउ। झाड़-फूंकमे समय नष्ट नहि करू।', pa: 'ਸ਼ਾਂਤ ਰਹੋ। ਮਰੀਜ਼ ਨੂੰ ਸਥਿਰ ਰੱਖੋ ਅਤੇ ਤੁਰੰਤ ਹਸਪਤਾਲ ਲੈ ਜਾਓ। ਜਾਦੂ-ਟੂਣੇ ਵਿੱਚ ਸਮਾਂ ਬਰਬਾਦ ਨਾ ਕਰੋ।', mr: 'शांत राहा. रुग्णाला स्थिर ठेवा आणि त्वरित रुग्णालयात घेऊन जा. मांत्रिक-भोंदूगिरीत वेळ घालवू नका.', gu: 'શાંત રહો. દર્દીને સ્થિર રાખો અને તરત જ હોસ્પિટલ લઈ જાઓ. દોરા-ધાગામાં સમય ન બગાડો.', ta: 'அமைதியாக இருங்கள். நோயாளியை நகர்த்தாமல் உடனடியாக மருத்துவமனைக்கு கொண்டு செல்லுங்கள். சடங்குகளில் நேரத்தை வீணாக்காதீர்கள்.', te: 'ప్రశాంతంగా ఉండండి. రోగిని కదలకుండా ఉంచి వెంటనే ఆసుపత్రికి తీసుకెళ్లండి. మూఢనమ్మకాలతో సమయం వృధా చేయవద్దు.' }
    },
    {
        id: 3, icon: '☠️',
        title: { hi: 'कीटनाशक का सावधान प्रयोग', en: 'Safe Pesticide Use', bn: 'কীটনাশকের নিরাপদ ব্যবহার', or: 'କୀଟନାଶକର ସୁରକ୍ଷିତ ବ୍ୟବହାର', mai: 'कीटनाशकक सावधान प्रयोग', pa: 'ਕੀਟਨਾਸ਼ਕ ਦੀ ਸੁਰੱਖਿਅਤ ਵਰਤੋਂ', mr: 'कीटकनाशकाचा सुरक्षित वापर', gu: 'જંતુનાશકનો સુરક્ષિત ઉપયોગ', ta: 'பாதுகாப்பான பூச்சிக்கொல்லி பயன்பாடு', te: 'సురక్షిత పురుగుమందుల వాడకం' },
        desc: { hi: 'दवा छिड़कते समय मास्क और दस्ताने पहनें। हवा की दिशा में छिड़काव न करें।', en: 'Wear mask and gloves when spraying. Do not spray against the wind direction.', bn: 'ওষুধ ছিটানোর সময় মাস্ক এবং গ্লাভস পরুন। বাতাসের বিপরীতে স্প্রে করবেন না।', or: 'ଔଷଧ ସ୍ପ୍ରେ କରିବା ସମୟରେ ମାସ୍କ ଏବଂ ଗ୍ଲୋଭସ୍ ପିନ୍ଧନ୍ତୁ। ପବନର ବିପରୀତ ଦିଗରେ ସ୍ପ୍ରେ କରନ୍ତୁ ନାହିଁ।', mai: 'दवा छिड़कैत काल मास्क आ दस्ताना पहिरू। हवाक दिशाक विपरीत छिड़काव नहि करू।', pa: 'ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਪਹਿਨੋ। ਹਵਾ ਦੀ ਦਿਸ਼ਾ ਦੇ ਉਲਟ ਸਪਰੇਅ ਨਾ ਕਰੋ।', mr: 'फवारणी करताना मास्क आणि हातमोजे घाला. वाऱ्याच्या विरुद्ध दिशेने फवारणी करू नका.', gu: 'દવા છાંટતી વખતે માસ્ક અને હાથમોજાં પહેરો. પવનની વિરુદ્ધ દિશામાં છંટકાવ ન કરો.', ta: 'மருந்து தெளிக்கும் போது முக்கவசம் மற்றும் கையுறைகளை அணியுங்கள். காற்று வீசும் திசைக்கு எதிராக தெளிக்க வேண்டாம்.', te: 'మందులు పిచికారీ చేసేటప్పుడు మాస్క్ మరియు చేతి తొడుగులు ధరించండి. గాలికి ఎదురుగా పిచికారీ చేయవద్దు.' }
    },
    {
        id: 4, icon: '☀️',
        title: { hi: 'लू (हीट स्ट्रोक) से बचाव', en: 'Heat Stroke Prevention', bn: 'হিট স্ট্রোক প্রতিরোধ', or: 'ଅଂଶୁଘାତ (ହିଟ୍ ଷ୍ଟ୍ରୋକ୍) ନିରାକରଣ', mai: 'लू (हीट स्ट्रोक) सँ बचाव', pa: 'ਲੂ (ਹੀਟ ਸਟ੍ਰੋਕ) ਤੋਂ ਬਚਾਅ', mr: 'उष्माघात प्रतिबंध', gu: 'લૂ (હીટ સ્ટ્રોક) નિવારણ', ta: 'வெப்பத்தடுப்பு (ஹீட் ஸ்ட்ரோக்)', te: 'వడదెబ్బ నివారణ' },
        desc: { hi: 'दोपहर 12-4 बजे काम न करें। छाया में आराम करें, पानी पीते रहें।', en: 'Avoid working from 12-4 PM. Rest in shade and keep drinking water.', bn: 'দুপুর ১২-৪ মিনিট পর্যন্ত কাজ করবেন না। ছায়ায় বিশ্রাম নিন এবং পানি পান করতে থাকুন।', or: 'ଦିନ ୧୨ ରୁ ୪ ଟା ମଧ୍ୟରେ କାମ କରନ୍ତୁ ନାହିଁ। ଛାଇରେ ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପାଣି ପିଅନ୍ତୁ।', mai: 'दोपहर १२-४ बजे काज नहि करू। छाँहीमे आराम करू, पानि पीबैत रहू।', pa: 'ਦੁਪਹਿਰ 12-4 ਵਜੇ ਤੱਕ ਕੰਮ ਕਰਨ ਤੋਂ ਬਚੋ। ਛਾਂ ਵਿੱਚ ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ।', mr: 'दुपारी 12-4 दरम्यान काम टाळा. सावलीत विश्रांती घ्या आणि पाणी पीत राहा.', gu: 'બપોરે 12-4 વાગ્યા સુધી કામ કરવાનું ટાળો. છાયામાં આરામ કરો અને પાણી પીતા રહો.', ta: 'பகல் 12 முதல் 4 மணி வரை வேலை செய்வதைத் தவிர்க்கவும். நிழலில் ஓய்வெடுத்து, தண்ணீர் குடித்துக்கொண்டே இருக்கவும்.', te: 'మధ్యాహ్నం 12-4 గంటల మధ్య పని చేయడం మానుకోండి. నీడలో విశ్రాంతి తీసుకోండి మరియు నీరు తాగుతూ ఉండండి.' }
    },
    {
        id: 5, icon: '💧',
        title: { hi: 'खेत में डूबने से बचाव', en: 'Drowning Prevention in Fields', bn: 'মাঠে ডুবে যাওয়া প্রতিরোধ', or: 'ବିଲରେ ବୁଡିଯିବାରୁ ରକ୍ଷା', mai: 'खेतमे डूबै सँ बचाव', pa: 'ਖੇਤਾਂ ਵਿੱਚ ਡੁੱਬਣ ਤੋਂ ਬਚਾਅ', mr: 'शेतात बुडण्यापासून बचाव', gu: 'ખેતરમાં ડૂબતા અટકાવવું', ta: 'வயல்களில் மூழ்குவதைத் தடுத்தல்', te: 'పొలాల్లో మునిగిపోకుండా నివారణ' },
        desc: { hi: 'खेत की नहरों के पास बच्चों को अकेला न छोड़ें। तैरना न जानने वालों को गहरे पानी से दूर रखें।', en: 'Do not leave children alone near field canals. Keep non-swimmers away from deep water.', bn: 'মাঠের খালের কাছে শিশুদের একা রাখবেন না। সাঁতার না জানা ব্যক্তিদের গভীর জল থেকে দূরে রাখুন।', or: 'ବିଲର କେନାଲ ପାଖରେ ପିଲାମାନଙ୍କୁ ଏକାକୀ ଛାଡନ୍ତୁ ନାହିଁ। ପହଁରିବା ଜାଣିନଥିବା ଲୋକଙ୍କୁ ଗଭୀର ପାଣିରୁ ଦୂରେଇ ରଖନ୍ତୁ।', mai: 'खेतक नहरक लग बच्चाकेँ अकेले नहि छोड़ू। पौड़य नहि जानए बलाकेँ गहिर पानि सँ दूर राखू।', pa: 'ਬੱਚਿਆਂ ਨੂੰ ਖੇਤ ਦੀਆਂ ਨਹਿਰਾਂ ਦੇ ਨੇੜੇ ਇਕੱਲੇ ਨਾ ਛੱਡੋ। ਤੈਰਨਾ ਨਾ ਜਾਣਨ ਵਾਲਿਆਂ ਨੂੰ ਡੂੰਘੇ ਪਾਣੀ ਤੋਂ ਦੂਰ ਰੱਖੋ।', mr: 'शेतातील कालव्यांजवळ मुलांना एकटे सोडू नका. पोहता न येणाऱ्यांना खोल पाण्यापासून दूर ठेवा.', gu: 'બાળકોને ખેતરની નહેરો પાસે એકલા ન છોડો. જેમને તરતા ન આવડતું હોય તેમને ઊંડા પાણીથી દૂર રાખો.', ta: 'வயல் கால்வாய்கள் அருகே குழந்தைகளை தனியாக விடாதீர்கள். நீச்சல் தெரியாதவர்களை ஆழமான நீரிலிருந்து தள்ளி வைக்கவும்.', te: 'పొలంలోని కాలువల దగ్గర పిల్లలను ఒంటరిగా వదిలివేయవద్దు. ఈత రాని వారిని లోతైన నీటికి దూరంగా ఉంచండి.' }
    }
];

export default function Training() {
    const { lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('training');
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedModule, setSelectedModule] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizResult, setQuizResult] = useState(null);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const url = activeCategory === 'all'
                ? `${API_BASE}/training/modules`
                : `${API_BASE}/training/modules?category=${activeCategory}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) setModules(data.modules);
        } catch (e) {
            if (import.meta.env.DEV) console.error('Training fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const res = await fetch(`${API_BASE}/training/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setProgress(data.progress);
        } catch { /* silent */ }
    };

    useEffect(() => {
        fetchModules();
        if (token) fetchProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory, token]);

    const openModule = async (mod) => {
        setSelectedModule(mod);
        setQuiz(null);
        setQuizAnswers([]);
        setQuizResult(null);
        // Fetch quiz
        try {
            const res = await fetch(`${API_BASE}/training/modules/${mod.id}/quiz`);
            const data = await res.json();
            if (data.success && data.hasQuiz) setQuiz(data.questions);
        } catch { /* silent */ }
    };

    const submitQuiz = async () => {
        if (!selectedModule || !quiz) return;
        try {
            const res = await fetch(`${API_BASE}/training/modules/${selectedModule.id}/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({ answers: quizAnswers })
            });
            const data = await res.json();
            if (data.success) {
                setQuizResult(data);
                if (data.passed) {
                    setProgress(prev => ({ ...prev, [selectedModule.id]: { completed: true, score: data.score } }));
                }
            }
        } catch { /* silent */ }
    };

    const getLocalizedModField = (mod, field) => {
        const key = `${field}_${activeLang}`;
        if (mod[key]) return mod[key];
        // fallback
        return activeLang === 'hi' ? (mod[`${field}_hi`] || mod[`${field}_en`]) : (mod[`${field}_en`] || mod[`${field}_hi`]);
    };

    return (
        <div className="page-content pb-safe">
            <header className="page-header training-header">
                <div>
                    <h2>{getT(activeLang, 'page_title')}</h2>
                    <p className="subtitle">{getT(activeLang, 'page_sub')}</p>
                </div>
            </header>

            <div className="tabs-pill-style">
                <button className={`pill-tab ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')}>
                    <BookOpen size={18} /> {getT(activeLang, 'tab_videos')}
                </button>
                <button className={`pill-tab ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
                    <Shield size={18} /> {getT(activeLang, 'tab_safety')}
                </button>
            </div>

            {activeTab === 'training' ? (
                <div>
                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 0', scrollbarWidth: 'none' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                    background: activeCategory === cat.id ? 'var(--primary)' : 'var(--card-bg)',
                                    color: activeCategory === cat.id ? 'white' : 'var(--text-primary)',
                                    fontSize: '13px', whiteSpace: 'nowrap', fontWeight: activeCategory === cat.id ? '600' : '400'
                                }}
                            >
                                {cat[activeLang] || cat['en']}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="spinner"></div>
                            <p>{getT(activeLang, 'loading')}</p>
                        </div>
                    ) : (
                        <div className="video-grid">
                            {modules.map(mod => {
                                const done = progress[mod.id]?.completed;
                                const title = getLocalizedModField(mod, 'title');
                                const desc = getLocalizedModField(mod, 'desc');
                                return (
                                    <div key={mod.id} className="video-card" onClick={() => openModule(mod)} style={{ cursor: 'pointer', position: 'relative' }}>
                                        {done && (
                                            <div style={{ position: 'absolute', top: 8, right: 8, background: '#52b788', borderRadius: '50%', padding: '4px', zIndex: 1 }}>
                                                <CheckCircle size={16} color="white" />
                                            </div>
                                        )}
                                        <div className="thumb-wrapper">
                                            <img
                                                src={`https://img.youtube.com/vi/${mod.youtube_id}/mqdefault.jpg`}
                                                alt={title}
                                                onError={e => { e.target.src = `https://placehold.co/320x180/2e7d32/fff?text=${encodeURIComponent(title)}`; }}
                                            />
                                            <div className="duration-badge">{mod.duration}</div>
                                            <div className="play-overlay"><Play size={32} fill="white" /></div>
                                        </div>
                                        <div className="video-info">
                                            <h3>{title}</h3>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0' }}>
                                                {desc}
                                            </p>
                                            <span>{mod.views?.toLocaleString()} {getT(activeLang, 'views')}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="safety-list">
                    {SAFETY_TIPS.map(tip => (
                        <div key={tip.id} className="safety-card">
                            <div className="safety-icon-box" style={{ fontSize: '28px' }}>{tip.icon}</div>
                            <div>
                                <h3>{tip.title[activeLang] || tip.title['en']}</h3>
                                <p>{tip.desc[activeLang] || tip.desc['en']}</p>
                            </div>
                        </div>
                    ))}
                    <div className="helpline-banner">
                        <h4>{getT(activeLang, 'helpline')}</h4>
                        <div className="emergency-numbers">
                            <span>{getT(activeLang, 'ambu')}</span>
                            <span>{getT(activeLang, 'fire')}</span>
                            <span>{getT(activeLang, 'police')}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {selectedModule && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ background: 'var(--card-bg)', borderRadius: '16px', width: '100%', maxWidth: '560px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>{getLocalizedModField(selectedModule, 'title')}</h3>
                            <button onClick={() => setSelectedModule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedModule.youtube_id}?autoplay=1&rel=0`}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={getLocalizedModField(selectedModule, 'title')}
                            />
                        </div>

                        {quiz && !quizResult && (
                            <div style={{ padding: '16px' }}>
                                <h4 style={{ margin: '0 0 12px' }}>📝 {getT(activeLang, 'quiz_title')}</h4>
                                {quiz.map((q, qi) => (
                                    <div key={qi} style={{ marginBottom: '16px' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{qi + 1}. {q.q}</p>
                                        {q.options.map((opt, oi) => (
                                            <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer' }}>
                                                <input
                                                    type="radio" name={`q${qi}`}
                                                    checked={quizAnswers[qi] === oi}
                                                    onChange={() => {
                                                        const updated = [...quizAnswers];
                                                        updated[qi] = oi;
                                                        setQuizAnswers(updated);
                                                    }}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                ))}
                                <button
                                    className="btn-primary btn-block"
                                    onClick={submitQuiz}
                                    disabled={quizAnswers.length < quiz.length}
                                    style={{ marginTop: '8px' }}
                                >
                                    {getT(activeLang, 'submit')}
                                </button>
                            </div>
                        )}

                        {quizResult && (
                            <div style={{ padding: '16px', textAlign: 'center' }}>
                                {quizResult.passed ? (
                                    <>
                                        <Award size={48} color="#52b788" />
                                        <h3 style={{ color: '#52b788' }}>🎉 {getT(activeLang, 'pass_msg')}</h3>
                                        <p>{`${lang === 'hi' ? 'आपका स्कोर' : 'Score'}: ${quizResult.score}%`}</p>
                                    </>
                                ) : (
                                    <>
                                        <X size={48} color="#d32f2f" />
                                        <h3 style={{ color: '#d32f2f' }}>{getT(activeLang, 'fail_msg')}</h3>
                                        <p>{`${lang === 'hi' ? 'आपका स्कोर' : 'Score'}: ${quizResult.score}% (Need 60%)`}</p>
                                    </>
                                )}
                                <button className="btn-primary" onClick={() => setSelectedModule(null)} style={{ marginTop: '12px' }}>
                                    {getT(activeLang, 'close')}
                                </button>
                            </div>
                        )}

                        {!quiz && !quizResult && (
                            <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-primary" onClick={() => setSelectedModule(null)}>
                                    {getT(activeLang, 'close')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
