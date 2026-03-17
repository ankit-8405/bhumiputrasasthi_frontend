import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config/api';
import './Consultation.css';

export default function Consultation() {
  const { doctorId, type } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`);
      const data = await response.json();
      if (data.success) {
        setDoctor(data.doctor);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        sender: 'doctor',
        content: lang === 'hi' 
          ? 'धन्यवाद! मैं आपकी समस्या समझ गया हूं। कृपया मुझे और जानकारी दें।'
          : 'Thank you! I understand your problem. Please provide more details.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="consultation-page">
        <div className="loading-container">
          <p>{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="consultation-page">
      {/* Header */}
      <header className="consultation-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="doctor-info">
          <h3>{doctor?.name || 'Doctor'}</h3>
          <p className="status online">
            🟢 {lang === 'hi' ? 'ऑनलाइन' : 'Online'}
          </p>
        </div>
        <div className="call-actions">
          {type === 'chat' && (
            <>
              <button className="icon-btn" title={lang === 'hi' ? 'ऑडियो कॉल' : 'Audio Call'}>
                <Phone size={20} />
              </button>
              <button className="icon-btn" title={lang === 'hi' ? 'वीडियो कॉल' : 'Video Call'}>
                <Video size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Consultation Type Banner */}
      <div className="consultation-banner">
        {type === 'chat' && <MessageSquare size={20} />}
        {type === 'audio' && <Phone size={20} />}
        {type === 'video' && <Video size={20} />}
        <span>
          {type === 'chat' && (lang === 'hi' ? 'चैट परामर्श' : 'Chat Consultation')}
          {type === 'audio' && (lang === 'hi' ? 'ऑडियो परामर्श' : 'Audio Consultation')}
          {type === 'video' && (lang === 'hi' ? 'वीडियो परामर्श' : 'Video Consultation')}
        </span>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            <MessageSquare size={48} />
            <p>
              {lang === 'hi' 
                ? 'अपनी समस्या बताएं और डॉक्टर से सलाह लें'
                : 'Describe your problem and get advice from the doctor'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              <p>{msg.content}</p>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      {type === 'chat' && (
        <div className="input-area">
          <input
            type="text"
            placeholder={lang === 'hi' ? 'अपना संदेश लिखें...' : 'Type your message...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            <Send size={20} />
          </button>
        </div>
      )}

      {/* Audio/Video Call UI */}
      {(type === 'audio' || type === 'video') && (
        <div className="call-interface">
          <div className="call-status">
            <div className="avatar-large">
              {doctor?.name?.charAt(0) || 'D'}
            </div>
            <h2>{doctor?.name}</h2>
            <p className="call-timer">00:00</p>
            <p className="call-status-text">
              {lang === 'hi' ? 'कॉल कनेक्ट हो रहा है...' : 'Connecting call...'}
            </p>
          </div>
          <div className="call-controls">
            <button className="control-btn mute">
              <Phone size={24} />
            </button>
            <button className="control-btn end" onClick={() => navigate(-1)}>
              <Phone size={24} />
            </button>
            {type === 'video' && (
              <button className="control-btn camera">
                <Video size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
