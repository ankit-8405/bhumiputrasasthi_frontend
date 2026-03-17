import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Custom hook for real-time mandi price updates
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID for personalized alerts
 * @param {string[]} options.crops - Array of crop names to subscribe to
 * @param {string} options.state - State name
 * @param {boolean} options.autoConnect - Auto-connect on mount (default: true)
 * 
 * @returns {Object} - { prices, isConnected, subscribe, unsubscribe, forceRefresh, stats }
 */
export function useMandiRealtime({ userId, crops = [], state = 'Uttar Pradesh', autoConnect = true } = {}) {
  const [prices, setPrices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Mandi WebSocket connected');
      setIsConnected(true);
      
      // Auto-subscribe if userId and crops provided
      if (userId && crops.length > 0 && state) {
        socket.emit('mandi:subscribe', { userId, crops, state });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Mandi WebSocket disconnected');
      setIsConnected(false);
    });

    // Receive initial cached data
    socket.on('mandi:initial_data', (data) => {
      console.log('📊 Received initial mandi data:', data.prices.length, 'prices');
      setPrices(data.prices);
      setLastUpdate(data.timestamp);
    });

    // Real-time price updates
    socket.on('mandi:price_update', (update) => {
      console.log('💰 Price update:', update.crop, update.state, '₹', update.new_price);
      
      setPrices(prev => {
        const index = prev.findIndex(p => p.crop === update.crop && p.state === update.state);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            price: update.new_price,
            old_price: update.old_price,
            change: update.change,
            change_percent: update.change_percent,
            timestamp: update.timestamp
          };
          return updated;
        } else {
          return [...prev, {
            crop: update.crop,
            state: update.state,
            price: update.new_price,
            market: update.market,
            timestamp: update.timestamp
          }];
        }
      });
      
      setLastUpdate(update.timestamp);
    });

    // General refresh notification
    socket.on('mandi:refresh', (data) => {
      console.log('🔄 Mandi prices refreshed:', data.message);
      setLastUpdate(data.timestamp);
    });

    // Price alert notifications
    socket.on('alert:price_reached', (alert) => {
      console.log('🔔 Price alert:', alert.message_hi);
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('मंडी भाव अलर्ट', {
          body: alert.message_hi,
          icon: '/logo.png',
          tag: `price-alert-${alert.commodity}`
        });
      }
      
      // You can also trigger a toast notification here
      // toast.success(alert.message_hi);
    });

    return () => {
      if (socket) {
        socket.emit('mandi:unsubscribe', { userId, state });
        socket.disconnect();
      }
    };
  }, [autoConnect, userId, state]);

  // Subscribe to specific crops
  const subscribe = useCallback((newCrops, newState) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mandi:subscribe', {
        userId,
        crops: newCrops,
        state: newState || state
      });
    }
  }, [userId, state]);

  // Unsubscribe
  const unsubscribe = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mandi:unsubscribe', { userId, state });
    }
  }, [userId, state]);

  // Force refresh specific crop
  const forceRefresh = useCallback((crop, refreshState) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mandi:force_refresh', {
        crop,
        state: refreshState || state
      });
    }
  }, [state]);

  // Fetch real-time stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/mandi/realtime/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch realtime stats:', error);
    }
  }, []);

  return {
    prices,
    isConnected,
    lastUpdate,
    stats,
    subscribe,
    unsubscribe,
    forceRefresh,
    fetchStats,
    socket: socketRef.current
  };
}

/**
 * Hook for price alerts
 */
export function usePriceAlerts(userId) {
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', userId);
    });

    socket.on('alert:price_reached', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('मंडी भाव अलर्ट', {
          body: alert.message_hi,
          icon: '/logo.png'
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    alerts,
    requestNotificationPermission
  };
}
