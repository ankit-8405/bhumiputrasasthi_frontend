import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Bell, Sun, Moon, Languages, LogIn, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationPanel from './NotificationPanel';
import logo from '../assets/logo.png';
import './Navbar.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLanguage } = useLanguage();
    const { user, token, socket } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUnreadCount((data.notifications || []).filter(n => !n.is_read).length);
            }
        } catch { /* silent */ }
    }, [token]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Real-time unread count update
    useEffect(() => {
        if (!socket) return;
        const handler = () => setUnreadCount(c => c + 1);
        socket.on('new:notification', handler);
        return () => socket.off('new:notification', handler);
    }, [socket]);

    const handleOpenNotifications = () => {
        setShowNotifications(true);
        setUnreadCount(0);
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="BhumiPutraSathi" className="logo-img" />
                    </div>
                    <div className="nav-actions">
                        <button className="icon-btn lang-btn" onClick={toggleLanguage} aria-label="Toggle Language" title="Change Language">
                            <Languages size={18} />
                            <span className="btn-text">{lang === 'hi' ? 'हिं' : 'EN'}</span>
                        </button>
                        <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Dark Mode">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <>
                                <button
                                    className="icon-btn notif-btn"
                                    onClick={handleOpenNotifications}
                                    aria-label="Notifications"
                                    title="Notifications"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                                </button>
                                <button
                                    className="icon-btn profile-btn"
                                    onClick={() => navigate('/profile')}
                                    aria-label="Profile"
                                    title={user.name || "Profile"}
                                >
                                    <User size={20} />
                                </button>
                            </>
                        ) : (
                            <button
                                className="login-btn"
                                onClick={() => navigate('/login')}
                                aria-label="Login"
                                title="Login"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 16px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: 'var(--primary-color, #2E7D32)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
            />

        </>
    );
}
