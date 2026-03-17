import React, { useState, useEffect } from 'react';
import { Droplets, Calculator, RefreshCw, AlertCircle, ChevronDown, CheckCircle, Zap, Calendar, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Irrigation.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    title:       { hi: 'सिंचाई और जल प्रबंधन', en: 'Irrigation & Water Management' },
    subtitle:    { hi: 'स्मार्ट सिंचाई से पानी बचाएं', en: 'Save water with smart irrigation' },
    crop:        { hi: 'फसल चुनें', en: 'Select Crop' },
    land:        { hi: 'क्षेत्र (एकड़)', en: 'Land Area (Acres)' },
    calculate:   { hi: 'पानी की जरूरत जानें', en: 'Calculate Water Need' },
    methods:     { hi: 'सिंचाई के तरीके', en: 'Irrigation Methods' },
    subsidy:     { hi: 'सब्सिडी जानकारी', en: 'Subsidy Information' },
    tips:        { hi: 'सिंचाई टिप्स', en: 'Irrigation Tips' },
    daily_need:  { hi: 'प्रतिदिन पानी', en: 'Daily Water Need' },
    weekly_need: { hi: 'साप्ताहिक पानी', en: 'Weekly Water Need' },
    schedule:    { hi: 'सिंचाई शेड्यूल', en: 'Irrigation Schedule' },
    method_reco: { hi: 'सर्वोत्तम तरीका', en: 'Best Method' },
    loading:     { hi: 'लोड हो रहा है...', en: 'Loading...' },
    retry:       { hi: 'पुनः प्रयास', en: 'Retry' },
    error_msg:   { hi: 'डेटा लोड नहीं हो सका', en: 'Could not load data' },
    efficiency:  { hi: 'दक्षता', en: 'Efficiency' },
    saving:      { hi: 'पानी बचत', en: 'Water Saving' },
    cost:        { hi: 'लागत/एकड़', en: 'Cost/Acre' },
    get_subsidy: { hi: 'सब्सिडी विवरण', en: 'Get Subsidy Info' },
    stages:      { hi: 'फसल चरण', en: 'Growth Stages' },
};
const gt = (lang, k) => T[k]?.[lang] || T[k]?.en || k;

const CROPS = [
    { id: 'wheat',     hi: 'गेहूं',      en: 'Wheat' },
    { id: 'rice',      hi: 'धान',        en: 'Rice' },
    { id: 'sugarcane', hi: 'गन्ना',      en: 'Sugarcane' },
    { id: 'potato',    hi: 'आलू',        en: 'Potato' },
    { id: 'tomato',    hi: 'टमाटर',     en: 'Tomato' },
    { id: 'onion',     hi: 'प्याज',      en: 'Onion' },
    { id: 'maize',     hi: 'मक्का',      en: 'Maize' },
    { id: 'mustard',   hi: 'सरसों',      en: 'Mustard' },
    { id: 'soybean',   hi: 'सोयाबीन',   en: 'Soybean' },
    { id: 'cotton',    hi: 'कपास',       en: 'Cotton' },
];

export default function Irrigation() {
    const { lang } = useLanguage();
    const L = typeof lang === 'string' ? lang : 'en';

    const [methods, setMethods]         = useState([]);
    const [tips, setTips]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(false);
    const [crop, setCrop]               = useState('wheat');
    const [landArea, setLandArea]       = useState('1');
    const [calcResult, setCalcResult]   = useState(null);
    const [calcLoading, setCalcLoading] = useState(false);
    const [subsidyInfo, setSubsidyInfo] = useState(null);
    const [activeTab, setActiveTab]     = useState('methods');

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const [mRes, tRes] = await Promise.all([
                fetch(`${API_BASE}/irrigation/methods`),
                fetch(`${API_BASE}/irrigation/tips`)
            ]);
            const mData = await mRes.json();
            const tData = await tRes.json();
            if (mData.success) setMethods(mData.methods || []);
            if (tData.success) setTips(tData.tips || []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const calculate = async () => {
        if (!crop || !landArea) return;
        setCalcLoading(true);
        try {
            // Use /advice which gives weather-adjusted rich results
            const res = await fetch(`${API_BASE}/irrigation/advice?crop=${crop}&land_area=${landArea}`);
            const data = await res.json();
            if (data.success && data.data) {
                setCalcResult(data.data);
            } else {
                // Fallback to /calculate
                const res2 = await fetch(`${API_BASE}/irrigation/calculate?crop=${crop}&land_area=${landArea}`);
                const data2 = await res2.json();
                if (data2.success) setCalcResult(data2.result || data2.calculation);
            }
        } catch { setCalcResult(null); }
        finally { setCalcLoading(false); }
    };

    const getSubsidy = async () => {
        try {
            const res = await fetch(`${API_BASE}/irrigation/subsidy?method=drip&area=${landArea}&farmer_category=small_marginal`);
            const data = await res.json();
            if (data.success) setSubsidyInfo(data.subsidy);
        } catch { setSubsidyInfo(null); }
    };

    const getCropName = (id) => {
        const c = CROPS.find(x => x.id === id);
        return c ? (L === 'hi' ? c.hi : c.en) : id;
    };

    const TABS = [
        { id: 'methods', label: L === 'hi' ? 'तरीके' : 'Methods' },
        { id: 'tips',    label: L === 'hi' ? 'टिप्स' : 'Tips' },
        { id: 'subsidy', label: L === 'hi' ? 'सब्सिडी' : 'Subsidy' },
    ];

    // Helper: get daily water from different API response shapes
    const getDailyLiters = (r) =>
        r?.water_requirement?.daily_liters ||
        r?.daily_water_liters ||
        r?.daily_liters ||
        null;

    const getSchedule = (r) =>
        r?.water_requirement?.frequency ||
        r?.weekly_schedule?.[0]?.time_recommended ||
        r?.irrigation_schedule ||
        r?.schedule ||
        null;

    const getMethodName = (r) => {
        const m = r?.recommended_method;
        if (!m) return null;
        if (typeof m === 'string') return m;
        return L === 'hi' ? m.name_hi : m.name_en;
    };

    return (
        <div className="page-content pb-safe irr-page">
            {/* Header */}
            <header className="irr-header animate-slide-down">
                <div className="irr-header-left">
                    <div className="irr-header-icon">💧</div>
                    <div>
                        <h1 className="irr-title">{gt(L, 'title')}</h1>
                        <p className="irr-subtitle">{gt(L, 'subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Calculator Card */}
            <div className="irr-calc-card animate-slide-up">
                <div className="irr-calc-header">
                    <Calculator size={18} />
                    <span>{gt(L, 'calculate')}</span>
                </div>
                <div className="irr-calc-inputs">
                    <div className="irr-input-group">
                        <label>{gt(L, 'crop')}</label>
                        <div className="irr-select-wrap">
                            <select value={crop} onChange={e => setCrop(e.target.value)}>
                                {CROPS.map(c => (
                                    <option key={c.id} value={c.id}>{L === 'hi' ? c.hi : c.en}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="irr-select-arrow" />
                        </div>
                    </div>
                    <div className="irr-input-group">
                        <label>{gt(L, 'land')}</label>
                        <input
                            type="number" value={landArea} min="0.5" max="100" step="0.5"
                            onChange={e => setLandArea(e.target.value)}
                            placeholder="1.0"
                        />
                    </div>
                </div>
                <button className="irr-calc-btn" onClick={calculate} disabled={calcLoading}>
                    {calcLoading ? <RefreshCw size={16} className="spin" /> : <Droplets size={16} />}
                    {gt(L, 'calculate')}
                </button>

                {/* Calculation Result */}
                {calcResult && (
                    <div className="irr-result animate-slide-up">
                        {/* Water Metrics */}
                        <div className="irr-result-row">
                            <div className="irr-result-item">
                                <span className="irr-result-label">{gt(L, 'daily_need')}</span>
                                <span className="irr-result-value blue">
                                    {(getDailyLiters(calcResult) || '—').toLocaleString()} L
                                </span>
                            </div>
                            <div className="irr-result-item">
                                <span className="irr-result-label">{gt(L, 'weekly_need')}</span>
                                <span className="irr-result-value green">
                                    {(calcResult?.water_requirement?.weekly_liters ||
                                      calcResult?.weekly_liters ||
                                      (getDailyLiters(calcResult) ? getDailyLiters(calcResult) * 7 : null) ||
                                      '—').toLocaleString()} L
                                </span>
                            </div>
                        </div>

                        {/* Irrigation Schedule */}
                        {getSchedule(calcResult) && (
                            <div className="irr-schedule-box">
                                <p className="irr-schedule-label">
                                    <Calendar size={13} /> {gt(L, 'schedule')}:
                                </p>
                                <p className="irr-schedule-text">{getSchedule(calcResult)}</p>
                            </div>
                        )}

                        {/* Recommended Method */}
                        {getMethodName(calcResult) && (
                            <div className="irr-reco-box">
                                <CheckCircle size={14} />
                                <span>
                                    {gt(L, 'method_reco')}: <strong>{getMethodName(calcResult)}</strong>
                                </span>
                            </div>
                        )}

                        {/* Growth Stages */}
                        {(calcResult?.crop?.stages || calcResult?.growth_stages) && (
                            <div className="irr-stages-box">
                                <p className="irr-stages-label">
                                    <Leaf size={13} /> {gt(L, 'stages')}:
                                </p>
                                <div className="irr-stages-pills">
                                    {(calcResult?.crop?.stages || calcResult?.growth_stages || []).map((s, i) => (
                                        <span key={i} className="irr-stage-pill">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tips from advice */}
                        {calcResult?.tips_hi && (
                            <div className="irr-advice-tips">
                                {calcResult.tips_hi.slice(0, 3).map((tip, i) => (
                                    <div key={i} className="irr-tip-card">
                                        <Zap size={12} className="irr-tip-icon" />
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="irr-tabs animate-slide-left delay-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`irr-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="irr-tab-content">
                {loading ? (
                    <div className="irr-loading">
                        <RefreshCw size={28} className="spin" />
                        <p>{gt(L, 'loading')}</p>
                    </div>
                ) : error ? (
                    <div className="irr-error">
                        <AlertCircle size={40} />
                        <p>{gt(L, 'error_msg')}</p>
                        <button className="irr-retry-btn" onClick={fetchData}>{gt(L, 'retry')}</button>
                    </div>
                ) : (
                    <>
                        {/* Methods Tab */}
                        {activeTab === 'methods' && (
                            <div className="irr-methods-list animate-slide-up">
                                {(methods.length > 0 ? methods : [
                                    { id: 'drip', name_hi: 'ड्रिप सिंचाई', name_en: 'Drip Irrigation', efficiency: 90, water_saving_pct: '50-60%', cost_per_acre: '₹40,000-60,000', subsidy: 'PMKSY — 55-90%', emoji: '💧' },
                                    { id: 'sprinkler', name_hi: 'स्प्रिंकलर', name_en: 'Sprinkler Irrigation', efficiency: 75, water_saving_pct: '30-40%', cost_per_acre: '₹15,000-25,000', subsidy: 'PMKSY — 55-75%', emoji: '🌧️' },
                                    { id: 'flood', name_hi: 'बाढ़ सिंचाई', name_en: 'Flood Irrigation', efficiency: 40, water_saving_pct: '0%', cost_per_acre: '₹2,000-5,000', subsidy: 'कोई सब्सिडी नहीं', emoji: '🏞️' },
                                ]).map((m, i) => (
                                    <div key={m.id || i} className="irr-method-card" style={{ animationDelay: `${i * 0.06}s` }}>
                                        <div className="irr-method-head">
                                            <span className="irr-method-emoji">{m.emoji || '💧'}</span>
                                            <div>
                                                <h3>{L === 'hi' ? m.name_hi : m.name_en}</h3>
                                                <div className="irr-method-subsidy">{m.subsidy || m.subsidy_scheme || ''}</div>
                                            </div>
                                        </div>
                                        <div className="irr-method-stats">
                                            <div className="irr-stat-item">
                                                <span>{gt(L, 'efficiency')}</span>
                                                <div className="irr-bar-wrap">
                                                    <div className="irr-bar" style={{
                                                        width: `${m.efficiency || 60}%`,
                                                        background: m.efficiency >= 80 ? '#52b788' : m.efficiency >= 60 ? '#4a9eff' : '#fb923c'
                                                    }} />
                                                </div>
                                                <strong>{m.efficiency || '—'}%</strong>
                                            </div>
                                            <div className="irr-method-meta">
                                                <span>💰 {gt(L, 'cost')}: {m.cost_per_acre || m.cost}</span>
                                                <span>💧 {gt(L, 'saving')}: {m.water_saving_pct || m.saving}</span>
                                            </div>
                                            {/* Pros */}
                                            {m.pros_hi && m.pros_hi.length > 0 && (
                                                <div className="irr-pros-list">
                                                    {m.pros_hi.map((p, j) => (
                                                        <span key={j} className="irr-pro-chip">✓ {p}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tips Tab */}
                        {activeTab === 'tips' && (
                            <div className="irr-tips-list animate-slide-up">
                                {(tips.length > 0 ? tips : [
                                    { hi: 'सुबह या शाम को सिंचाई करें — वाष्पीकरण कम होगा', en: 'Irrigate in morning or evening to reduce evaporation' },
                                    { hi: 'मिट्टी में नमी जांचकर ही सिंचाई करें', en: 'Check soil moisture before irrigating' },
                                    { hi: 'ड्रिप सिंचाई से 50-60% पानी बच सकता है', en: 'Drip irrigation can save 50-60% water' },
                                    { hi: 'PMKSY योजना में ड्रिप/स्प्रिंकलर पर 55-90% सब्सिडी', en: 'PMKSY offers 55-90% subsidy on drip/sprinkler' },
                                    { hi: 'मल्चिंग से मिट्टी की नमी लंबे समय तक बनी रहती है', en: 'Mulching helps retain soil moisture longer' },
                                ]).map((tip, i) => (
                                    <div key={i} className="irr-tip-card" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <Zap size={14} className="irr-tip-icon" />
                                        <p>{L === 'hi' ? (tip.hi || tip) : (tip.en || tip)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Subsidy Tab */}
                        {activeTab === 'subsidy' && (
                            <div className="irr-subsidy-section animate-slide-up">
                                <div className="irr-subsidy-header">
                                    <h3>{L === 'hi' ? 'PMKSY सब्सिडी' : 'PMKSY Subsidy'}</h3>
                                    <p>{L === 'hi' ? 'प्रधानमंत्री कृषि सिंचाई योजना' : 'Pradhan Mantri Krishi Sinchayee Yojana'}</p>
                                </div>
                                <div className="irr-subsidy-cards">
                                    {[
                                        { method: L === 'hi' ? 'ड्रिप सिंचाई' : 'Drip Irrigation', small: '90%', other: '55%', emoji: '💧' },
                                        { method: L === 'hi' ? 'स्प्रिंकलर' : 'Sprinkler', small: '80%', other: '55%', emoji: '🌧️' },
                                        { method: L === 'hi' ? 'माइक्रो स्प्रिंकलर' : 'Micro Sprinkler', small: '90%', other: '55%', emoji: '🌱' },
                                    ].map((item, i) => (
                                        <div key={i} className="irr-subsidy-card">
                                            <div className="irr-sub-emoji">{item.emoji}</div>
                                            <h4>{item.method}</h4>
                                            <div className="irr-sub-rates">
                                                <span className="irr-sub-rate">
                                                    {L === 'hi' ? 'छोटे/सीमांत किसान' : 'Small Farmers'}: <strong>{item.small}</strong>
                                                </span>
                                                <span className="irr-sub-rate">
                                                    {L === 'hi' ? 'अन्य किसान' : 'Other Farmers'}: <strong>{item.other}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="irr-sub-cta" onClick={getSubsidy}>
                                    <Droplets size={16} /> {gt(L, 'get_subsidy')}
                                </button>
                                {subsidyInfo && (
                                    <div className="irr-subsidy-result animate-slide-up">
                                        <div className="irr-sub-result-grid">
                                            <div className="irr-sub-result-item">
                                                <span>{L === 'hi' ? 'कुल लागत' : 'Total Cost'}</span>
                                                <strong>₹{subsidyInfo.total_cost?.toLocaleString()}</strong>
                                            </div>
                                            <div className="irr-sub-result-item green">
                                                <span>{L === 'hi' ? 'सब्सिडी' : 'Subsidy'} ({subsidyInfo.subsidy_percent}%)</span>
                                                <strong>₹{subsidyInfo.subsidy_amount?.toLocaleString()}</strong>
                                            </div>
                                            <div className="irr-sub-result-item blue">
                                                <span>{L === 'hi' ? 'आपका हिस्सा' : 'Your Share'}</span>
                                                <strong>₹{subsidyInfo.farmer_share?.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                        {subsidyInfo.note_hi && (
                                            <div className="irr-sub-note-box">
                                                <CheckCircle size={14} />
                                                <p>{L === 'hi' ? subsidyInfo.note_hi : subsidyInfo.note_hi}</p>
                                            </div>
                                        )}
                                        <a href="https://pmksy.gov.in" target="_blank" rel="noreferrer" className="irr-apply-link">
                                            {L === 'hi' ? 'pmksy.gov.in पर आवेदन करें →' : 'Apply at pmksy.gov.in →'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
