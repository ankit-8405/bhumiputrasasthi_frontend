import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Wind, Droplets, Eye, Sunrise, Sunset, Thermometer, CloudRain } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './WeatherDetail.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const WEATHER_T = {
    today_weather: { hi: 'आज का मौसम', en: "Today's Weather", bn: 'আজকের আবহাওয়া', or: 'ଆଜିର ପାଣିପାଗ', mai: 'आइक मौसम', pa: 'ਅੱਜ ਦਾ ਮੌਸਮ', mr: 'आजचे हवामान', gu: 'આજનું હવામાન', ta: 'இன்றைய வானிலை', te: 'నేటి వాతావరణం' },
    temp_range: { hi: 'तापमान रेंज', en: 'Temperature Range', bn: 'তাপমাত্রার পরিসর', or: 'ତାପମାତ୍ରା ପରିସର', mai: 'तापमान रेंज', pa: 'ਤਾਪਮਾਨ ਰੇਂਜ', mr: 'तापमान श्रेणी', gu: 'તાપમાન શ્રેણી', ta: 'வெப்பநிலை வரம்பு', te: 'ఉష్ణోగ్రత పరిధి' },
    min: { hi: 'न्यूनतम', en: 'Min', bn: 'সর্বনিম্ন', or: 'ସର୍ବନିମ୍ନ', mai: 'न्यूनतम', pa: 'ਨਿਊਨਤਮ', mr: 'किमान', gu: 'ન્યૂનતમ', ta: 'குறைந்தபட்சம்', te: 'కనిష్ట' },
    max: { hi: 'अधिकतम', en: 'Max', bn: 'সর্বোচ্চ', or: 'ସର୍ବାଧିକ', mai: 'अधिकतम', pa: 'ਅਧਿਕਤਮ', mr: 'कमाल', gu: 'મહત્તમ', ta: 'அதிகபட்சம்', te: 'గరిష్ట' },
    adv_high_temp: {
        hi: 'गर्मी ज्यादा है - दोपहर 12-4 बजे काम न करें', en: 'High temperature - avoid work between 12-4 PM',
        bn: 'উচ্চ তাপমাত্রা - দুপুর ১২-৪ মি কাজ এড়িয়ে চলুন', or: 'ଉଚ୍ଚ ତାପମାତ୍ରା - ଦିନ ୧୨-୪ ଟା ମଧ୍ୟରେ କାମରୁ ନିବୃତ୍ତ ରୁହନ୍ତୁ',
        mai: 'गर्मी बेसी अछि - दोपहर 12-4 बजे काज नहि करू', pa: 'ਜ਼ਿਆਦਾ ਗਰਮੀ - ਦੁਪਹਿਰ 12-4 ਵਜੇ ਕੰਮ ਤੋਂ ਬਚੋ',
        mr: 'जास्त तापमान - दुपारी 12-4 दरम्यान काम टाळा', gu: 'ઊંચું તાપમાન - બપોરે 12-4 વચ્ચે કામ ટાળો',
        ta: 'அதிக வெப்பநிலை - மதியம் 12-4 மணி வரை வேலையைத் தவிர்க்கவும்', te: 'అధిక ఉష్ణోగ్రత - మధ్యాహ్నం 12-4 గంటల మధ్య పనిని నివారించండి'
    },
    adv_high_hum: {
        hi: 'नमी ज्यादा है - fungicide स्प्रे करें', en: 'High humidity - apply fungicide spray',
        bn: 'উચ્ચ আর্দ্রতা - ছত্রাকনাশক স্প্রে করুন', or: 'ଉଚ୍ଚ ଆର୍ଦ୍ରତା - ଫଙ୍ଗିସାଇଡ୍ ସ୍ପ୍ରେ କରନ୍ତୁ',
        mai: 'नमी बेसी अछि - फंगीसाइड स्प्रे करू', pa: 'ਜ਼ਿਆਦਾ ਨਮੀ - ਉੱਲੀਨਾਸ਼ਕ ਸਪਰੇਅ ਕਰੋ',
        mr: 'जास्त आर्द्रता - बुरशीनाशक फवारा', gu: 'ઉચ્ચ ભેજ - ફૂગનાશક સ્પ્રે કરો',
        ta: 'அதிக ஈரப்பதம் - பூஞ்சைக் கொல்லி ஸ்ப்ரே செய்யவும்', te: 'అధిక తేమ - శిలీంద్ర సంహారిణి స్ప్రే చేయండి'
    },
    adv_high_wind: {
        hi: 'तेज हवा - स्प्रे न करें', en: 'Strong wind - avoid spraying',
        bn: 'প্রবল বাতাস - স্প্রে করা এড়িয়ে চলুন', or: 'ପ୍ରବଳ ପବନ - ସ୍ପ୍ରେ କରନ୍ତୁ ନାହିଁ',
        mai: 'तेज हवा - स्प्रे नहि करू', pa: 'ਤੇਜ਼ ਹਵਾ - ਸਪਰੇਅ ਨਾ ਕਰੋ',
        mr: 'वेगाने वाहणारा वारा - फवारणी टाळा', gu: 'તીવ્ર પવન - છંટકાવ ટાળો',
        ta: 'வேகமான காற்று - தெளிப்பதைத் தவிர்க்கவும்', te: 'బలమైన గాలి - పిచికారీ చేయవద్దు'
    },
    adv_good: {
        hi: 'सुबह जल्दी और शाम को काम करें', en: 'Work early morning and evening',
        bn: 'খুব সকালে এবং সন্ধ্যায় কাজ করুন', or: 'ସକାଳେ ଏବଂ ସନ୍ଧ୍ୟାରେ କାମ କରନ୍ତୁ',
        mai: 'भोरमे जल्दी आ साँझमे काज करू', pa: 'ਸਵੇਰੇ ਜਲਦੀ ਅਤੇ ਸ਼ਾਮ ਨੂੰ ਕੰਮ ਕਰੋ',
        mr: 'सकाळी लवकर आणि संध्याकाळी काम करा', gu: 'વહેલી સવારે અને સાંજે કામ કરો',
        ta: 'அதிகாலை மற்றும் மாலையில் வேலை செய்யவும்', te: 'ఉదయం మరియు సాయంత్రం పని చేయండి'
    }
};

const getLocT = (lang, key) => (WEATHER_T[key] && WEATHER_T[key][lang]) || (WEATHER_T[key] && WEATHER_T[key]['en']) || key;

export default function WeatherDetail() {
    const { t, lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const navigate = useNavigate();
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        try {
            const location = localStorage.getItem('userLocation') || 'Rampur';
            const weatherRes = await fetch(`${API_BASE}/weather/current?location=${location}`);
            const weatherData = await weatherRes.json();
            
            const forecastRes = await fetch(`${API_BASE}/weather/forecast?location=${location}`);
            const forecastData = await forecastRes.json();
            
            if (weatherData.success) setWeather(weatherData.weather);
            if (forecastData.success) setForecast(forecastData.forecast);
        } catch (error) {
            console.error('Weather fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content pb-safe">
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="weather-detail-page">
            <header className="weather-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-info">
                    <h1>{weather?.temp || 32}°C</h1>
                    <p className="location">
                        <MapPin size={16} />
                        {weather?.location || 'Rampur, UP'}
                    </p>
                    <p className="description">{weather?.description}</p>
                </div>
            </header>

            <section className="weather-metrics">
                <h3>{getLocT(activeLang, 'today_weather')}</h3>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <Thermometer size={24} color="#e74c3c" />
                        <div>
                            <span className="label">{t('feels_like')}</span>
                            <strong>{weather?.feels_like || 35}°C</strong>
                        </div>
                    </div>
                    <div className="metric-card">
                        <Wind size={24} color="#3498db" />
                        <div>
                            <span className="label">{t('wind_speed')}</span>
                            <strong>{weather?.wind_speed || 12} km/h</strong>
                        </div>
                    </div>
                    <div className="metric-card">
                        <Droplets size={24} color="#2ecc71" />
                        <div>
                            <span className="label">{t('humidity')}</span>
                            <strong>{weather?.humidity || 65}%</strong>
                        </div>
                    </div>
                    <div className="metric-card">
                        <Eye size={24} color="#9b59b6" />
                        <div>
                            <span className="label">{t('visibility')}</span>
                            <strong>{weather?.visibility || 10} km</strong>
                        </div>
                    </div>
                    <div className="metric-card">
                        <Sunrise size={24} color="#f39c12" />
                        <div>
                            <span className="label">{t('sunrise')}</span>
                            <strong>{weather?.sunrise || '05:45'}</strong>
                        </div>
                    </div>
                    <div className="metric-card">
                        <Sunset size={24} color="#e67e22" />
                        <div>
                            <span className="label">{t('sunset')}</span>
                            <strong>{weather?.sunset || '18:30'}</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="temp-range">
                <h3>{getLocT(activeLang, 'temp_range')}</h3>
                <div className="range-bar">
                    <div className="range-info">
                        <span>{getLocT(activeLang, 'min')}: {weather?.temp_min || 28}°C</span>
                        <span>{getLocT(activeLang, 'max')}: {weather?.temp_max || 36}°C</span>
                    </div>
                    <div className="range-visual">
                        <div className="range-fill" style={{ width: '70%' }}></div>
                    </div>
                </div>
            </section>

            <section className="forecast-section">
                <h3>{t('weekly_forecast')}</h3>
                <div className="forecast-list">
                    {forecast.map((day, index) => (
                        <div key={index} className="forecast-card">
                            <p className="forecast-date">{day.date}</p>
                            <CloudRain size={32} color="#3498db" />
                            <div className="forecast-temp">
                                <span className="temp-max">{Math.round(day.temp_max)}°</span>
                                <span className="temp-min">{Math.round(day.temp_min)}°</span>
                            </div>
                            <p className="forecast-desc">{day.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="farming-advice">
                <h3>{t('farming_advice')}</h3>
                <div className="advice-list">
                    {weather?.temp > 35 && (
                        <div className="advice-item warning">
                            <span>🔥</span>
                            <p>{getLocT(activeLang, 'adv_high_temp')}</p>
                        </div>
                    )}
                    {weather?.humidity > 70 && (
                        <div className="advice-item info">
                            <span>💧</span>
                            <p>{getLocT(activeLang, 'adv_high_hum')}</p>
                        </div>
                    )}
                    {weather?.wind_speed > 30 && (
                        <div className="advice-item caution">
                            <span>💨</span>
                            <p>{getLocT(activeLang, 'adv_high_wind')}</p>
                        </div>
                    )}
                    <div className="advice-item success">
                        <span>✅</span>
                        <p>{getLocT(activeLang, 'adv_good')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
