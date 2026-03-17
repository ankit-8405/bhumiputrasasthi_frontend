import { Home, LayoutGrid, Users, User, Bot } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DashboardBottomSheet from './DashboardBottomSheet';
import './BottomTabs.css';

export default function BottomTabs() {
    const { t, lang } = useLanguage();
    const location = useLocation();
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    // Force CSS reload on mount
    useEffect(() => {
        // Add a class to body to ensure styles are applied
        document.body.classList.add('bottom-tabs-loaded');
        return () => {
            document.body.classList.remove('bottom-tabs-loaded');
        };
    }, []);

    const tabs = [
        {
            id: 'dashboard',
            path: '/dashboard',
            icon: LayoutGrid,
            label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
        },
        {
            id: 'community',
            path: '/community',
            icon: Users,
            label: t('nav_community'),
        },
        {
            id: 'home',
            path: '/',
            icon: Home,
            label: 'Home',
            isSpecial: true,
        },
        {
            id: 'ai',
            path: '/chat',
            icon: Bot,
            label: 'AI',
        },
        {
            id: 'profile',
            path: '/profile',
            icon: User,
            label: t('nav_profile'),
        },
    ];

    return (
        <div className="bottom-tabs-container">
            <nav className="bottom-tabs-modern" role="navigation" aria-label="Main Navigation">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    const Icon = tab.icon;

                    // Dashboard tab opens bottom sheet
                    if (tab.id === 'dashboard') {
                        return (
                            <button
                                key={tab.id}
                                className={`nav-tab ${isActive ? 'active' : ''}`}
                                onClick={() => setIsDashboardOpen(true)}
                            >
                                <div className="tab-icon">
                                    <Icon />
                                </div>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        );
                    }

                    // Special tab (Community/Plus)
                    if (tab.isSpecial) {
                        return (
                            <NavLink
                                key={tab.id}
                                to={tab.path}
                                state={tab.id === 'community' ? { openCreate: true } : null}
                                className={({ isActive }) =>
                                    `nav-tab ${isActive ? 'active' : ''} home-tab`
                                }
                            >
                                <div className="home-icon-wrapper">
                                    <Icon size={32} strokeWidth={2} />
                                </div>
                            </NavLink>
                        );
                    }

                    // Other tabs
                    return (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            className={({ isActive }) =>
                                `nav-tab ${isActive ? 'active' : ''}`
                            }
                        >
                            <div className="tab-icon">
                                <Icon />
                            </div>
                            <span className="tab-label">{tab.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Dashboard Bottom Sheet */}
            <DashboardBottomSheet
                isOpen={isDashboardOpen}
                onClose={() => setIsDashboardOpen(false)}
            />
        </div>
    );
}
