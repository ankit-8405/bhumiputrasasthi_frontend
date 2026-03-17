import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef(null);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        const storedUser = localStorage.getItem('bps_user');
        const storedToken = localStorage.getItem('bps_token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch {
                localStorage.removeItem('bps_user');
                localStorage.removeItem('bps_token');
            }
        }
        setIsLoading(false);
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Connect socket when user logs in
    useEffect(() => {
        if (user && token) {
            connectSocket(user.id);
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect?.();
                socketRef.current = null;
            }
        };
    }, [user?.id, token]);

    const connectSocket = async (userId) => {
        try {
            const { io } = await import('socket.io-client');
            if (socketRef.current) socketRef.current.disconnect();
            const socket = io(SOCKET_URL, {
                reconnection: true,
                reconnectionDelay: 1000,
                auth: { token }
            });
            socket.on('connect', () => {
                socket.emit('join', userId);
                if (import.meta.env.DEV) console.log('Socket connected');
            });
            socket.on('disconnect', () => {
                if (import.meta.env.DEV) console.log('Socket disconnected');
            });
            socketRef.current = socket;
        } catch {
            if (import.meta.env.DEV) console.log('Socket not available');
        }
    };

    const sendOtp = async (mobile) => {
        try {
            const response = await fetch(`${API_BASE}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile })
            });
            return await response.json();
        } catch {
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    };

    const login = async (mobile, otp, name) => {
        try {
            const response = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp, name })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('bps_user', JSON.stringify(data.user));
                localStorage.setItem('bps_token', data.token);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const refreshProfile = async () => {
        try {
            const currentToken = localStorage.getItem('bps_token');
            if (!currentToken) return;
            const response = await fetch(`${API_BASE}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('bps_user', JSON.stringify(data.user));
            }
        } catch { /* silent */ }
    };

    const updateProfile = async (updates) => {
        try {
            const currentToken = localStorage.getItem('bps_token');
            const response = await fetch(`${API_BASE}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            if (data.success) {
                const updated = { ...user, ...data.user };
                setUser(updated);
                localStorage.setItem('bps_user', JSON.stringify(updated));
            }
            return data;
        } catch {
            return { success: false, message: 'Network error' };
        }
    };

    const logout = () => {
        if (socketRef.current) {
            socketRef.current.emit('leave', user?.id);
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('bps_user');
        localStorage.removeItem('bps_token');
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider value={{
            user, token, login, logout, sendOtp,
            updateProfile, refreshProfile,
            isLoading, isAuthenticated,
            socket: socketRef.current
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
