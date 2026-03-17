import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, User, Users, Send, Bookmark, MoreVertical, Camera, Image as ImageIcon, ThumbsUp, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './Community.css';

const MOCK_POSTS = [
    {
        id: 1,
        author: 'Dr. R.K. Singh',
        role: 'Expert',
        avatar: '👨‍⚕️',
        time: '2 hrs ago',
        type: 'video',
        content: {
            hi: 'धान की फसल में यूरिया कब डालें? सही समय और मात्रा की पूरी जानकारी।',
            en: 'When to apply urea in paddy crop? Complete guide on timing and quantity.'
        },
        likes: 125,
        comments: 45,
        shares: 23,
        isLiked: false,
        isSaved: false,
        thumbnail: 'https://placehold.co/600x340/e3f2fd/1565c0?text=Urea+Guide+Video'
    },
    {
        id: 2,
        author: 'Ramesh Yadav',
        role: 'Farmer',
        avatar: '👨‍🌾',
        time: '4 hrs ago',
        type: 'image',
        content: {
            hi: 'मेरी आलू की फसल तैयार है। मंडी भाव क्या चल रहा है? कोई सुझाव?',
            en: 'My potato crop is ready. What is the current market price? Any suggestions?'
        },
        likes: 89,
        comments: 12,
        shares: 8,
        isLiked: true,
        isSaved: false,
        image: 'https://placehold.co/600x400/fff3e0/e65100?text=Potato+Crop'
    },
    {
        id: 3,
        author: 'Suresh Kumar',
        role: 'Farmer',
        avatar: '🧑‍🌾',
        time: '6 hrs ago',
        type: 'text',
        content: {
            hi: 'गेहूं की बुवाई के लिए सबसे अच्छी किस्म कौन सी है? मेरा खेत 5 एकड़ का है।',
            en: 'Which is the best variety for wheat sowing? My farm is 5 acres.'
        },
        likes: 67,
        comments: 28,
        shares: 5,
        isLiked: false,
        isSaved: true
    },
    {
        id: 4,
        author: 'Dr. Priya Sharma',
        role: 'Expert',
        avatar: '👩‍⚕️',
        time: '8 hrs ago',
        type: 'text',
        content: {
            hi: '⚠️ महत्वपूर्ण सूचना: अगले 48 घंटे में भारी बारिश की संभावना। कृपया फसल की सुरक्षा करें।',
            en: '⚠️ Important Notice: Heavy rainfall expected in next 48 hours. Please protect your crops.'
        },
        likes: 234,
        comments: 67,
        shares: 89,
        isLiked: true,
        isSaved: true
    },
    {
        id: 5,
        author: 'Vijay Singh',
        role: 'Farmer',
        avatar: '👨‍🌾',
        time: '1 day ago',
        type: 'image',
        content: {
            hi: 'टमाटर में पत्ती मुड़ने की समस्या। कोई उपाय बताएं।',
            en: 'Leaf curl problem in tomatoes. Please suggest remedies.'
        },
        likes: 45,
        comments: 19,
        shares: 3,
        isLiked: false,
        isSaved: false,
        image: 'https://placehold.co/600x400/ffebee/c62828?text=Tomato+Leaf+Curl'
    }
];

const MOCK_CHAT_MESSAGES = [
    { id: 1, user: 'Suresh (Bihar)', text: { hi: 'क्या किसी के पास ट्रैक्टर किराए पर है?', en: 'Does anyone have a tractor for rent?' }, time: '10:05 AM' },
    { id: 2, user: 'Raju (UP)', text: { hi: 'हां, मेरे पास है। कहां चाहिए?', en: 'Yes, I have one. Where do you need it?' }, time: '10:07 AM' },
    { id: 3, user: 'Dr. Singh', text: { hi: 'आज बारिश होने वाली है, सभी किसान ध्यान दें।', en: 'Rain expected today, all farmers please take note.' }, time: '10:15 AM', isExpert: true },
    { id: 4, user: 'Mohan (Punjab)', text: { hi: 'गेहूं का भाव आज 2100 रुपये क्विंटल है।', en: 'Wheat price is 2100 rupees per quintal today.' }, time: '10:20 AM' },
    { id: 5, user: 'Dr. Priya', text: { hi: 'फसल में कीड़े लगने पर तुरंत स्प्रे करें।', en: 'Spray immediately if pests appear on crops.' }, time: '10:25 AM', isExpert: true }
];

// Normalize API post to component format
const normalizePost = (p, lang) => ({
    id: p.id,
    author: p.author_name,
    role: p.author_role === 'doctor' ? 'Expert' : 'Farmer',
    avatar: p.author_avatar,
    time: new Date(p.created_at).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
    type: p.post_type || 'text',
    content: { hi: p.content_hi || p.content_en, en: p.content_en || p.content_hi },
    likes: p.likes,
    comments: p.comment_count || 0,
    shares: p.shares || 0,
    isLiked: p.isLiked || false,
    isSaved: false,
    image: p.image_url || null,
    thumbnail: p.image_url || null,
    _raw: p
});

export default function Community() {
    const { t, lang } = useLanguage();
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('feed'); // feed | live | myPosts
    const [chatInput, setChatInput] = useState('');
    const [liveMessages, setLiveMessages] = useState(MOCK_CHAT_MESSAGES);
    const [posts, setPosts] = useState([]);
    const [, setPostsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | experts | trending
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setPostsLoading(true);
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch(API_ENDPOINTS.COMMUNITY.POSTS, { headers });
            const data = await response.json();
            if (data.success) {
                setPosts(data.posts.map(p => normalizePost(p, lang)));
            } else {
                setPosts(MOCK_POSTS); // fallback to mock
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            setPosts(MOCK_POSTS); // fallback to mock
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'live') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [liveMessages, activeTab]);

    const handleSendChat = (e) => {
        e?.preventDefault();
        if (!chatInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: lang === 'hi' ? 'आप' : 'You',
            text: { hi: chatInput, en: chatInput },
            time: lang === 'hi' ? 'अभी' : 'Just now'
        };

        setLiveMessages([...liveMessages, newMessage]);
        setChatInput('');
    };

    const handleLike = async (postId) => {
        // Optimistic update
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));

        if (!token) return; // not logged in, just optimistic UI
        try {
            await fetch(API_ENDPOINTS.COMMUNITY.LIKE(postId), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleSave = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return { ...post, isSaved: !post.isSaved };
            }
            return post;
        }));
    };

    const getFilteredPosts = () => {
        if (filter === 'experts') {
            return posts.filter(p => p.role === 'Expert');
        }
        if (filter === 'trending') {
            return [...posts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
        }
        return posts;
    };

    return (
        <div className="page-content pb-safe community-page">
            <header className="page-header community-header">
                <div className="header-top">
                    <h2>{lang === 'hi' ? 'किसान साथी मंच 🤝' : 'Farmer Community 🤝'}</h2>
                    <button className="icon-btn">
                        <MoreVertical size={20} />
                    </button>
                </div>
                
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feed')}
                    >
                        {t('feed')}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                        onClick={() => setActiveTab('live')}
                    >
                        <span className="live-dot"></span> {t('live_chat')}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'myPosts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('myPosts')}
                    >
                        {t('my_posts')}
                    </button>
                </div>
            </header>

            {activeTab === 'feed' ? (
                <>
                    {/* Filter Pills */}
                    <div className="filter-pills">
                        <button 
                            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            {lang === 'hi' ? 'सभी' : 'All'}
                        </button>
                        <button 
                            className={`filter-pill ${filter === 'experts' ? 'active' : ''}`}
                            onClick={() => setFilter('experts')}
                        >
                            {t('expert')} {lang === 'hi' ? 'पोस्ट' : 'Posts'}
                        </button>
                        <button 
                            className={`filter-pill ${filter === 'trending' ? 'active' : ''}`}
                            onClick={() => setFilter('trending')}
                        >
                            <TrendingUp size={16} /> {lang === 'hi' ? 'ट्रेंडिंग' : 'Trending'}
                        </button>
                    </div>

                    <div className="feed-container">
                        {getFilteredPosts().map(post => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="avatar-circle">
                                        <span className="avatar-emoji">{post.avatar}</span>
                                    </div>
                                    <div className="post-meta">
                                        <h4>
                                            {post.author}
                                            {post.role === 'Expert' && (
                                                <span className="badge-expert">{t('expert')}</span>
                                            )}
                                        </h4>
                                        <span>{post.time}</span>
                                    </div>
                                    <button className="icon-btn-sm">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <p className="post-content">{post.content[lang]}</p>

                                {post.type === 'video' && (
                                    <div className="media-container video-wrapper">
                                        <img src={post.thumbnail} alt="Thumbnail" />
                                        <div className="play-btn">
                                            <Play size={40} fill="white" />
                                        </div>
                                        <div className="video-duration">12:30</div>
                                    </div>
                                )}

                                {post.type === 'image' && (
                                    <div className="media-container">
                                        <img src={post.image} alt="Post" />
                                    </div>
                                )}

                                {/* Engagement Stats */}
                                <div className="engagement-stats">
                                    <span className="stat-item">
                                        <ThumbsUp size={14} /> {post.likes} {lang === 'hi' ? 'लाइक' : 'likes'}
                                    </span>
                                    <span className="stat-item">
                                        {post.comments} {lang === 'hi' ? 'कमेंट' : 'comments'} • {post.shares} {lang === 'hi' ? 'शेयर' : 'shares'}
                                    </span>
                                </div>

                                <div className="post-actions">
                                    <button 
                                        className={`action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <div className="action-icon-wrapper">
                                            <Heart 
                                                size={22} 
                                                fill={post.isLiked ? 'currentColor' : 'none'}
                                                className="action-icon"
                                            />
                                            {post.isLiked && <span className="like-burst">💕</span>}
                                        </div>
                                        <span className="action-label">{t('like')}</span>
                                        {post.likes > 0 && <span className="action-count">{post.likes}</span>}
                                    </button>
                                    
                                    <button className="action-btn comment-btn">
                                        <div className="action-icon-wrapper">
                                            <MessageCircle size={22} className="action-icon" />
                                        </div>
                                        <span className="action-label">{t('comment')}</span>
                                        {post.comments > 0 && <span className="action-count">{post.comments}</span>}
                                    </button>
                                    
                                    <button className="action-btn share-btn">
                                        <div className="action-icon-wrapper">
                                            <Share2 size={22} className="action-icon" />
                                        </div>
                                        <span className="action-label">{t('share')}</span>
                                        {post.shares > 0 && <span className="action-count">{post.shares}</span>}
                                    </button>
                                    
                                    <button 
                                        className={`action-btn save-btn ${post.isSaved ? 'saved' : ''}`}
                                        onClick={() => handleSave(post.id)}
                                    >
                                        <div className="action-icon-wrapper">
                                            <Bookmark 
                                                size={22} 
                                                fill={post.isSaved ? 'currentColor' : 'none'}
                                                className="action-icon"
                                            />
                                        </div>
                                        <span className="action-label">{post.isSaved ? (lang === 'hi' ? 'सेव्ड' : 'Saved') : (lang === 'hi' ? 'सेव' : 'Save')}</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {getFilteredPosts().length === 0 && (
                            <div className="empty-state">
                                <Users size={48} color="var(--text-muted)" />
                                <p>{lang === 'hi' ? 'कोई पोस्ट नहीं मिली' : 'No posts found'}</p>
                            </div>
                        )}
                    </div>

                    <button className="fab-post" title={lang === 'hi' ? 'नई पोस्ट' : 'New Post'}>
                        <Camera size={24} />
                    </button>
                </>
            ) : activeTab === 'myPosts' ? (
                <div className="my-posts-container">
                    <div className="empty-state">
                        <User size={48} color="var(--text-muted)" />
                        <h3>{lang === 'hi' ? 'आपकी पोस्ट' : 'Your Posts'}</h3>
                        <p>{lang === 'hi' ? 'आपने अभी तक कोई पोस्ट नहीं की है' : 'You haven\'t posted anything yet'}</p>
                        <button className="btn-primary mt-3">
                            <Camera size={18} />
                            {lang === 'hi' ? 'पहली पोस्ट बनाएं' : 'Create First Post'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="live-chat-container">
                    <div className="live-header-banner">
                        <div className="live-indicator">
                            <span className="live-dot"></span>
                            <Users size={18} />
                            <span>{lang === 'hi' ? '245 किसान ऑनलाइन' : '245 Farmers Online'}</span>
                        </div>
                        <span className="live-time">{new Date().toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="chat-list">
                        {liveMessages.map(msg => (
                            <div key={msg.id} className={`chat-item ${msg.user === (lang === 'hi' ? 'आप' : 'You') ? 'mine' : ''}`}>
                                <div className="chat-user">
                                    {msg.user} {msg.isExpert && <span className="badge-expert-xs">{t('expert')}</span>}
                                </div>
                                <div className="chat-bubble">
                                    {typeof msg.text === 'object' ? msg.text[lang] : msg.text}
                                </div>
                                <div className="chat-time">{msg.time}</div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="live-input-area" onSubmit={handleSendChat}>
                        <button type="button" className="attach-btn-sm">
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder={lang === 'hi' ? 'संदेश लिखें...' : 'Type message...'}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat(e)}
                        />
                        <button 
                            type="submit" 
                            className="send-btn-sm"
                            disabled={!chatInput.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
