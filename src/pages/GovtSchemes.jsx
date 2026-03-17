import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, ExternalLink, RefreshCw, AlertCircle, Gift, Shield, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './GovtSchemes.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    title:       { hi: 'सरकारी योजनाएं', en: 'Government Schemes' },
    subtitle:    { hi: 'किसानों के लिए सरकारी लाभ', en: 'Benefits for farmers' },
    loading:     { hi: 'योजनाएं लोड हो रही हैं...', en: 'Loading schemes...' },
    no_data:     { hi: 'कोई योजना नहीं मिली', en: 'No schemes found' },
    deadlines:   { hi: 'आगामी समय सीमाएं', en: 'Upcoming Deadlines' },
    check_elig:  { hi: 'पात्रता जांचें', en: 'Check Eligibility' },
    eligible:    { hi: '✅ आप पात्र हैं', en: '✅ You are Eligible' },
    not_elig:    { hi: '❌ पात्र नहीं', en: '❌ Not Eligible' },
    apply_now:   { hi: 'आवेदन करें', en: 'Apply Now' },
    benefit:     { hi: 'लाभ', en: 'Benefit' },
    documents:   { hi: 'आवश्यक दस्तावेज़', en: 'Required Documents' },
    helpline:    { hi: 'हेल्पलाइन', en: 'Helpline' },
    deadline:    { hi: 'अंतिम तिथि', en: 'Deadline' },
    all:         { hi: 'सभी', en: 'All' },
    financial:   { hi: 'आर्थिक सहायता', en: 'Financial' },
    insurance:   { hi: 'बीमा', en: 'Insurance' },
    irrigation:  { hi: 'सिंचाई', en: 'Irrigation' },
    credit:      { hi: 'ऋण', en: 'Credit' },
    retry:       { hi: 'पुनः प्रयास', en: 'Retry' },
    error_msg:   { hi: 'डेटा लोड नहीं हो सका', en: 'Could not load data' },
};
const gt = (lang, k) => T[k]?.[lang] || T[k]?.en || k;

export default function GovtSchemes() {
    const { lang } = useLanguage();
    const L = typeof lang === 'string' ? lang : 'en';

    const [schemes, setSchemes]       = useState([]);
    const [deadlines, setDeadlines]   = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(false);
    const [filter, setFilter]         = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [eligResult, setEligResult] = useState({});
    const [checking, setChecking]     = useState(null);

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const [sRes, dRes] = await Promise.all([
                fetch(`${API_BASE}/govt-schemes`),
                fetch(`${API_BASE}/govt-schemes/deadlines`)
            ]);
            const sData = await sRes.json();
            const dData = await dRes.json();
            if (sData.success) setSchemes(sData.schemes || sData.data || []);
            if (dData.success) setDeadlines(dData.deadlines || []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const checkEligibility = async (schemeId) => {
        setChecking(schemeId);
        try {
            const res = await fetch(`${API_BASE}/govt-schemes/eligibility-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheme_id: schemeId, farmer_profile: { land_area: 2, category: 'small' } })
            });
            const data = await res.json();
            setEligResult(prev => ({ ...prev, [schemeId]: data.eligible ?? data.is_eligible ?? true }));
        } catch { setEligResult(prev => ({ ...prev, [schemeId]: null })); }
        finally { setChecking(null); }
    };

    const FILTERS = [
        { id: 'all', label: gt(L, 'all') },
        { id: 'financial', label: gt(L, 'financial') },
        { id: 'insurance', label: gt(L, 'insurance') },
        { id: 'irrigation', label: gt(L, 'irrigation') },
        { id: 'credit', label: gt(L, 'credit') },
    ];

    const filtered = filter === 'all' ? schemes : schemes.filter(s => s.category === filter || s.type === filter);

    const getName = s => L === 'hi' ? (s.name_hi || s.name) : (s.name_en || s.name);
    const getDesc = s => L === 'hi' ? (s.description_hi || s.description) : (s.description_en || s.description);
    const getBenefit = s => L === 'hi' ? (s.benefit_hi || s.benefit) : (s.benefit);

    return (
        <div className="page-content pb-safe gs-page">
            {/* Header */}
            <header className="gs-header animate-slide-down">
                <div className="gs-header-left">
                    <div className="gs-header-icon">🏛️</div>
                    <div>
                        <h1 className="gs-title">{gt(L, 'title')}</h1>
                        <p className="gs-subtitle">{gt(L, 'subtitle')}</p>
                    </div>
                </div>
                <button className="gs-refresh-btn" onClick={fetchData} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                </button>
            </header>

            {/* Deadlines Banner */}
            {!loading && deadlines.length > 0 && (
                <div className="gs-deadlines-banner animate-slide-up">
                    <Clock size={14} className="gs-clock-icon" />
                    <span className="gs-deadlines-label">{gt(L, 'deadlines')}:</span>
                    <div className="gs-deadlines-scroll">
                        {deadlines.map((d, i) => (
                            <span key={i} className="gs-deadline-chip">
                                {L === 'hi' ? d.name_hi || d.name : d.name_en || d.name}
                                {d.deadline ? ` — ${d.deadline}` : ''}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="gs-filters animate-slide-left delay-1">
                {FILTERS.map(f => (
                    <button
                        key={f.id}
                        className={`gs-filter-pill ${filter === f.id ? 'active' : ''}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="gs-content">
                {loading ? (
                    <div className="gs-loading">
                        <div className="gs-loading-spinner"><RefreshCw size={32} className="spin" /></div>
                        <p>{gt(L, 'loading')}</p>
                    </div>
                ) : error ? (
                    <div className="gs-error-state">
                        <AlertCircle size={48} />
                        <p>{gt(L, 'error_msg')}</p>
                        <button className="gs-retry-btn" onClick={fetchData}>{gt(L, 'retry')}</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="gs-empty-state">
                        <Gift size={56} />
                        <p>{gt(L, 'no_data')}</p>
                    </div>
                ) : (
                    <div className="gs-schemes-list animate-slide-up delay-2">
                        {filtered.map((scheme, i) => {
                            const isOpen = expandedId === scheme.id;
                            const elig = eligResult[scheme.id];
                            return (
                                <div
                                    key={scheme.id || i}
                                    className={`gs-card ${isOpen ? 'gs-card-open' : ''}`}
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                    {/* Card Header — always visible */}
                                    <div className="gs-card-head" onClick={() => setExpandedId(isOpen ? null : scheme.id)}>
                                        <span className="gs-card-emoji">{scheme.icon || '🏛️'}</span>
                                        <div className="gs-card-info">
                                            <h3 className="gs-card-name">{getName(scheme)}</h3>
                                            <div className="gs-card-benefit">
                                                <Gift size={12} />
                                                <span>{getBenefit(scheme)}</span>
                                            </div>
                                        </div>
                                        <div className="gs-chevron-wrap">
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {/* Expanded Body */}
                                    {isOpen && (
                                        <div className="gs-card-body">
                                            <p className="gs-card-desc">{getDesc(scheme)}</p>

                                            {scheme.deadline && (
                                                <div className="gs-info-row">
                                                    <Clock size={14} />
                                                    <span>{gt(L, 'deadline')}: <strong>{scheme.deadline}</strong></span>
                                                </div>
                                            )}

                                            {scheme.helpline && (
                                                <div className="gs-info-row">
                                                    <Phone size={14} />
                                                    <span>{gt(L, 'helpline')}: <strong>{scheme.helpline}</strong></span>
                                                </div>
                                            )}

                                            {Array.isArray(scheme.documents) && scheme.documents.length > 0 && (
                                                <div className="gs-docs-section">
                                                    <p className="gs-docs-label">
                                                        <FileText size={13} /> {gt(L, 'documents')}:
                                                    </p>
                                                    <div className="gs-docs-chips">
                                                        {scheme.documents.map((doc, j) => (
                                                            <span key={j} className="gs-doc-chip"><Shield size={10} /> {doc}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="gs-card-actions">
                                                <button
                                                    className={`gs-elig-btn ${elig === true ? 'elig-yes' : elig === false ? 'elig-no' : ''}`}
                                                    onClick={() => checkEligibility(scheme.id)}
                                                    disabled={checking === scheme.id}
                                                >
                                                    {checking === scheme.id
                                                        ? <RefreshCw size={14} className="spin" />
                                                        : elig === true
                                                            ? <><CheckCircle size={14} /> {gt(L, 'eligible')}</>
                                                            : elig === false
                                                                ? <><XCircle size={14} /> {gt(L, 'not_elig')}</>
                                                                : gt(L, 'check_elig')
                                                    }
                                                </button>

                                                {scheme.apply_url && (
                                                    <a
                                                        href={scheme.apply_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="gs-apply-btn"
                                                    >
                                                        {gt(L, 'apply_now')} <ExternalLink size={13} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
