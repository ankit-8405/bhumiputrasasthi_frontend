import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, TestTube, Sprout, Droplets,
    FileText, Tractor, Package, Stethoscope,
    CloudSun, Activity, RefreshCw, ChevronRight,
    BookOpen, Bug, MessageSquare, AlertCircle, Loader
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const T = {
    hi: {
        morning: 'सुप्रभात', afternoon: 'नमस्कार', evening: 'शुभ संध्या',
        subtitle: 'आपका किसान डैशबोर्ड', my_stats: 'मेरी गतिविधि',
        consultations: 'परामर्श', soil_tests: 'मिट्टी जांच',
        detections: 'रोग पहचान', posts: 'पोस्ट',
        mandi_live: 'मंडी भाव (लाइव)', see_all: 'सभी देखें',
        per_qtl: '/क्विंटल', all_services: 'सभी सेवाएं',
        recent: 'हाल की गतिविधि', no_activity: 'अभी कोई गतिविधि नहीं है',
        retry: 'पुनः प्रयास', loading: 'लोड हो रहा है...',
        error: 'डेटा लोड नहीं हुआ',
    },
    en: {
        morning: 'Good Morning', afternoon: 'Good Afternoon', evening: 'Good Evening',
        subtitle: 'Your Kisan Dashboard', my_stats: 'My Activity',
        consultations: 'Consultations', soil_tests: 'Soil Tests',
        detections: 'Detections', posts: 'Posts',
        mandi_live: 'Mandi Prices (Live)', see_all: 'See All',
        per_qtl: '/quintal', all_services: 'All Services',
        recent: 'Recent Activity', no_activity: 'No activity yet',
        retry: 'Retry', loading: 'Loading...',
        error: 'Failed to load data',
    }
};

const getGreetingKey = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
};

const ACTIVITY_CONFIG = {
    detection:    { icon: Bug,           color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    consultation: { icon: Stethoscope,   color: '#4a9eff', bg: 'rgba(74,158,255,0.12)' },
    soil_test:    { icon: TestTube,      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    post:         { icon: MessageSquare, color: '#52b788', bg: 'rgba(82,183,136,0.12)' },
};

export default function Dashboard() {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const L = lang === 'hi' ? 'hi' : 'en';
    const t = (k) => T[L][k] || T.en[k] || k;

    const [dashData, setDashData] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('bps_token');
            if (!token) { setLoading(false); return; }

            // Try to get GPS coords for weather
            let locationQ = '';
            try {
                const pos = await new Promise((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
                );
                locationQ = `?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
            } catch { /* ok, will use district */ }

            const response = await fetch(`${API_BASE}/dashboard/summary${locationQ}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await response.json();
            if (json.success) {
                setDashData(json.data);
            } else {
                setError(json.message || t('error'));
            }
        } catch {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const SERVICES = [
        { id: 'mandi',    icon: TrendingUp,  label: L === 'hi' ? 'मंडी भाव'       : 'Mandi',       color: '#4a9eff', bg: 'rgba(74,158,255,0.12)',   path: '/mandi' },
        { id: 'soil',     icon: TestTube,    label: L === 'hi' ? 'मिट्टी जांच'    : 'Soil Test',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  path: '/soil-test' },
        { id: 'crop',     icon: Sprout,      label: L === 'hi' ? 'फसल सलाह'       : 'Crop Advice', color: '#52b788', bg: 'rgba(82,183,136,0.12)',  path: '/crop-advisory' },
        { id: 'water',    icon: Droplets,    label: L === 'hi' ? 'सिंचाई'         : 'Irrigation',  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   path: '/irrigation' },
        { id: 'schemes',  icon: FileText,    label: L === 'hi' ? 'सरकारी योजना'  : 'Schemes',     color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  path: '/govt-schemes' },
        { id: 'mach',     icon: Tractor,     label: L === 'hi' ? 'मशीनरी'         : 'Machinery',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  path: '/machinery' },
        { id: 'store',    icon: Package,     label: L === 'hi' ? 'भंडारण'         : 'Storage',     color: '#10b981', bg: 'rgba(16,185,129,0.12)',  path: '/storage' },
        { id: 'train',    icon: BookOpen,    label: L === 'hi' ? 'प्रशिक्षण'      : 'Training',    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  path: '/training' },
        { id: 'rog',      icon: Bug,         label: L === 'hi' ? 'रोग पहचान'      : 'Disease',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   path: '/rog-detector' },
        { id: 'expert',   icon: Stethoscope, label: L === 'hi' ? 'डॉक्टर'         : 'Expert',      color: '#ec4899', bg: 'rgba(236,72,153,0.12)',  path: '/doctors' },
    ];

    const stats        = dashData?.stats || {};
    const weather      = dashData?.weather;
    const mandiPrices  = dashData?.top_mandi_prices || [];
    const recentActs   = dashData?.recent_activity  || [];
    const displayName  = user?.name || dashData?.user?.name || (L === 'hi' ? 'किसान' : 'Farmer');

    return (
        <div className="db-page">

            {/* ── HERO HEADER ── */}
            <div className="db-hero">
                <div className="db-hero-text">
                    <p className="db-greeting">{t(getGreetingKey())},</p>
                    <h1 className="db-name">{displayName} 🌾</h1>
                    <p className="db-sub">{t('subtitle')}</p>
                </div>
                {weather && (
                    <div className="db-weather">
                        <CloudSun size={24} className="db-w-icon" />
                        <div>
                            <b className="db-w-temp">{Math.round(weather.temp)}°C</b>
                            <span className="db-w-desc">{weather.description}</span>
                        </div>
                    </div>
                )}
                <div className="db-hero-blob" />
                <div className="db-hero-blob2" />
            </div>

            {/* ── MY ACTIVITY STATS ── */}
            <div className="db-section">
                <div className="db-sec-hdr">
                    <Activity size={15} className="db-sec-ico" />
                    <h2 className="db-sec-ttl">{t('my_stats')}</h2>
                    <button className="db-refresh" onClick={fetchDashboard} disabled={loading}>
                        <RefreshCw size={13} className={loading ? 'db-spin' : ''} />
                    </button>
                </div>

                {error && (
                    <div className="db-error-bar">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                        <button onClick={fetchDashboard}>{t('retry')}</button>
                    </div>
                )}

                <div className="db-stat-grid">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => <div key={i} className="db-stat-card db-skel" />)
                    ) : (
                        <>
                            <div className="db-stat-card" style={{ '--sc': '#4a9eff' }}>
                                <span className="db-sn">{stats.total_consultations || 0}</span>
                                <span className="db-sl">{t('consultations')}</span>
                            </div>
                            <div className="db-stat-card" style={{ '--sc': '#8b5cf6' }}>
                                <span className="db-sn">{stats.total_soil_tests || 0}</span>
                                <span className="db-sl">{t('soil_tests')}</span>
                            </div>
                            <div className="db-stat-card" style={{ '--sc': '#ef4444' }}>
                                <span className="db-sn">{stats.total_detections || 0}</span>
                                <span className="db-sl">{t('detections')}</span>
                            </div>
                            <div className="db-stat-card" style={{ '--sc': '#52b788' }}>
                                <span className="db-sn">{stats.total_posts || 0}</span>
                                <span className="db-sl">{t('posts')}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── LIVE MANDI PRICES ── */}
            {(loading || mandiPrices.length > 0) && (
                <div className="db-section">
                    <div className="db-sec-hdr">
                        <TrendingUp size={15} className="db-sec-ico" />
                        <h2 className="db-sec-ttl">{t('mandi_live')}</h2>
                        <button className="db-see-all" onClick={() => navigate('/mandi')}>
                            {t('see_all')} <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="db-mandi-box">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="db-mandi-row db-skel" style={{ height: 48 }} />
                            ))
                        ) : mandiPrices.map((p, i) => (
                            <div key={i} className="db-mandi-row">
                                <div className="db-mandi-dot" />
                                <span className="db-mc">{p.crop}</span>
                                <span className="db-mm">{p.market}</span>
                                <span className="db-mp">₹{Number(p.price).toLocaleString('en-IN')}<small>{t('per_qtl')}</small></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── ALL SERVICES ── */}
            <div className="db-section">
                <div className="db-sec-hdr">
                    <h2 className="db-sec-ttl">{t('all_services')}</h2>
                </div>
                <div className="db-svc-grid">
                    {SERVICES.map(svc => {
                        const Icon = svc.icon;
                        return (
                            <div key={svc.id} className="db-svc-card" onClick={() => navigate(svc.path)}>
                                <div className="db-svc-icon" style={{ background: svc.bg, color: svc.color }}>
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <span className="db-svc-lbl">{svc.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── RECENT ACTIVITY ── */}
            <div className="db-section db-last">
                <div className="db-sec-hdr">
                    <h2 className="db-sec-ttl">{t('recent')}</h2>
                </div>
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="db-act-row db-skel" style={{ height: 56, marginBottom: 10 }} />
                    ))
                ) : recentActs.length === 0 ? (
                    <div className="db-empty">
                        <Loader size={32} className="db-empty-icon" />
                        <p>{t('no_activity')}</p>
                    </div>
                ) : (
                    <div className="db-act-list">
                        {recentActs.map((act, i) => {
                            const cfg = ACTIVITY_CONFIG[act.type] || ACTIVITY_CONFIG.post;
                            const ActIcon = cfg.icon;
                            return (
                                <div key={i} className="db-act-row">
                                    <div className="db-act-ico" style={{ background: cfg.bg, color: cfg.color }}>
                                        <ActIcon size={16} />
                                    </div>
                                    <div className="db-act-info">
                                        <span className="db-act-title">{L === 'hi' ? act.title_hi : act.title_en}</span>
                                        <span className="db-act-time">{new Date(act.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
