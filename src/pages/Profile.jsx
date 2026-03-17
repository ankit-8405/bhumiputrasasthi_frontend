import React, { useState } from 'react';
import { User, Shield, HelpCircle, LogOut, ChevronRight, Edit2, Save, X, Check, Globe } from 'lucide-react';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Inline language label map for the selector header (shown in current language)
const LANG_LABEL = {
    hi: 'भाषा चुनें', en: 'Select Language', bn: 'ভাষা নির্বাচন', or: 'ଭାଷା ଚୁଣନ୍ତୁ',
    mai: 'भाषा चुनू', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', mr: 'भाषा निवडा', gu: 'ભાષા પસંદ', ta: 'மொழி தேர்வு', te: 'భాష ఎంచుకో'
};

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const { toggleTheme, theme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [stats] = useState({ posts: 0, consultations: 0, detections: 0, soilTests: 0 });
    const [form, setForm] = useState({
        name: user?.name || '',
        village: user?.village || '',
        district: user?.district || '',
        state: user?.state || '',
    });

    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

    const handleSave = async () => {
        setSaving(true);
        const result = await updateProfile(form);
        setSaving(false);
        if (result?.success) setEditing(false);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    if (!user) {
        return (
            <div className="page-content pb-safe" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <User size={64} color="var(--primary)" />
                <h2>{t('profile')}</h2>
                <button className="btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '16px' }}>
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="page-content pb-safe">
            {/* Lang picker overlay */}
            {showLangPicker && (
                <div className="lang-overlay" onClick={() => setShowLangPicker(false)}>
                    <div className="lang-sheet" onClick={e => e.stopPropagation()}>
                        <div className="lang-sheet-handle" />
                        <div className="lang-sheet-title">
                            <Globe size={18} />
                            <span>{LANG_LABEL[lang] || 'Select Language'}</span>
                        </div>
                        <div className="lang-grid">
                            {SUPPORTED_LANGUAGES.map(l => (
                                <button
                                    key={l.code}
                                    className={`lang-tile ${lang === l.code ? 'active' : ''}`}
                                    onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                                >
                                    <span className="lang-tile-flag">{l.flag}</span>
                                    <span className="lang-tile-name">{l.nativeName}</span>
                                    {lang === l.code && <Check size={14} className="lang-tile-check" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header card */}
            <header className="profile-header">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.profile_pic
                            ? <img src={user.profile_pic} alt="Profile" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
                            : <User size={40} color="var(--primary)" />
                        }
                    </div>
                    <div className="profile-info">
                        <h2>{user.name || t('profile')}</h2>
                        <p>📱 +91 {user.mobile}</p>
                        {user.village && <p className="profile-location">📍 {user.village}{user.district ? `, ${user.district}` : ''}</p>}
                        <span className="sc-badge">
                            {user.role === 'doctor' ? '👨‍⚕️' : '🌾'}&nbsp;
                            {user.role === 'doctor' ? t('expert') : (lang === 'hi' ? 'किसान' : lang === 'en' ? 'Farmer' : lang === 'bn' ? 'কৃষক' : lang === 'or' ? 'କୃଷକ' : lang === 'ta' ? 'விவசாயி' : lang === 'te' ? 'రైతు' : 'किसान')}
                        </span>
                    </div>
                    <button className="edit-btn" onClick={() => setEditing(!editing)}>
                        {editing ? <X size={18} /> : <Edit2 size={18} />}
                    </button>
                </div>

                <div className="stats-row">
                    <div className="stat-item"><strong>{stats.posts || 0}</strong><span>{t('posts')}</span></div>
                    <div className="stat-item"><strong>{stats.consultations || 0}</strong><span>{t('consultations')}</span></div>
                    <div className="stat-item"><strong>{stats.detections || 0}</strong><span>{lang === 'hi' ? 'रोग जांच' : 'Detections'}</span></div>
                    <div className="stat-item"><strong>{stats.soilTests || 0}</strong><span>{t('soil_test')}</span></div>
                </div>
            </header>

            {/* Edit form */}
            {editing && (
                <div className="edit-form" style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', margin: '0 0 16px' }}>
                    <h3 style={{ marginBottom: '16px' }}>{t('edit')}</h3>
                    {[
                        { key: 'name', label: t('full_name') || 'Name' },
                        { key: 'village', label: t('village') || 'Village' },
                        { key: 'district', label: t('district') || 'District' },
                        { key: 'state', label: t('state') || 'State' },
                    ].map(field => (
                        <div key={field.key} style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                {field.label}
                            </label>
                            <input
                                type="text"
                                value={form[field.key]}
                                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
                            />
                        </div>
                    ))}
                    <button className="btn-primary btn-block" onClick={handleSave} disabled={saving}>
                        {saving ? t('loading') : `✅ ${t('save')}`}
                    </button>
                </div>
            )}

            {/* Settings Menu */}
            <div className="menu-list">
                <h3 className="section-title">{t('settings')}</h3>

                {/* Language Selector */}
                <div className="menu-item" onClick={() => setShowLangPicker(true)}>
                    <div className="menu-icon"><Globe size={20} /></div>
                    <div className="menu-text">
                        <span>{t('language')}</span>
                        <small>{selectedLang.flag} {selectedLang.nativeName}</small>
                    </div>
                    <ChevronRight size={20} className="chevron" />
                </div>

                {/* Theme */}
                <div className="menu-item" onClick={toggleTheme}>
                    <div className="menu-icon"><Shield size={20} /></div>
                    <div className="menu-text">
                        <span>{t('app_theme')}</span>
                        <small>{theme === 'dark' ? t('dark_mode') : t('light_mode')}</small>
                    </div>
                    <ChevronRight size={20} className="chevron" />
                </div>

                <h3 className="section-title">{lang === 'hi' ? 'सहायता' : lang === 'en' ? 'Support' : lang === 'bn' ? 'সহায়তা' : 'Support'}</h3>

                <div className="menu-item" onClick={() => navigate('/chat')}>
                    <div className="menu-icon"><HelpCircle size={20} /></div>
                    <div className="menu-text"><span>AI {t('help_center')}</span></div>
                    <ChevronRight size={20} className="chevron" />
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} /> {t('logout')}
                </button>
            </div>

            <p className="app-version">BhumiPutraSathi v1.0.0 (Beta)</p>
        </div>
    );
}
