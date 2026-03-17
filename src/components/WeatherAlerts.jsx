import { useState, useEffect } from 'react';
import { X, Zap, Snowflake, Flame, CloudRain, Wind, CloudLightning, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './WeatherAlerts.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function WeatherAlerts() {
    const { lang } = useLanguage();
    const [alerts, setAlerts] = useState([]);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    const fetchWeatherAlerts = async () => {
        try {
            const lat = localStorage.getItem('userLat');
            const lon = localStorage.getItem('userLon');
            
            if (!lat || !lon) return;

            const response = await fetch(
                `${API_BASE}/weather/alerts?lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            
            if (data.success && data.alerts) {
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Weather alerts fetch error:', error);
        }
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchWeatherAlerts();
        // Refresh alerts every 15 minutes
        const interval = setInterval(fetchWeatherAlerts, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const dismissAlert = (alertId) => {
        setDismissedAlerts([...dismissedAlerts, alertId]);
    };

    const getAlertConfig = (type) => {
        const configs = {
            lightning: {
                icon: Zap,
                color: 'purple',
                bgColor: 'rgba(147, 51, 234, 0.15)',
                borderColor: '#9333ea',
                glowColor: 'rgba(147, 51, 234, 0.4)',
                title: lang === 'hi' ? '⚡ बिजली गिरने का खतरा' : '⚡ Lightning Strike Warning',
                message: lang === 'hi' 
                    ? 'अगले 30 मिनट में आपके क्षेत्र में बिजली गिरने की संभावना है, घर के अंदर रहें।'
                    : 'Lightning strike possible in your area in next 30 minutes, stay indoors.',
                action: lang === 'hi' 
                    ? 'इलेक्ट्रॉनिक उपकरण बंद करें और पेड़ों के नीचे न खड़े हों।'
                    : 'Turn off electronic devices and avoid standing under trees.'
            },
            frost: {
                icon: Snowflake,
                color: 'blue',
                bgColor: 'rgba(59, 130, 246, 0.15)',
                borderColor: '#3b82f6',
                glowColor: 'rgba(59, 130, 246, 0.4)',
                title: lang === 'hi' ? '❄️ पाला पड़ने की चेतावनी' : '❄️ Frost Warning',
                message: lang === 'hi'
                    ? 'आज रात पाला पड़ने की संभावना है, फसल को पानी देकर बचाएं।'
                    : 'Frost expected tonight, protect crops by watering.',
                action: lang === 'hi'
                    ? 'फसल को हल्का पानी दें और धुआं करें।'
                    : 'Lightly water crops and create smoke cover.'
            },
            heatwave: {
                icon: Flame,
                color: 'orange',
                bgColor: 'rgba(249, 115, 22, 0.15)',
                borderColor: '#f97316',
                glowColor: 'rgba(249, 115, 22, 0.4)',
                title: lang === 'hi' ? '🔥 लू चलने की चेतावनी' : '🔥 Heatwave Warning',
                message: lang === 'hi'
                    ? 'दोपहर में तापमान 45°C जाएगा, पशुओं को छाँव में रखें।'
                    : 'Temperature will reach 45°C in afternoon, keep animals in shade.',
                action: lang === 'hi'
                    ? 'दोपहर 12-4 बजे बाहर काम न करें और पानी पीते रहें।'
                    : 'Avoid outdoor work between 12-4 PM and stay hydrated.'
            },
            heavyrain: {
                icon: CloudRain,
                color: 'darkblue',
                bgColor: 'rgba(30, 64, 175, 0.15)',
                borderColor: '#1e40af',
                glowColor: 'rgba(30, 64, 175, 0.4)',
                title: lang === 'hi' ? '🌧️ भारी बारिश की चेतावनी' : '🌧️ Heavy Rain Warning',
                message: lang === 'hi'
                    ? 'भारी बारिश की चेतावनी, खेत में पानी निकासी (drainage) का इंतजाम करें।'
                    : 'Heavy rain warning, ensure proper drainage in fields.',
                action: lang === 'hi'
                    ? 'नालियां साफ करें और फसल को सहारा दें।'
                    : 'Clear drains and provide support to crops.'
            },
            wind: {
                icon: Wind,
                color: 'gray',
                bgColor: 'rgba(107, 114, 128, 0.15)',
                borderColor: '#6b7280',
                glowColor: 'rgba(107, 114, 128, 0.4)',
                title: lang === 'hi' ? '💨 तेज हवा की चेतावनी' : '💨 Strong Wind Warning',
                message: lang === 'hi'
                    ? 'तेज हवा चलने की संभावना, स्प्रे न करें।'
                    : 'Strong winds expected, avoid spraying.',
                action: lang === 'hi'
                    ? 'फसल को सहारा दें और ढीली चीजें बांध दें।'
                    : 'Support crops and secure loose items.'
            },
            storm: {
                icon: CloudLightning,
                color: 'darkpurple',
                bgColor: 'rgba(109, 40, 217, 0.15)',
                borderColor: '#6d28d9',
                glowColor: 'rgba(109, 40, 217, 0.4)',
                title: lang === 'hi' ? '⛈️ तूफान की चेतावनी' : '⛈️ Storm Warning',
                message: lang === 'hi'
                    ? 'तूफान आने की संभावना, सुरक्षित स्थान पर रहें।'
                    : 'Storm approaching, stay in safe location.',
                action: lang === 'hi'
                    ? 'घर के अंदर रहें और खिड़कियां बंद करें।'
                    : 'Stay indoors and close windows.'
            }
        };

        return configs[type] || configs.heatwave;
    };

    const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

    if (activeAlerts.length === 0) return null;

    return (
        <>
            {/* Scrolling Ticker */}
            <div className="weather-alert-ticker">
                <div className="ticker-content">
                    <AlertTriangle size={16} className="ticker-icon" />
                    <span className="ticker-text">
                        {activeAlerts.map((alert, index) => {
                            const config = getAlertConfig(alert.type);
                            return (
                                <span key={alert.id}>
                                    {config.title}
                                    {index < activeAlerts.length - 1 && ' • '}
                                </span>
                            );
                        })}
                    </span>
                </div>
            </div>

            {/* Sticky Alert Cards */}
            <div className="weather-alerts-container">
                {activeAlerts.map((alert) => {
                    const config = getAlertConfig(alert.type);
                    const Icon = config.icon;

                    return (
                        <div
                            key={alert.id}
                            className={`weather-alert-card alert-${config.color}`}
                            style={{
                                background: config.bgColor,
                                borderLeftColor: config.borderColor,
                                boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15), 0 0 40px ${config.glowColor}`
                            }}
                        >
                            <div className="alert-icon-wrapper" style={{ background: config.borderColor }}>
                                <Icon size={28} className="alert-icon-main" />
                            </div>

                            <div className="alert-content">
                                <div className="alert-header">
                                    <h3 className="alert-title">{config.title}</h3>
                                    <button
                                        className="alert-dismiss"
                                        onClick={() => dismissAlert(alert.id)}
                                        aria-label="Dismiss alert"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <p className="alert-message">{config.message}</p>

                                <div className="alert-action">
                                    <div className="action-icon">💡</div>
                                    <p className="action-text">{config.action}</p>
                                </div>

                                {alert.validUntil && (
                                    <div className="alert-validity">
                                        <span className="validity-label">
                                            {lang === 'hi' ? 'वैध:' : 'Valid until:'}
                                        </span>
                                        <span className="validity-time">
                                            {new Date(alert.validUntil).toLocaleTimeString(
                                                lang === 'hi' ? 'hi-IN' : 'en-IN',
                                                { hour: '2-digit', minute: '2-digit' }
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
