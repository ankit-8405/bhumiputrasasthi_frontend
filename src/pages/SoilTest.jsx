import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { ArrowLeft, ArrowRight, Check, MapPin, Camera, User, Home as HomeIcon, Leaf, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './SoilTest.css';

const SOIL_T = {
    // Alerts
    loc_success: { hi: '✅ स्थान प्राप्त हो गया!', en: '✅ Location captured!', bn: '✅ অবস্থান ক্যাপচার করা হয়েছে!', or: '✅ ସ୍ଥାନ ପ୍ରାପ୍ତ ହେଲା!', mai: '✅ स्थान प्राप्त भ गेल!', pa: '✅ ਸਥਾਨ ਪ੍ਰਾਪਤ ਹੋਇਆ!', mr: '✅ स्थान प्राप्त झाले!', gu: '✅ સ્થાન પ્રાપ્ત થયું!', ta: '✅ இருப்பிடம் கைப்பற்றப்பட்டது!', te: '✅ స్థానం సంగ్రహించబడింది!' },
    loc_fail: { hi: '❌ स्थान प्राप्त नहीं हो सका', en: '❌ Could not get location', bn: '❌ অবস্থান পাওয়া যায়নি', or: '❌ ସ୍ଥାନ ପ୍ରାପ୍ତ ହୋଇପାରିଲା ନାହିଁ', mai: '❌ स्थान प्राप्त नहि भ सकल', pa: '❌ ਸਥਾਨ ਨਹੀਂ ਮਿਲ ਸਕਿਆ', mr: '❌ स्थान मिळू शकले नाही', gu: '❌ સ્થાન પ્રાપ્ત થઈ શક્યું નથી', ta: '❌ இருப்பிடத்தைக் கண்டறிய முடியவில்லை', te: '❌ స్థానం పొందలేకపోయాము' },
    
    // States
    UP: { hi: 'उत्तर प्रदेश', en: 'Uttar Pradesh', bn: 'উত্তর প্রদেশ', or: 'ଉତ୍ତର ପ୍ରଦେଶ', mai: 'उत्तर प्रदेश', pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼', mr: 'उत्तर प्रदेश', gu: 'ઉત્તર પ્રદેશ', ta: 'உத்தரப் பிரதேசம்', te: 'ఉత్తర ప్రదేశ్' },
    BR: { hi: 'बिहार', en: 'Bihar', bn: 'বিহার', or: 'ବିହାର', mai: 'बिहार', pa: 'ਬਿਹਾਰ', mr: 'बिहार', gu: 'બિહાર', ta: 'பீகார்', te: 'బీహార్' },
    MP: { hi: 'मध्य प्रदेश', en: 'Madhya Pradesh', bn: 'মধ্যপ্রদেশ', or: 'ମଧ୍ୟ ପ୍ରଦେଶ', mai: 'मध्य प्रदेश', pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼', mr: 'मध्य प्रदेश', gu: 'મધ્ય પ્રદેશ', ta: 'மத்தியப் பிரதேசம்', te: 'మధ్య ప్రదేశ్' },
    RJ: { hi: 'राजस्थान', en: 'Rajasthan', bn: 'রাজস্থান', or: 'ରାଜସ୍ଥାନ', mai: 'राजस्थान', pa: 'ਰਾਜਸਥਾਨ', mr: 'राजस्थान', gu: 'રાજસ્થાન', ta: 'ராஜஸ்தான்', te: 'రాజస్థాన్' },
    MH: { hi: 'महाराष्ट्र', en: 'Maharashtra', bn: 'মহারাষ্ট্র', or: 'ମହାରାଷ୍ଟ୍ର', mai: 'महाराष्ट्र', pa: 'ਮਹਾਰਾਸ਼ਟਰ', mr: 'महाराष्ट्र', gu: 'મહારાષ્ટ્ર', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర' },
    PB: { hi: 'पंजाब', en: 'Punjab', bn: 'পাঞ্জাব', or: 'ପଞ୍ଜାବ', mai: 'पंजाब', pa: 'ਪੰਜਾਬ', mr: 'पंजाब', gu: 'પંજાબ', ta: 'பஞ்சாப்', te: 'పంజాబ్' },
    HR: { hi: 'हरियाणा', en: 'Haryana', bn: 'হরিয়ানা', or: 'ହରିୟାଣା', mai: 'हरियाणा', pa: 'ਹਰਿਆਣਾ', mr: 'हरियाणा', gu: 'હરિયાણા', ta: 'ஹரியானா', te: 'హర్యానా' },
    GJ: { hi: 'गुजरात', en: 'Gujarat', bn: 'গুজরাট', or: 'ଗୁଜରାଟ', mai: 'गुजरात', pa: 'ਗੁਜਰਾਤ', mr: 'गुजरात', gu: 'ગુજરાત', ta: 'குஜராத்', te: 'గుజరాత్' },
    WB: { hi: 'पश्चिम बंगाल', en: 'West Bengal', bn: 'পশ্চিমবঙ্গ', or: 'ପଶ୍ଚିମ ବଙ୍ଗ', mai: 'पश्चिम बंगाल', pa: 'ਪੱਛਮੀ ਬੰਗਾਲ', mr: 'पश्चिम बंगाल', gu: 'પશ્ચિમ બંગાળ', ta: 'மேற்கு வங்காளம்', te: 'పశ్చిమ బెంగాల్' },
    KA: { hi: 'कर्नाटक', en: 'Karnataka', bn: 'কর্ণাটক', or: 'କର୍ଣ୍ଣାଟକ', mai: 'कर्नाटक', pa: 'ਕਰਨਾਟਕ', mr: 'कर्नाटक', gu: 'કર્ણાટક', ta: 'கர்நாடகா', te: 'కర్ణాటక' },

    // Soil Types
    alluvial: { hi: 'जलोढ़ मिट्टी', en: 'Alluvial', bn: 'পলি মাটি', or: 'ପଲି ମାଟି', mai: 'जलोढ़ माटि', pa: 'ਜਲੋੜ ਮਿੱਟੀ', mr: 'गाळाची जमीन', gu: 'કાંપની માટી', ta: 'வண்டல் மண்', te: 'ఒండ్రు మట్టి' },
    black: { hi: 'काली मिट्टी', en: 'Black', bn: 'কালো মাটি', or: 'କଳା ମାଟି', mai: 'करीका माटि', pa: 'ਕਾਲੀ ਮਿੱਟੀ', mr: 'काळी जमीन', gu: 'કાળી માટી', ta: 'கரிசல் மண்', te: 'నల్ల రేగడి మట్టి' },
    red: { hi: 'लाल मिट्टी', en: 'Red', bn: 'লাল মাটি', or: 'ନାଲି ମାଟି', mai: 'ललका माटि', pa: 'ਲਾਲ ਮਿੱਟੀ', mr: 'लाल जमीन', gu: 'લાલ માટી', ta: 'செம்மண்', te: 'ఎర్ర మట్టి' },
    laterite: { hi: 'लेटराइट मिट्टी', en: 'Laterite', bn: 'ল্যাটেরাইট মাটি', or: 'ଲାଟେରାଇଟ୍ ମାଟି', mai: 'लेटराइट माटि', pa: 'ਲੈਟਰਾਈਟ ਮਿੱਟੀ', mr: 'जांभी जमीन', gu: 'લેટેરાઈટ માટી', ta: 'லேட்டரைட் மண்', te: 'లేటరైట్ మట్టి' },
    desert: { hi: 'रेतीली मिट्टी', en: 'Desert', bn: 'মরুভূমির মাটি', or: 'ବାଲିଆ ମାଟି', mai: 'बालू माटि', pa: 'ਰੇਤਲੀ ਮਿੱਟੀ', mr: 'वाळवंटी जमीन', gu: 'રેતાળ માટી', ta: 'பாலைவன மண்', te: 'ఇసుక మట్టి' },
    mountain: { hi: 'पहाड़ी मिट्टी', en: 'Mountain', bn: 'পাহাড়ি মাটি', or: 'ପାର୍ବତ୍ୟ ମାଟି', mai: 'पहाड़ी माटि', pa: 'ਪਹਾੜੀ ਮਿੱਟੀ', mr: 'डोंगराळ जमीन', gu: 'પહાડી માટી', ta: 'மலை மண்', te: 'పర్వత మట్టి' },

    // Crops
    wheat: { hi: 'गेहूं', en: 'Wheat', bn: 'গম', or: 'ଗହମ', mai: 'गहूम', pa: 'ਕਣਕ', mr: 'गहू', gu: 'ઘઉં', ta: 'கோதுமை', te: 'గోధుమ' },
    rice: { hi: 'चावल/धान', en: 'Rice', bn: 'চাল/ধান', or: 'ଧାନ', mai: 'धान', pa: 'ਝੋਨਾ', mr: 'तांदूळ/भात', gu: 'ચોખા/ડાંગર', ta: 'அரிசி', te: 'వరి' },
    sugarcane: { hi: 'गन्ना', en: 'Sugarcane', bn: 'আখ', or: 'ଆଖୁ', mai: 'कुशियार', pa: 'ਗੰਨਾ', mr: 'ऊस', gu: 'શેરડી', ta: 'கரும்பு', te: 'చెరకు' },
    cotton: { hi: 'कपास', en: 'Cotton', bn: 'তুলা', or: 'କପା', mai: 'कपास', pa: 'ਕਪਾਹ', mr: 'कापूस', gu: 'કપાસ', ta: 'பருத்தி', te: 'పత్తి' },
    maize: { hi: 'मक्का', en: 'Maize', bn: 'ভুট্টা', or: 'ମକା', mai: 'मकई', pa: 'ਮੱਕੀ', mr: 'मका', gu: 'મકાઈ', ta: 'மக்காச்சோளம்', te: 'మొక్కజొన్న' },
    potato: { hi: 'आलू', en: 'Potato', bn: 'আলু', or: 'ଆଳୁ', mai: 'आलू', pa: 'ਆਲੂ', mr: 'बटाटा', gu: 'બટાકા', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప' },
    tomato: { hi: 'टमाटर', en: 'Tomato', bn: 'টমেটো', or: 'ଟମାଟୋ', mai: 'टमाटड़', pa: 'ਟਮਾਟਰ', mr: 'टोमॅटो', gu: 'ટામેટા', ta: 'தக்காளி', te: 'టమోటా' },
    onion: { hi: 'प्याज', en: 'Onion', bn: 'পেঁয়াজ', or: 'ପିଆଜ', mai: 'पेयाज', pa: 'ਪਿਆਜ਼', mr: 'कांदा', gu: 'ડુંગળી', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ' },
};

const STATES = [
    { id: 'UP', en: 'Uttar Pradesh' }, { id: 'BR', en: 'Bihar' }, { id: 'MP', en: 'Madhya Pradesh' },
    { id: 'RJ', en: 'Rajasthan' }, { id: 'MH', en: 'Maharashtra' }, { id: 'PB', en: 'Punjab' },
    { id: 'HR', en: 'Haryana' }, { id: 'GJ', en: 'Gujarat' }, { id: 'WB', en: 'West Bengal' },
    { id: 'KA', en: 'Karnataka' }
];

const DISTRICTS = {
    'UP': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut'],
    'BR': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'MP': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'RJ': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'PB': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
    'HR': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    'GJ': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'WB': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri'],
    'KA': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi']
};

const SOIL_TYPES = ['alluvial', 'black', 'red', 'laterite', 'desert', 'mountain'];
const CROPS = ['wheat', 'rice', 'sugarcane', 'cotton', 'maize', 'potato', 'tomato', 'onion'];

const getLocT = (lang, key) => (SOIL_T[key] && SOIL_T[key][lang]) || (SOIL_T[key] && SOIL_T[key]['en']) || key;

export default function SoilTest() {
    const { t, lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [applicationId, setApplicationId] = useState('');

    const [formData, setFormData] = useState({
        // Step 1
        fullName: '',
        mobile: '',
        email: '',
        gender: '',
        language: activeLang,
        
        // Step 2
        state: '',
        district: '',
        block: '',
        village: '',
        gpsLocation: null,
        
        // Step 3
        ownership: 'own',
        landArea: '',
        landUnit: 'acre',
        soilType: '',
        currentCrop: '',
        plannedCrop: '',
        
        // Step 4
        collectionMethod: 'pickup',
        soilPhoto: null,
        preferredLab: 'govt',
        consent: false
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateField('gpsLocation', {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    alert(getLocT(activeLang, 'loc_success'));
                },
                () => {
                    alert(getLocT(activeLang, 'loc_fail'));
                }
            );
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateField('soilPhoto', URL.createObjectURL(file));
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('bps_token');
            const res = await fetch(`${API_BASE}/soil-test/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success && data.application_id) {
                setApplicationId(data.application_id);
            } else {
                setApplicationId('ST' + Date.now().toString().slice(-8));
            }
        } catch {
            setApplicationId('ST' + Date.now().toString().slice(-8));
        }
        setShowSuccess(true);
    };

    const getStepIcon = (step) => {
        const icons = [User, HomeIcon, Leaf, FileText];
        const Icon = icons[step - 1];
        return <Icon size={20} />;
    };

    if (showSuccess) {
        return (
            <div className="soil-test-page">
                <div className="success-screen">
                    <div className="success-icon">✅</div>
                    <h2>{t('application_successful')}</h2>
                    <div className="application-id">
                        <span>{t('application_id')}</span>
                        <strong>{applicationId}</strong>
                    </div>
                    <p>{t('application_submitted')}</p>
                    
                    <div className="status-tracker">
                        <h3>{t('application_status')}</h3>
                        <div className="status-steps">
                            <div className="status-step active">
                                <div className="status-dot"></div>
                                <span>{t('received')}</span>
                            </div>
                            <div className="status-step">
                                <div className="status-dot"></div>
                                <span>{t('sample_collection')}</span>
                            </div>
                            <div className="status-step">
                                <div className="status-dot"></div>
                                <span>{t('testing')}</span>
                            </div>
                            <div className="status-step">
                                <div className="status-dot"></div>
                                <span>{t('report_ready')}</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn-primary btn-block" onClick={() => navigate('/')}>
                        {t('go_home')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="soil-test-page">
            <header className="soil-test-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1>{t('soil_test_title')}</h1>
                    <p>{t('step')} {currentStep}/4</p>
                </div>
            </header>

            <div className="progress-indicator">
                {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
                        <div className="step-circle">
                            {currentStep > step ? <Check size={16} /> : getStepIcon(step)}
                        </div>
                        {step < 4 && <div className="step-line"></div>}
                    </div>
                ))}
            </div>

            <div className="form-container">
                {currentStep === 1 && (
                    <div className="form-step">
                        <h2>{t('farmer_details')}</h2>
                        
                        <div className="form-group">
                            <label>{t('full_name')} *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => updateField('fullName', e.target.value)}
                                placeholder={t('enter_name')}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('mobile_number')} *</label>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => updateField('mobile', e.target.value)}
                                placeholder={t('enter_mobile_10')}
                                maxLength="10"
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('email')} ({t('optional')})</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('gender')} ({t('optional')})</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => updateField('gender', e.target.value)}
                                    />
                                    <span>{t('male')}</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => updateField('gender', e.target.value)}
                                    />
                                    <span>{t('female')}</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={formData.gender === 'other'}
                                        onChange={(e) => updateField('gender', e.target.value)}
                                    />
                                    <span>{t('other')}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="form-step">
                        <h2>{t('location_address')}</h2>
                        
                        <div className="form-group">
                            <label>{t('state')} *</label>
                            <select
                                value={formData.state}
                                onChange={(e) => {
                                    updateField('state', e.target.value);
                                    updateField('district', '');
                                }}
                            >
                                <option value="">{t('select_state')}</option>
                                {STATES.map(s => (
                                    <option key={s.id} value={s.id}>{getLocT(activeLang, s.id)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('district')} *</label>
                            <select
                                value={formData.district}
                                onChange={(e) => updateField('district', e.target.value)}
                                disabled={!formData.state}
                            >
                                <option value="">{t('select_district')}</option>
                                {formData.state && DISTRICTS[formData.state]?.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('block_tehsil')} *</label>
                            <input
                                type="text"
                                value={formData.block}
                                onChange={(e) => updateField('block', e.target.value)}
                                placeholder={t('block_name')}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('village')} *</label>
                            <input
                                type="text"
                                value={formData.village}
                                onChange={(e) => updateField('village', e.target.value)}
                                placeholder={t('village_name')}
                            />
                        </div>

                        <button className="btn-secondary btn-block" onClick={getLocation}>
                            <MapPin size={20} />
                            {formData.gpsLocation 
                                ? `✅ ${t('location_captured')}`
                                : t('get_gps_location')
                            }
                        </button>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="form-step">
                        <h2>{t('land_crop_details')}</h2>
                        
                        <div className="form-group">
                            <label>{t('land_ownership')} *</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="own"
                                        checked={formData.ownership === 'own'}
                                        onChange={(e) => updateField('ownership', e.target.value)}
                                    />
                                    <span>{t('own')}</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="lease"
                                        checked={formData.ownership === 'lease'}
                                        onChange={(e) => updateField('ownership', e.target.value)}
                                    />
                                    <span>{t('lease')}</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('total_land_area')} *</label>
                                <input
                                    type="number"
                                    value={formData.landArea}
                                    onChange={(e) => updateField('landArea', e.target.value)}
                                    placeholder="0.0"
                                    step="0.1"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('unit')}</label>
                                <select
                                    value={formData.landUnit}
                                    onChange={(e) => updateField('landUnit', e.target.value)}
                                >
                                    <option value="acre">{t('acre')}</option>
                                    <option value="bigha">{t('bigha')}</option>
                                    <option value="hectare">{t('hectare')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('soil_type')} ({t('optional')})</label>
                            <select
                                value={formData.soilType}
                                onChange={(e) => updateField('soilType', e.target.value)}
                            >
                                <option value="">{t('select')}</option>
                                {SOIL_TYPES.map(type => (
                                    <option key={type} value={type}>{getLocT(activeLang, type)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('current_crop')} *</label>
                            <select
                                value={formData.currentCrop}
                                onChange={(e) => updateField('currentCrop', e.target.value)}
                            >
                                <option value="">{t('select_crop')}</option>
                                {CROPS.map(crop => (
                                    <option key={crop} value={crop}>{getLocT(activeLang, crop)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('planned_crop')} ({t('optional')})</label>
                            <select
                                value={formData.plannedCrop}
                                onChange={(e) => updateField('plannedCrop', e.target.value)}
                            >
                                <option value="">{t('select_crop')}</option>
                                {CROPS.map(crop => (
                                    <option key={crop} value={crop}>{getLocT(activeLang, crop)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="form-step">
                        <h2>{t('soil_sample_details')}</h2>
                        
                        <div className="form-group">
                            <label>{t('sample_collection_method')} *</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="collection"
                                        value="pickup"
                                        checked={formData.collectionMethod === 'pickup'}
                                        onChange={(e) => updateField('collectionMethod', e.target.value)}
                                    />
                                    <span>{t('home_pickup')}</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="collection"
                                        value="self"
                                        checked={formData.collectionMethod === 'self'}
                                        onChange={(e) => updateField('collectionMethod', e.target.value)}
                                    />
                                    <span>{t('self_submit')}</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('soil_photo')} ({t('optional')})</label>
                            <div className="photo-upload">
                                {formData.soilPhoto ? (
                                    <div className="photo-preview">
                                        <img src={formData.soilPhoto} alt="Soil" />
                                        <button onClick={() => updateField('soilPhoto', null)}>✕</button>
                                    </div>
                                ) : (
                                    <label className="upload-btn">
                                        <Camera size={32} />
                                        <span>{t('take_upload_photo')}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handlePhotoUpload}
                                            hidden
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('preferred_lab')} *</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="lab"
                                        value="govt"
                                        checked={formData.preferredLab === 'govt'}
                                        onChange={(e) => updateField('preferredLab', e.target.value)}
                                    />
                                    <span>{t('govt_lab')}</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="lab"
                                        value="auto"
                                        checked={formData.preferredLab === 'auto'}
                                        onChange={(e) => updateField('preferredLab', e.target.value)}
                                    />
                                    <span>{t('auto_assign')}</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.consent}
                                    onChange={(e) => updateField('consent', e.target.checked)}
                                />
                                <span>{t('consent_text')}</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className="form-navigation">
                {currentStep > 1 && (
                    <button className="btn-secondary" onClick={prevStep}>
                        <ArrowLeft size={20} />
                        {t('previous')}
                    </button>
                )}
                
                {currentStep < 4 ? (
                    <button className="btn-primary" onClick={nextStep}>
                        {t('next')}
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <button 
                        className="btn-primary" 
                        onClick={handleSubmit}
                        disabled={!formData.consent}
                    >
                        {t('submit')}
                        <Check size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
