import React, { useState, useEffect } from 'react';
import { Tractor, Search, RefreshCw, AlertCircle, Clock, MapPin, Phone, CheckCircle, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Machinery.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    title:    { hi: 'मशीनरी और उपकरण', en: 'Machinery & Equipment' },
    subtitle: { hi: 'किराए पर कृषि मशीनरी', en: 'Rent agricultural machinery' },
    search:   { hi: 'मशीन खोजें...', en: 'Search machinery...' },
    all:      { hi: 'सभी', en: 'All' },
    tractor:  { hi: 'ट्रैक्टर', en: 'Tractor' },
    harvester:{ hi: 'हार्वेस्टर', en: 'Harvester' },
    sprayer:  { hi: 'स्प्रेयर', en: 'Sprayer' },
    thresher: { hi: 'थ्रेशर', en: 'Thresher' },
    per_hour: { hi: '/घंटा', en: '/hour' },
    per_day:  { hi: '/दिन', en: '/day' },
    book_now: { hi: 'अभी बुक करें', en: 'Book Now' },
    booked:   { hi: '✅ बुक हो गया!', en: '✅ Booked!' },
    chc_title:{ hi: 'पास के CHC केंद्र', en: 'Nearby CHC Centers' },
    subsidy:  { hi: 'SMAM सब्सिडी', en: 'SMAM Subsidy' },
    loading:  { hi: 'लोड हो रहा है...', en: 'Loading...' },
    retry:    { hi: 'पुनः प्रयास', en: 'Retry' },
    no_data:  { hi: 'कोई मशीन नहीं मिली', en: 'No machinery found' },
    login_req:{ hi: 'बुकिंग के लिए लॉगिन करें', en: 'Login required to book' },
};
const gt = (lang, k) => T[k]?.[lang] || T[k]?.en || k;

export default function Machinery() {
    const { lang } = useLanguage();
    const { isAuthenticated, token } = useAuth();
    const L = typeof lang === 'string' ? lang : 'en';

    const [machinery, setMachinery]   = useState([]);
    const [chcCenters, setChcCenters] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(false);
    const [search, setSearch]         = useState('');
    const [category, setCategory]     = useState('all');
    const [booking, setBooking]       = useState(null);
    const [booked, setBooked]         = useState({});
    const [activeTab, setActiveTab]   = useState('machines');

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const [mRes, cRes] = await Promise.all([
                fetch(`${API_BASE}/machinery`),
                fetch(`${API_BASE}/machinery/chc/nearby?district=Lucknow`)
            ]);
            const mData = await mRes.json();
            const cData = await cRes.json();
            if (mData.success) setMachinery(mData.machinery || mData.data || []);
            if (cData.success) setChcCenters(cData.chc_centers || cData.centers || cData.data || []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const bookMachine = async (machineId) => {
        if (!isAuthenticated) { alert(gt(L, 'login_req')); return; }
        setBooking(machineId);
        try {
            const res = await fetch(`${API_BASE}/machinery/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ machinery_id: machineId, booking_date: new Date().toISOString().split('T')[0], duration_hours: 8 })
            });
            const data = await res.json();
            if (data.success) setBooked(prev => ({ ...prev, [machineId]: true }));
        } catch { /* silent */ }
        finally { setBooking(null); }
    };

    const CATEGORIES = [
        { id: 'all', label: gt(L, 'all') },
        { id: 'tractor', label: gt(L, 'tractor') },
        { id: 'harvester', label: gt(L, 'harvester') },
        { id: 'sprayer', label: gt(L, 'sprayer') },
        { id: 'thresher', label: gt(L, 'thresher') },
    ];

    const filtered = machinery.filter(m => {
        const name = L === 'hi' ? (m.name_hi || m.name) : (m.name_en || m.name || '');
        const matchSearch = name.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'all' || m.category === category;
        return matchSearch && matchCat;
    });

    const getName = m => L === 'hi' ? (m.name_hi || m.name) : (m.name_en || m.name);
    const getDesc = m => L === 'hi' ? (m.description_hi || m.description) : (m.description_en || m.description);

    const TABS = [
        { id: 'machines', label: L === 'hi' ? 'मशीनें' : 'Machines' },
        { id: 'chc', label: 'CHC ' + (L === 'hi' ? 'केंद्र' : 'Centers') },
        { id: 'subsidy', label: gt(L, 'subsidy') },
    ];

    return (
        <div className="page-content pb-safe mach-page">
            {/* Header */}
            <header className="mach-header animate-slide-down">
                <div className="mach-header-left">
                    <div className="mach-header-icon">🚜</div>
                    <div>
                        <h1 className="mach-title">{gt(L, 'title')}</h1>
                        <p className="mach-subtitle">{gt(L, 'subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="mach-search animate-slide-down delay-1">
                <Search size={18} className="mach-search-icon" />
                <input
                    type="text" placeholder={gt(L, 'search')}
                    value={search} onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Tabs */}
            <div className="mach-tabs animate-slide-left delay-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`mach-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Category filters — only on machines tab */}
            {activeTab === 'machines' && (
                <div className="mach-cats animate-slide-left delay-2">
                    {CATEGORIES.map(c => (
                        <button
                            key={c.id}
                            className={`mach-cat-pill ${category === c.id ? 'active' : ''}`}
                            onClick={() => setCategory(c.id)}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="mach-content">
                {loading ? (
                    <div className="mach-loading">
                        <RefreshCw size={28} className="spin" />
                        <p>{gt(L, 'loading')}</p>
                    </div>
                ) : error ? (
                    <div className="mach-error">
                        <AlertCircle size={40} />
                        <p>Could not load data</p>
                        <button className="mach-retry-btn" onClick={fetchData}>{gt(L, 'retry')}</button>
                    </div>
                ) : (
                    <>
                        {/* Machines List */}
                        {activeTab === 'machines' && (
                            <div className="mach-list animate-slide-up">
                                {filtered.length === 0 ? (
                                    <div className="mach-empty"><Tractor size={48} /><p>{gt(L, 'no_data')}</p></div>
                                ) : filtered.map((m, i) => (
                                    <div key={m.id || i} className="mach-card" style={{ animationDelay: `${i * 0.06}s` }}>
                                        <div className="mach-card-head">
                                            <div className="mach-card-icon">
                                                {m.category === 'tractor' ? '🚜' :
                                                 m.category === 'harvester' ? '🌾' :
                                                 m.category === 'sprayer' ? '💨' : '⚙️'}
                                            </div>
                                            <div className="mach-card-info">
                                                <h3>{getName(m)}</h3>
                                                <p className="mach-card-desc">{getDesc(m)}</p>
                                            </div>
                                            {m.available !== false && (
                                                <div className="mach-available-badge">
                                                    <CheckCircle size={12} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mach-card-pricing">
                                            <div className="mach-price-item">
                                                <Clock size={13} />
                                                <span>₹{m.rent_per_hour}{gt(L, 'per_hour')}</span>
                                            </div>
                                            <div className="mach-price-divider" />
                                            <div className="mach-price-item">
                                                <span>₹{m.rent_per_day}{gt(L, 'per_day')}</span>
                                            </div>
                                        </div>
                                        {m.subsidy_scheme && (
                                            <div className="mach-subsidy-tag">
                                                🏛️ {m.subsidy_scheme}
                                            </div>
                                        )}
                                        <button
                                            className={`mach-book-btn ${booked[m.id] ? 'booked' : ''}`}
                                            onClick={() => bookMachine(m.id)}
                                            disabled={booking === m.id || booked[m.id]}
                                        >
                                            {booking === m.id
                                                ? <RefreshCw size={14} className="spin" />
                                                : booked[m.id]
                                                    ? gt(L, 'booked')
                                                    : gt(L, 'book_now')
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CHC Centers */}
                        {activeTab === 'chc' && (
                            <div className="mach-chc-list animate-slide-up">
                                {chcCenters.length === 0 ? (
                                    [
                                        { name: 'कृषि विज्ञान केंद्र, लखनऊ', contact: '0522-2740213', address: 'Bakshi Ka Talab, Lucknow' },
                                        { name: 'Custom Hiring Centre, Kanpur', contact: '0512-2550123', address: 'Kalyanpur, Kanpur' },
                                        { name: 'CHC केंद्र, वाराणसी', contact: '0542-2226701', address: 'Sarnath Road, Varanasi' },
                                    ].map((c, i) => (
                                        <div key={i} className="mach-chc-card">
                                            <h3><MapPin size={14} /> {c.name}</h3>
                                            <p><MapPin size={12} /> {c.address}</p>
                                            <a href={`tel:${c.contact}`} className="mach-chc-phone">
                                                <Phone size={13} /> {c.contact}
                                            </a>
                                        </div>
                                    ))
                                ) : chcCenters.map((c, i) => (
                                    <div key={i} className="mach-chc-card">
                                        <h3><MapPin size={14} /> {c.name || c.centre_name}</h3>
                                        {c.address && <p><MapPin size={12} /> {c.address}</p>}
                                        {c.contact && (
                                            <a href={`tel:${c.contact}`} className="mach-chc-phone">
                                                <Phone size={13} /> {c.contact}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Subsidy Info */}
                        {activeTab === 'subsidy' && (
                            <div className="mach-subsidy-info animate-slide-up">
                                <div className="mach-sub-header">
                                    <h3>🏛️ SMAM Scheme</h3>
                                    <p>{L === 'hi' ? 'कृषि यंत्रीकरण उप मिशन' : 'Sub Mission on Agricultural Mechanization'}</p>
                                </div>
                                {[
                                    { cat: L === 'hi' ? 'छोटे/सीमांत किसान' : 'Small/Marginal', sub: '50%', max: '₹40,000' },
                                    { cat: L === 'hi' ? 'अन्य किसान' : 'Other Farmers', sub: '40%', max: '₹35,000' },
                                    { cat: L === 'hi' ? 'SC/ST किसान' : 'SC/ST Farmers', sub: '50%', max: '₹50,000' },
                                ].map((item, i) => (
                                    <div key={i} className="mach-sub-card">
                                        <h4>{item.cat}</h4>
                                        <div className="mach-sub-row">
                                            <span>{L === 'hi' ? 'सब्सिडी' : 'Subsidy'}: <strong className="mach-sub-pct">{item.sub}</strong></span>
                                            <span>{L === 'hi' ? 'अधिकतम' : 'Max'}: <strong>{item.max}</strong></span>
                                        </div>
                                    </div>
                                ))}
                                <div className="mach-sub-note">
                                    <Filter size={13} />
                                    <p>{L === 'hi' ? 'आवेदन के लिए अपने जिले के कृषि विभाग से संपर्क करें। हेल्पलाइन: 1800-180-1551' : 'Contact district agriculture office to apply. Helpline: 1800-180-1551'}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
