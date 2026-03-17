import { useState, useEffect } from 'react';
import { Sun, CloudRain, AlertTriangle, Mic, Camera, Phone, Stethoscope, Cloud, Wind, Droplets, Thermometer, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import WeatherAlerts from '../components/WeatherAlerts';
import PlatformImpact from '../components/PlatformImpact';
import { API_BASE_URL, buildUrl } from '../config/api';

// --- Inline Translations for Home Page features ---
const HOME_T = {
    // Greetings
    greeting_morning: { hi: 'सुप्रभात', en: 'Good Morning', bn: 'সুপ্রভাত', or: 'ସୁପ୍ରଭାତ', mai: 'सुप्रभात', pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', mr: 'शुभ सकाळ', gu: 'શુભ સવાર', ta: 'காலை வணக்கம்', te: 'శుభోదయం' },
    greeting_afternoon: { hi: 'नमस्ते', en: 'Good Afternoon', bn: 'শুভ অপরাহ্ন', or: 'ଶୁଭ ଅପରାହ୍ନ', mai: 'प्रणाम', pa: 'ਸ਼ੁਭ ਦੁਪਹਿਰ', mr: 'शुभ दुपार', gu: 'શુભ બપોર', ta: 'மதிய வணக்கம்', te: 'శుభాహ్నం' },
    greeting_evening: { hi: 'शुभ संध्या', en: 'Good Evening', bn: 'শুভ সন্ধ্যা', or: 'ଶୁଭ ସନ୍ଧ୍ୟା', mai: 'शुभ संध्या', pa: 'ਸ਼ੁਭ ਸ਼ਾਮ', mr: 'शुभ संध्याकाळ', gu: 'શુભ સાંજ', ta: 'மாலை வணக்கம்', te: 'శుభ సాయంత్రం' },
    // Weather
    sunny_clouds: { hi: 'धूप और बादल', en: 'Sunny with clouds', bn: 'রোদ ও মেঘ', or: 'ଖରା ଏବଂ ମେଘ', mai: 'घाम आ बद्दल', pa: 'ਧੁੱਪ ਅਤੇ ਬੱਦਲ', mr: 'ऊन आणि ढग', gu: 'તડકો અને વાદળો', ta: 'மேகங்களுடன் வெயில்', te: 'మేఘాలతో ఎండ' },
    wind: { hi: 'हवा', en: 'Wind', bn: 'বাতাস', or: 'ପବନ', mai: 'हावा', pa: 'ਹਵਾ', mr: 'वारा', gu: 'પવન', ta: 'காற்று', te: 'గాలి' },
    min: { hi: 'न्यूनतम', en: 'Min', bn: 'সর্বনিম্ন', or: 'ସର୍ବନିମ୍ନ', mai: 'न्यूनतम', pa: 'ਘੱਟੋ-ਘੱਟ', mr: 'किमान', gu: 'લઘુતમ', ta: 'குறைந்தபட்சம்', te: 'కనీస' },
    max: { hi: 'अधिकतम', en: 'Max', bn: 'সর্বোচ্চ', or: 'ସର୍ବାଧିକ', mai: 'अधिकतम', pa: 'ਵੱਧ ਤੋਂ ਵੱਧ', mr: 'कमाल', gu: 'મહત્તમ', ta: 'அதிகபட்சம்', te: 'గరిష్ట' },
    // Alerts
    heat_alert: { hi: 'गर्मी अलर्ट', en: 'Heat Alert', bn: 'তাপপ্রবাহ সতর্কতা', or: 'ଗରମ ସତର୍କତା', mai: 'गर्मी अलर्ट', pa: 'ਗਰਮੀ ਅਲਰਟ', mr: 'उष्णतेचा इशारा', gu: 'ગરમીનું એલર્ટ', ta: 'வெப்ப எச்சரிக்கை', te: 'వేడి హెచ్చరిక' },
    heat_desc: { hi: 'बहुत गर्मी है - दोपहर में काम न करें', en: 'Very hot - avoid work in afternoon', bn: 'খুব গরম - দুপুরে কাজ এড়িয়ে চলুন', or: 'ବହୁତ ଗରମ - ଖରାରେ କାମ କରନ୍ତୁ ନାହିଁ', mai: 'बढ़त गर्मी अछि - दुपहरिया मे काज नहि करू', pa: 'ਬਹੁਤ ਗਰਮੀ - ਦੁਪਹਿਰ ਨੂੰ ਕੰਮ ਤੋਂ ਬਚੋ', mr: 'खूप उष्णता - दुपारी काम टाळा', gu: 'ખૂબ ગરમી - બપોરે કામ ટાળો', ta: 'மிகவும் வெப்பம் - மதியம் வேலை செய்ய வேண்டாம்', te: 'చాలా వేడి - మధ్యాహ్నం పని మానుకోండి' },
    humidity_alert: { hi: 'नमी अलर्ट', en: 'Humidity Alert', bn: 'আর্দ্রতা সতর্কতা', or: 'ଆର୍ଦ୍ରତା ସତର୍କତା', mai: 'नमी अलर्ट', pa: 'ਨਮੀ ਅਲਰਟ', mr: 'आर्द्रता इशारा', gu: 'ભેજનું એલર્ટ', ta: 'ஈரப்பத எச்சரிக்கை', te: 'తేమ హెచ్చరిక' },
    humidity_desc: { hi: 'फंगल रोग का खतरा - स्प्रे करें', en: 'Fungal disease risk - apply spray', bn: 'ছত্রাকজনিত রোগের ঝুঁকি - স্প্রে করুন', or: 'ଫଙ୍ଗସ ରୋଗର ଭୟ - ସ୍ପ୍ରେ କରନ୍ତୁ', mai: 'फंगल रोगक खतरा - स्प्रे करू', pa: 'ਫੰਗਲ ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ - ਸਪਰੇਅ ਕਰੋ', mr: 'बुरशीजन्य आजार धोका - फवारणी करा', gu: 'ફંગલ રોગનું જોખમ - સ્પ્રે કરો', ta: 'காளான் நோய் ஆபத்து - தெளிக்கவும்', te: 'ఫంగల్ వ్యాధి ప్రమాదం - పిచికారీ చేయండి' },
    // Generic
    farmer: { hi: 'किसान जी', en: 'Farmer', bn: 'কৃষক ভাই', or: 'କୃଷକ ଭାଇ', mai: 'किसान जी', pa: 'ਕਿਸਾਨ ਵੀਰ', mr: 'शेतकरी दादा', gu: 'ખેડૂત ભાઈ', ta: 'விவசாயி', te: 'రైతు' },
    services: { hi: 'किसान सुविधाएं', en: 'Farmer Services', bn: 'কৃষক পরিষেবা', or: 'କୃଷକ ସୁବିଧା', mai: 'किसान सुविधा', pa: 'ਕਿਸਾਨ ਸੇਵਾਵਾਂ', mr: 'शेतकरी सेवा', gu: 'ખેડૂત સેવાઓ', ta: 'விவசாயி சேவைகள்', te: 'రైతు సేవలు' },
    // Quick Actions
    quick_mandi: { hi: 'मंडी भाव', en: 'Mandi', bn: 'মান্ডি', or: 'ମଣ୍ଡି', mai: 'मंडी', pa: 'ਮੰਡੀ', mr: 'मंडी', gu: 'મંડી', ta: 'மண்டி', te: 'మండీ' },
    quick_test: { hi: 'मिट्टी जांच', en: 'Soil Test', bn: 'মাটি পরীক্ষা', or: 'ମାଟି ପରୀକ୍ଷା', mai: 'माटि जांच', pa: 'ਮਿੱਟੀ ਟੈਸਟ', mr: 'माती चाचणी', gu: 'માટી પરીક્ષણ', ta: 'மண் சோதனை', te: 'నేల పరీక్ష' },
    quick_comm: { hi: 'समुदाय', en: 'Community', bn: 'সম্প্রদায়', or: 'ସମ୍ପ୍ରଦାୟ', mai: 'समुदाय', pa: 'ਭਾਈਚਾਰਾ', mr: 'समुदाय', gu: 'સમુદાય', ta: 'சமூகம்', te: 'సమాజం' },
    quick_prof: { hi: 'प्रोफाइल', en: 'Profile', bn: 'প্রোফাইল', or: 'ପ୍ରୋଫାଇଲ', mai: 'प्रोफाइल', pa: 'ਪ੍ਰੋਫਾਈਲ', mr: 'प्रोफाइल', gu: 'પ્રોફાઇલ', ta: 'சுயவிவரம்', te: 'ప్రొఫైల్' },
    // Tips
    tip_title: { hi: 'आज का सुझाव', en: 'Tip of the Day', bn: 'আজকের পরামর্শ', or: 'ଆଜିର ପରାମର୍ଶ', mai: 'आइक सुझाव', pa: 'ਅੱਜ ਦਾ ਸੁਝਾਅ', mr: 'आजचा सल्ला', gu: 'આજની સલાહ', ta: 'இன்றைய குறிப்பு', te: 'నేటి చిట్కా' }
};

const DAILY_TIPS = [
    { hi: 'नीम के तेल का छिड़काव कीटों को प्राकृतिक रूप से दूर रखता है।', en: 'Spraying neem oil naturally keeps pests away.', bn: 'নিম তেল স্প্রে করলে প্রাকৃতিকভাবে কীটপতঙ্গ দূরে থাকে।', or: 'ନିମ୍ବ ତେଲ ସ୍ପ୍ରେ କଲେ କୀଟମାନେ ଦୂରେଇ ରୁହନ୍ତି।', mai: 'नीमक तेलक छिड़काव कीड़ासँ प्राकृतिक रूपसँ दूर रखैत अछि।', pa: 'ਨਿੰਮ ਦਾ ਤੇਲ ਛਿੜਕਣ ਨਾਲ ਕੀੜੇ ਕੁਦਰਤੀ ਤੌਰ ਤੇ ਦੂਰ ਰਹਿੰਦੇ ਹਨ।', mr: 'कडुलिंबाच्या तेलाची फवारणी केल्याने कीड नैसर्गिकरीत्या दूर राहते.', gu: 'લીમડાના તેલનો છંટકાવ કીટકોને દૂર રાખે છે.', ta: 'வேப்ப எண்ணெய் தெளிப்பது பூச்சிகளை இயற்கையாகவே விலக்கி வைக்கும்.', te: 'వేప నూనెను పిచికారీ చేయడం వల్ల సహజంగానే పురుగులు దరిచేరవు.' },
    { hi: 'मिट्टी की नमी बनाए रखने के लिए मल्चिंग (Mulching) का प्रयोग करें।', en: 'Use mulching to maintain soil moisture in summer.', bn: 'মাটির আর্দ্রতা ধরে রাখতে মালচিং ব্যবহার করুন।', or: 'ମାଟିର ଆର୍ଦ୍ରତା ବଜାୟ ରଖିବା ପାଇଁ ମଲଚିଂର ବ୍ୟବହାର କରନ୍ତୁ।', mai: 'माटिक नमी बनौने राखबाक लेल मल्चिंगक प्रयोग करू।', pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ ਬਣਾਈ ਰੱਖਣ ਲਈ ਮਲਚਿੰਗ ਦੀ ਵਰਤੋਂ ਕਰੋ।', mr: 'मातीची आर्द्रता टिकवून ठेवण्यासाठी मल्चिंगचा वापर करा.', gu: 'જમીનનો ભેજ જાળવી રાખવા માટે મલ્ચિંગનો ઉપયોગ કરો.', ta: 'மண் ஈரப்பதத்தை பராமரிக்க மல்ச்சிங் பயன்படுத்தவும்.', te: 'నేల తేమను కాపాడుకోవడానికి మల్చింగ్‌ను వాడండి.' },
    { hi: 'सिंचाई के लिए ड्रिप सिस्टम का उपयोग करें, इससे 50% पानी बचता है।', en: 'Use drip irrigation to save up to 50% water.', bn: 'ড্রিপ সেচ ব্যবহার করুন, এতে ৫০% জল বাঁচে।', or: 'ଡ୍ରିପ୍ ଜଳସେଚନ ବ୍ୟବହାର କରନ୍ତୁ, ଏହା ୫୦% ପାଣି ବଞ୍ଚାଏ।', mai: 'सिंचाईक लेल ड्रिप सिसटमक उपयोग करू, एहि सँ 50% पानि बचैत अछि।', pa: 'ਸਿੰਚਾਈ ਲਈ ਡਰਿੱਪ ਸਿਸਟਮ ਦੀ ਵਰਤੋਂ ਕਰੋ, ਇਸ ਨਾਲ 50% ਪਾਣੀ ਬਚਦਾ ਹੈ।', mr: 'ठिबक सिंचन वापरून ५०% पाण्याची बचत करा.', gu: 'ટપક સિંચાઈ પદ્ધતિનો ઉપયોગ કરી ૫૦% પાણી બચાવો.', ta: 'சொட்டு நீர் பாசனத்தை பயன்படுத்தி 50% நீரை சேமிக்கவும்.', te: '50% నీటిని ఆదా చేసేందుకు డ్రిప్ ఇరిగేషన్‌ను ఉపయోగించండి.' }
];

const getT = (lang, key) => (HOME_T[key] && HOME_T[key][lang]) || (HOME_T[key] && HOME_T[key]['en']) || key;

export default function Home() {
    const { user } = useAuth();
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    
    // Fallback if SUPPORTED_LANGUAGES doesn't exist yet in hot reload
    const activeLang = typeof lang === 'string' ? lang : 'en';
    
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Dynamic Tip
    const todayTipIndex = new Date().getDate() % DAILY_TIPS.length;
    const currentTip = DAILY_TIPS[todayTipIndex][activeLang] || DAILY_TIPS[todayTipIndex]['en'];

    useEffect(() => {
        getUserLocation();
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timeInterval);
    }, []);

    const getUserLocation = () => {
        setLoading(true);
        setIsRefreshing(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const url = buildUrl(`${API_BASE_URL}/api/weather/current`, { lat: latitude, lon: longitude });
                        const response = await fetch(url);
                        const data = await response.json();
                        if (data.success) {
                            setWeather(data.weather);
                            localStorage.setItem('userLocation', data.weather.location);
                        } else fetchWeather('Rampur');
                    } catch { fetchWeather('Rampur'); } 
                    finally { setLoading(false); setIsRefreshing(false); }
                },
                () => fetchWeather('Rampur'),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            fetchWeather('Rampur');
        }
    };

    const fetchWeather = async (loc) => {
        try {
            const url = buildUrl(`${API_BASE_URL}/api/weather/current`, { location: loc });
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) setWeather(data.weather);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); setIsRefreshing(false); }
    };

    const getWeatherIcon = () => {
        if (!weather) return <Sun size={28} />;
        const condition = weather.main?.toLowerCase() || '';
        if (condition.includes('rain')) return <CloudRain size={28} className="weather-icon-pulse" />;
        if (condition.includes('cloud')) return <Cloud size={28} className="weather-icon-float" />;
        return <Sun size={28} className="weather-icon-spin" />;
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return getT(activeLang, 'greeting_morning');
        if (hour < 17) return getT(activeLang, 'greeting_afternoon');
        return getT(activeLang, 'greeting_evening');
    };

    const getFormattedTime = () => {
        return currentTime.toLocaleTimeString(activeLang === 'hi' ? 'hi-IN' : 'en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="home-page pb-safe">
            <WeatherAlerts />

            {/* Premium Greeting Banner */}
            <div className="greeting-section animate-slide-down">
                <div className="greeting-content">
                    <h1 className="greeting-title">
                        {getGreeting()}, {user?.name || getT(activeLang, 'farmer')} <span className="wave-emoji">👋</span>
                    </h1>
                    <p className="greeting-location">
                        <MapPinIcon /> {weather?.location || t('location')}
                    </p>
                    <p className="greeting-time">
                        <Sparkles size={14} className="sparkle-icon" />
                        {getFormattedTime()}
                    </p>
                </div>
                {/* Minimal dynamic weather badge */}
                <div className={`greeting-weather-badge ${isRefreshing ? 'refreshing' : ''}`}>
                    {loading ? <div className="skeleton-dot" /> : `${weather?.temp || 32}°C`}
                </div>
            </div>

            {/* Emergency Alerts (Dynamic based on logic) */}
            {weather && weather.temp > 38 && (
                <div className="alert-card alert-danger animate-slide-left">
                    <div className="alert-icon pulse-danger"><AlertTriangle size={20} /></div>
                    <div className="alert-content">
                        <strong>{getT(activeLang, 'heat_alert')}</strong>
                        <p>{getT(activeLang, 'heat_desc')}</p>
                    </div>
                </div>
            )}

            {weather && weather.humidity > 80 && (
                <div className="alert-card alert-warning animate-slide-left delay-1">
                    <div className="alert-icon pulse-warning"><AlertTriangle size={20} /></div>
                    <div className="alert-content">
                        <strong>{getT(activeLang, 'humidity_alert')}</strong>
                        <p>{getT(activeLang, 'humidity_desc')}</p>
                    </div>
                </div>
            )}

            {/* Enhanced Weather Card with Skeleton Loading */}
            <div className="modern-weather-card animate-slide-up delay-1" onClick={() => navigate('/weather-detail')}>
                {loading ? (
                    <div className="weather-skeleton">
                        <div className="skel-row"><div className="skel-circle"/><div className="skel-text w-50"/></div>
                        <div className="skel-grid">
                            <div className="skel-text"/><div className="skel-text"/><div className="skel-text"/><div className="skel-text"/>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="weather-header">
                            <div className="weather-icon-wrapper">{getWeatherIcon()}</div>
                            <div className="weather-info">
                                <h3>{t('weather_main')}</h3>
                                <p>{weather?.description || getT(activeLang, 'sunny_clouds')}</p>
                            </div>
                            <div className="weather-temp">
                                <span className="temp-value">{weather?.temp || 32}°</span>
                            </div>
                        </div>
                        <div className="weather-details-grid">
                            <div className="weather-detail-item">
                                <Wind size={16} /> <span>{getT(activeLang, 'wind')}</span> <strong>{weather?.wind_speed || 12} km/h</strong>
                            </div>
                            <div className="weather-detail-item">
                                <Droplets size={16} /> <span>{t('humidity')}</span> <strong>{weather?.humidity || 78}%</strong>
                            </div>
                            <div className="weather-detail-item">
                                <Thermometer size={16} /> <span>{getT(activeLang, 'min')}</span> <strong>{weather?.temp_min || 28}°C</strong>
                            </div>
                            <div className="weather-detail-item">
                                <Thermometer size={16} /> <span>{getT(activeLang, 'max')}</span> <strong>{weather?.temp_max || 36}°C</strong>
                            </div>
                        </div>
                    </>
                )}
            </div>



            {/* Daily Dynamic Tip */}
            <div className="tip-card animate-slide-up delay-3">
                <div className="tip-header">
                    <Sparkles size={16} className="tip-icon" />
                    <span>{getT(activeLang, 'tip_title')}</span>
                </div>
                <p className="tip-text">{currentTip}</p>
            </div>

            {/* Main Services Section */}
            <div className="services-section">
                <div className="section-header">
                    <h2 className="section-heading">{getT(activeLang, 'services')}</h2>
                    <ArrowRight size={18} className="header-arrow" />
                </div>
                
                <div className="services-grid">
                    <div className="service-card service-ai animate-slide-up delay-3" onClick={() => navigate('/chat')}>
                        <div className="service-icon"><Mic size={24} /></div>
                        <div className="service-card-text">
                            <h3>{t('ai_sahayak')}</h3>
                            <p>{t('ai_desc')}</p>
                        </div>
                    </div>

                    <div className="service-card service-camera animate-slide-up delay-4" onClick={() => navigate('/rog-detector')}>
                        <div className="service-icon"><Camera size={24} /></div>
                        <div className="service-card-text">
                            <h3>{t('photo_upload')}</h3>
                            <p>{t('photo_desc')}</p>
                        </div>
                    </div>

                    <div className="service-card service-doctor animate-slide-up delay-5" onClick={() => navigate('/doctors')}>
                        <div className="service-icon"><Stethoscope size={24} /></div>
                        <div className="service-card-text">
                            <h3>{t('doc_connect')}</h3>
                            <p>{t('doc_desc')}</p>
                        </div>
                    </div>

                    <div className="service-card service-helpline animate-slide-up delay-6" onClick={() => window.location.href = 'tel:18001801551'}>
                        <div className="service-icon"><Phone size={24} /></div>
                        <div className="service-card-text">
                            <h3>{t('helpline')}</h3>
                            <p>{t('call_now')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <PlatformImpact />
        </div>
    );
}

// Simple map pin icon component specifically for the greeting area
function MapPinIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    );
}
