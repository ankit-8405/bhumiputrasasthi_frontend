import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TrendingUp, TestTube, Sprout, Droplets, 
    FileText, Tractor, Package, Stethoscope, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './DashboardBottomSheet.css';

export default function DashboardBottomSheet({ isOpen, onClose }) {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const services = [
        {
            id: 'mandi',
            icon: TrendingUp,
            title: lang === 'hi' ? 'मंडी भाव' : 'Mandi Prices',
            subtitle: lang === 'hi' ? 'लाइव फसल के दाम' : 'Live crop prices',
            color: '#4a9eff',
            bgColor: 'rgba(74, 158, 255, 0.12)',
            path: '/mandi'
        },
        {
            id: 'soil',
            icon: TestTube,
            title: lang === 'hi' ? 'मिट्टी परीक्षण' : 'Soil Test',
            subtitle: lang === 'hi' ? 'मिट्टी की जांच' : 'Soil testing',
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.12)',
            path: '/soil-test'
        },
        {
            id: 'crop',
            icon: Sprout,
            title: lang === 'hi' ? 'फसल सलाह' : 'Crop Advisory',
            subtitle: lang === 'hi' ? 'फसल की देखभाल' : 'Crop care tips',
            color: '#52b788',
            bgColor: 'rgba(82, 183, 136, 0.12)',
            path: '/crop-advisory'
        },
        {
            id: 'irrigation',
            icon: Droplets,
            title: lang === 'hi' ? 'सिंचाई और पानी' : 'Irrigation & Water',
            subtitle: lang === 'hi' ? 'पानी प्रबंधन' : 'Water management',
            color: '#4a9eff',
            bgColor: 'rgba(74, 158, 255, 0.12)',
            path: '/irrigation'
        },
        {
            id: 'schemes',
            icon: FileText,
            title: lang === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes',
            subtitle: lang === 'hi' ? 'योजनाओं की जानकारी' : 'Scheme information',
            color: '#fb923c',
            bgColor: 'rgba(251, 146, 60, 0.12)',
            path: '/govt-schemes'
        },
        {
            id: 'machinery',
            icon: Tractor,
            title: lang === 'hi' ? 'मशीनरी और उपकरण' : 'Machinery & Equipment',
            subtitle: lang === 'hi' ? 'किराए पर उपकरण' : 'Rent equipment',
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.12)',
            path: '/machinery'
        },
        {
            id: 'storage',
            icon: Package,
            title: lang === 'hi' ? 'भंडारण और बाजार' : 'Storage & Market',
            subtitle: lang === 'hi' ? 'फसल भंडारण' : 'Crop storage',
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.12)',
            path: '/storage'
        },
        {
            id: 'expert',
            icon: Stethoscope,
            title: lang === 'hi' ? 'विशेषज्ञ सहायता' : 'Expert Help',
            subtitle: lang === 'hi' ? 'डॉक्टर से बात करें' : 'Talk to doctor',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.12)',
            path: '/doctors'
        }
    ];

    const handleServiceClick = (service) => {
        if (service.path !== '#') {
            onClose();
            setTimeout(() => {
                navigate(service.path);
            }, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`dashboard-backdrop ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className={`dashboard-bottom-sheet ${isOpen ? 'open' : ''}`}>
                {/* Drag Handle */}
                <div className="sheet-handle-container">
                    <div className="sheet-handle" />
                </div>

                {/* Header */}
                <div className="sheet-header">
                    <div className="sheet-header-content">
                        <h2 className="sheet-title">
                            📊 {lang === 'hi' ? 'किसान डैशबोर्ड' : 'Kisan Dashboard'}
                        </h2>
                        <p className="sheet-subtitle">
                            {lang === 'hi' 
                                ? 'अपनी सभी सेवाएं एक जगह से प्रबंधित करें' 
                                : 'Manage all your services from one place'}
                        </p>
                    </div>
                    <button className="sheet-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Services Grid */}
                <div className="sheet-services-grid">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="sheet-service-card animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => handleServiceClick(service)}
                            >
                                <div 
                                    className="sheet-service-icon"
                                    style={{ 
                                        backgroundColor: service.bgColor,
                                        color: service.color 
                                    }}
                                >
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                <div className="sheet-service-info">
                                    <h3 className="sheet-service-title">{service.title}</h3>
                                    <p className="sheet-service-subtitle">{service.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
