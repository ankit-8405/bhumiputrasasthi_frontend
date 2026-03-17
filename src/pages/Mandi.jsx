import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Filter, Search, RefreshCw, BookOpen, TestTube, Tractor, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Mandi.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MANDI_T = {
    // States
    s_all: { hi: 'सभी राज्य', en: 'All States', bn: 'সব রাজ্য', or: 'ସମସ୍ତ ରାଜ୍ୟ', mai: 'सबहि राज्य', pa: 'ਸਾਰੇ ਰਾਜ', mr: 'सर्व राज्ये', gu: 'તમામ રાજ્યો', ta: 'அனைத்து மாநிலங்கள்', te: 'అన్ని రాష్ట్రాలు' },
    s_mp: { hi: 'मध्य प्रदेश', en: 'Madhya Pradesh', bn: 'মধ্য প্রদেশ', or: 'ମଧ୍ୟ ପ୍ରଦେଶ', mai: 'मध्य प्रदेश', pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼', mr: 'मध्य प्रदेश', gu: 'મધ્ય પ્રદેશ', ta: 'மத்திய பிரதேசம்', te: 'మధ్యప్రదేశ్' },
    s_up: { hi: 'उत्तर प्रदेश', en: 'Uttar Pradesh', bn: 'উত্তর প্রদেশ', or: 'ଉତ୍ତର ପ୍ରଦେଶ', mai: 'उत्तर प्रदेश', pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼', mr: 'उत्तर प्रदेश', gu: 'ઉત્તર પ્રદેશ', ta: 'உத்தர பிரதேசம்', te: 'ఉత్తరప్రదేశ్' },
    s_rj: { hi: 'राजस्थान', en: 'Rajasthan', bn: 'রাজস্থান', or: 'ରାଜସ୍ଥାନ', mai: 'राजस्थान', pa: 'ਰਾਜਸਥਾਨ', mr: 'राजस्थान', gu: 'રાજસ્થાન', ta: 'ராஜஸ்தான்', te: 'రాజస్థాన్' },
    s_pj: { hi: 'पंजाब', en: 'Punjab', bn: 'পাঞ্জাব', or: 'ପଞ୍ଜାବ', mai: 'पंजाब', pa: 'ਪੰਜਾਬ', mr: 'पंजाब', gu: 'પંજાબ', ta: 'பஞ்சாப்', te: 'పంజాబ్' },
    s_hr: { hi: 'हरियाणा', en: 'Haryana', bn: 'হরিয়ানা', or: 'ହରିୟାଣା', mai: 'हरियाणा', pa: 'ਹਰਿਆਣਾ', mr: 'हरियाणा', gu: 'હરિયાણા', ta: 'ஹரியானா', te: 'హర్యానా' },
    s_mh: { hi: 'महाराष्ट्र', en: 'Maharashtra', bn: 'মহারাষ্ট্র', or: 'ମହାରାଷ୍ଟ୍ର', mai: 'महाराष्ट्र', pa: 'ਮਹਾਰਾਸ਼ਟਰ', mr: 'महाराष्ट्र', gu: 'મહારાષ્ટ્ર', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర' },
    s_gj: { hi: 'गुजरात', en: 'Gujarat', bn: 'গুজরাট', or: 'ଗୁଜୁରାଟ', mai: 'गुजरात', pa: 'ਗੁਜਰਾਤ', mr: 'गुजरात', gu: 'ગુજરાત', ta: 'குஜராத்', te: 'గుజరాత్' },
    s_bh: { hi: 'बिहार', en: 'Bihar', bn: 'বিহার', or: 'ବିହାର', mai: 'बिहार', pa: 'ਬਿਹਾਰ', mr: 'बिहार', gu: 'બિહાર', ta: 'பீகார்', te: 'బీహార్' },
    
    // Crops
    c_all: { hi: 'सभी फसलें', en: 'All Crops', bn: 'সব ফসল', or: 'ସମସ୍ତ ଫସଲ', mai: 'सबहि फसल', pa: 'ਸਾਰੀਆਂ ਫਸਲਾਂ', mr: 'सर्व पिके', gu: 'તમામ પાક', ta: 'அனைத்து பயிர்கள்', te: 'అన్ని పంటలు' },
    c_wheat: { hi: 'गेहूं', en: 'Wheat', bn: 'গম', or: 'ଗହମ', mai: 'गहूम', pa: 'ਕਣਕ', mr: 'गहू', gu: 'ઘઉં', ta: 'கோதுமை', te: 'గోధుమ' },
    c_rice: { hi: 'चावल', en: 'Rice', bn: 'চাল', or: 'ଚାଉଳ', mai: 'चाउर', pa: 'ਚੌਲ', mr: 'तांदूळ', gu: 'ચોખા', ta: 'அரிசி', te: 'బియ్యం' },
    c_maize: { hi: 'मक्का', en: 'Maize', bn: 'ভুট্টা', or: 'ମକା', mai: 'मकई', pa: 'ਮੱਕੀ', mr: 'मका', gu: 'મકાઈ', ta: 'மக்காச்சோளம்', te: 'మొక్కజొన్న' },
    c_soybean: { hi: 'सोयाबीन', en: 'Soybean', bn: 'সয়াবিন', or: 'ସୋୟାବିନ୍', mai: 'सोयाबीन', pa: 'ਸੋਇਆਬੀਨ', mr: 'सोयाबीन', gu: 'સોયાબીન', ta: 'சோயாபீன்', te: 'సోయాబీన్' },
    c_cotton: { hi: 'कपास', en: 'Cotton', bn: 'তুলা', or: 'କପା', mai: 'कपास', pa: 'ਕਪਾਹ', mr: 'कापूस', gu: 'કપાસ', ta: 'பருத்தி', te: 'పత్తి' },
    c_onion: { hi: 'प्याज', en: 'Onion', bn: 'পেঁয়াজ', or: 'ପିଆଜ', mai: 'पियाज', pa: 'ਪਿਆਜ਼', mr: 'कांदा', gu: 'ડુંગળી', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ' },
    c_tomato: { hi: 'टमाटर', en: 'Tomato', bn: 'টমেটো', or: 'ଟମାଟୋ', mai: 'टमाटर', pa: 'ਟਮਾਟਰ', mr: 'टोमॅटो', gu: 'ટામેટા', ta: 'தக்காளி', te: 'టమోటా' },
    c_potato: { hi: 'आलू', en: 'Potato', bn: 'আলু', or: 'ଆଳୁ', mai: 'आलू', pa: 'ਆਲੂ', mr: 'बटाटा', gu: 'બટાકા', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప' },

    // UI Elements
    live: { hi: 'लाइव', en: 'Live', bn: 'লাইভ', or: 'ଲାଇଭ୍', mai: 'लाइव', pa: 'ਲਾਈਵ', mr: 'थेट', gu: 'લાઇવ', ta: 'நேரலை', te: 'లైవ్' },
    updated: { hi: 'अपडेट:', en: 'Updated:', bn: 'আপডেট:', or: 'ଅପଡେଟ୍:', mai: 'अपडेट:', pa: 'ਅੱਪਡੇਟ:', mr: 'अद्यतनित:', gu: 'અપડેટ:', ta: 'புதுப்பிக்கப்பட்டது:', te: 'నవీకరించబడింది:' },
    just_now: { hi: 'अभी', en: 'Just now', bn: 'এইমাত্র', or: 'ଏବେ', mai: 'अखन', pa: 'ਹੁਣੇ', mr: 'आत्ता', gu: 'હમણાં જ', ta: 'இப்போது', te: 'ఇప్పుడే' },
    refresh: { hi: 'रिफ्रेश', en: 'Refresh', bn: 'রিফ্রেশ', or: 'ରିଫ୍ରେସ', mai: 'रिफ्रेश', pa: 'ਰਿਫ੍ਰੈਸ਼', mr: 'रिफ्रेश', gu: 'રિફ્રેશ', ta: 'புதுப்பி', te: 'రిఫ్రెష్' },
    filters: { hi: 'फ़िल्टर', en: 'Filters', bn: 'ফিল্টার', or: 'ଫିଲ୍ଟର', mai: 'फ़िल्टर', pa: 'ਫਿਲਟਰ', mr: 'फिल्टर्स', gu: 'ફિલ્ટર્સ', ta: 'வடிகட்டிகள்', te: 'ఫిల్టర్లు' },
    clear_all: { hi: 'साफ़ करें', en: 'Clear all', bn: 'সব মুছুন', or: 'ସବୁ ସଫା କରନ୍ତୁ', mai: 'साफ़ करू', pa: 'ਸਭ ਸਾਫ਼ ਕਰੋ', mr: 'सर्व पुसा', gu: 'બધું સાફ કરો', ta: 'அனைத்தையும் அழிக்கவும்', te: 'అన్నీ క్లియర్ చేయండి' },
    state: { hi: 'राज्य', en: 'State', bn: 'রাজ্য', or: 'ରାଜ୍ୟ', mai: 'राज्य', pa: 'ਰਾਜ', mr: 'राज्य', gu: 'રાજ્ય', ta: 'மாநிலம்', te: 'రాష్ట్రం' },
    commodity: { hi: 'फसल', en: 'Commodity', bn: 'পণ্য', or: 'ସାମଗ୍ରୀ', mai: 'फसल', pa: 'ਵਸਤੂ', mr: 'माल', gu: 'કોમોડિટી', ta: 'பொருள்', te: 'సరుకు' },
    trend_7d: { hi: '7 दिन का ट्रेंड', en: '7-Day Price Trend', bn: '৭ দিনের প্রবণতা', or: '୭ ଦିନର ଟ୍ରେଣ୍ଡ', mai: '७ दिनक ट्रेंड', pa: '7-ਦਿਨ ਦਾ ਰੁਝਾਨ', mr: '7-दिवसीय कल', gu: '7-દિવસનો ટ્રેન્ડ', ta: '7 நாள் விலை நிலவரம்', te: '7-రోజుల ధరల ట్రెండ్' },
    now: { hi: 'अभी:', en: 'Now:', bn: 'এখন:', or: 'ଏବେ:', mai: 'अखन:', pa: 'ਹੁਣ:', mr: 'आता:', gu: 'હવે:', ta: 'இப்போது:', te: 'ఇప్పుడు:' },
    loading_rates: { hi: 'लाइव रेट्स लोड हो रहे हैं...', en: 'Loading live rates...', bn: 'লাইভ রেট লোড হচ্ছে...', or: 'ଲାଇଭ୍ ରେଟ୍ ଲୋଡ୍ ହେଉଛି...', mai: 'लाइव रेट लोड भ रहल अछि...', pa: 'ਲਾਈਵ ਰੇਟ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...', mr: 'थेट दर लोड होत आहेत...', gu: 'લાઇવ રેટ્સ લોડ થઈ રહ્યા છે...', ta: 'நேரடி விலைகள் ஏற்றப்படுகின்றன...', te: 'లైవ్ రేట్లు లోడ్ అవుతున్నాయి...' },
    no_data: { hi: 'कोई डेटा नहीं मिला', en: 'No data found', bn: 'কোনো ডেটা পাওয়া যায়নি', or: 'କୌଣସି ଡାଟା ମିଳିଲା ନାହିଁ', mai: 'कोनो डेटा नहि भेटल', pa: 'ਕੋਈ ਡਾਟਾ ਨਹੀਂ ਮਿਲਿਆ', mr: 'कोणताही डेटा आढळला नाही', gu: 'કોઈ ડેટા મળ્યો નથી', ta: 'தரவு கிடைக்கவில்லை', te: 'డేటా కనుగొనబడలేదు' },
    other_srv: { hi: 'अन्य सुविधाएं', en: 'Other Services', bn: 'অন্যান্য পরিষেবা', or: 'ଅନ୍ୟାନ୍ୟ ସେବା', mai: 'आन सुविधा', pa: 'ਹੋਰ ਸੇਵਾਵਾਂ', mr: 'इतर सेवा', gu: 'અન્ય સેવાઓ', ta: 'பிற சேவைகள்', te: 'ఇతర సేవలు' },
    srv_train: { hi: 'प्रशिक्षण और सुरक्षा', en: 'Training & Safety', bn: 'প্রশিক্ষণ ও নিরাপত্তা', or: 'ପ୍ରଶିକ୍ଷଣ ଏବଂ ସୁରକ୍ଷା', mai: 'प्रशिक्षण आ सुरक्षा', pa: 'ਸਿਖਲਾਈ ਅਤੇ ਸੁਰੱਖਿਆ', mr: 'प्रशिक्षण आणि सुरक्षा', gu: 'તાલીમ અને સલામતી', ta: 'பயிற்சி மற்றும் பாதுகாப்பு', te: 'శిక్షణ మరియు భద్రత' },
    srv_soil: { hi: 'मिट्टी परीक्षण', en: 'Soil Test', bn: 'মাটি পরীক্ষা', or: 'ମାଟି ପରୀକ୍ଷା', mai: 'माटि परीक्षण', pa: 'ਮਿੱਟੀ ਟੈਸਟ', mr: 'माती चाचणी', gu: 'માટી પરીક્ષણ', ta: 'மண் சோதனை', te: 'నేల పరీక్ష' },
    srv_rent: { hi: 'किराए पर उपकरण', en: 'Rent Equipment', bn: 'সরঞ্জাম ভাড়া', or: 'ଉପକରଣ ଭଡାରେ ଦିଅନ୍ତୁ', mai: 'किराया पर उपकरण', pa: 'ਸੰਦ ਕਿਰਾਏ ਤੇ', mr: 'भाड्याने उपकरणे', gu: 'સાધનો ભાડે આપો', ta: 'உபகரணங்கள் வாடகைக்கு', te: 'పరికరాల అద్దెకు' }
};

const getT = (lang, key) => (MANDI_T[key] && MANDI_T[key][lang]) || (MANDI_T[key] && MANDI_T[key]['en']) || key;

const getDaysArray = (lang) => {
    const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dic = {
        hi: ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र'],
        bn: ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি'],
        or: ['ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି', 'ରବି'],
        mr: ['सोम', 'मंगळ', 'बुध', 'गुरू', 'शुक्र', 'शनी', 'रवी'],
        gu: ['સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ', 'રવિ'],
        ta: ['தி', 'செ', 'பு', 'வி', 'வெ', 'ச', 'ஞா'],
        te: ['సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని', 'ఆది']
    };
    return dic[lang] || defaultDays;
};

// Mini sparkline chart using SVG
function SparklineChart({ trend, basePrice }) {
    const points = 7;
    const width = 80;
    const height = 30;
    const variation = 0.03;

    // Generate stable mock 7-day data (memoized to avoid impure render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = useMemo(() => Array.from({ length: points }, (_, i) => {
        const factor = trend === 'up'
            ? 1 - (points - 1 - i) * (variation / (points - 1))
            : 1 + (points - 1 - i) * (variation / (points - 1));
        return basePrice * (factor + (Math.random() - 0.5) * 0.01);
    }), [trend, basePrice]); // eslint-disable-line react-hooks/exhaustive-deps

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const svgPoints = data
        .map((v, i) => {
            const x = (i / (points - 1)) * width;
            const y = height - ((v - min) / range) * height;
            return `${x},${y}`;
        })
        .join(' ');

    const color = trend === 'up' ? '#52b788' : trend === 'down' ? '#ef5350' : '#999';

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
            />
            {/* Last point dot */}
            {(() => {
                const lastX = width;
                const lastY = height - ((data[data.length - 1] - min) / range) * height;
                return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
            })()}
        </svg>
    );
}

export default function Mandi() {
    const { t, lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [mandiData, setMandiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCommodity, setSelectedCommodity] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [trendCard, setTrendCard] = useState(null);

    const STATES = [
        { value: '', label: getT(activeLang, 's_all') },
        { value: 'Madhya Pradesh', label: getT(activeLang, 's_mp') },
        { value: 'Uttar Pradesh', label: getT(activeLang, 's_up') },
        { value: 'Rajasthan', label: getT(activeLang, 's_rj') },
        { value: 'Punjab', label: getT(activeLang, 's_pj') },
        { value: 'Haryana', label: getT(activeLang, 's_hr') },
        { value: 'Maharashtra', label: getT(activeLang, 's_mh') },
        { value: 'Gujarat', label: getT(activeLang, 's_gj') },
        { value: 'Bihar', label: getT(activeLang, 's_bh') },
    ];

    const COMMODITIES = [
        { value: '', label: getT(activeLang, 'c_all') },
        { value: 'wheat', label: getT(activeLang, 'c_wheat') },
        { value: 'rice', label: getT(activeLang, 'c_rice') },
        { value: 'maize', label: getT(activeLang, 'c_maize') },
        { value: 'soybean', label: getT(activeLang, 'c_soybean') },
        { value: 'cotton', label: getT(activeLang, 'c_cotton') },
        { value: 'onion', label: getT(activeLang, 'c_onion') },
        { value: 'tomato', label: getT(activeLang, 'c_tomato') },
        { value: 'potato', label: getT(activeLang, 'c_potato') },
    ];

    const fetchMandiPrices = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE}/mandi/prices`;
            const params = [];
            if (selectedState) params.push(`state=${encodeURIComponent(selectedState)}`);
            if (selectedCommodity) params.push(`commodity=${encodeURIComponent(selectedCommodity)}`);
            if (params.length) url += `?${params.join('&')}`;

            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                setMandiData(result.data || []);
                setLastUpdated(result.timestamp || new Date().toLocaleString());
            }
        } catch (error) {
            console.error('Error fetching mandi prices:', error);
            setMandiData([
                { id: 1, crop: getT(activeLang, 'c_wheat'), price: 2125, trend: 'up', change: 15, location: 'Offline' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMandiPrices();
        const interval = setInterval(fetchMandiPrices, 30000);
        return () => clearInterval(interval);
    }, [selectedState, selectedCommodity]);

    const filteredData = mandiData.filter(item =>
        item.crop?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeFilterCount = [selectedState, selectedCommodity].filter(Boolean).length;

    return (
        <div className="page-content pb-safe">
            <header className="page-header">
                <div>
                    <h2>{t('mandi_prices')}</h2>
                    <p className="subtitle">
                        {loading
                            ? t('loading')
                            : `${getT(activeLang, 'live')} • ${getT(activeLang, 'updated')} ${lastUpdated.split(',')[1] || getT(activeLang, 'just_now')}`
                        }
                    </p>
                </div>
                <button className="icon-btn-text" onClick={fetchMandiPrices}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    {getT(activeLang, 'refresh')}
                </button>
            </header>

            {/* Search & Filter */}
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('search_crop')}
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={`filter-btn ${activeFilterCount > 0 ? 'active' : ''}`}
                    onClick={() => setShowFilters(v => !v)}
                    style={{ position: 'relative' }}
                >
                    <Filter size={18} />
                    {activeFilterCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '-4px', right: '-4px',
                            background: 'var(--primary-color, #2E7D32)', color: '#fff',
                            borderRadius: '50%', width: '16px', height: '16px',
                            fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div style={{
                    background: 'var(--card-bg, #fff)', borderRadius: '12px',
                    padding: '16px', marginBottom: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>
                            {getT(activeLang, 'filters')}
                        </span>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => { setSelectedState(''); setSelectedCommodity(''); }}
                                style={{ fontSize: '12px', color: '#ef5350', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {getT(activeLang, 'clear_all')}
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary, #666)', display: 'block', marginBottom: '6px' }}>
                                {getT(activeLang, 'state')}
                            </label>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: '8px',
                                    border: '1px solid var(--border-color, #e0e0e0)',
                                    background: 'var(--input-bg, #f5f5f5)', fontSize: '13px'
                                }}
                            >
                                {STATES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary, #666)', display: 'block', marginBottom: '6px' }}>
                                {getT(activeLang, 'commodity')}
                            </label>
                            <select
                                value={selectedCommodity}
                                onChange={(e) => setSelectedCommodity(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: '8px',
                                    border: '1px solid var(--border-color, #e0e0e0)',
                                    background: 'var(--input-bg, #f5f5f5)', fontSize: '13px'
                                }}
                            >
                                {COMMODITIES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Trend Modal */}
            {trendCard && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
                }} onClick={() => setTrendCard(null)}>
                    <div style={{
                        background: 'var(--card-bg, #fff)', borderRadius: '16px',
                        padding: '24px', width: '100%', maxWidth: '340px'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>{trendCard.crop}</h3>
                            <button onClick={() => setTrendCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary, #666)', marginBottom: '16px' }}>
                            {getT(activeLang, 'trend_7d')}
                        </p>
                        {/* 7-day chart */}
                        <div style={{ background: 'var(--bg-secondary, #f9f9f9)', borderRadius: '12px', padding: '16px' }}>
                            {(() => {
                                const p = 7;
                                const variation = 0.04;
                                const data = Array.from({ length: p }, (_, i) => {
                                    const f = trendCard.trend === 'up'
                                        ? 1 - (p - 1 - i) * (variation / (p - 1))
                                        : 1 + (p - 1 - i) * (variation / (p - 1));
                                    return Math.round(trendCard.price * (f + (Math.random() - 0.5) * 0.01));
                                });
                                const min = Math.min(...data);
                                const max = Math.max(...data);
                                const range = max - min || 1;
                                const w = 280, h = 80;
                                const pts = data.map((v, i) => {
                                    const x = (i / (p - 1)) * w;
                                    const y = h - ((v - min) / range) * (h - 8) - 4;
                                    return `${x},${y}`;
                                }).join(' ');
                                const color = trendCard.trend === 'up' ? '#52b788' : '#ef5350';
                                const days = getDaysArray(activeLang);
                                return (
                                    <>
                                        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%' }}>
                                            <polyline fill="none" stroke={color} strokeWidth="2.5"
                                                strokeLinecap="round" strokeLinejoin="round" points={pts} />
                                            {data.map((v, i) => {
                                                const x = (i / (p - 1)) * w;
                                                const y = h - ((v - min) / range) * (h - 8) - 4;
                                                return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
                                            })}
                                        </svg>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                            {days.map((d, i) => (
                                                <span key={i} style={{ fontSize: '10px', color: 'var(--text-secondary, #888)' }}>{d}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '13px' }}>
                                            <span>Min: <strong>₹{min}</strong></span>
                                            <span>Max: <strong>₹{max}</strong></span>
                                            <span>{getT(activeLang, 'now')} <strong style={{ color }}>₹{trendCard.price}</strong></span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary, #888)', marginTop: '12px', textAlign: 'center' }}>
                            {trendCard.location}
                        </p>
                    </div>
                </div>
            )}

            {/* Market Cards */}
            <div className="mandi-grid">
                {loading && (
                    <p className="loading-text">{getT(activeLang, 'loading_rates')}</p>
                )}

                {!loading && filteredData.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary, #666)' }}>
                        <p>{getT(activeLang, 'no_data')}</p>
                    </div>
                )}

                {!loading && filteredData.map((item) => (
                    <div key={item.id} className="mandi-card">
                        <div className="card-top">
                            <div>
                                <h3>{item.crop}</h3>
                                <span className="variety">{item.location || item.district || item.state}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                <div className={`trend-badge ${item.trend}`}>
                                    {item.trend === 'up' && <TrendingUp size={14} />}
                                    {item.trend === 'down' && <TrendingDown size={14} />}
                                    <span>{item.change > 0 ? '+' : ''}{item.change}₹</span>
                                </div>
                                <SparklineChart trend={item.trend} basePrice={item.price} />
                            </div>
                        </div>
                        <div className="card-price">
                            <span className="sc-rs">₹</span>
                            <span className="amount">{item.price?.toLocaleString()}</span>
                            <span className="unit">{t('per_quintal')}</span>
                        </div>
                        {item.minPrice && item.maxPrice && (
                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary, #666)', marginBottom: '8px' }}>
                                <span>Min: ₹{item.minPrice?.toLocaleString()}</span>
                                <span>Max: ₹{item.maxPrice?.toLocaleString()}</span>
                            </div>
                        )}
                        {/* MSP Badge + Sell Advice */}
                        {item.msp && (
                            <div className={`mandi-msp-row ${item.price >= item.msp ? 'msp-above' : 'msp-below'}`}>
                                <span className="mandi-msp-label">
                                    MSP: ₹{item.msp?.toLocaleString()}
                                </span>
                                <span className="mandi-msp-badge">
                                    {item.price >= item.msp
                                        ? (activeLang === 'hi' ? '✅ MSP से अच्छा' : '✅ Above MSP')
                                        : (activeLang === 'hi' ? '⚠️ MSP से कम' : '⚠️ Below MSP')}
                                </span>
                            </div>
                        )}
                        {/* Sell Advice from backend */}
                        {item.sell_advice && (
                            <div className={`mandi-sell-advice ${item.sell_advice}`}>
                                {activeLang === 'hi'
                                    ? (item.sell_reason_hi || (item.sell_advice === 'sell' ? 'अभी बेचना फायदेमंद — दाम अच्छे हैं' : 'कुछ समय रुकें — दाम बढ़ सकते हैं'))
                                    : (item.sell_reason_en || (item.sell_advice === 'sell' ? 'Good time to sell' : 'Consider holding for better price'))}
                            </div>
                        )}
                        <div className="card-footer">
                            <button className="btn-outline" onClick={() => setTrendCard(item)}>{t('view_trend')}</button>
                            <button className="btn-link-sm">{t('sell_now')}</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Other Services Section */}
            <section className="other-services-section">
                <h2 className="section-heading">
                    {getT(activeLang, 'other_srv')}
                </h2>
                <div className="services-pills-container">
                    <button className="service-pill-unified" onClick={() => navigate('/training')}>
                        <div className="pill-icon-wrapper"><BookOpen size={20} /></div>
                        <span className="pill-text">{getT(activeLang, 'srv_train')}</span>
                    </button>
                    <button className="service-pill-unified" onClick={() => navigate('/soil-test')}>
                        <div className="pill-icon-wrapper"><TestTube size={20} /></div>
                        <span className="pill-text">{getT(activeLang, 'srv_soil')}</span>
                    </button>
                    <button className="service-pill-unified">
                        <div className="pill-icon-wrapper"><Tractor size={20} /></div>
                        <span className="pill-text">{getT(activeLang, 'srv_rent')}</span>
                    </button>
                </div>
            </section>
        </div>
    );
}

