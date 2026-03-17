import React, { useState, useEffect, useCallback } from 'react';
import { X, Bell, Check, AlertTriangle, Info, MessageSquare, Calendar, TrendingUp, CloudRain } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './NotificationPanel.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NotificationPanel({ isOpen, onClose }) {
    const { t, lang } = useLanguage();
    const { token, socket } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setNotifications(data.notifications || []);
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isOpen) fetchNotifications();
    }, [isOpen, fetchNotifications]);

    // Real-time notifications via Socket.io
    useEffect(() => {
        if (!socket) return;
        const handler = (notification) => {
            setNotifications(prev => [notification, ...prev]);
        };
        socket.on('new:notification', handler);
        return () => socket.off('new:notification', handler);
    }, [socket]);

    const markAsRead = async (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        if (!token) return;
        try {
            await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch { /* silent */ }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        if (!token) return;
        try {
            await fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch { /* silent */ }
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => setNotifications([]);

    const getIcon = (type) => {
        const map = {
            weather: CloudRain,
            mandi: TrendingUp,
            consultation: MessageSquare,
            appointment: Calendar,
            info: Info,
            alert: AlertTriangle,
        };
        const IconComponent = map[type] || Bell;
        return <IconComponent size={20} />;
    };

    const getColor = (type) => {
        const map = {
            weather: '#ef5350',
            mandi: '#52b788',
            consultation: '#2196f3',
            appointment: '#ff9800',
            info: '#9c27b0',
            alert: '#ff5722',
        };
        return map[type] || '#4caf50';
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return lang === 'hi' ? 'अभी' : 'Just now';
        if (mins < 60) return lang === 'hi' ? `${mins} मिनट पहले` : `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return lang === 'hi' ? `${hrs} घंटे पहले` : `${hrs}h ago`;
        return lang === 'hi' ? `${Math.floor(hrs / 24)} दिन पहले` : `${Math.floor(hrs / 24)}d ago`;
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        if (filter === 'read') return n.is_read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!isOpen) return null;

    return (
        <>
            <div className="notification-overlay" onClick={onClose}></div>
            <div className="notification-panel">
                <div className="notif-header">
                    <div className="notif-title">
                        <Bell size={24} />
                        <h2>{t('notifications')}</h2>
                        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="notif-filters">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                        {t('all')} ({notifications.length})
                    </button>
                    <button className={`filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                        {t('unread')} ({unreadCount})
                    </button>
                    <button className={`filter-btn ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
                        {t('read')} ({notifications.length - unreadCount})
                    </button>
                </div>

                {notifications.length > 0 && (
                    <div className="notif-actions">
                        {unreadCount > 0 && (
                            <button className="action-btn" onClick={markAllAsRead}>
                                <Check size={16} /> {t('mark_all_read')}
                            </button>
                        )}
                        <button className="action-btn danger" onClick={clearAll}>
                            <X size={16} /> {t('clear_all')}
                        </button>
                    </div>
                )}

                <div className="notif-list">
                    {loading && (
                        <div className="empty-state">
                            <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
                        </div>
                    )}
                    {!loading && filteredNotifications.length === 0 && (
                        <div className="empty-state">
                            <Bell size={48} />
                            <p>{t('no_notifications')}</p>
                            <small>{t('new_notification')}</small>
                        </div>
                    )}
                    {!loading && filteredNotifications.map(notif => {
                        const color = getColor(notif.type);
                        return (
                            <div
                                key={notif.id}
                                className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                                onClick={() => markAsRead(notif.id)}
                            >
                                <div className="notif-icon" style={{ backgroundColor: `${color}15`, color }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-header-row">
                                        <h4>{notif.title}</h4>
                                        {!notif.is_read && <span className="unread-dot"></span>}
                                    </div>
                                    <p>{notif.message}</p>
                                    <span className="notif-time">{formatTime(notif.created_at)}</span>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
