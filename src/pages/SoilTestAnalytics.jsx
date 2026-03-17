import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './SoilTestAnalytics.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SoilTestAnalytics() {
    const { lang } = useLanguage();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`${API_BASE}/soil-test/analytics/public`);
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Fetch analytics error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="page-content">
                <div className="error-state">
                    <p>{lang === 'hi' ? 'डेटा लोड नहीं हो सका' : 'Failed to load data'}</p>
                </div>
            </div>
        );
    }

    const calculatePercentage = (value, total) => {
        return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    };

    return (
        <div className="page-content analytics-page">
            {/* Header */}
            <header className="analytics-header">
                <div className="header-icon">
                    <BarChart3 size={32} />
                </div>
                <div>
                    <h1>{lang === 'hi' ? 'मिट्टी परीक्षण विश्लेषण' : 'Soil Testing Analytics'}</h1>
                    <p>{lang === 'hi' ? 'सार्वजनिक डैशबोर्ड - वास्तविक समय डेटा' : 'Public Dashboard - Real-time Data'}</p>
                </div>
            </header>

            {/* Main Stats */}
            <div className="main-stats">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <FileText size={40} />
                    </div>
                    <div className="stat-content">
                        <h2>{analytics.total_applications}</h2>
                        <p>{lang === 'hi' ? 'कुल आवेदन' : 'Total Applications'}</p>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <Clock size={40} />
                    </div>
                    <div className="stat-content">
                        <h2>{analytics.in_process}</h2>
                        <p>{lang === 'hi' ? 'प्रगति में' : 'In Process'}</p>
                        <small>{calculatePercentage(analytics.in_process, analytics.total_applications)}%</small>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <CheckCircle size={40} />
                    </div>
                    <div className="stat-content">
                        <h2>{analytics.completed}</h2>
                        <p>{lang === 'hi' ? 'पूर्ण' : 'Completed'}</p>
                        <small>{calculatePercentage(analytics.completed, analytics.total_applications)}%</small>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <section className="breakdown-section">
                <h2>{lang === 'hi' ? 'विस्तृत विवरण' : 'Detailed Breakdown'}</h2>
                
                <div className="breakdown-grid">
                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot pending"></span>
                            <h3>{lang === 'hi' ? 'प्रतीक्षारत' : 'Pending'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.pending}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill pending"
                                style={{ width: `${calculatePercentage(analytics.breakdown.pending, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot assigned"></span>
                            <h3>{lang === 'hi' ? 'आवंटित' : 'Assigned'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.assigned}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill assigned"
                                style={{ width: `${calculatePercentage(analytics.breakdown.assigned, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot collected"></span>
                            <h3>{lang === 'hi' ? 'नमूना संग्रहित' : 'Sample Collected'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.sample_collected}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill collected"
                                style={{ width: `${calculatePercentage(analytics.breakdown.sample_collected, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot testing"></span>
                            <h3>{lang === 'hi' ? 'परीक्षण में' : 'Testing'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.testing}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill testing"
                                style={{ width: `${calculatePercentage(analytics.breakdown.testing, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot uploaded"></span>
                            <h3>{lang === 'hi' ? 'रिपोर्ट अपलोड' : 'Report Uploaded'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.report_uploaded}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill uploaded"
                                style={{ width: `${calculatePercentage(analytics.breakdown.report_uploaded, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot review"></span>
                            <h3>{lang === 'hi' ? 'समीक्षा में' : 'Under Review'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.under_review}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill review"
                                style={{ width: `${calculatePercentage(analytics.breakdown.under_review, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="item-header">
                            <span className="status-dot completed"></span>
                            <h3>{lang === 'hi' ? 'पूर्ण' : 'Completed'}</h3>
                        </div>
                        <div className="item-value">{analytics.breakdown.completed}</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill completed"
                                style={{ width: `${calculatePercentage(analytics.breakdown.completed, analytics.total_applications)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Rate */}
            <section className="success-rate-section">
                <h2>{lang === 'hi' ? 'सफलता दर' : 'Success Rate'}</h2>
                <div className="success-rate-card">
                    <div className="rate-circle">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2d35" strokeWidth="10" />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="45" 
                                fill="none" 
                                stroke="#52b788" 
                                strokeWidth="10"
                                strokeDasharray={`${calculatePercentage(analytics.completed, analytics.total_applications) * 2.827} 282.7`}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="rate-text">
                            <h3>{calculatePercentage(analytics.completed, analytics.total_applications)}%</h3>
                            <p>{lang === 'hi' ? 'पूर्ण' : 'Complete'}</p>
                        </div>
                    </div>
                    <div className="rate-info">
                        <p>{lang === 'hi' ? 
                            `${analytics.completed} आवेदनों में से ${analytics.total_applications} पूर्ण हो चुके हैं` :
                            `${analytics.completed} out of ${analytics.total_applications} applications completed`
                        }</p>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <div className="analytics-footer">
                <p>
                    {lang === 'hi' ? 
                        '📊 यह डेटा वास्तविक समय में अपडेट होता है। कोई व्यक्तिगत जानकारी प्रदर्शित नहीं की जाती है।' :
                        '📊 This data updates in real-time. No personal information is displayed.'
                    }
                </p>
            </div>
        </div>
    );
}
