import React, { useState, useRef, useEffect } from 'react';
import { Camera, UploadCloud, AlertTriangle, CheckCircle, RefreshCw, Smartphone, Sprout, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './RogDetector.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Inline Translations ---
const ROG_T = {
    title: { hi: 'रोग पहचान', en: 'Disease Detector', bn: 'রোগ শনাক্তকারী', or: 'ରୋଗ ଚିହ୍ନଟକାରୀ', mai: 'रोग पहिचान', pa: 'ਬਿਮਾਰੀ ਪਛਾਣਕਰਤਾ', mr: 'रोग शोधक', gu: 'રોગ ડિટેક્ટર', ta: 'நோய் கண்டறிதல்', te: 'వ్యాధి శోధకం' },
    subtitle: { hi: 'AI से तुरंत फसल रोग पहचानें', en: 'Instantly detect crop disease with AI', bn: 'AI দিয়ে তাৎক্ষণিক ফসলের রোগ শনাক্ত করুন', or: 'AI ସହିତ ତୁରନ୍ତ ଫସଲ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ', mai: 'AI सँ तुरन्त फसलक रोग पहचानू', pa: 'AI ਨਾਲ ਤੁਰੰਤ ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਦਾ ਪਤਾ ਲਗਾਓ', mr: 'AI सह त्वरित पीक रोग ओळखा', gu: 'AI થી તરત પાકનો રોગ ઓળખો', ta: 'AI மூலம் பயிர் நோயைக் கண்டறியவும்', te: 'AI తో తక్షణమే పంట వ్యాధిని గుర్తించండి' },
    step1: { hi: 'फोटो', en: 'Photo', bn: 'ছবি', or: 'ଫଟୋ', mai: 'फोटो', pa: 'ਫੋਟੋ', mr: 'फोटो', gu: 'ફોટો', ta: 'புகைப்படம்', te: 'ఫోటో' },
    step2: { hi: 'विश्लेषण', en: 'Analyze', bn: 'বিশ্লেষণ', or: 'ବିଶ୍ଳେଷଣ', mai: 'विश्लेषण', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ', mr: 'विश्लेषण', gu: 'વિષ્લેષણ', ta: 'பகுப்பாய்வு', te: 'విశ్లేషణ' },
    step3: { hi: 'परिणाम', en: 'Result', bn: 'ফলাফল', or: 'ପରିଣାମ', mai: 'परिणाम', pa: 'ਨਤੀਜਾ', mr: 'परिणाम', gu: 'પરિણામ', ta: 'முடிவு', te: 'ఫలితం' },
    upload: { hi: 'फोटो अपलोड करें', en: 'Upload Photo', bn: 'ছবি আপলোড করুন', or: 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ', mai: 'फोटो अपलोड करू', pa: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ', mr: 'फोटो अपलोड करा', gu: 'ફોટો અપલોડ કરો', ta: 'புகைப்படத்தைப் பதிவேற்றவும்', te: 'ఫోటో అప్‌లోడ్ చేయండి' },
    upload_desc: { hi: 'फसल, पत्ती या पौधे की साफ फोटो लें', en: 'Take a clear photo of crop, leaf or plant', bn: 'ফসল, পাতা বা গাছের পরিষ্কার ছবি তুলুন', or: 'ଫସଲ, ପତ୍ର କିମ୍ବା ଗଛର ସ୍ପଷ୍ଟ ଫଟୋ ନିଅନ୍ତୁ', mai: 'फसल, पत्ता वा गाछक साफ फोटो लिअ', pa: 'ਫਸਲ, ਪੱਤੇ ਜਾਂ ਪੌਦੇ ਦੀ ਸਾਫ਼ ਫੋਟੋ ਲਓ', mr: 'पीक, पान किंवा झाडाचा स्पष्ट फोटो घ्या', gu: 'પાક, પાંદડા કે છોડનો સ્પષ્ટ ફોટો લો', ta: 'பயிர், இலை அல்லது செடியின் தெளிவான புகைப்படம் எடுக்கவும்', te: 'పంట, ఆకు లేదా మొక్క యొక్క స్పష్టమైన ఫోటో తీయండి' },
    gallery: { hi: 'गैलरी से चुनें', en: 'Choose from Gallery', bn: 'গ্যালারি থেকে বাছুন', or: 'ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ', mai: 'गैलरी सँ चुनू', pa: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ', mr: 'गॅलरीतून निवडा', gu: 'ગેલેરીમાંથી પસંદ કરો', ta: 'கேலரியிலிருந்து தேர்வு செய்யவும்', te: 'గ్యాలరీ నుండి ఎంచుకోండి' },
    camera: { hi: 'कैमरा', en: 'Camera', bn: 'ক্যামেরা', or: 'କ୍ୟାମେରା', mai: 'कैमरा', pa: 'ਕੈਮਰਾ', mr: 'कॅमेरा', gu: 'કેમેરા', ta: 'கேமரா', te: 'కెమెరా' },
    crop_name: { hi: 'फसल का नाम (जैसे: धान)', en: 'Crop name (e.g., Rice)', bn: 'ফসলের নাম (যেমন: ধান)', or: 'ଫସଲର ନାମ (ଯେପରିକି: ଧାନ)', mai: 'फसलक नाम (जैना: धान)', pa: 'ਫਸਲ ਦਾ ਨਾਮ (ਜਿਵੇਂ ਕਿ: ਝੋਨਾ)', mr: 'पिकाचे नाव (उदा: भात)', gu: 'પાકનું નામ (દા.ત., ડાંગર)', ta: 'பயிர் பெயர் (உ-ம்: நெல்)', te: 'పంట పేరు (ఉదాహరణ: వరి)' },
    analyze_btn: { hi: 'AI से जांच करें', en: 'Analyze with AI', bn: 'AI দিয়ে পরীক্ষা করুন', or: 'AI ସହିତ ଯାଞ୍ଚ କରନ୍ତୁ', mai: 'AI सँ जांच करू', pa: 'AI ਨਾਲ ਜਾਂਚ ਕਰੋ', mr: 'AI सह तपासा', gu: 'AI થી તપાસો', ta: 'AI மூலம் பகுப்பாய்வு செய்யவும்', te: 'AI తో విశ్లేషించండి' },
    analyzing: { hi: 'AI विश्लेषण कर रहा है...', en: 'AI is analyzing...', bn: 'AI বিশ্লেষণ করছে...', or: 'AI ବିଶ୍ଳେଷଣ କରୁଛି...', mai: 'AI विश्लेषण क रहल अछि...', pa: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...', mr: 'AI विश्लेषण करत आहे...', gu: 'AI વિશ્લેષણ કરી રહ્યું છે...', ta: 'AI பகுப்பாய்வு செய்கிறது...', te: 'AI విశ్లేషిస్తోంది...' },
    cancel: { hi: 'रद्द करें', en: 'Cancel', bn: 'বাতিল করুন', or: 'ବାତିଲ୍ କରନ୍ତୁ', mai: 'रद्द करू', pa: 'ਰੱਦ ਕਰੋ', mr: 'रद्द करा', gu: 'રદ કરો', ta: 'ரத்துசெய்', te: 'రద్దు చేయి' },
    confidence: { hi: 'विश्वास', en: 'Confidence', bn: 'আস্থা', or: 'ଆତ୍ମବିଶ୍ୱାସ', mai: 'विश्वास', pa: 'ਵਿਸ਼ਵਾਸ', mr: 'आत्मविश्वास', gu: 'આત્મવિશ્વાસ', ta: 'நம்பிக்கை', te: 'నమ్మకం' },
    symptoms: { hi: 'लक्षण', en: 'Symptoms', bn: 'লক্ষণ', or: 'ଲକ୍ଷଣ', mai: 'लक्षण', pa: 'ਲੱਛਣ', mr: 'लक्षणे', gu: 'લક્ષણો', ta: 'அறிகுறிகள்', te: 'లక్షణాలు' },
    treatment: { hi: 'उपचार', en: 'Treatment', bn: 'চিকিৎসা', or: 'ଉପଚାର', mai: 'उपचार', pa: 'ਇਲਾਜ', mr: 'उपचार', gu: 'સારવાર', ta: 'சிகிச்சை', te: 'చికిత్స' },
    prevention: { hi: 'बचाव', en: 'Prevention', bn: 'প্রতিরোধ', or: 'ନିରାକରଣ', mai: 'बचाव', pa: 'ਬਚਾਅ', mr: 'प्रतिबंध', gu: 'નિવારણ', ta: 'தடுப்பு', te: 'నివారణ' },
    check_another: { hi: 'दूसरी फोटो जांचें', en: 'Check Another Photo', bn: 'অন্য ছবি পরীক্ষা করুন', or: 'ଅନ୍ୟ ଫଟୋ ଯାଞ୍ଚ କରନ୍ତୁ', mai: 'दोसर फोटो जांचू', pa: 'ਹੋਰ ਫੋਟੋ ਦੀ ਜਾਂਚ ਕਰੋ', mr: 'दुसरा फोटो तपासा', gu: 'બીજો ફોટો તપાસો', ta: 'வேறு புகைப்படத்தை சரிபார்க்கவும்', te: 'మరొక ఫోటోని తనిఖీ చేయండి' },
    consult_alert: { hi: 'विशेषज्ञ से परामर्श करें', en: 'Consult an expert doctor', bn: 'বিশেষজ্ঞের পরামর্শ নিন', or: 'ବିଶେଷଜ୍ଞଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ', mai: 'विशेषज्ञसँ परामर्श लिअ', pa: 'ਮਾਹਿਰ ਦੀ ਸਲਾਹ ਲਓ', mr: 'तज्ज्ञांचा सल्ला घ्या', gu: 'નિષ્ણાતની સલાહ લો', ta: 'நிபுணரை அணுகவும்', te: 'నిపుణుడిని సంప్రదించండి' }
};

const getT = (lang, key) => (ROG_T[key] && ROG_T[key][lang]) || (ROG_T[key] && ROG_T[key]['en']) || key;

export default function RogDetector() {
    const { lang } = useLanguage();
    const { token } = useAuth();
    const activeLang = typeof lang === 'string' ? lang : 'en';

    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [cropName, setCropName] = useState('');
    const [animatedConfidence, setAnimatedConfidence] = useState(0);
    
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Current Step: 1 (Upload), 2 (Analyze), 3 (Result)
    const currentStep = result ? 3 : (analyzing || image ? 2 : 1);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImage(URL.createObjectURL(file));
            setResult(null);
            setError(null);
            setAnimatedConfidence(0);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;
        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', imageFile, 'crop-image.jpg');
            formData.append('crop', cropName || 'unknown');
            formData.append('description', 'Check crop disease');

            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/ai/analyze-image`, {
                method: 'POST',
                headers,
                body: formData
            });

            const data = await response.json();

            if (data.success && data.analysis) {
                setResult(data.analysis);
            } else {
                setError(data.message || 'Analysis failed. Please try again.');
            }
        } catch {
            setError('Could not connect to server. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setImage(null);
        setImageFile(null);
        setResult(null);
        setError(null);
        setCropName('');
        setAnimatedConfidence(0);
    };

    const getSeverityColor = (severity) => {
        if (!severity) return 'var(--warning)';
        const s = severity.toLowerCase();
        if (s === 'critical') return '#ef4444'; // Red
        if (s === 'high') return '#f97316'; // Orange
        if (s === 'medium') return '#f59e0b'; // Amber
        return '#10b981'; // Emerald
    };

    useEffect(() => {
        if (result && result.confidence) {
            // Animate confidence bar
            setTimeout(() => setAnimatedConfidence(result.confidence), 300);
        }
    }, [result]);

    return (
        <div className="page-content pb-safe">
            <header className="page-header animate-slide-down">
                <h2>🔍 {getT(activeLang, 'title')}</h2>
                <p className="subtitle">{getT(activeLang, 'subtitle')}</p>
            </header>

            {/* Step Progress Bar */}
            <div className="ai-steps-container animate-slide-down delay-1">
                <div className="ai-steps">
                    <div className={`ai-step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-circle"><Camera size={16} /></div>
                        <span>{getT(activeLang, 'step1')}</span>
                    </div>
                    <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`ai-step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-circle"><Activity size={16} /></div>
                        <span>{getT(activeLang, 'step2')}</span>
                    </div>
                    <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                    <div className={`ai-step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-circle"><CheckCircle size={16} /></div>
                        <span>{getT(activeLang, 'step3')}</span>
                    </div>
                </div>
            </div>

            <div className="detector-container">
                {!image ? (
                    <div className="upload-box animate-fade-in-up delay-2">
                        <div className="upload-border-dash"></div>
                        <div className="upload-icon-circle pulse-glow">
                            <UploadCloud size={48} color="var(--primary)" />
                        </div>
                        <h3>{getT(activeLang, 'upload')}</h3>
                        <p>{getT(activeLang, 'upload_desc')}</p>

                        <div className="upload-actions">
                            <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                                <Smartphone size={20} /> {getT(activeLang, 'gallery')}
                            </button>
                            <button className="btn-secondary" onClick={() => cameraInputRef.current?.click()}>
                                <Camera size={20} /> {getT(activeLang, 'camera')}
                            </button>
                        </div>

                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
                        <input type="file" accept="image/*" capture="environment" hidden ref={cameraInputRef} onChange={handleFileChange} />
                    </div>
                ) : (
                    <div className="preview-section animate-fade-in-up">
                        <div className="preview-img-wrapper">
                            <img src={image} alt="Crop" className="preview-img" />
                            {analyzing && <div className="scanning-line"></div>}
                        </div>

                        {!result && !analyzing && (
                            <div className="crop-input-row">
                                <span className="crop-input-icon"><Sprout size={18} /></span>
                                <input
                                    type="text"
                                    placeholder={getT(activeLang, 'crop_name')}
                                    value={cropName}
                                    onChange={e => setCropName(e.target.value)}
                                    className="crop-name-input"
                                />
                            </div>
                        )}

                        {!result && (
                            <div className="preview-actions">
                                {analyzing ? (
                                    <div className="analyzing-loader">
                                        <div className="ai-spinner"></div>
                                        <span>{getT(activeLang, 'analyzing')}</span>
                                    </div>
                                ) : (
                                    <div className="action-row">
                                        <button className="btn-secondary outline" onClick={reset}>
                                            {getT(activeLang, 'cancel')}
                                        </button>
                                        <button className="btn-primary analyze-btn" onClick={handleAnalyze}>
                                            <Activity size={20} /> {getT(activeLang, 'analyze_btn')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="error-message bounce-in">
                                <AlertTriangle size={20} /> {error}
                                <button className="btn-text mt-2" onClick={handleAnalyze}>
                                    <RefreshCw size={16} /> Retry
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {result && (
                    <div className="result-card fade-in-up">
                        <div className="result-header" style={{ background: `linear-gradient(135deg, ${getSeverityColor(result.severity)} 0%, ${getSeverityColor(result.severity)}dd 100%)` }}>
                            {result.severity === 'low' ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
                            <h3>{result.disease || 'Disease Detected'}</h3>
                        </div>

                        <div className="result-body">
                            <div className="confidence-meter">
                                <div className="flex-between">
                                    <span><strong>{getT(activeLang, 'confidence')}</strong></span>
                                    <span>{animatedConfidence}%</span>
                                </div>
                                <div className="meter-bar-bg">
                                    <div 
                                        className="meter-bar-fill" 
                                        style={{ 
                                            width: `${animatedConfidence}%`, 
                                            background: getSeverityColor(result.severity) 
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {result.symptoms && (
                                <div className="info-block">
                                    <div className="info-title">
                                        <Activity size={18} color={getSeverityColor(result.severity)} />
                                        <strong>{getT(activeLang, 'symptoms')}</strong>
                                    </div>
                                    <p>{result.symptoms}</p>
                                </div>
                            )}

                            {result.treatment && (
                                <div className="info-block highlight">
                                    <div className="info-title">
                                        <span className="pill-icon">💊</span>
                                        <strong>{getT(activeLang, 'treatment')}</strong>
                                    </div>
                                    <p>{result.treatment}</p>
                                </div>
                            )}

                            {result.prevention && (
                                <div className="info-block">
                                    <div className="info-title">
                                        <span className="shield-icon">🛡️</span>
                                        <strong>{getT(activeLang, 'prevention')}</strong>
                                    </div>
                                    <p>{result.prevention}</p>
                                </div>
                            )}

                            {result.doctorRequired && (
                                <div className="doctor-alert-banner">
                                    <AlertTriangle size={20} /> 
                                    <span>{getT(activeLang, 'consult_alert')}</span>
                                </div>
                            )}

                            <button className="btn-secondary btn-block mt-4" onClick={reset}>
                                <Camera size={18} /> {getT(activeLang, 'check_another')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
