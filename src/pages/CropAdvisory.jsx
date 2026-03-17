import React, { useState, useEffect } from 'react';
import { Sprout, RefreshCw, AlertCircle, Star, ChevronDown, Leaf, Bug, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './CropAdvisory.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    title:     { hi: 'फसल सलाह', en: 'Crop Advisory' },
    subtitle:  { hi: 'सही फसल, सही समय, सही लाभ', en: 'Right crop, right time, right profit' },
    season:    { hi: 'मौसम', en: 'Season' },
    soil:      { hi: 'मिट्टी का प्रकार', en: 'Soil Type' },
    recommend: { hi: 'फसल सुझाव', en: 'Crop Recommendations' },
    fertilizer:{ hi: 'उर्वरक सलाह', en: 'Fertilizer Guide' },
    pest:      { hi: 'कीट कैलेंडर', en: 'Pest Calendar' },
    season_g:  { hi: 'मौसम गाइड', en: 'Season Guide' },
    get_reco:  { hi: 'सुझाव पाएं', en: 'Get Recommendations' },
    loading:   { hi: 'लोड हो रहा है...', en: 'Loading...' },
    retry:     { hi: 'पुनः प्रयास', en: 'Retry' },
    profit:    { hi: 'लाभ स्कोर', en: 'Profit Score' },
    water:     { hi: 'पानी', en: 'Water' },
    select_crop:{ hi: 'फसल चुनें', en: 'Select Crop' },
};
const gt = (lang, k) => T[k]?.[lang] || T[k]?.en || k;

const SEASONS = [
    { id: 'kharif', hi: 'खरीफ (जून-नवंबर)', en: 'Kharif (Jun-Nov)' },
    { id: 'rabi',   hi: 'रबी (नवंबर-अप्रैल)', en: 'Rabi (Nov-Apr)' },
    { id: 'zaid',   hi: 'जायद (मार्च-जून)', en: 'Zaid (Mar-Jun)' },
];
const SOILS = [
    { id: 'loamy',    hi: 'दोमट', en: 'Loamy' },
    { id: 'black',    hi: 'काली', en: 'Black' },
    { id: 'sandy',    hi: 'बलुई', en: 'Sandy' },
    { id: 'clay',     hi: 'चिकनी', en: 'Clay' },
    { id: 'alluvial', hi: 'जलोढ़', en: 'Alluvial' },
    { id: 'red',      hi: 'लाल', en: 'Red' },
];
const CROPS_FOR_PEST = [
    { id: 'wheat', hi: 'गेहूं', en: 'Wheat' },
    { id: 'rice', hi: 'धान', en: 'Rice' },
    { id: 'mustard', hi: 'सरसों', en: 'Mustard' },
    { id: 'potato', hi: 'आलू', en: 'Potato' },
    { id: 'tomato', hi: 'टमाटर', en: 'Tomato' },
    { id: 'cotton', hi: 'कपास', en: 'Cotton' },
    { id: 'maize', hi: 'मक्का', en: 'Maize' },
];

export default function CropAdvisory() {
    const { lang } = useLanguage();
    const L = typeof lang === 'string' ? lang : 'en';

    const [season, setSeason]           = useState('rabi');
    const [soilType, setSoilType]       = useState('loamy');
    const [recommendations, setReco]    = useState([]);
    const [fertData, setFertData]       = useState(null);
    const [pestData, setPestData]       = useState(null);
    const [seasonGuide, setSeasonGuide] = useState(null);
    const [recoLoading, setRecoLoading] = useState(false);
    const [activeTab, setActiveTab]     = useState('recommend');
    const [tabLoading, setTabLoading]   = useState(false);
    const [error, setError]             = useState(false);
    const [selectedCrop, setSelectedCrop] = useState('wheat');

    const fetchRecommendations = async () => {
        setRecoLoading(true); setError(false);
        try {
            const res = await fetch(`${API_BASE}/crop-advisory/recommend?season=${season}&soil_type=${soilType}`);
            const data = await res.json();
            if (data.success) setReco(data.recommendations || data.crops || data.data || []);
        } catch { setError(true); }
        finally { setRecoLoading(false); }
    };

    const fetchTabData = async (tab) => {
        setTabLoading(true);
        try {
            if (tab === 'fertilizer') {
                const res = await fetch(`${API_BASE}/crop-advisory/fertilizer?crop=${selectedCrop}`);
                const data = await res.json();
                if (data.success) setFertData(data.fertilizer || data.data);
            } else if (tab === 'pest') {
                const month = new Date().getMonth() + 1;
                const res = await fetch(`${API_BASE}/crop-advisory/pest-calendar?crop=${selectedCrop}&month=${month}`);
                const data = await res.json();
                if (data.success) setPestData(data.pests || data.calendar || data.data);
            } else if (tab === 'season') {
                const res = await fetch(`${API_BASE}/crop-advisory/season-guide?season=${season}`);
                const data = await res.json();
                if (data.success) setSeasonGuide(data.guide || data.data);
            }
        } catch { /* silent */ }
        finally { setTabLoading(false); }
    };

    useEffect(() => { fetchRecommendations(); }, [season, soilType]);
    useEffect(() => { if (activeTab !== 'recommend') fetchTabData(activeTab); }, [activeTab, selectedCrop]);

    const TABS = [
        { id: 'recommend', label: L === 'hi' ? 'सुझाव' : 'Recommend' },
        { id: 'fertilizer', label: L === 'hi' ? 'उर्वरक' : 'Fertilizer' },
        { id: 'pest', label: L === 'hi' ? 'कीट' : 'Pest' },
        { id: 'season', label: L === 'hi' ? 'मौसम' : 'Season' },
    ];

    const renderStars = (score) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={12} fill={i < Math.round(score / 2) ? '#ffb74d' : 'none'} stroke="#ffb74d" />
        ));
    };

    return (
        <div className="page-content pb-safe ca-page">
            {/* Header */}
            <header className="ca-header animate-slide-down">
                <div className="ca-header-left">
                    <div className="ca-header-icon">🌱</div>
                    <div>
                        <h1 className="ca-title">{gt(L, 'title')}</h1>
                        <p className="ca-subtitle">{gt(L, 'subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Filters Row */}
            <div className="ca-filters animate-slide-down delay-1">
                <div className="ca-filter-group">
                    <label>{gt(L, 'season')}</label>
                    <div className="ca-select-wrap">
                        <select value={season} onChange={e => setSeason(e.target.value)}>
                            {SEASONS.map(s => <option key={s.id} value={s.id}>{L === 'hi' ? s.hi : s.en}</option>)}
                        </select>
                        <ChevronDown size={14} className="ca-arrow" />
                    </div>
                </div>
                <div className="ca-filter-group">
                    <label>{gt(L, 'soil')}</label>
                    <div className="ca-select-wrap">
                        <select value={soilType} onChange={e => setSoilType(e.target.value)}>
                            {SOILS.map(s => <option key={s.id} value={s.id}>{L === 'hi' ? s.hi : s.en}</option>)}
                        </select>
                        <ChevronDown size={14} className="ca-arrow" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="ca-tabs animate-slide-left delay-2">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`ca-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Crop selector for fertilizer/pest tabs */}
            {(activeTab === 'fertilizer' || activeTab === 'pest') && (
                <div className="ca-crop-row animate-slide-down">
                    <div className="ca-select-wrap full">
                        <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                            {CROPS_FOR_PEST.map(c => <option key={c.id} value={c.id}>{L === 'hi' ? c.hi : c.en}</option>)}
                        </select>
                        <ChevronDown size={14} className="ca-arrow" />
                    </div>
                </div>
            )}

            {/* Tab Content */}
            <div className="ca-content">
                {/* Recommendations */}
                {activeTab === 'recommend' && (
                    <div className="ca-reco-section">
                        {recoLoading ? (
                            <div className="ca-loading"><RefreshCw size={28} className="spin" /><p>{gt(L, 'loading')}</p></div>
                        ) : error ? (
                            <div className="ca-error">
                                <AlertCircle size={36} />
                                <button className="ca-retry-btn" onClick={fetchRecommendations}>{gt(L, 'retry')}</button>
                            </div>
                        ) : recommendations.length === 0 ? (
                            /* Fallback recommendations */
                            <div className="ca-reco-list">
                                {(season === 'rabi'
                                    ? [
                                        { crop_key: 'wheat', name_hi: 'गेहूं', name_en: 'Wheat', profit_score: 8, water: 'medium', reason_hi: 'दोमट मिट्टी और रबी सीजन के लिए आदर्श', reason_en: 'Ideal for loamy soil and rabi season' },
                                        { crop_key: 'mustard', name_hi: 'सरसों', name_en: 'Mustard', profit_score: 8, water: 'low', reason_hi: 'कम पानी में अच्छा मुनाफा', reason_en: 'Good profit with less water' },
                                        { crop_key: 'potato', name_hi: 'आलू', name_en: 'Potato', profit_score: 9, water: 'medium', reason_hi: 'उच्च मुनाफे वाली फसल', reason_en: 'High-profit vegetable crop' },
                                    ]
                                    : [
                                        { crop_key: 'rice', name_hi: 'धान', name_en: 'Rice', profit_score: 7, water: 'high', reason_hi: 'खरीफ सीजन की प्रमुख फसल', reason_en: 'Primary kharif crop' },
                                        { crop_key: 'soybean', name_hi: 'सोयाबीन', name_en: 'Soybean', profit_score: 7, water: 'medium', reason_hi: 'काली मिट्टी के लिए उपयुक्त', reason_en: 'Suitable for black soil' },
                                        { crop_key: 'maize', name_hi: 'मक्का', name_en: 'Maize', profit_score: 7, water: 'medium', reason_hi: 'बाजार में अच्छी मांग', reason_en: 'Good market demand' },
                                    ]
                                ).map((crop, i) => (
                                    <div key={i} className="ca-reco-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div className="ca-reco-rank">#{i + 1}</div>
                                        <div className="ca-reco-info">
                                            <h3>{L === 'hi' ? crop.name_hi : crop.name_en}</h3>
                                            <p>{L === 'hi' ? crop.reason_hi : crop.reason_en}</p>
                                            <div className="ca-reco-meta">
                                                <div className="ca-stars">{renderStars(crop.profit_score)}</div>
                                                <span className={`ca-water-badge ${crop.water}`}>
                                                    💧 {L === 'hi' ? (crop.water === 'low' ? 'कम' : crop.water === 'high' ? 'अधिक' : 'मध्यम') : crop.water}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ca-reco-list animate-slide-up">
                                {recommendations.map((crop, i) => (
                                    <div key={i} className="ca-reco-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div className="ca-reco-rank">#{i + 1}</div>
                                        <div className="ca-reco-info">
                                            <h3>{L === 'hi' ? (crop.name_hi || crop.name) : (crop.name_en || crop.name)}</h3>
                                            <p>{L === 'hi' ? (crop.reason_hi || crop.reason) : (crop.reason_en || crop.reason)}</p>
                                            <div className="ca-reco-meta">
                                                <div className="ca-stars">{renderStars(crop.profit_score || 5)}</div>
                                                {crop.water && <span className="ca-water-badge">💧 {crop.water}</span>}
                                            </div>
                                        </div>
                                        {crop.profit_score && (
                                            <div className="ca-profit-score">{crop.profit_score}<span>/10</span></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Fertilizer */}
                {activeTab === 'fertilizer' && (
                    <div className="ca-fert-section">
                        {tabLoading ? (
                            <div className="ca-loading"><RefreshCw size={24} className="spin" /></div>
                        ) : fertData ? (
                            <div className="ca-fert-card animate-slide-up">
                                <div className="ca-fert-header">
                                    <Leaf size={16} />
                                    <h3>{L === 'hi' ? CROPS_FOR_PEST.find(c => c.id === selectedCrop)?.hi : CROPS_FOR_PEST.find(c => c.id === selectedCrop)?.en} — {L === 'hi' ? 'प्रति एकड़ खाद' : 'Fertilizer per Acre'}</h3>
                                </div>
                                <div className="ca-fert-grid">
                                    {fertData.urea    && <div className="ca-fert-item"><span>यूरिया</span><strong>{fertData.urea} kg</strong></div>}
                                    {fertData.dap     && <div className="ca-fert-item"><span>DAP</span><strong>{fertData.dap} kg</strong></div>}
                                    {fertData.mop     && <div className="ca-fert-item"><span>MOP</span><strong>{fertData.mop} kg</strong></div>}
                                    {fertData.zinc    && <div className="ca-fert-item"><span>जिंक</span><strong>{fertData.zinc} kg</strong></div>}
                                    {fertData.sulfur  && <div className="ca-fert-item"><span>सल्फर</span><strong>{fertData.sulfur} kg</strong></div>}
                                </div>
                                {fertData.note_hi && (
                                    <div className="ca-fert-note">
                                        <Leaf size={13} />
                                        <p>{L === 'hi' ? fertData.note_hi : fertData.note_en || fertData.note_hi}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Fallback */
                            <div className="ca-fert-card animate-slide-up">
                                <p className="ca-fert-hint">{L === 'hi' ? 'उर्वरक जानकारी लोड हो रही है...' : 'Loading fertilizer data...'}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pest Calendar */}
                {activeTab === 'pest' && (
                    <div className="ca-pest-section">
                        {tabLoading ? (
                            <div className="ca-loading"><RefreshCw size={24} className="spin" /></div>
                        ) : pestData ? (
                            <div className="ca-pest-list animate-slide-up">
                                {(Array.isArray(pestData) ? pestData : Object.entries(pestData)).map((item, i) => {
                                    const pest = Array.isArray(pestData) ? item : { name: item[0], ...item[1] };
                                    return (
                                        <div key={i} className="ca-pest-card">
                                            <Bug size={16} className="ca-pest-icon" />
                                            <div>
                                                <h4>{L === 'hi' ? (pest.name_hi || pest.name) : (pest.name_en || pest.name)}</h4>
                                                {pest.control_hi && <p>{L === 'hi' ? pest.control_hi : pest.control_en || pest.control_hi}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="ca-pest-fallback animate-slide-up">
                                {[
                                    { emoji: '🐛', name_hi: 'दीमक', name_en: 'Termite', control_hi: 'क्लोरपाइरिफॉस 20EC 2ml/लीटर पानी में मिलाकर मिट्टी में डालें' },
                                    { emoji: '🦟', name_hi: 'माहू/एफिड', name_en: 'Aphid', control_hi: 'इमिडाक्लोप्रिड 17.8SL 0.5ml/लीटर का छिड़काव करें' },
                                    { emoji: '🍄', name_hi: 'झुलसा रोग', name_en: 'Blight', control_hi: 'मैंकोज़ेब 75WP 2.5g/लीटर का छिड़काव 15 दिन पर करें' },
                                ].map((p, i) => (
                                    <div key={i} className="ca-pest-card">
                                        <span className="ca-pest-emoji">{p.emoji}</span>
                                        <div>
                                            <h4>{L === 'hi' ? p.name_hi : p.name_en}</h4>
                                            <p>{L === 'hi' ? p.control_hi : p.control_hi}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Season Guide */}
                {activeTab === 'season' && (
                    <div className="ca-season-section">
                        {tabLoading ? (
                            <div className="ca-loading"><RefreshCw size={24} className="spin" /></div>
                        ) : (
                            <div className="ca-season-guide animate-slide-up">
                                {(seasonGuide || [
                                    { month_hi: 'जून-जुलाई', month_en: 'Jun-Jul', activity_hi: 'खरीफ फसलों की बुवाई', activity_en: 'Sow kharif crops', season: 'kharif' },
                                    { month_hi: 'अगस्त-सितंबर', month_en: 'Aug-Sep', activity_hi: 'खाद और कीट प्रबंधन', activity_en: 'Fertilizer and pest management', season: 'kharif' },
                                    { month_hi: 'अक्टूबर-नवंबर', month_en: 'Oct-Nov', activity_hi: 'खरीफ कटाई, रबी बुवाई', activity_en: 'Harvest kharif, sow rabi', season: 'transition' },
                                    { month_hi: 'दिसंबर-जनवरी', month_en: 'Dec-Jan', activity_hi: 'रबी फसलों की देखभाल', activity_en: 'Rabi crop care', season: 'rabi' },
                                    { month_hi: 'फरवरी-मार्च', month_en: 'Feb-Mar', activity_hi: 'रबी कटाई की तैयारी', activity_en: 'Prepare for rabi harvest', season: 'rabi' },
                                    { month_hi: 'अप्रैल-मई', month_en: 'Apr-May', activity_hi: 'रबी कटाई, जायद बुवाई', activity_en: 'Harvest rabi, sow zaid', season: 'zaid' },
                                ]).map((item, i) => (
                                    <div key={i} className={`ca-season-item sea-${item.season || 'kharif'}`}>
                                        <div className="ca-season-month">
                                            <Calendar size={13} />
                                            {L === 'hi' ? item.month_hi : item.month_en}
                                        </div>
                                        <p>{L === 'hi' ? (item.activity_hi || item.activity) : (item.activity_en || item.activity)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
