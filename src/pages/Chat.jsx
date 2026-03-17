import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Camera, Image as ImageIcon, MoreVertical, Loader, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config/api';
import './Chat.css';

export default function Chat() {
    const { lang } = useLanguage();
    
    const SUGGESTIONS = [
        lang === 'hi' ? "🌾 Fasal me kida laga hai" : "🌾 Pest in my crop",
        lang === 'hi' ? "🌦️ Aaj barish hogi?" : "🌦️ Will it rain today?",
        lang === 'hi' ? "👨‍⚕️ Doctor se baat karni hai" : "👨‍⚕️ Need to talk to doctor",
        lang === 'hi' ? "💰 Gehoon ka mandi bhav?" : "💰 Wheat market price?"
    ];
    
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            sender: 'ai', 
            type: 'text', 
            content: lang === 'hi' 
                ? '🙏 Namaste! Main BhumiPutra AI Sahayak hoon. Main aapki kheti-baadi mein madad kar sakta hoon. Aap mujhse fasal rog, pashu swasthya, mausam, ya koi bhi samasya ke baare mein pooch sakte hain!' 
                : '🙏 Hello! I am BhumiPutra AI Assistant. I can help you with farming. Ask me about crop diseases, animal health, weather, or any farming problem!' 
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [, setCapturedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showHelplineModal, setShowHelplineModal] = useState(false);
    const [helplines, setHelplines] = useState([]);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Fetch helplines from API
    useEffect(() => {
        fetchHelplines();
    }, []);

    const fetchHelplines = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/helpline`);
            const data = await response.json();
            if (data.success) {
                setHelplines(data.helplines);
            }
        } catch (error) {
            console.error('Error fetching helplines:', error);
            // Keep default helplines if API fails
        }
    };

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsRecording(false);
            };
            
            recognitionRef.current.onerror = () => {
                setIsRecording(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, [lang]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // User Message
        const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: inputText };
        setMessages(prev => [...prev, userMsg]);
        const query = inputText;
        setInputText('');

        // Show typing indicator
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: query,
                    context: {
                        location: localStorage.getItem('userLocation') || 'Rampur, UP',
                        crop: 'Dhan',
                        language: lang
                    }
                }),
            });

            const data = await response.json();
            setIsTyping(false);

            if (data.success && data.response) {
                const aiResponse = data.response;
                
                // Create AI message based on response type
                const aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: aiResponse.category === 'crop' || aiResponse.category === 'animal' ? 'diagnosis' : 'text',
                    content: aiResponse.message,
                    disease: aiResponse.category === 'crop' ? 'Fasal Rog' : aiResponse.category === 'animal' ? 'Pashu Rog' : null,
                    confidence: aiResponse.severity === 'high' ? '85%' : aiResponse.severity === 'critical' ? '95%' : '70%',
                    cure: aiResponse.medicines?.length > 0 ? aiResponse.medicines[0].name + ' - ' + aiResponse.medicines[0].dose : null,
                    nextStep: aiResponse.recommendations?.join(', '),
                    recommendations: aiResponse.recommendations,
                    medicines: aiResponse.medicines,
                    severity: aiResponse.severity,
                    doctorRequired: aiResponse.doctorRequired,
                    category: aiResponse.category
                };

                setMessages(prev => [...prev, aiMsg]);
                setIsConnected(true);
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setIsTyping(false);
            setIsConnected(false);
            
            const errorMsg = { 
                id: Date.now() + 1, 
                sender: 'ai', 
                type: 'text', 
                content: lang === 'hi' 
                    ? '😔 Maafi chahta hoon, server se connection nahi ho pa raha. Kripya internet check karein ya thodi der baad try karein.' 
                    : '😔 Sorry, unable to connect to server. Please check your internet or try again later.' 
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            alert(lang === 'hi' ? 'Voice feature aapke browser mein available nahi hai' : 'Voice feature not available in your browser');
            return;
        }
        
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    };

    // Open camera
    const _handleCameraClick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }, // Use back camera on mobile
                audio: false 
            });
            setCameraStream(stream);
            setShowCameraModal(true);
            
            // Wait for video element to be ready
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (error) {
            console.error('Camera error:', error);
            alert(lang === 'hi' 
                ? 'Camera access nahi mil paya. Kripya permissions check karein.' 
                : 'Camera access denied. Please check permissions.');
        }
    };

    // Capture photo from camera
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                setCapturedImage(blob);
                closeCameraModal();
                
                // Add to selected images
                const newImage = {
                    id: Date.now(),
                    file: blob,
                    preview: URL.createObjectURL(blob),
                    name: 'camera-capture.jpg',
                    description: ''
                };
                setSelectedImages(prev => [...prev, newImage]);
            }, 'image/jpeg', 0.95);
        }
    };

    // Close camera modal
    const closeCameraModal = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCameraModal(false);
    };

    // Handle multiple file upload
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/')).slice(0, 10);
        
        if (imageFiles.length > 0) {
            const imagesWithPreview = imageFiles.map((file, index) => ({
                id: Date.now() + index,
                file: file,
                preview: URL.createObjectURL(file),
                name: file.name,
                description: ''
            }));
            setSelectedImages(imagesWithPreview);
        }
    };

    // Update description for specific image
    const handleImageDescriptionChange = (imageId, description) => {
        setSelectedImages(prev => prev.map(img => 
            img.id === imageId ? { ...img, description } : img
        ));
    };

    // Remove image from selection
    const handleRemoveImage = (imageId) => {
        setSelectedImages(prev => {
            const filtered = prev.filter(img => img.id !== imageId);
            // Revoke URL to free memory
            const removed = prev.find(img => img.id === imageId);
            if (removed) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
    };

    // Send message with images
    const handleSendWithImages = async () => {
        if (selectedImages.length === 0 && !inputText.trim()) return;

        // If only text, send normally
        if (selectedImages.length === 0) {
            handleSend();
            return;
        }

        // Send images with descriptions
        for (const image of selectedImages) {
            await sendImageToAI(image.file, image.description);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Cleanup
        selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
        setSelectedImages([]);
        setInputText('');
    };

    // Send image to AI for analysis
    const sendImageToAI = async (imageBlob, description = '') => {
        // Add image message
        const imageUrl = URL.createObjectURL(imageBlob);
        const userMsg = { 
            id: Date.now(), 
            sender: 'user', 
            type: 'image', 
            content: description || (lang === 'hi' ? '📷 Photo upload ki gayi' : '📷 Photo uploaded'),
            imageUrl 
        };
        setMessages(prev => [...prev, userMsg]);

        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append('image', imageBlob, 'crop-image.jpg');
            formData.append('crop', 'Dhan');
            formData.append('location', localStorage.getItem('userLocation') || 'Rampur, UP');
            formData.append('description', description);

            console.log('📤 Sending image to AI:', {
                size: imageBlob.size,
                description: description
            });

            const response = await fetch(`${API_BASE_URL}/api/ai/analyze-image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📥 AI Response:', data);
            
            setIsTyping(false);

            if (data.success && data.analysis) {
                const analysis = data.analysis;
                
                const aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'diagnosis',
                    content: analysis.message || analysis.symptoms || analysis.treatment || 'Image analysis complete',
                    disease: analysis.disease,
                    confidence: `${analysis.confidence}%`,
                    severity: analysis.severity,
                    recommendations: analysis.recommendations || (analysis.prevention ? [analysis.prevention] : []),
                    medicines: analysis.medicines || [],
                    doctorRequired: analysis.doctorRequired || analysis.severity === 'high' || analysis.severity === 'critical',
                    category: analysis.category || 'crop'
                };

                setMessages(prev => [...prev, aiMsg]);
                setIsConnected(true);
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([50, 100, 50]);
                }
            } else {
                throw new Error(data.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('❌ Image analysis error:', error);
            setIsTyping(false);
            setIsConnected(false);
            
            const errorMsg = { 
                id: Date.now() + 1, 
                sender: 'ai', 
                type: 'text', 
                content: lang === 'hi' 
                    ? `😔 Image analysis mein problem aayi: ${error.message}. Kripya server check karein aur phir se try karein.` 
                    : `😔 Image analysis failed: ${error.message}. Please check server and try again.` 
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="chat-page pb-safe">
            {/* Header */}
            <header className="chat-header">
                <div className="chat-title">
                    <div className="bot-avatar">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2>{lang === 'hi' ? 'BhumiPutra AI' : 'BhumiPutra AI'}</h2>
                        <p className={isConnected ? 'status-online' : 'status-offline'}>
                            {isConnected 
                                ? (lang === 'hi' ? '🟢 ऑनलाइन' : '🟢 Online')
                                : (lang === 'hi' ? '🔴 ऑफलाइन' : '🔴 Offline')
                            }
                        </p>
                    </div>
                </div>
                <button className="icon-btn"><MoreVertical size={20} /></button>
            </header>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.type === 'text' && <p>{msg.content}</p>}
                            
                            {msg.type === 'image' && (
                                <div className="image-message">
                                    <img src={msg.imageUrl} alt="Uploaded" />
                                    <p>{msg.content}</p>
                                </div>
                            )}

                            {msg.type === 'diagnosis' && (
                                <div className="diagnosis-card">
                                    <h4>
                                        {msg.category === 'crop' && '🌾'}
                                        {msg.category === 'animal' && '🐄'}
                                        {msg.category === 'poultry' && '🐔'}
                                        {msg.category === 'fish' && '🐟'}
                                        {' '}{msg.disease || 'Samasya Detected'}
                                    </h4>
                                    {msg.confidence && (
                                        <div className={`confidence-badge severity-${msg.severity}`}>
                                            {lang === 'hi' ? 'विश्वास' : 'Confidence'}: {msg.confidence}
                                        </div>
                                    )}
                                    
                                    <p className="main-message">{msg.content}</p>
                                    
                                    {msg.medicines && msg.medicines.length > 0 && (
                                        <div className="remedy-box">
                                            <strong>💊 {lang === 'hi' ? 'दवा (Medicine):' : 'Medicine:'}</strong>
                                            {msg.medicines.map((med, i) => (
                                                <p key={i}>• {med.name} - {med.dose}</p>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {msg.recommendations && msg.recommendations.length > 0 && (
                                        <div className="recommendations">
                                            <strong>📋 {lang === 'hi' ? 'सुझाव:' : 'Recommendations:'}</strong>
                                            {msg.recommendations.map((rec, i) => (
                                                <p key={i}>• {rec}</p>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {msg.doctorRequired && (
                                        <div className="doctor-alert">
                                            ⚠️ {lang === 'hi' ? 'Doctor se salah lena zaroori hai' : 'Doctor consultation required'}
                                        </div>
                                    )}
                                    
                                    <div className="card-actions">
                                        <button className="btn-xs primary" onClick={() => window.location.href = '/doctors'}>
                                            {lang === 'hi' ? 'डॉक्टर कॉल' : 'Doctor Call'}
                                        </button>
                                        <button className="btn-xs outline" onClick={() => setShowHelplineModal(true)}>
                                            {lang === 'hi' ? 'हेल्पलाइन' : 'Helpline'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="timestamp">{new Date().toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="message-wrapper ai">
                        <div className="message-bubble">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (if empty or specific state - simplified for MVP to always show) */}
            {messages.length < 3 && (
                <div className="suggestions-scroll">
                    {SUGGESTIONS.map((s, i) => (
                        <button key={i} onClick={() => setInputText(s)} className="suggestion-pill">
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="chat-input-area">
                {/* Selected Images Preview - WhatsApp Style */}
                {selectedImages.length > 0 && (
                    <div className="whatsapp-image-preview">
                        {selectedImages.map((image) => (
                            <div key={image.id} className="whatsapp-image-card">
                                <img src={image.preview} alt="Selected" />
                                <div className="whatsapp-image-actions">
                                    <button 
                                        className="whatsapp-edit-btn" 
                                        onClick={() => {/* Edit functionality */}}
                                        title="Edit"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        className="whatsapp-close-btn" 
                                        onClick={() => handleRemoveImage(image.id)}
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="whatsapp-caption-input"
                                    placeholder={lang === 'hi' ? 'Caption likhen...' : 'Add a caption...'}
                                    value={image.description}
                                    onChange={(e) => handleImageDescriptionChange(image.id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="input-row">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                    <button className="attach-btn" onClick={() => fileInputRef.current?.click()} title={lang === 'hi' ? 'Photo upload karein' : 'Upload Photo'}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                    </button>
                    <div className="input-field-wrapper">
                        <input
                            type="text"
                            placeholder={lang === 'hi' ? 'Kuch bhi puchhen...' : 'Ask anything'}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendWithImages()}
                        />
                        <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
                            <Mic size={20} />
                        </button>
                    </div>
                    <button className="send-btn-round" onClick={handleSendWithImages} disabled={selectedImages.length === 0 && !inputText.trim()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Helpline Modal */}
            {showHelplineModal && (
                <div className="helpline-modal-overlay" onClick={() => setShowHelplineModal(false)}>
                    <div className="helpline-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="helpline-header">
                            <h3>📞 {lang === 'hi' ? 'हेल्पलाइन - शिकायत दर्ज करें' : 'Helpline - Register Complaint'}</h3>
                            <button className="close-btn" onClick={() => setShowHelplineModal(false)}>✕</button>
                        </div>
                        
                        <div className="helpline-content">
                            <p className="helpline-subtitle">
                                {lang === 'hi' 
                                    ? 'आप निम्नलिखित तरीकों से शिकायत दर्ज कर सकते हैं:' 
                                    : 'You can register complaints through:'}
                            </p>

                            {helplines.length > 0 ? (
                                helplines.map((helpline) => (
                                    <div key={helpline.id} className="helpline-option">
                                        <div className="option-icon" style={{ background: `linear-gradient(135deg, ${helpline.color} 0%, ${helpline.color}dd 100%)` }}>
                                            {helpline.icon}
                                        </div>
                                        <div className="option-details">
                                            <h4>{lang === 'hi' ? helpline.title_hi : helpline.title_en}</h4>
                                            <p className="option-value">{helpline.value}</p>
                                            <p className="option-desc">
                                                {lang === 'hi' ? helpline.description_hi : helpline.description_en}
                                            </p>
                                            <button 
                                                className={`action-btn ${helpline.type === 'whatsapp' ? 'whatsapp' : helpline.type === 'phone' ? 'primary' : 'secondary'}`}
                                                onClick={() => {
                                                    if (helpline.type === 'phone') {
                                                        window.open(`tel:${helpline.value}`);
                                                    } else if (helpline.type === 'sms') {
                                                        window.open(`sms:${helpline.value}?body=Meri samasya: `);
                                                    } else if (helpline.type === 'email') {
                                                        window.open(`mailto:${helpline.value}?subject=Krishi Samasya&body=Namaste,%0D%0A%0D%0AMeri samasya:`);
                                                    } else if (helpline.type === 'whatsapp') {
                                                        window.open(`https://wa.me/${helpline.value.replace(/[^0-9]/g, '')}?text=Namaste, Mujhe madad chahiye`);
                                                    } else {
                                                        window.open(helpline.value, '_blank');
                                                    }
                                                }}
                                            >
                                                {helpline.icon} {lang === 'hi' 
                                                    ? (helpline.type === 'phone' ? 'अभी कॉल करें' : 
                                                       helpline.type === 'sms' ? 'SMS करें' :
                                                       helpline.type === 'email' ? 'ईमेल करें' :
                                                       helpline.type === 'whatsapp' ? 'WhatsApp करें' :
                                                       helpline.type === 'portal' ? 'पोर्टल खोलें' :
                                                       'खोलें')
                                                    : (helpline.type === 'phone' ? 'Call Now' :
                                                       helpline.type === 'sms' ? 'Send SMS' :
                                                       helpline.type === 'email' ? 'Send Email' :
                                                       helpline.type === 'whatsapp' ? 'WhatsApp Now' :
                                                       helpline.type === 'portal' ? 'Open Portal' :
                                                       'Open')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="loading-text">{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
                            )}
                        </div>

                        <div className="helpline-footer">
                            <p className="helpline-note">
                                {lang === 'hi' 
                                    ? '⚠️ आपातकालीन स्थिति में तुरंत 1800-180-1551 पर कॉल करें' 
                                    : '⚠️ For emergencies, call 1800-180-1551 immediately'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Modal */}
            {showCameraModal && (
                <div className="camera-modal">
                    <div className="camera-container">
                        <div className="camera-header">
                            <h3>{lang === 'hi' ? '📷 Photo Lein' : '📷 Take Photo'}</h3>
                            <button className="close-btn" onClick={closeCameraModal}>✕</button>
                        </div>
                        <div className="camera-view">
                            <video ref={videoRef} autoPlay playsInline />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <div className="camera-controls">
                            <button className="capture-btn" onClick={handleCapture}>
                                <div className="capture-ring">
                                    <div className="capture-dot"></div>
                                </div>
                                <span>{lang === 'hi' ? 'Photo Lein' : 'Capture'}</span>
                            </button>
                        </div>
                        <p className="camera-hint">
                            {lang === 'hi' 
                                ? '💡 Fasal/patti ko clear dikhayein' 
                                : '💡 Show crop/leaf clearly'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
