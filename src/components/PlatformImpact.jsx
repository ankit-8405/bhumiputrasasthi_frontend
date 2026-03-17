import { useState, useEffect, useRef } from 'react';
import { Users, UserCheck, Stethoscope, Scale, TrendingUp, CheckCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './PlatformImpact.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Animated Counter Component
function AnimatedCounter({ value, duration = 1500, placeholder = '---' }) {
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const countRef = useRef(0);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        const endValue = parseInt(value) || 0;

        // If value is 0, show placeholder
        if (endValue === 0) {
            setCount(0);
            return;
        }

        setIsAnimating(true);
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * endValue);

            setCount(currentCount);
            countRef.current = currentCount;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(endValue);
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Show placeholder if count is 0
    if (count === 0 && parseInt(value) === 0) {
        return <span style={{ opacity: 0.5 }}>{placeholder}</span>;
    }

    return (
        <span className={isAnimating ? 'counting-animation' : ''}>
            {count.toLocaleString()}
        </span>
    );
}

export default function PlatformImpact() {
    const { lang } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchPlatformStats();
        // Refresh stats every 1 minute for dynamic feel
        const interval = setInterval(fetchPlatformStats, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchPlatformStats = async () => {
        try {
            setIsRefreshing(true);
            const response = await fetch(`${API_BASE}/platform/stats`);
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Platform stats fetch error:', error);
            // Use minimal fallback data to show system is working
            setStats({
                totalVisitors: 0,
                totalFarmers: 0,
                totalDoctors: 0,
                totalLawyers: 0,
                totalProblems: 0,
                problemsActive: 0,
                problemsInProcess: 0,
                problemsResolved: 0,
                averageRating: 0,
                resolutionRate: 0,
                lastSolved: 'डेटा लोड हो रहा है...',
                topDoctor: 'डेटा लोड हो रहा है...',
                satisfaction: 0
            });
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="platform-impact-loading">
                <div className="spinner-small"></div>
            </div>
        );
    }

    if (!stats) return null;

    const formatLastUpdated = () => {
        if (!lastUpdated) return '';
        const now = new Date();
        const diff = Math.floor((now - lastUpdated) / 1000);
        if (diff < 60) return `${diff} सेकंड पहले अपडेट`;
        const minutes = Math.floor(diff / 60);
        return `${minutes} मिनट पहले अपडेट`;
    };

    return (
        <div className="platform-impact-container">
            {/* Live Update Indicator */}
            {lastUpdated && (
                <div className="live-update-badge">
                    <span className={`live-dot ${isRefreshing ? 'pulsing' : ''}`}></span>
                    <span className="live-text">
                        {isRefreshing ? 'अपडेट हो रहा है...' : formatLastUpdated()}
                    </span>
                </div>
            )}

            {/* Platform Impact Stats */}
            <section className="impact-stats-section">
                <h2 className="section-title">
                    {lang === 'hi' ? '📊 प्लेटफॉर्म प्रभाव' : '📊 Platform Impact'}
                </h2>
                
                <div className="stats-grid">
                    <div className="stat-card stat-visitors animate-fade-in-up">
                        <div className="featured-badge">⭐ मुख्य</div>
                        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Users size={26} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                <AnimatedCounter value={stats.totalVisitors} />
                            </div>
                            <div className="stat-label">
                                {lang === 'hi' ? 'कुल विज़िटर' : 'Total Visitors'}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-farmers animate-fade-in-up delay-1">
                        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #52b788 0%, #74c69d 100%)' }}>
                            <UserCheck size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                <AnimatedCounter value={stats.totalFarmers} />
                            </div>
                            <div className="stat-label">
                                {lang === 'hi' ? 'कुल किसान' : 'Total Farmers'}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-doctors animate-fade-in-up delay-2">
                        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <Stethoscope size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                <AnimatedCounter value={stats.totalDoctors} />
                            </div>
                            <div className="stat-label">
                                {lang === 'hi' ? 'डॉक्टर' : 'Doctors'}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-lawyers animate-fade-in-up delay-3">
                        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <Scale size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                <AnimatedCounter value={stats.totalLawyers} />
                            </div>
                            <div className="stat-label">
                                {lang === 'hi' ? 'वकील' : 'Lawyers'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complaint Resolution Status */}
            <section className="resolution-section">
                <h2 className="section-title">
                    {lang === 'hi' ? '📋 किसान समस्या समाधान' : '📋 Farmer Problems Overview'}
                </h2>

                {/* Pie Chart Visualization */}
                <div className="pie-chart-container animate-fade-in-up delay-4">
                    <div className="pie-chart-wrapper">
                        <svg className="pie-chart" viewBox="0 0 200 200">
                            {/* Background circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="rgba(0,0,0,0.05)"
                                strokeWidth="40"
                            />
                            
                            {/* Calculate percentages */}
                            {(() => {
                                const total = stats.totalProblems || 1;
                                const resolved = stats.problemsResolved || 0;
                                const inProcess = stats.problemsInProcess || 0;
                                const active = stats.problemsActive || 0;
                                
                                const resolvedPercent = (resolved / total) * 100;
                                const inProcessPercent = (inProcess / total) * 100;
                                const activePercent = (active / total) * 100;
                                
                                const circumference = 2 * Math.PI * 80; // 502.65
                                const resolvedLength = (resolvedPercent / 100) * circumference;
                                const inProcessLength = (inProcessPercent / 100) * circumference;
                                const activeLength = (activePercent / 100) * circumference;
                                
                                return (
                                    <>
                                        {/* Resolved segment (green) - largest */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="url(#greenGradient)"
                                            strokeWidth="40"
                                            strokeDasharray={`${resolvedLength} ${circumference}`}
                                            strokeDashoffset="0"
                                            transform="rotate(-90 100 100)"
                                            className="pie-segment pie-resolved"
                                        />
                                        
                                        {/* In Process segment (blue) */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="url(#blueGradient)"
                                            strokeWidth="40"
                                            strokeDasharray={`${inProcessLength} ${circumference}`}
                                            strokeDashoffset={-resolvedLength}
                                            transform="rotate(-90 100 100)"
                                            className="pie-segment pie-process"
                                        />
                                        
                                        {/* Active segment (orange) */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="url(#orangeGradient)"
                                            strokeWidth="40"
                                            strokeDasharray={`${activeLength} ${circumference}`}
                                            strokeDashoffset={-(resolvedLength + inProcessLength)}
                                            transform="rotate(-90 100 100)"
                                            className="pie-segment pie-active"
                                        />
                                    </>
                                );
                            })()}
                            
                            {/* Gradients */}
                            <defs>
                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#16a34a" />
                                </linearGradient>
                                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                        </svg>
                        
                        {/* Center text */}
                        <div className="pie-center-text">
                            <div className="pie-percentage">
                                <AnimatedCounter value={stats.totalProblems} duration={1500} />
                            </div>
                            <div className="pie-label">
                                {lang === 'hi' ? 'कुल समस्याएं' : 'Total'}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="pie-legend">
                        <div className="legend-item">
                            <div className="legend-color legend-green"></div>
                            <div className="legend-text">
                                <span className="legend-value">{stats.problemsResolved.toLocaleString()}</span>
                                <span className="legend-label">
                                    {lang === 'hi' ? '✅ हल हो गए' : '✅ Resolved'}
                                </span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-blue"></div>
                            <div className="legend-text">
                                <span className="legend-value">{stats.problemsInProcess}</span>
                                <span className="legend-label">
                                    {lang === 'hi' ? '🔄 प्रक्रिया में' : '🔄 In Process'}
                                </span>
                            </div>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-orange"></div>
                            <div className="legend-text">
                                <span className="legend-value">{stats.problemsActive}</span>
                                <span className="legend-label">
                                    {lang === 'hi' ? '🔴 सक्रिय' : '🔴 Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="resolution-grid">
                    <div className="resolution-card card-active animate-fade-in-up delay-5">
                        <div className="resolution-icon">
                            <AlertTriangle size={28} />
                        </div>
                        <div className="resolution-content">
                            <div className="resolution-number">
                                <AnimatedCounter value={stats.problemsActive} duration={1500} />
                            </div>
                            <div className="resolution-label">
                                {lang === 'hi' ? 'सक्रिय' : 'Active'}
                            </div>
                            <div className="resolution-status status-orange">
                                🔴 {lang === 'hi' ? 'तुरंत ध्यान' : 'Urgent'}
                            </div>
                        </div>
                    </div>

                    <div className="resolution-card card-process animate-fade-in-up delay-6">
                        <div className="resolution-icon">
                            <Clock size={28} />
                        </div>
                        <div className="resolution-content">
                            <div className="resolution-number">
                                <AnimatedCounter value={stats.problemsInProcess} duration={1500} />
                            </div>
                            <div className="resolution-label">
                                {lang === 'hi' ? 'प्रक्रिया में' : 'In Process'}
                            </div>
                            <div className="resolution-status status-blue">
                                🔄 {lang === 'hi' ? 'जांच हो रही' : 'Under Review'}
                            </div>
                        </div>
                    </div>

                    <div className="resolution-card card-resolved animate-fade-in-up delay-7">
                        <div className="resolution-icon">
                            <CheckCircle size={28} />
                        </div>
                        <div className="resolution-content">
                            <div className="resolution-number">
                                <AnimatedCounter value={stats.problemsResolved} duration={1500} />
                            </div>
                            <div className="resolution-label">
                                {lang === 'hi' ? 'हल हो गए' : 'Resolved'}
                            </div>
                            <div className="resolution-status status-green">
                                ✅ {stats.resolutionRate}% {lang === 'hi' ? 'सफलता' : 'Success'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="resolution-progress animate-fade-in-up delay-8">
                    <div className="progress-header">
                        <span className="progress-label">
                            {lang === 'hi' ? 'समस्या समाधान दर' : 'Problem Resolution Rate'}
                        </span>
                        <span className="progress-percentage">{stats.resolutionRate}%</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${stats.resolutionRate}%` }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="trust-signals-section">
                <h2 className="section-title">
                    {lang === 'hi' ? '🔔 विश्वास संकेत' : '🔔 Trust Signals'}
                </h2>

                <div className="trust-signals">
                    <div className="trust-signal animate-fade-in-left delay-8">
                        <div className="trust-icon">✅</div>
                        <div className="trust-text">
                            <strong>{lang === 'hi' ? 'आखिरी समस्या हल:' : 'Last problem solved:'}</strong>
                            <span>{stats.lastSolved}</span>
                        </div>
                    </div>

                    <div className="trust-signal animate-fade-in-left delay-9">
                        <div className="trust-icon">🏆</div>
                        <div className="trust-text">
                            <strong>{lang === 'hi' ? 'इस हफ्ते के टॉप डॉक्टर:' : 'Top rated doctor:'}</strong>
                            <span>{stats.topDoctor}</span>
                        </div>
                    </div>

                    <div className="trust-signal animate-fade-in-left delay-10">
                        <div className="trust-icon">😊</div>
                        <div className="trust-text">
                            <strong>{lang === 'hi' ? 'किसान संतुष्टि:' : 'Farmer satisfaction:'}</strong>
                            <span>{stats.satisfaction}⭐ ({lang === 'hi' ? 'उत्कृष्ट' : 'Excellent'})</span>
                        </div>
                    </div>

                    <div className="trust-signal animate-fade-in-left delay-11">
                        <div className="trust-icon">📈</div>
                        <div className="trust-text">
                            <strong>{lang === 'hi' ? 'सक्रिय उपयोगकर्ता:' : 'Active users:'}</strong>
                            <span>
                                <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                {lang === 'hi' ? 'बढ़ रहा है' : 'Growing'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
