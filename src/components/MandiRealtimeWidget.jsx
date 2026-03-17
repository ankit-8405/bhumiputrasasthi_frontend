import { useEffect } from 'react';
import { useMandiRealtime } from '../hooks/useMandiRealtime';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './MandiRealtimeWidget.css';

export default function MandiRealtimeWidget({ userId, state = 'Uttar Pradesh' }) {
  const {
    prices,
    isConnected,
    lastUpdate,
    stats,
    forceRefresh,
    fetchStats
  } = useMandiRealtime({
    userId,
    crops: ['Gehun', 'Dhan', 'Makka', 'Sarson', 'Chana', 'Arhar'],
    state,
    autoConnect: true
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update stats every 30s
    return () => clearInterval(interval);
  }, [fetchStats]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getPriceChangeColor = (change) => {
    if (!change) return 'neutral';
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  };

  return (
    <div className="mandi-realtime-widget">
      {/* Header */}
      <div className="widget-header">
        <div className="header-left">
          <h2>🌾 लाइव मंडी भाव</h2>
          <span className="state-badge">{state}</span>
        </div>
        <div className="header-right">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
          {lastUpdate && (
            <span className="last-update">
              अपडेट: {formatTime(lastUpdate)}
            </span>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">कैश्ड प्राइस:</span>
            <span className="stat-value">{stats.cached_prices}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">अपडेट इंटरवल:</span>
            <span className="stat-value">{stats.update_interval}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">सब्सक्राइबर्स:</span>
            <span className="stat-value">{stats.active_subscribers}</span>
          </div>
        </div>
      )}

      {/* Price Grid */}
      <div className="price-grid">
        {prices.length === 0 ? (
          <div className="loading-state">
            <RefreshCw className="spin" size={32} />
            <p>लाइव भाव लोड हो रहे हैं...</p>
          </div>
        ) : (
          prices.map((item, index) => (
            <div key={index} className="price-card realtime">
              <div className="card-header">
                <h3>{item.crop}</h3>
                {item.change_percent && (
                  <span className={`change-badge ${getPriceChangeColor(item.change)}`}>
                    {item.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(item.change_percent)}%
                  </span>
                )}
              </div>
              
              <div className="price-main">
                <span className="price-value">₹{item.price}</span>
                <span className="price-unit">/क्विंटल</span>
              </div>

              {item.old_price && item.old_price !== item.price && (
                <div className="price-change">
                  <span className="old-price">₹{item.old_price}</span>
                  <span className={`change-amount ${getPriceChangeColor(item.change)}`}>
                    {item.change > 0 ? '+' : ''}{item.change}
                  </span>
                </div>
              )}

              <div className="card-footer">
                <span className="market-name">{item.market}</span>
                <button
                  className="refresh-btn"
                  onClick={() => forceRefresh(item.crop, item.state)}
                  title="Refresh this price"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Live indicator pulse */}
              {isConnected && (
                <div className="live-pulse" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="widget-footer">
        <p className="disclaimer">
          💡 भाव हर 5 मिनट में अपडेट होते हैं | स्रोत: Agmarknet API
        </p>
      </div>
    </div>
  );
}
