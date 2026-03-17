import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './SoilTestDashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SoilTestDashboard() {
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('bps_token');

            // Fetch applications
            const appResponse = await fetch(`${API_BASE}/soil-test/applications/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const appData = await appResponse.json();
            if (appData.success) {
                setApplications(appData.applications);
            }

            // Fetch published reports
            const reportResponse = await fetch(`${API_BASE}/soil-test/reports/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const reportData = await reportResponse.json();
            if (reportData.success) {
                setReports(reportData.reports);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                hi: 'प्रतीक्षारत',
                en: 'Pending',
                color: '#FFA500',
                icon: Clock
            },
            assigned: {
                hi: 'आवंटित',
                en: 'Assigned',
                color: '#4A90E2',
                icon: Clock
            },
            sample_collected: {
                hi: 'नमूना संग्रहित',
                en: 'Sample Collected',
                color: '#52b788',
                icon: CheckCircle
            },
            testing: {
                hi: 'परीक्षण में',
                en: 'Testing',
                color: '#4A90E2',
                icon: TrendingUp
            },
            report_uploaded: {
                hi: 'रिपोर्ट अपलोड',
                en: 'Report Uploaded',
                color: '#52b788',
                icon: FileText
            },
            under_review: {
                hi: 'समीक्षा में',
                en: 'Under Review',
                color: '#FFA500',
                icon: Clock
            },
            completed: {
                hi: 'पूर्ण',
                en: 'Completed',
                color: '#52b788',
                icon: CheckCircle
            }
        };

        return statusMap[status] || statusMap.pending;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content soil-test-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1>{lang === 'hi' ? 'मिट्टी परीक्षण' : 'Soil Testing'}</h1>
                    <p>{lang === 'hi' ? 'अपने आवेदन और रिपोर्ट देखें' : 'View your applications and reports'}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/soil-test')}>
                    + {lang === 'hi' ? 'नया आवेदन' : 'New Application'}
                </button>
            </header>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-icon" style={{ background: '#4A90E2' }}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3>{applications.length}</h3>
                        <p>{lang === 'hi' ? 'कुल आवेदन' : 'Total Applications'}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon" style={{ background: '#FFA500' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3>{applications.filter(a => !['completed'].includes(a.status)).length}</h3>
                        <p>{lang === 'hi' ? 'प्रगति में' : 'In Progress'}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon" style={{ background: '#52b788' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3>{reports.length}</h3>
                        <p>{lang === 'hi' ? 'पूर्ण रिपोर्ट' : 'Completed Reports'}</p>
                    </div>
                </div>
            </div>

            {/* Recent Applications */}
            <section className="applications-section">
                <h2>{lang === 'hi' ? 'हाल के आवेदन' : 'Recent Applications'}</h2>
                
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={64} color="#666" />
                        <h3>{lang === 'hi' ? 'कोई आवेदन नहीं' : 'No Applications'}</h3>
                        <p>{lang === 'hi' ? 'नया मिट्टी परीक्षण आवेदन जमा करें' : 'Submit a new soil test application'}</p>
                        <button className="btn-primary" onClick={() => navigate('/soil-test')}>
                            {lang === 'hi' ? 'आवेदन करें' : 'Apply Now'}
                        </button>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map(app => {
                            const statusInfo = getStatusInfo(app.status);
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                                <div key={app.application_id} className="application-card">
                                    <div className="card-header">
                                        <div>
                                            <h3>{app.application_id}</h3>
                                            <p className="location">📍 {app.village}, {app.district}</p>
                                        </div>
                                        <div className="status-badge" style={{ background: statusInfo.color }}>
                                            <StatusIcon size={16} />
                                            <span>{statusInfo[lang]}</span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="info-row">
                                            <span>{lang === 'hi' ? 'भूमि क्षेत्र:' : 'Land Area:'}</span>
                                            <strong>{app.land_area} {app.land_unit}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>{lang === 'hi' ? 'फसल:' : 'Crop:'}</span>
                                            <strong>{app.current_crop}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>{lang === 'hi' ? 'आवेदन तिथि:' : 'Applied on:'}</span>
                                            <strong>{formatDate(app.created_at)}</strong>
                                        </div>
                                    </div>
                                    {app.status === 'completed' && (
                                        <button 
                                            className="btn-view-report"
                                            onClick={() => navigate(`/soil-test/report/${app.application_id}`)}
                                        >
                                            {lang === 'hi' ? 'रिपोर्ट देखें' : 'View Report'} →
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Published Reports */}
            {reports.length > 0 && (
                <section className="reports-section">
                    <h2>{lang === 'hi' ? 'प्रकाशित रिपोर्ट' : 'Published Reports'}</h2>
                    <div className="reports-grid">
                        {reports.map(report => (
                            <div 
                                key={report.application_id} 
                                className="report-card"
                                onClick={() => navigate(`/soil-test/report/${report.application_id}`)}
                            >
                                <div className="report-icon">
                                    <FileText size={32} />
                                </div>
                                <h3>{report.application_id}</h3>
                                <p>{report.village}, {report.district}</p>
                                <div className="health-status" style={{
                                    background: report.soil_health_status === 'excellent' ? '#52b788' :
                                               report.soil_health_status === 'good' ? '#4A90E2' :
                                               report.soil_health_status === 'moderate' ? '#FFA500' : '#E74C3C'
                                }}>
                                    {report.soil_health_status?.toUpperCase()}
                                </div>
                                <small>{formatDate(report.approved_at)}</small>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
