import React, { useState, useRef } from 'react';
import { ArrowRight, Phone, Loader, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import './Login.css';

// --- Inline Translations ---
const LOGIN_T = {
    welcome: { hi: 'भूमिपुत्र साथी में आपका स्वागत है', en: 'Welcome to BhumiPutra Sathi', bn: 'ভূমিপুত্র সাথীতে স্বাগতম', or: 'ଭୂମିପୁତ୍ର ସାଥୀକୁ ସ୍ୱାଗତ', mai: 'भूमिपुत्र साथी मे अहाँक स्वागत अछि', pa: 'ਭੂਮੀਪੁਤਰ ਸਾਥੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ', mr: 'भूमिपुत्र साथी मध्ये आपले स्वागत आहे', gu: 'ભૂમિપુત્ર સાથીમાં આપનું સ્વાગત છે', ta: 'பூமிபுத்ரா சாதிக்கு வரவேற்கிறோம்', te: 'భూమిపుత్ర సాథికి స్వాగతం' },
    tagline: { hi: 'किसानों का सच्चा डिजिटल दोस्त', en: "Farmer's true digital friend", bn: 'কৃষকের সত্যিকারের ডিজিটাল বন্ধু', or: 'କୃଷକଙ୍କ ପ୍ରକୃତ ଡିଜିଟାଲ୍ ସାଙ୍ଗ', mai: 'किसानक सच्चा डिजिटल दोस्त', pa: 'ਕਿਸਾਨ ਦਾ ਸੱਚਾ ਡਿਜੀਟਲ ਦੋਸਤ', mr: 'शेतकऱ्यांचा खरा डिजिटल मित्र', gu: 'ખેડૂતનો સાચો ડિજિટલ મિત્ર', ta: 'விவசாயியின் உண்மையான டிஜிட்டல் நண்பன்', te: 'రైతు నిజమైన డిజిటల్ స్నేహితుడు' },
    mobile_lbl: { hi: 'मोबाइल नंबर दर्ज करें', en: 'Enter mobile number', bn: 'মোবাইল নম্বর লিখুন', or: 'ମୋବାଇଲ୍ ନମ୍ବର ଲେଖନ୍ତୁ', mai: 'मोबाइल नंबर दर्ज करू', pa: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ', mr: 'मोबाईल नंबर टाका', gu: 'મોબાઈલ નંબર દાખલ કરો', ta: 'மொபைல் எண்ணை உள்ளிடவும்', te: 'మొబైల్ నంబర్ నమోదు చేయండి' },
    send_otp: { hi: 'ओटीपी प्राप्त करें', en: 'Get OTP', bn: 'ওটিপি (OTP) পান', or: 'ଓଟିପି ପାଆନ୍ତୁ', mai: 'ओटीपी प्राप्त करू', pa: 'OTP ਪ੍ਰਾਪਤ ਕਰੋ', mr: 'OTP मिळवा', gu: 'OTP મેળવો', ta: 'OTP பெறவும்', te: 'OTP పొందండి' },
    otp_sent: { hi: 'ओटीपी भेजा गया:', en: 'OTP sent to:', bn: 'OTP পাঠানো হয়েছে:', or: 'ଓଟିପି ପଠାଯାଇଛି:', mai: 'ओटीपी पठाल गेल:', pa: 'OTP ਭੇਜਿਆ ਗਿਆ:', mr: 'OTP पाठवला:', gu: 'OTP મોકલ્યો:', ta: 'OTP அனுப்பப்பட்டது:', te: 'OTP పంపబడింది:' },
    enter_otp: { hi: '4 अंकों का ओटीपी दर्ज करें', en: 'Enter 4-digit OTP', bn: '৪-অঙ্কের ওটিপি লিখুন', or: '୪-ଅଙ୍କ ବିଶିଷ୍ଟ ଓଟିପି ଲେଖନ୍ତୁ', mai: '४-अंकक ओटीपी दर्ज करू', pa: '4-ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ', mr: '4-अंकी OTP टाका', gu: '4-અંકનો OTP દાખલ કરો', ta: '4 இலக்க OTP ஐ உள்ளிடவும்', te: '4-అంకెల OTP నమోదు చేయండి' },
    verify_login: { hi: 'सत्यापित करें और लॉगिन करें', en: 'Verify & Login', bn: 'যাচাই করুন এবং লগইন করুন', or: 'ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଲଗଇନ୍ କରନ୍ତୁ', mai: 'सत्यापित करू आ लॉगिन करू', pa: 'ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਲਾਗਇਨ ਕਰੋ', mr: 'सत्यापित करा आणि लॉगिन करा', gu: 'ચકાસો અને લૉગિન કરો', ta: 'சரிபார்த்து உள்நுழையவும்', te: 'ధృవీకరించి లాగిన్ అవ్వండి' },
    change_number: { hi: 'नंबर बदलें', en: 'Change Number', bn: 'নম্বর পরিবর্তন করুন', or: 'ନମ୍ବର ପରିବର୍ତ୍ତନ କରନ୍ତୁ', mai: 'नंबर बदलू', pa: 'ਨੰਬਰ ਬਦਲੋ', mr: 'नंबर बदला', gu: 'નંબર બદલો', ta: 'எண்ணை மாற்றவும்', te: 'నెంబర్ మార్చండి' },
    terms: { hi: 'लॉगिन करके, आप नियम और शर्तों से सहमत हैं।', en: 'By logging in, you agree to the Terms & Conditions.', bn: 'লগইন করে, আপনি নিয়ম ও শর্তাবলীতে সম্মত হন।', or: 'ଲଗଇନ୍ କରି, ଆପଣ ନିୟମ ଏବଂ ସର୍ତ୍ତାବଳୀରେ ସମ୍ମତ ଅଟନ୍ତି।', mai: 'लॉगिन ककए, अहाँ नियम आ शर्तसँ सहमत छी।', pa: 'ਲਾਗਇਨ ਕਰਕੇ, ਤੁਸੀਂ ਨਿਯਮਾਂ ਅਤੇ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹੋ।', mr: 'लॉगिन करून, तुम्ही नियम आणि अटींना सहमती देता.', gu: 'લૉગિન કરીને, તમે નિયમો અને શરતો સાથે સંમત થાઓ છો.', ta: 'உள்நுழைவதன் மூலம், நீங்கள் விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கிறீர்கள்.', te: 'లాగిన్ చేయడం ద్వారా, మీరు నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నారు.' },
    invalid_mobile: { hi: 'कृपया सही 10 अंकों का नंबर दर्ज करें', en: 'Please enter a valid 10-digit number', bn: 'দয়া করে একটি বৈধ ১০-সংখ্যার নম্বর লিখুন', or: 'ଦୟାକରି ଏକ ବୈଧ ୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ନମ୍ବର ଲେଖନ୍ତୁ', mai: 'कृपा ककए सही १० अंकक नंबर दर्ज करू', pa: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕਾਂ ਦਾ ਨੰਬਰ ਦਰਜ ਕਰੋ', mr: 'कृपया वैध 10-अंकी क्रमांक टाका', gu: 'કૃપા કરીને માન્ય 10-અંકનો નંબર દાખલ કરો', ta: 'சரியான 10 இலக்க எண்ணை உள்ளிடவும்', te: 'దయచేసి సరైన 10 అంకెల సంఖ్యను నమోదు చేయండి' },
    invalid_otp: { hi: 'कृपया 4 अंकों का ओटीपी दर्ज करें', en: 'Please enter 4-digit OTP', bn: 'দয়া করে ৪-অঙ্কের ওটিপি লিখুন', or: 'ଦୟାକରି ୪-ଅଙ୍କ ବିଶିଷ୍ଟ ଓଟିପି ଲେଖନ୍ତୁ', mai: 'कृपा ककए ४ अंकक ओटीपी दर्ज करू', pa: 'ਕਿਰਪਾ ਕਰਕੇ 4-ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ', mr: 'कृपया 4-अंकी OTP टाका', gu: 'કૃપા કરીને 4-અંકનો OTP દાખલ કરો', ta: '4 இலக்க OTP ஐ உள்ளிடவும்', te: 'దయచేసి 4 అంకెల OTP ని నమోదు చేయండి' }
};

const getT = (lang, key) => (LOGIN_T[key] && LOGIN_T[key][lang]) || (LOGIN_T[key] && LOGIN_T[key]['en']) || key;

export default function Login() {
    const { lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const navigate = useNavigate();
    const { login, sendOtp } = useAuth();

    const [mobile, setMobile] = useState('');
    const [step, setStep] = useState('MOBILE'); // 'MOBILE' | 'OTP'
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // OTP Array for 4 split inputs
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (mobile.length === 10) {
            setLoading(true);
            const res = await sendOtp(mobile);
            setLoading(false);

            if (res.success) {
                setStep('OTP');
                if (res.otp) alert(`[DEV MODE] Your API Mock OTP is: ${res.otp}`);
                // Focus first OTP input after switching step
                setTimeout(() => inputRefs[0].current?.focus(), 100);
            } else {
                setErrorMsg(res.message || 'Failed to send OTP');
            }
        } else {
            setErrorMsg(getT(activeLang, 'invalid_mobile'));
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Auto focus previous input on backspace
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
        if (e.key === 'Enter') {
            handleVerifyOtp(e);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg('');
        const otpStr = otpValues.join('');
        
        if (otpStr.length === 4) {
            setLoading(true);
            const res = await login(mobile, otpStr);
            setLoading(false);

            if (res.success) {
                navigate('/');
            } else {
                setErrorMsg(res.message || 'Login Failed. Invalid OTP.');
            }
        } else {
            setErrorMsg(getT(activeLang, 'invalid_otp'));
        }
    };

    const handleBack = () => {
        setStep('MOBILE');
        setOtpValues(['', '', '', '']);
        setErrorMsg('');
    };

    return (
        <div className="login-screen-wrapper">
            {/* Animated Background Blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            <div className="login-glass-card animate-slide-up">
                
                <div className="login-brand-header">
                    <div className="logo-container animate-bounce-in delay-1">
                        <img src={logo} alt="BhumiPutra Sathi" className="premium-logo" />
                    </div>
                    <h1 className="welcome-text animate-fade-in-up delay-2">
                        {getT(activeLang, 'welcome')}
                    </h1>
                    <p className="tagline-text animate-fade-in-up delay-3">
                        🌱 {getT(activeLang, 'tagline')} 🚜
                    </p>
                </div>

                <div className="login-features-row">
                    <div className="login-feature-badge">🌾 <span>Mandi Prices</span></div>
                    <div className="login-feature-badge">🌿 <span>Crop Advisory</span></div>
                    <div className="login-feature-badge">👨‍⚕️ <span>Expert Help</span></div>
                </div>

                <div className="login-interactive-area animate-fade-in-up delay-4">
                    {errorMsg && <div className="login-error-toast">{errorMsg}</div>}

                    {step === 'MOBILE' ? (
                        <form onSubmit={handleSendOtp} className="premium-form">
                            <div className="input-field-wrapper">
                                <Phone size={20} className="field-icon" />
                                <span className="country-code">+91</span>
                                <input
                                    type="tel"
                                    placeholder={getT(activeLang, 'mobile_lbl')}
                                    value={mobile}
                                    onChange={(e) => {
                                        setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                                        setErrorMsg('');
                                    }}
                                    className="premium-input"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="premium-btn primary-btn mt-4" disabled={loading}>
                                {loading ? <Loader className="spin" size={24} /> : (
                                    <>
                                        <span>{getT(activeLang, 'send_otp')}</span>
                                        <ArrowRight size={20} className="btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="premium-form otp-form">
                            <div className="otp-header-row">
                                <button type="button" className="back-icon-btn" onClick={handleBack} disabled={loading}>
                                    <ChevronLeft size={24} />
                                </button>
                                <p className="otp-sent-info">
                                    {getT(activeLang, 'otp_sent')} <strong>+91 {mobile}</strong>
                                </p>
                            </div>

                            <p className="otp-prompt text-center">{getT(activeLang, 'enter_otp')}</p>
                            
                            <div className="otp-boxes-container">
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="tel"
                                        maxLength={1}
                                        value={digit}
                                        className="otp-box-input"
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        disabled={loading}
                                    />
                                ))}
                            </div>

                            <button onClick={handleVerifyOtp} className="premium-btn primary-btn mt-4" disabled={loading || otpValues.join('').length < 4}>
                                {loading ? <Loader className="spin" size={24} /> : getT(activeLang, 'verify_login')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="login-footer-terms animate-fade-in delay-5">
                    <p>{getT(activeLang, 'terms')}</p>
                </div>
            </div>
        </div>
    );
}
