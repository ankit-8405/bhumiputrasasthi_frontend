import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, MapPin, Video, Phone, MessageSquare, ShieldCheck, Search, SearchSlash, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './DoctorList.css';

// --- Inline Translations ---
const DOC_T = {
    title: { hi: 'कृषि विशेषज्ञ', en: 'Agri Experts', bn: 'কৃষি বিশেষজ্ঞ', or: 'କୃଷି ବିଶେଷଜ୍ଞ', mai: 'कृषि विशेषज्ञ', pa: 'ਖੇਤੀ ਮਾਹਿਰ', mr: 'कृषी तज्ञ', gu: 'કૃષિ નિષ્ણાતો', ta: 'வேளாண் நிபுணர்கள்', te: 'వ్యవసాయ నిపుణులు' },
    subtitle: { hi: 'देश के बेस्ट कृषि विशेषज्ञों से सलाह लें', en: 'Get advice from the best agricultural experts', bn: 'সেরা কৃষি বিশেষজ্ঞদের থেকে পরামর্শ নিন', or: 'ସର୍ବଶ୍ରେଷ୍ଠ କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ', mai: 'देश देशक श्रेष्ठ कृषि विशेषज्ञसँ सलाह लिअ', pa: 'ਦੇਸ਼ ਦੇ ਸਭ ਤੋਂ ਵਧੀਆ ਖੇਤੀ ਮਾਹਿਰਾਂ ਤੋਂ ਸਲਾਹ ਲਓ', mr: 'देशातील सर्वोत्तम कृषी तज्ज्ञांचा सल्ला घ्या', gu: 'દેશના શ્રેષ્ઠ કૃષિ નિષ્ણાતોની સલાહ લો', ta: 'சிறந்த வேளாண் நிபுணர்களிடம் ஆலோசனை பெறுங்கள்', te: 'ఉత్తమ వ్యవసాయ నిపుణుల నుండి సలహా పొందండి' },
    search: { hi: 'डॉक्टर या विशेषज्ञ खोजें...', en: 'Search doctors or experts...', bn: 'ডাক্তার বা বিশেষজ্ঞ খুঁজুন...', or: 'ଡାକ୍ତର କିମ୍ବା ବିଶେଷଜ୍ଞ ଖୋଜନ୍ତୁ...', mai: 'डॉक्टर वा विशेषज्ञ खोजू...', pa: 'ਡਾਕਟਰ ਜਾਂ ਮਾਹਿਰ ਲੱਭੋ...', mr: 'डॉक्टर किंवा तज्ञ शोधा...', gu: 'ડૉક્ટર અથવા નિષ્ણાત શોધો...', ta: 'மருத்துவர் அல்லது நிபுணரைத் தேடுங்கள்...', te: 'వైద్యుడు లేదా నిపుణుడిని శోధించండి...' },
    cat_all: { hi: 'सभी', en: 'All', bn: 'সব', or: 'ସମସ୍ତ', mai: 'सबहि', pa: 'ਸਾਰੇ', mr: 'सर्व', gu: 'બધા', ta: 'அனைத்து', te: 'అన్ని' },
    cat_crop: { hi: 'फसल रोग', en: 'Crop Disease', bn: 'ফসলের রোগ', or: 'ଫସଲ ରୋଗ', mai: 'फसल रोग', pa: 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ', mr: 'पिकांचे आजार', gu: 'પાકના રોગો', ta: 'பயிர் நோய்', te: 'పంట వ్యాధి' },
    cat_animal: { hi: 'पशु', en: 'Animal', bn: 'পশু', or: 'ପଶୁ', mai: 'पशु', pa: 'ਪਸ਼ੂ', mr: 'प्राणी', gu: 'પ્રાણીઓ', ta: 'விலங்கு', te: 'జంతువు' },
    cat_soil: { hi: 'मिट्टी', en: 'Soil', bn: 'মাটি', or: 'ମାଟି', mai: 'माटि', pa: 'ਮਿੱਟੀ', mr: 'माती', gu: 'માટી', ta: 'மண்', te: 'నేల' },
    online_now: { hi: 'अभी ऑनलाइन', en: 'Online Now', bn: 'এখন অনলাইনে', or: 'ଏବେ ଅନଲାଇନ୍ ଅଛନ୍ତି', mai: 'अखन ऑनलाइन', pa: 'ਹੁਣ ਆਨਲਾਈਨ', mr: 'आता ऑनलाइन', gu: 'હવે ઓનલાઇન', ta: 'இப்போது ஆன்லைனில்', te: 'ఇప్పుడు ఆన్‌లైన్‌లో' },
    offline: { hi: 'ऑफ़लाइन', en: 'Offline', bn: 'অফলাইন', or: 'ଅଫଲାଇନ୍', mai: 'ऑफ़लाइन', pa: 'ਆਫਲਾਈਨ', mr: 'ऑफलाइन', gu: 'ઓફલાઇન', ta: 'ஆஃப்லைனில்', te: 'ఆఫ్‌లైన్' },
    no_results: { hi: 'कोई डॉक्टर नहीं मिला', en: 'No doctors found', bn: 'কোনো ডাক্তার পাওয়া যায়নি', or: 'କୌଣସି ଡାକ୍ତର ମିଳିଲେ ନାହିଁ', mai: 'कोनो डॉक्टर नहि भेटल', pa: 'ਕੋਈ ਡਾਕਟਰ ਨਹੀਂ ਮਿਲਿਆ', mr: 'कोणतेही डॉक्टर आढळले नाहीत', gu: 'કોઈ ડૉક્ટર મળ્યા નથી', ta: 'மருத்துவர்கள் யாரும் இல்லை', te: 'వైద్యులు ఎవరూ దొరకలేదు' },
    exp_suffix: { hi: 'साल', en: 'Years', bn: 'বছর', or: 'ବର୍ଷ', mai: 'बर्ष', pa: 'ਸਾਲ', mr: 'वर्षे', gu: 'વર્ષ', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు' }
};

const getT = (lang, key) => (DOC_T[key] && DOC_T[key][lang]) || (DOC_T[key] && DOC_T[key]['en']) || key;

// Avatar color generator based on name
const getAvatarColor = (name) => {
    const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea', '#ed64a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// Multi-language mock data (expanded for demonstration)
const MOCK_DOCTORS = [
    {
        id: 1, category: 'crop', rating: 4.8, reviews: 120, isOnline: true, isVerified: true,
        name: { hi: "डॉ. राजेश वर्मा", en: "Dr. Rajesh Verma", bn: "ডাঃ রাজেশ ভার্মা", mr: "डॉ. राजेश वर्मा" },
        spec: { hi: "फसल रोग विशेषज्ञ", en: "Plant Pathologist", bn: "উদ্ভিদ রোগ বিশেষজ্ঞ", mr: "वनस्पती रोगतज्ज्ञ" },
        exp: "15",
        loc: { hi: "वाराणसी, यूपी", en: "Varanasi, UP", bn: "বারাণসী, ইউপি", mr: "वाराणसी, यूपी" }
    },
    {
        id: 2, category: 'animal', rating: 4.9, reviews: 85, isOnline: false, isVerified: true,
        name: { hi: "डॉ. अनीता सिंह", en: "Dr. Anita Singh", bn: "ডাঃ অনিতা সিং", mr: "डॉ. अनिता सिंग" },
        spec: { hi: "पशु चिकित्सक", en: "Veterinary Doctor", bn: "পশু চিকিৎসক", mr: "पशुवैद्यकीय डॉक्टर" },
        exp: "8",
        loc: { hi: "लखनऊ, यूपी", en: "Lucknow, UP", bn: "লখনউ, ইউপি", mr: "लखनौ, यूपी" }
    },
    {
        id: 3, category: 'soil', rating: 4.5, reviews: 45, isOnline: true, isVerified: false,
        name: { hi: "डॉ. सुरेश पटेल", en: "Dr. Suresh Patel", bn: "ডাঃ সুরেশ প্যাটেল", mr: "डॉ. सुरेश पटेल" },
        spec: { hi: "मिट्टी विशेषज्ञ", en: "Soil Expert", bn: "মাটি বিশেষজ্ঞ", mr: "माती तज्ज्ञ" },
        exp: "12",
        loc: { hi: "कानपुर, यूपी", en: "Kanpur, UP", bn: "কানপুর, ইউপি", mr: "कानपूर, यूपी" }
    },
    {
        id: 4, category: 'crop', rating: 4.7, reviews: 95, isOnline: true, isVerified: true,
        name: { hi: "डॉ. प्रिया शर्मा", en: "Dr. Priya Sharma", bn: "ডাঃ প্রিয়া শর্মা", mr: "डॉ. प्रिया शर्मा" },
        spec: { hi: "फसल सलाहकार", en: "Crop Consultant", bn: "ফসল পরামর্শদাতা", mr: "पीक सल्लागार" },
        exp: "10",
        loc: { hi: "पटना, बिहार", en: "Patna, Bihar", bn: "পাটনা, বিহার", mr: "पाटणा, बिहार" }
    }
];

export default function DoctorList() {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const activeLang = typeof lang === 'string' ? lang : 'en';

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        let cancelled = false;
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${API_BASE}/doctors`);
                const data = await res.json();
                if (!cancelled) {
                    if (data.success && data.doctors?.length > 0) {
                        setDoctors(data.doctors);
                    } else {
                        setDoctors(MOCK_DOCTORS);
                    }
                }
            } catch {
                if (!cancelled) setDoctors(MOCK_DOCTORS);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchDoctors();
        return () => { cancelled = true; };
    }, []);

    const categories = [
        { id: 'all', label: getT(activeLang, 'cat_all') },
        { id: 'crop', label: getT(activeLang, 'cat_crop') },
        { id: 'animal', label: getT(activeLang, 'cat_animal') },
        { id: 'soil', label: getT(activeLang, 'cat_soil') }
    ];

    const getProp = useCallback((obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[activeLang] || obj['hi'] || obj['en'] || Object.values(obj)[0];
    }, [activeLang]);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc => {
            const matchesCategory = filter === 'all' || doc.category === filter;
            const searchLower = searchQuery.toLowerCase();
            const docName = getProp(doc.name).toLowerCase();
            const docSpec = getProp(doc.spec).toLowerCase();
            const matchesSearch = docName.includes(searchLower) || docSpec.includes(searchLower);
            return matchesCategory && matchesSearch;
        });
    }, [filter, searchQuery, doctors, getProp]);

    const handleConsult = (doctorId, type) => {
        navigate(`/consultation/${doctorId}/${type}`);
    };

    return (
        <div className="page-content pb-safe">
            <header className="docs-header animate-slide-down">
                <div className="header-titles">
                    <h2>{getT(activeLang, 'title')} 👨‍⚕️</h2>
                    <p className="subtitle">{getT(activeLang, 'subtitle')}</p>
                </div>
                
                {/* Search Bar */}
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder={getT(activeLang, 'search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="doc-search-input"
                    />
                    {searchQuery && (
                        <SearchSlash 
                            className="clear-search" 
                            size={18} 
                            onClick={() => setSearchQuery('')} 
                        />
                    )}
                </div>
            </header>

            {/* Scrollable Categories Map */}
            <div className="category-scroll animate-slide-left delay-1">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`cat-pill ${filter === cat.id ? 'active' : ''}`}
                        onClick={() => setFilter(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Doctor List */}
            <div className="doctor-list animate-slide-up delay-2">
                {loading ? (
                    <div className="doc-skeleton-list">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="doctor-card skel-pulse">
                                <div className="doc-info skel-info">
                                    <div className="skel-avatar"></div>
                                    <div className="skel-details">
                                        <div className="skel-line w-70"></div>
                                        <div className="skel-line w-50"></div>
                                        <div className="skel-line w-40 mt-2"></div>
                                    </div>
                                </div>
                                <div className="skel-actions">
                                    <div className="skel-btn"></div>
                                    <div className="skel-btn"></div>
                                    <div className="skel-btn"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="no-docs-found">
                        <SearchSlash size={48} color="var(--text-muted)" />
                        <h3>{getT(activeLang, 'no_results')}</h3>
                    </div>
                ) : (
                    filteredDoctors.map((doc, index) => {
                        const name = getProp(doc.name);
                        const spec = getProp(doc.spec);
                        const loc = getProp(doc.loc);
                        const expText = `${doc.exp} ${getT(activeLang, 'exp_suffix')}`;
                        const initials = getInitials(name);
                        const avatarBg = getAvatarColor(name);

                        return (
                            <div 
                                key={doc.id} 
                                className="doctor-card animate-fade-in-up" 
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="doc-info">
                                    <div className="doc-avatar-container">
                                        <div className="doc-avatar-initials" style={{ backgroundColor: avatarBg }}>
                                            {initials}
                                        </div>
                                        <div className={`status-badge ${doc.isOnline ? 'online' : 'offline'}`}>
                                            {doc.isOnline && <span className="pulse-dot"></span>}
                                        </div>
                                    </div>
                                    
                                    <div className="doc-details">
                                        <div className="doc-name-row">
                                            <h3>{name}</h3>
                                            {doc.isVerified && <ShieldCheck size={18} className="verified-icon" />}
                                        </div>
                                        
                                        <p className="specialization">{spec}</p>
                                        
                                        <div className="doc-meta-grid">
                                            <div className="meta-item rating">
                                                <Star className="star-icon" size={14} fill="#FFB703" stroke="none" />
                                                <span>{doc.rating} ({doc.reviews})</span>
                                            </div>
                                            <div className="meta-item exp">
                                                <Clock size={14} /> 
                                                <span>{expText}</span>
                                            </div>
                                            <div className="meta-item location">
                                                <MapPin size={14} /> 
                                                <span>{loc}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="consult-actions">
                                    <button className="consult-btn btn-chat" onClick={() => handleConsult(doc.id, 'chat')}>
                                        <MessageSquare size={18} />
                                    </button>
                                    <button className="consult-btn btn-audio" onClick={() => handleConsult(doc.id, 'audio')} disabled={!doc.isOnline}>
                                        <Phone size={18} />
                                    </button>
                                    <button className="consult-btn btn-video" onClick={() => handleConsult(doc.id, 'video')} disabled={!doc.isOnline}>
                                        <Video size={18} />
                                    </button>
                                    <div className="online-status-text">
                                        {doc.isOnline ? getT(activeLang, 'online_now') : getT(activeLang, 'offline')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
