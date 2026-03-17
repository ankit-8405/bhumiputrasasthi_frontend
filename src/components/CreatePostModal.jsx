import React, { useState, useRef, useEffect } from 'react';
import {
    X, Image as ImageIcon, Video, MapPin, Mic, StopCircle,
    FileText, Shield, ChevronDown, Globe, Check, Camera, Send
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './CreatePostModal.css';

const CATEGORIES_I18N = {
    en: ['Crop Advisory', 'Soil Test', 'Weather Update', 'Animal Care',
         'Poultry', 'Fisheries', 'Government Schemes', 'Market Prices', 'General Discussion'],
    hi: ['फसल सलाह', 'मिट्टी परीक्षण', 'मौसम अपडेट', 'पशु देखभाल',
         'पोल्ट्री', 'मत्स्य पालन', 'सरकारी योजनाएं', 'बाजार भाव', 'सामान्य चर्चा'],
    bn: ['ফসল পরামর্শ', 'মাটি পরীক্ষা', 'আবহাওয়া আপডেট', 'পশু পরিচর্যা',
         'পোল্ট্রি', 'মৎস্যচাষ', 'সরকারি প্রকল্প', 'বাজার দর', 'সাধারণ আলোচনা'],
    or: ['ଫସଲ ପରାମର୍ଶ', 'ମାଟି ପରୀକ୍ଷା', 'ପାଣିପାଗ ଅଦ୍ୟତନ', 'ପଶୁ ଯତ୍ନ',
         'ପୋଲ୍ଟ୍ରି', 'ମତ୍ସ୍ୟ ଚାଷ', 'ସରକାରୀ ଯୋଜନା', 'ବଜାର ମୂଲ୍ୟ', 'ସାଧାରଣ ଆଲୋଚନା'],
    mai: ['फसल सलाह', 'माटि परीक्षण', 'मौसम अपडेट', 'पशु देखभाल',
          'पोल्ट्री', 'मछली पालन', 'सरकारी योजना', 'बाजार भाव', 'सामान्य चर्चा'],
    pa: ['ਫਸਲ ਸਲਾਹ', 'ਮਿੱਟੀ ਟੈਸਟ', 'ਮੌਸਮ ਅਪਡੇਟ', 'ਜਾਨਵਰਾਂ ਦੀ ਦੇਖਭਾਲ',
         'ਪੋਲਟਰੀ', 'ਮੱਛੀ ਪਾਲਣ', 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', 'ਬਾਜ਼ਾਰ ਭਾਅ', 'ਆਮ ਚਰਚਾ'],
    mr: ['पीक सल्ला', 'माती चाचणी', 'हवामान अपडेट', 'पशुधन काळजी',
         'पोल्ट्री', 'मत्स्यपालन', 'सरकारी योजना', 'बाजार भाव', 'सामान्य चर्चा'],
    gu: ['પાક સલાહ', 'માટી પરીક્ષણ', 'હવામાન અપડેટ', 'પશુ સંભાળ',
         'મરઘાં', 'માછીમારી', 'સરકારી યોજનાઓ', 'બાજાર ભાવ', 'સામાન્ય ચર્ચા'],
    ta: ['பயிர் ஆலோசனை', 'மண் சோதனை', 'வானிலை புதுப்பிப்பு', 'கால்நடை பராமரிப்பு',
         'கோழிப்பண்ணை', 'மீன்வளர்ப்பு', 'அரசு திட்டங்கள்', 'சந்தை விலை', 'பொது விவாதம்'],
    te: ['పంట సలహా', 'నేల పరీక్ష', 'వాతావరణ నవీకరణ', 'పశువుల సంరక్షణ',
         'పోల్ట్రీ', 'చేపల పెంపకం', 'ప్రభుత్వ పథకాలు', 'మార్కెట్ ధరలు', 'సాధారణ చర్చ'],
};

const TEMPLATES_I18N = {
    en: [
        { id: 'disease', label: '🦠 Crop Disease', content: "Crop Name: \nSymptoms Seen: \nSince When: \n(Attach photos of affected leaves)" },
        { id: 'soil',    label: '🌱 Soil Issue',   content: "Soil Type: \nLast Crop: \nProblem Observed: \n(Attach soil test report if available)" },
        { id: 'market',  label: '💰 Price Update', content: "Crop/Item: \nMarket Name: \nCurrent Price (per Quintal): \nQuality: " },
        { id: 'scheme',  label: '🏛️ Scheme Query', content: "Scheme Name: \nProblem Faced: \nApplication ID (if any): " },
    ],
    hi: [
        { id: 'disease', label: '🦠 फसल रोग', content: "फसल का नाम: \nलक्षण: \nकब से: \n(प्रभावित पत्तियों की फोटो लगाएं)" },
        { id: 'soil',    label: '🌱 मिट्टी समस्या', content: "मिट्टी प्रकार: \nपिछली फसल: \nसमस्या: \n(रिपोर्ट हो तो लगाएं)" },
        { id: 'market',  label: '💰 मंडी भाव', content: "फसल/सामान: \nमंडी का नाम: \nवर्तमान भाव (प्रति क्विंटल): \nगुणवत्ता: " },
        { id: 'scheme',  label: '🏛️ योजना सवाल', content: "योजना का नाम: \nसमस्या: \nआवेदन संख्या (यदि हो): " },
    ],
};

// Languages that fall back to Hindi templates (Indic family)
const HINDI_FALLBACK_LANGS = ['mai', 'mr', 'gu', 'pa'];

const getTemplates = (lang) =>
    TEMPLATES_I18N[lang] || (HINDI_FALLBACK_LANGS.includes(lang) ? TEMPLATES_I18N['hi'] : TEMPLATES_I18N['en']);

const getCategories = (lang) =>
    CATEGORIES_I18N[lang] || (HINDI_FALLBACK_LANGS.includes(lang) ? CATEGORIES_I18N['hi'] : CATEGORIES_I18N['en']);

// Language Picker Dropdown
function LanguagePicker({ postLang, setPostLang, label }) {
    const [open, setOpen] = useState(false);
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === postLang) || SUPPORTED_LANGUAGES[0];

    return (
        <div className="lang-picker-wrap">
            <button className="lang-picker-btn" onClick={() => setOpen(!open)} type="button">
                <Globe size={14} />
                <span>{selected.nativeName}</span>
                <ChevronDown size={13} className={open ? 'rotated' : ''} />
            </button>
            {open && (
                <div className="lang-picker-dropdown">
                    <div className="lang-picker-label">{label}</div>
                    <div className="lang-picker-grid">
                        {SUPPORTED_LANGUAGES.map(l => (
                            <button
                                key={l.code}
                                className={`lang-option ${postLang === l.code ? 'selected' : ''}`}
                                onClick={() => { setPostLang(l.code); setOpen(false); }}
                                type="button"
                            >
                                <span className="lang-flag">{l.flag}</span>
                                <span className="lang-native">{l.nativeName}</span>
                                {postLang === l.code && <Check size={12} className="lang-check" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreatePostModal({ isOpen, onClose, onSubmit, initialData }) {
    const { t, lang } = useLanguage();
    const { user } = useAuth();

    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [audience, setAudience] = useState('public');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [isExpertHelpRequested, setIsExpertHelpRequested] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [postLang, setPostLang] = useState(lang);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [locationText, setLocationText] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const MAX_CHARS = 1000;

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const docInputRef = useRef(null);
    const recordingInterval = useRef(null);
    const textareaRef = useRef(null);

    const categories = getCategories(postLang);
    const templates  = getTemplates(postLang);

    const AUDIENCE_OPTIONS = [
        { id: 'public',    label: lang === 'hi' ? 'सार्वजनिक' : 'Public',      icon: '🌍' },
        { id: 'community', label: lang === 'hi' ? 'समुदाय' : 'Community',      icon: '👥' },
        { id: 'experts',   label: lang === 'hi' ? 'विशेषज्ञ' : 'Experts Only', icon: '🎓' },
    ];

    // Load initial data for edit
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (isOpen && initialData) {
            setContent(initialData.content || '');
            setCharCount((initialData.content || '').length);
            setCategory(initialData.category || '');
            setTags(initialData.tags || []);
            setIsExpertHelpRequested(initialData.isExpertHelpRequested || false);
            if (initialData.media) {
                setMediaItems([{ type: initialData.media.type, url: initialData.media.url, name: 'Existing Media' }]);
            } else {
                setMediaItems([]);
            }
        } else if (isOpen && !initialData) {
            setContent(''); setCharCount(0); setCategory('');
            setTags([]); setMediaItems([]); setIsExpertHelpRequested(false);
            setLocationText(null); setPostLang(lang); setSubmitAttempted(false);
        }
    }, [isOpen, initialData]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        // Cleanup blob URLs
        return () => {
            mediaItems.forEach(item => { if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url); });
            if (recordingInterval.current) clearInterval(recordingInterval.current);
        };
    }, []);

    if (!isOpen) return null;

    const handleContentChange = (e) => {
        const val = e.target.value;
        if (val.length <= MAX_CHARS) {
            setContent(val);
            setCharCount(val.length);
        }
    };

    const handleFileSelect = (e, type) => {
        const files = Array.from(e.target.files);
        const newItems = files.map(file => ({
            type, url: URL.createObjectURL(file), file, name: file.name
        }));
        setMediaItems(prev => [...prev, ...newItems]);
        e.target.value = '';
    };

    const handleRemoveMedia = (index) => {
        setMediaItems(prev => {
            const updated = [...prev];
            if (updated[index].url?.startsWith('blob:')) URL.revokeObjectURL(updated[index].url);
            updated.splice(index, 1);
            return updated;
        });
    };

    const toggleRecording = () => {
        if (isRecording) {
            clearInterval(recordingInterval.current);
            setIsRecording(false);
            setMediaItems(prev => [...prev, {
                type: 'audio', url: '#',
                name: `Voice_${new Date().toLocaleTimeString()}.mp3`,
                duration: recordingTime
            }]);
            setRecordingTime(0);
        } else {
            setIsRecording(true);
            recordingInterval.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const handleTemplateSelect = (tmpl) => {
        if (content && !window.confirm('Replace current content with template?')) return;
        setContent(tmpl.content);
        setCharCount(tmpl.content.length);
        textareaRef.current?.focus();
    };

    const handleTagKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
            e.preventDefault();
            const clean = tagInput.trim().replace(/^#/, '');
            if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    setLocationText(`📍 ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                },
                () => setLocationText('📍 Location access denied')
            );
        }
    };

    const canSubmit = category && (content.trim() || mediaItems.length > 0) && !isSubmitting;

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        if (!canSubmit) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        onSubmit({ content, category, audience, tags, isExpertHelpRequested, mediaItems, locationText, postLang, timestamp: new Date().toISOString() });
        setContent(''); setCharCount(0); setCategory(''); setTags([]);
        setIsExpertHelpRequested(false); setMediaItems([]); setLocationText(null);
        setIsSubmitting(false);
        onClose();
    };

    const userInitial = (user?.name?.[0] || '🌾').toUpperCase();
    const isEdit = !!initialData;

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <h2>{isEdit ? t('edit_post_title') : t('create_post_title')}</h2>
                    </div>
                    <div className="modal-header-right">
                        <LanguagePicker postLang={postLang} setPostLang={setPostLang} label={t('your_post_language')} />
                        <button className="close-btn" onClick={onClose} type="button">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="modal-body-scroll">
                    {/* User + Audience Row */}
                    <div className="user-preview">
                        <div className="modal-avatar">
                            <span className="modal-avatar-initial">{userInitial}</span>
                        </div>
                        <div className="user-meta">
                            <span className="user-name">{user?.name || (lang === 'hi' ? 'किसान' : 'Farmer')}</span>
                            <div className="audience-selector">
                                {AUDIENCE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`audience-pill ${audience === opt.id ? 'active' : ''}`}
                                        onClick={() => setAudience(opt.id)}
                                        type="button"
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Category Select */}
                    <div className="form-group-new">
                        <div className="select-wrapper">
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className={`category-select ${!category ? 'required-pulse' : 'filled'}`}
                            >
                                <option value="">{t('select_category')}</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={CATEGORIES_I18N['en'][i]}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="select-arrow" />
                        </div>
                        {submitAttempted && !category && (
                            <p className="field-hint">{lang === 'hi' ? '⚠️ विषय जरूरी है' : '⚠️ Topic is required to post'}</p>
                        )}
                    </div>

                    {/* Templates */}
                    <div className="template-scroll-container">
                        {templates.map(tmpl => (
                            <button key={tmpl.id} className="template-pill" data-template={tmpl.id} onClick={() => handleTemplateSelect(tmpl)} type="button">
                                {tmpl.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Textarea */}
                    <div className="content-area">
                        <textarea
                            ref={textareaRef}
                            placeholder={t('share_placeholder')}
                            value={content}
                            onChange={handleContentChange}
                            className="post-input"
                            rows={5}
                        />
                        <div className="char-counter">
                            <span className={charCount > MAX_CHARS * 0.9 ? 'near-limit' : ''}>{charCount}/{MAX_CHARS}</span>
                        </div>

                        {/* Location pill */}
                        {locationText && (
                            <div className="location-pill">
                                {locationText}
                                <button onClick={() => setLocationText(null)} type="button"><X size={12} /></button>
                            </div>
                        )}

                        {/* Recording status */}
                        {isRecording && (
                            <div className="recording-status">
                                <div className="recording-dot" />
                                <span>REC {formatTime(recordingTime)}</span>
                            </div>
                        )}

                        {/* Media Preview Grid */}
                        {mediaItems.length > 0 && (
                            <div className="media-grid">
                                {mediaItems.map((item, idx) => (
                                    <div key={idx} className="media-grid-item">
                                        <button className="remove-media-btn-small" onClick={() => handleRemoveMedia(idx)} type="button">
                                            <X size={12} />
                                        </button>
                                        {item.type === 'image' && <img src={item.url} alt="Preview" />}
                                        {item.type === 'video' && <video src={item.url} muted />}
                                        {item.type === 'audio' && (
                                            <div className="audio-preview">
                                                <Mic size={22} />
                                                <span>{formatTime(item.duration || 0)}</span>
                                            </div>
                                        )}
                                        {item.type === 'doc' && (
                                            <div className="doc-preview">
                                                <FileText size={22} />
                                                <span>{item.name.slice(0, 14)}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="form-group-new">
                        <div className="tags-container">
                            {tags.map(tag => (
                                <span key={tag} className="tag-chip">
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} type="button"><X size={11} /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder={t('add_tags')}
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="tag-input"
                            />
                        </div>
                    </div>

                    {/* Expert Help Toggle */}
                    <div className="expert-toggle-container">
                        <label className={`expert-toggle ${isExpertHelpRequested ? 'expert-active' : ''}`}>
                            <input
                                type="checkbox"
                                checked={isExpertHelpRequested}
                                onChange={e => setIsExpertHelpRequested(e.target.checked)}
                            />
                            <div className="expert-toggle-content">
                                <Shield size={18} className="shield-icon" />
                                <div>
                                    <span className="toggle-title">{t('expert_help')}</span>
                                    <span className="toggle-subtitle">{t('expert_help_sub')}</span>
                                </div>
                            </div>
                            {isExpertHelpRequested && <Check size={18} className="expert-check" />}
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <div className="action-tools">
                        <button className="tool-btn photo-btn" onClick={() => fileInputRef.current?.click()} title={lang === 'hi' ? 'फोटो' : 'Photo'} type="button">
                            <ImageIcon size={20} />
                        </button>
                        <button className="tool-btn video-btn" onClick={() => videoInputRef.current?.click()} title={lang === 'hi' ? 'वीडियो' : 'Video'} type="button">
                            <Video size={20} />
                        </button>
                        <button className="tool-btn cam-btn" onClick={() => fileInputRef.current?.click()} title={lang === 'hi' ? 'कैमरा' : 'Camera'} type="button">
                            <Camera size={20} />
                        </button>
                        <button className={`tool-btn mic-btn ${isRecording ? 'recording-active' : ''}`} onClick={toggleRecording} title={lang === 'hi' ? 'आवाज़' : 'Voice'} type="button">
                            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                        </button>
                        <button className="tool-btn doc-btn" onClick={() => docInputRef.current?.click()} title={lang === 'hi' ? 'दस्तावेज़' : 'Document'} type="button">
                            <FileText size={20} />
                        </button>
                        <button className="tool-btn loc-btn" onClick={handleGetLocation} title={lang === 'hi' ? 'स्थान' : 'Location'} type="button">
                            <MapPin size={20} />
                        </button>
                    </div>

                    <button
                        className={`submit-btn ${canSubmit ? 'active' : 'disabled'}`}
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        type="button"
                    >
                        {isSubmitting ? (
                            <span className="submit-spinner" />
                        ) : (
                            <>
                                <Send size={16} />
                                {isEdit ? t('update_btn') : t('post_btn')}
                            </>
                        )}
                    </button>
                </div>

                {/* Hidden file inputs */}
                <input type="file" ref={fileInputRef}  accept="image/*"        multiple hidden onChange={e => handleFileSelect(e, 'image')} />
                <input type="file" ref={videoInputRef} accept="video/*"                 hidden onChange={e => handleFileSelect(e, 'video')} />
                <input type="file" ref={docInputRef}   accept=".pdf,.doc,.docx"         hidden onChange={e => handleFileSelect(e, 'doc')} />
            </div>
        </div>
    );
}
