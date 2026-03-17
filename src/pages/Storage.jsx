import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, AlertCircle, TrendingUp, Warehouse, Clock, Phone, Calculator, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Storage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    title:      { hi: 'भंडारण और बाजार', en: 'Storage & Market' },
    subtitle:   { hi: 'सही समय पर बेचें, सही जगह रखें', en: 'Sell at right time, store at right place' },
    all_crops:  { hi: 'फसल चुनें', en: 'Select Crop' },
    tips:       { hi: 'भंडारण टिप्स', en: 'Storage Tips' },
    warehouses: { hi: 'गोदाम खोजें', en: 'Find Warehouses' },
    calculator: { hi: 'बेचें या रखें?', en: 'Sell or Store?' },
    timing:     { hi: 'बाजार समय', en: 'Market Timing' },
    loading:    { hi: 'लोड हो रहा है...', en: 'Loading...' },
    retry:      { hi: 'पुनः प्रयास', en: 'Retry' },
    quantity:   { hi: 'मात्रा (क्विंटल)', en: 'Quantity (Quintals)' },
    mkt_price:  { hi: 'बाजार दाम (₹/क्विंटल)', en: 'Market Price (₹/quintal)' },
    calculate:  { hi: 'अभी जानें', en: 'Calculate Now' },
    sell_reco:  { hi: 'बेचने की सलाह', en: 'Sell Recommendation' },
    store_reco: { hi: 'रखने की सलाह', en: 'Store Recommendation' },
    loan_avail: { hi: 'वेयरहाउस लोन उपलब्ध', en: 'Warehouse Loan Available' },
};
const gt = (lang, k) => T[k]?.[lang] || T[k]?.en || k;

const CROPS = [
    { id: 'wheat',   hi: 'गेहूं',     en: 'Wheat' },
    { id: 'rice',    hi: 'धान/चावल', en: 'Rice' },
    { id: 'potato',  hi: 'आलू',       en: 'Potato' },
    { id: 'onion',   hi: 'प्याज',     en: 'Onion' },
    { id: 'mustard', hi: 'सरसों',     en: 'Mustard' },
    { id: 'soybean', hi: 'सोयाबीन',  en: 'Soybean' },
    { id: 'maize',   hi: 'मक्का',     en: 'Maize' },
];

export default function Storage() {
    const { lang } = useLanguage();
    const { isAuthenticated, token } = useAuth();
    const L = typeof lang === 'string' ? lang : 'en';

    const [tips, setTips]           = useState(null);
    const [warehouses, setWarehouses]= useState([]);
    const [timing, setTiming]       = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(false);
    const [crop, setCrop]           = useState('wheat');
    const [qty, setQty]             = useState('10');
    const [mktPrice, setMktPrice]   = useState('');
    const [calcResult, setCalcResult]= useState(null);
    const [calcLoading, setCalcLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tips');
    const [booking, setBooking]     = useState(null);
    const [booked, setBooked]       = useState({});

    const fetchData = async (selectedCrop = crop) => {
        setLoading(true); setError(false);
        try {
            const [tRes, wRes, mRes] = await Promise.all([
                fetch(`${API_BASE}/storage/tips?crop=${selectedCrop}`),
                fetch(`${API_BASE}/storage/warehouses?district=Lucknow`),
                fetch(`${API_BASE}/storage/market-timing?crop=${selectedCrop}`)
            ]);
            const tData = await tRes.json();
            const wData = await wRes.json();
            const mData = await mRes.json();
            if (tData.success) setTips(tData.tips || tData.data);
            if (wData.success) setWarehouses(wData.warehouses || wData.data || []);
            if (mData.success) setTiming(mData.timing || mData.data);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(crop); }, [crop]);

    const calculate = async () => {
        if (!qty || !mktPrice) return;
        setCalcLoading(true);
        try {
            // Backend expects quantity_mt and current_price_per_qt
            const qtyMt = (parseFloat(qty) / 10).toFixed(2); // convert quintals → MT
            const res = await fetch(`${API_BASE}/storage/sell-vs-store?crop=${crop}&quantity_mt=${qtyMt}&current_price_per_qt=${mktPrice}&months_to_hold=3`);
            const data = await res.json();
            if (data.success) setCalcResult(data.calculator || data.result || data.analysis || data);
        } catch { setCalcResult(null); }
        finally { setCalcLoading(false); }
    };

    const bookStorage = async (warehouseId) => {
        if (!isAuthenticated) { alert(L === 'hi' ? 'बुकिंग के लिए लॉगिन करें' : 'Login to book'); return; }
        setBooking(warehouseId);
        try {
            const res = await fetch(`${API_BASE}/storage/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ warehouse_id: warehouseId, crop, quantity_mt: parseFloat(qty) / 10 })
            });
            const data = await res.json();
            if (data.success) setBooked(prev => ({ ...prev, [warehouseId]: true }));
        } catch { /* silent */ }
        finally { setBooking(null); }
    };

    const TABS = [
        { id: 'tips',       label: gt(L, 'tips') },
        { id: 'warehouses', label: gt(L, 'warehouses') },
        { id: 'calculator', label: gt(L, 'calculator') },
        { id: 'timing',     label: gt(L, 'timing') },
    ];

    const getCropName = (id) => {
        const c = CROPS.find(x => x.id === id);
        return c ? (L === 'hi' ? c.hi : c.en) : id;
    };

    return (
        <div className="page-content pb-safe stor-page">
            {/* Header */}
            <header className="stor-header animate-slide-down">
                <div className="stor-header-left">
                    <div className="stor-header-icon">📦</div>
                    <div>
                        <h1 className="stor-title">{gt(L, 'title')}</h1>
                        <p className="stor-subtitle">{gt(L, 'subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Crop Selector */}
            <div className="stor-crop-row animate-slide-down delay-1">
                <div className="stor-select-wrap">
                    <select value={crop} onChange={e => setCrop(e.target.value)}>
                        {CROPS.map(c => (
                            <option key={c.id} value={c.id}>{L === 'hi' ? c.hi : c.en}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="stor-select-arrow" />
                </div>
            </div>

            {/* Tabs */}
            <div className="stor-tabs animate-slide-left delay-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`stor-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="stor-content">
                {loading ? (
                    <div className="stor-loading">
                        <RefreshCw size={28} className="spin" />
                        <p>{gt(L, 'loading')}</p>
                    </div>
                ) : error ? (
                    <div className="stor-error">
                        <AlertCircle size={40} />
                        <button className="stor-retry-btn" onClick={() => fetchData(crop)}>{gt(L, 'retry')}</button>
                    </div>
                ) : (
                    <>
                        {/* Storage Tips */}
                        {activeTab === 'tips' && (
                            <div className="stor-tips-section animate-slide-up">
                                <div className="stor-tips-hero">
                                    <Package size={20} />
                                    <span>{getCropName(crop)} — {L === 'hi' ? 'भंडारण गाइड' : 'Storage Guide'}</span>
                                </div>
                                {tips ? (
                                    <div className="stor-tips-list">
                                        {/* Crop meta */}
                                        <div className="stor-meta-row">
                                            <div className="stor-meta-item">
                                                <span>{L === 'hi' ? 'नमी' : 'Moisture'}</span>
                                                <strong>{tips.moisture || '—'}</strong>
                                            </div>
                                            <div className="stor-meta-item">
                                                <span>{L === 'hi' ? 'तापमान' : 'Temp'}</span>
                                                <strong>{tips.temp || '—'}</strong>
                                            </div>
                                            <div className="stor-meta-item">
                                                <span>{L === 'hi' ? 'अवधि' : 'Duration'}</span>
                                                <strong>{tips.max_months ? `${tips.max_months} ${L === 'hi' ? 'माह' : 'months'}` : '—'}</strong>
                                            </div>
                                        </div>
                                        {/* Tip items */}
                                        {(tips.tips_hi || tips.tips || []).map((tip, i) => (
                                            <div key={i} className="stor-tip-item">
                                                <span className="stor-tip-bullet">✓</span>
                                                <p>{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="stor-no-tips">{L === 'hi' ? 'फसल चुनें' : 'Select a crop'}</p>
                                )}
                            </div>
                        )}

                        {/* Warehouses */}
                        {activeTab === 'warehouses' && (
                            <div className="stor-wh-list animate-slide-up">
                                {warehouses.length === 0 ? (
                                    [
                                        { id: 1, name: 'FCI गोदाम', type: 'FCI', contact: '1800-180-2087', loan_facility: true, loan_rate: '7%/वर्ष', charges_per_mt_month: 25 },
                                        { id: 2, name: 'WDRA पंजीकृत गोदाम', type: 'WDRA', contact: '1800-419-1515', loan_facility: true, loan_rate: '9%/वर्ष', charges_per_mt_month: 30 },
                                        { id: 3, name: 'NAFED केंद्र', type: 'NAFED', contact: '1800-111-3037', loan_facility: false, charges_per_mt_month: 0 },
                                    ].map((wh, i) => (
                                        <div key={i} className="stor-wh-card">
                                            <div className="stor-wh-head">
                                                <Warehouse size={16} />
                                                <h3>{wh.name}</h3>
                                                <span className={`stor-wh-type type-${wh.type?.toLowerCase()}`}>{wh.type}</span>
                                            </div>
                                            <div className="stor-wh-meta">
                                                <span>💰 ₹{wh.charges_per_mt_month}/MT/माह</span>
                                                {wh.loan_facility && <span className="stor-loan-badge"><TrendingUp size={11} /> {wh.loan_rate}</span>}
                                            </div>
                                            <div className="stor-wh-actions">
                                                <a href={`tel:${wh.contact}`} className="stor-call-btn"><Phone size={13} /> {wh.contact}</a>
                                                <button className={`stor-book-btn ${booked[wh.id] ? 'booked' : ''}`} onClick={() => bookStorage(wh.id)} disabled={booking === wh.id || booked[wh.id]}>
                                                    {booking === wh.id ? <RefreshCw size={12} className="spin" /> : booked[wh.id] ? '✅ Booked' : (L === 'hi' ? 'बुक करें' : 'Book')}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : warehouses.map((wh, i) => (
                                    <div key={i} className="stor-wh-card">
                                        <div className="stor-wh-head">
                                            <Warehouse size={16} />
                                            <h3>{wh.name}</h3>
                                            <span className={`stor-wh-type type-${wh.type?.toLowerCase()}`}>{wh.type}</span>
                                        </div>
                                        <div className="stor-wh-meta">
                                            <span>💰 ₹{wh.charges_per_mt_month}/MT</span>
                                            {wh.loan_facility && <span className="stor-loan-badge"><TrendingUp size={11} /> {wh.loan_rate}</span>}
                                        </div>
                                        <div className="stor-wh-actions">
                                            {wh.contact && <a href={`tel:${wh.contact}`} className="stor-call-btn"><Phone size={13} /> {wh.contact}</a>}
                                            <button className={`stor-book-btn ${booked[wh.id] ? 'booked' : ''}`} onClick={() => bookStorage(wh.id)}>
                                                {booked[wh.id] ? '✅' : (L === 'hi' ? 'बुक करें' : 'Book')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sell vs Store Calculator */}
                        {activeTab === 'calculator' && (
                            <div className="stor-calc-section animate-slide-up">
                                <div className="stor-calc-card">
                                    <h3><Calculator size={16} /> {getCropName(crop)} — {gt(L, 'calculator')}</h3>
                                    <div className="stor-calc-inputs">
                                        <div className="stor-input-group">
                                            <label>{gt(L, 'quantity')}</label>
                                            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="10" min="1" />
                                        </div>
                                        <div className="stor-input-group">
                                            <label>{gt(L, 'mkt_price')}</label>
                                            <input type="number" value={mktPrice} onChange={e => setMktPrice(e.target.value)} placeholder="2200" />
                                        </div>
                                    </div>
                                    <button className="stor-calc-btn" onClick={calculate} disabled={calcLoading || !qty || !mktPrice}>
                                        {calcLoading ? <RefreshCw size={14} className="spin" /> : <Calculator size={14} />}
                                        {gt(L, 'calculate')}
                                    </button>
                                </div>

                                {calcResult && (
                                    <div className="stor-calc-result animate-slide-up">
                                        {/* MSP alert */}
                                        {calcResult.below_msp && calcResult.msp && (
                                            <div className="stor-msp-alert">
                                                ⚠️ {L === 'hi'
                                                    ? `MSP (₹${calcResult.msp}/क्विंटल) से कम भाव — सरकारी केंद्र पर MSP पर बेचें`
                                                    : `Price below MSP (₹${calcResult.msp}/qtl) — sell at Govt procurement center`
                                                }
                                            </div>
                                        )}
                                        {/* Recommendation */}
                                        {calcResult.recommendation_hi && (
                                            <div className={`stor-decision-banner ${(calcResult.sell_now?.earnings || 0) > (calcResult.store_and_sell?.projected_earnings || 0) ? 'sell' : 'store'}`}>
                                                <p>{calcResult.recommendation_hi}</p>
                                            </div>
                                        )}
                                        {/* Stats grid */}
                                        <div className="stor-result-stats">
                                            <div className="stor-stat-box">
                                                <span>{L === 'hi' ? 'अभी बेचें' : 'Sell Now'}</span>
                                                <strong>₹{calcResult.sell_now?.earnings?.toLocaleString() || calcResult.sell_value?.toLocaleString() || '—'}</strong>
                                            </div>
                                            <div className="stor-stat-box green">
                                                <span>{L === 'hi' ? '3 माह बाद' : 'In 3 Months'}</span>
                                                <strong>₹{calcResult.store_and_sell?.projected_earnings?.toLocaleString() || calcResult.store_value?.toLocaleString() || '—'}</strong>
                                            </div>
                                            {(calcResult.warehouse_loan?.amount || calcResult.warehouse_loan) && (
                                                <div className="stor-stat-box blue">
                                                    <span>{gt(L, 'loan_avail')}</span>
                                                    <strong>₹{(calcResult.warehouse_loan?.amount || calcResult.warehouse_loan)?.toLocaleString()}</strong>
                                                </div>
                                            )}
                                        </div>
                                        {/* Best sell time */}
                                        {calcResult.best_sell_time_hi && (
                                            <p className="stor-best-time">
                                                📅 {L === 'hi' ? `बेचने का सही समय: ${calcResult.best_sell_time_hi}` : `Best sell time: ${calcResult.best_sell_time_hi}`}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Market Timing */}
                        {activeTab === 'timing' && (
                            <div className="stor-timing-section animate-slide-up">
                                {timing ? (
                                    <div className="stor-timing-card">
                                        <div className="stor-timing-hero">
                                            <Clock size={20} />
                                            <h3>{getCropName(crop)} — {L === 'hi' ? 'बाजार समय' : 'Market Timing'}</h3>
                                        </div>
                                        <div className="stor-timing-grid">
                                            <div className="stor-timing-item best">
                                                <span>✅ {L === 'hi' ? 'बेचने का सही समय' : 'Best Time to Sell'}</span>
                                                <strong>{timing.best_months}</strong>
                                            </div>
                                            <div className="stor-timing-item avoid">
                                                <span>⚠️ {L === 'hi' ? 'इस समय न बेचें' : 'Avoid Selling'}</span>
                                                <strong>{timing.avoid_months}</strong>
                                            </div>
                                            {timing.price_premium_pct && (
                                                <div className="stor-timing-item premium">
                                                    <span>📈 {L === 'hi' ? 'अतिरिक्त कमाई' : 'Extra Earnings'}</span>
                                                    <strong>+{timing.price_premium_pct}%</strong>
                                                </div>
                                            )}
                                        </div>
                                        {timing.advice_hi && <p className="stor-timing-advice">{L === 'hi' ? timing.advice_hi : timing.advice_en || timing.advice_hi}</p>}
                                    </div>
                                ) : (
                                    <p className="stor-no-tips">No data</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
