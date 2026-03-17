import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Heart, MessageCircle, Share2, Bookmark, MoreVertical,
    Camera, Image as ImageIcon, Video, BarChart3, Plus, Search,
    TrendingUp, Clock, Eye, ChevronRight, Sparkles, Edit2, Trash2,
    Flag, X, Send, Users, Zap, Award, Wifi
} from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './CommunityNew.css';

const COMMUNITY_T = {
    title: { hi: 'किसान साथी मंच', en: 'Farmer Community', bn: 'কৃষক সম্প্রদায়', or: 'କୃଷକ ସମ୍ପ୍ରଦାୟ', mai: 'किसान साथी मंच', pa: 'ਕਿਸਾਨ ਭਾਈਚਾਰਾ', mr: 'शेतकरी समुदाय', gu: 'ખેડૂત સમુદાય', ta: 'விவசாயி சமூகம்', te: 'రైతు సంఘం' },
    online: { hi: 'ऑनलाइन', en: 'Online', bn: 'অনলাইন', or: 'ଅନଲାଇନ୍', mai: 'ऑनलाइन', pa: 'ਆਨਲਾਈਨ', mr: 'ऑनलाइन', gu: 'ઓનલાઇન', ta: 'ஆன்லைன்', te: 'ఆన్‌లైన్' },
    search_placeholder: { hi: 'पोस्ट या किसान खोजें...', en: 'Search posts or farmers...', bn: 'পোস্ট বা কৃষক খুঁজুন...', or: 'ପୋଷ୍ଟ କିମ୍ବା କୃଷକ ଖୋଜନ୍ତୁ...', mai: 'पोस्ट वा किसान खोजू...', pa: 'ਪੋਸਟਾਂ ਜਾਂ ਕਿਸਾਨਾਂ ਦੀ ਖੋਜ ਕਰੋ...', mr: 'पोस्ट किंवा शेतकरी शोधा...', gu: 'પોસ્ટ અથવા ખેડૂત શોધો...', ta: 'பதிவுகள் அல்லது விவசாயிகளைத் தேடுங்கள்...', te: 'పోస్ట్‌లు లేదా రైతులను వెతకండి...' },
    tab_feed: { hi: 'फीड', en: 'Feed', bn: 'ফিড', or: 'ଫିଡ୍', mai: 'फीड', pa: 'ਫੀਡ', mr: 'फीड', gu: 'ફીડ', ta: 'ஃபீட்', te: 'ఫీడ్' },
    tab_trending: { hi: 'ट्रेंडिंग', en: 'Trending', bn: 'ট্রেন্ডিং', or: 'ଟ୍ରେଣ୍ଡିଂ', mai: 'ट्रेंडिंग', pa: 'ਟ੍ਰੈਂਡਿੰਗ', mr: 'ट्रेंडिंग', gu: 'ટ્રેન્ડિંગ', ta: 'பிரபலமானவை', te: 'ట్రెండింగ్' },
    tab_live: { hi: 'लाइव', en: 'Live', bn: 'লাইভ', or: 'ଲାଇଭ୍', mai: 'लाइव', pa: 'ਲਾਈਵ', mr: 'थेट (लाईव्ह)', gu: 'જીવંત (લાઇવ)', ta: 'நேரலை', te: 'లైవ్' },
    post_btn_text: { hi: 'पोस्ट करें', en: 'Post', bn: 'পোস্ট করুন', or: 'ପୋଷ୍ଟ କରନ୍ତୁ', mai: 'पोस्ट करू', pa: 'ਪੋਸਟ ਕਰੋ', mr: 'पोस्ट करा', gu: 'પોસ્ટ કરો', ta: 'பதிவிடு', te: 'పోస్ట్ చేయండి' },
    quick_photo: { hi: 'फोटो', en: 'Photo', bn: 'ছবি', or: 'ଫଟୋ', mai: 'फोटो', pa: 'ਫੋਟੋ', mr: 'फोटो', gu: 'ફોટો', ta: 'புகைப்படம்', te: 'ఫోటో' },
    quick_video: { hi: 'वीडियो', en: 'Video', bn: 'ভিডিও', or: 'ଭିଡିଓ', mai: 'वीडियो', pa: 'ਵੀਡੀਓ', mr: 'व्हिडिओ', gu: 'વિડિઓ', ta: 'காணொளி', te: 'వీడియో' },
    quick_poll: { hi: 'पोल', en: 'Poll', bn: 'জরিপ', or: 'ପୋଲ୍', mai: 'पोल', pa: 'ਪੋਲ', mr: 'पोल', gu: 'પોલ', ta: 'வாக்கெடுப்பு', te: 'పోల్' },
    filter_all: { hi: 'सभी', en: 'All', bn: 'সব', or: 'ସମସ୍ତ', mai: 'सभ', pa: 'ਸਾਰੇ', mr: 'सर्व', gu: 'તમામ', ta: 'அனைத்து', te: 'అన్ని' },
    filter_alert: { hi: 'अलर्ट', en: 'Alerts', bn: 'সতর্কতা', or: 'ଆଲର୍ଟ', mai: 'अलर्ट', pa: 'ਅਲਰਟ', mr: 'अॅलर्ट', gu: 'ચેતવણી', ta: 'எச்சரிக்கை', te: 'హెచ్చరిక' },
    filter_question: { hi: 'सवाल', en: 'Questions', bn: 'প্রশ্ন', or: 'ପ୍ରଶ୍ନ', mai: 'सवाल', pa: 'ਸਵਾਲ', mr: 'प्रश्न', gu: 'પ્રશ્ન', ta: 'கேள்வி', te: 'ప్రశ్న' },
    filter_crop: { hi: 'फसल', en: 'Crops', bn: 'ফসল', or: 'ଫସଲ', mai: 'फसल', pa: 'ਫਸਲ', mr: 'पीक', gu: 'પાક', ta: 'பயிர்', te: 'పంట' },
    filter_weather: { hi: 'मौसम', en: 'Weather', bn: 'আবহাওয়া', or: 'ପାଣିପାଗ', mai: 'मौसम', pa: 'ਮੌਸਮ', mr: 'हवामान', gu: 'હવામાન', ta: 'வானிலை', te: 'వాతావరణం' },
    empty_feed: { hi: 'कोई पोस्ट नहीं मिली', en: 'No posts found', bn: 'কোন পোস্ট পাওয়া যায়নি', or: 'କୌଣସି ପୋଷ୍ଟ ମିଳିଲା ନାହିଁ', mai: 'कोनो पोस्ट नहि भेटल', pa: 'ਕੋਈ ਪੋਸਟ ਨਹੀਂ ਮਿਲੀ', mr: 'कोणतीही पोस्ट आढळली नाही', gu: 'કોઈ પોસ્ટ મળી નથી', ta: 'பதிவுகள் எதுவும் இல்லை', te: 'పోస్ట్‌లు ఏవీ లేవు' },
    empty_sub: { hi: 'अपनी खोज बदलें या नई पोस्ट बनाएं', en: 'Change search or create a post', bn: 'আপনার অনুসন্ধান পরিবর্তন করুন বা একটি নতুন পোস্ট তৈরি করুন', or: 'ଆପଣଙ୍କର ସନ୍ଧାନ ପରିବର୍ତ୍ତନ କରନ୍ତୁ କିମ୍ବା ଏକ ନୂଆ ପୋଷ୍ଟ ତିଆରି କରନ୍ତୁ', mai: 'अपन खोज बदलू वा नव पोस्ट बनाउ', pa: 'ਆਪਣੀ ਖੋਜ ਬਦਲੋ ਜਾਂ ਨਵੀਂ ਪੋਸਟ ਬਣਾਓ', mr: 'तुमचा शोध बदला किंवा नवीन पोस्ट करा', gu: 'તમારી શોધ બદલો અથવા નવી પોસ્ટ બનાવો', ta: 'தேடலை மாற்றவும் அல்லது புதிய பதிவை உருவாக்கவும்', te: 'శోధనను మార్చండి లేదా కొత్త పోస్ట్‌ను సృష్టించండి' },
    expert_badge: { hi: 'विशेषज्ञ', en: 'Expert', bn: 'বিশেষজ্ঞ', or: 'ବିଶେଷଜ୍ଞ', mai: 'विशेषज्ञ', pa: 'ਮਾਹਿਰ', mr: 'तज्ञ', gu: 'નિષ્ણાત', ta: 'நிபுணர்', te: 'నిపుణుడు' },
    menu_edit: { hi: 'सुधारें', en: 'Edit', bn: 'সম্পাদনা', or: 'ସମ୍ପାଦନ', mai: 'सुधारू', pa: 'ਸੋਧ', mr: 'संपादित करा', gu: 'સંપાદિત કરો', ta: 'திருத்து', te: 'సవరించు' },
    menu_delete: { hi: 'हटाएं', en: 'Delete', bn: 'মুছুন', or: 'ଡିଲିଟ୍', mai: 'हटाउ', pa: 'ਮਿਟਾਓ', mr: 'हटवा', gu: 'કાઢી નાખો', ta: 'அழி', te: 'తొలగించు' },
    menu_report: { hi: 'रिपोर्ट', en: 'Report', bn: 'রিপোর্ট', or: 'ରିପୋର୍ଟ', mai: 'रिपोर्ट', pa: 'ਰਿਪੋਰਟ', mr: 'अहवाल', gu: 'રિપોર્ટ', ta: 'புகாரளி', te: 'నివేదించు' },
    action_like: { hi: 'लाइक', en: 'Like', bn: 'লাইক', or: 'ଲାଇକ୍', mai: 'लाइक', pa: 'ਪਸੰਦ', mr: 'लाइक', gu: 'લાઇક', ta: 'விருப்பம்', te: 'లైక్' },
    action_comment: { hi: 'कमेंट', en: 'Comment', bn: 'মন্তব্য', or: 'ମନ୍ତବ୍ୟ', mai: 'कमेंट', pa: 'ਟਿੱਪਣੀ', mr: 'टिप्पणी', gu: 'ટિપ્પણી', ta: 'கருத்து', te: 'వ్యాఖ్య' },
    action_share: { hi: 'शेयर', en: 'Share', bn: 'শেয়ার', or: 'ସେୟାର', mai: 'शेयर', pa: 'ਸਾਂਝਾ', mr: 'शेअर', gu: 'શેર', ta: 'பகிர்', te: 'షేర్' },
    action_save: { hi: 'सेव', en: 'Save', bn: 'সংরক্ষণ', or: 'ସେଭ୍', mai: 'सेव', pa: 'ਸੁਰੱਖਿਅਤ', mr: 'जतन करा', gu: 'સાચવો', ta: 'சேமி', te: 'సేవ్' },
    trend_header: { hi: '🔥 ट्रेंडिंग टॉपिक्स', en: '🔥 Trending Topics', bn: '🔥 ট্রেন্ডিং বিষয়', or: '🔥 ଟ୍ରେଣ୍ଡିଂ ବିଷୟ', mai: '🔥 ट्रेंडिंग टॉपिक्स', pa: '🔥 ਟਰੈਂਡਿੰਗ ਵਿਸ਼ੇ', mr: '🔥 ट्रेंडिंग विषय', gu: '🔥 ટ્રેન્ડિંગ વિષયો', ta: '🔥 பிரபலமான தலைப்புகள்', te: '🔥 ట్రెండింగ్ విషయాలు' },
    posts_today: { hi: 'पोस्ट · आज', en: 'posts · Today', bn: 'পোস্ট · আজ', or: 'ପୋଷ୍ଟ · ଆଜି', mai: 'पोस्ट · आइ', pa: 'ਪੋਸਟਾਂ · ਅੱਜ', mr: 'पोस्ट · आज', gu: 'પોસ્ટ · આજે', ta: 'பதிவுகள் · இன்று', te: 'పోస్ట్‌లు · ఈ రోజు' },
    expert_posts: { hi: '👨‍⚕️ विशेषज्ञों की पोस्ट', en: '👨‍⚕️ Expert Posts', bn: '👨‍⚕️ বিশেষজ্ঞের পোস্ট', or: '👨‍⚕️ ବିଶେଷଜ୍ଞଙ୍କ ପୋଷ୍ଟ', mai: '👨‍⚕️ विशेषज्ञक पोस्ट', pa: '👨‍⚕️ ਮਾਹਿਰਾਂ ਦੀਆਂ ਪੋਸਟਾਂ', mr: '👨‍⚕️ तज्ञांच्या पोस्ट', gu: '👨‍⚕️ નિષ્ણાતોની પોસ્ટ', ta: '👨‍⚕️ நிபுணர்களின் பதிவுகள்', te: '👨‍⚕️ నిపుణుల పోస్ట్‌లు' },
    live_title: { hi: 'किसान लाइव चैट', en: 'Farmer Live Chat', bn: 'কৃষক লাইভ চ্যাট', or: 'କୃଷକ ଲାଇଭ୍ ଚାଟ୍', mai: 'किसान लाइव चैट', pa: 'ਕਿਸਾਨ ਲਾਈਵ ਚੈਟ', mr: 'शेतकरी लाईव्ह चॅट', gu: 'ખેડૂત લાઇવ ચેટ', ta: 'விவசாயி நேரலை அரட்டை', te: 'రైతు లైవ్ చాట్' },
    watching: { hi: 'देख रहे हैं', en: 'watching', bn: 'দেখছেন', or: 'ଦେଖୁଛନ୍ତି', mai: 'देखि रहल अछि', pa: 'ਦੇਖ ਰਹੇ ਹਨ', mr: 'पाहत आहेत', gu: 'જોઈ રહ્યા છે', ta: 'பார்க்கிறார்கள்', te: 'చూస్తున్నారు' },
    type_message: { hi: 'अपना संदेश लिखें...', en: 'Type your message...', bn: 'আপনার বার্তা লিখুন...', or: 'ଆପଣଙ୍କର ସନ୍ଦେଶ ଲେଖନ୍ତୁ...', mai: 'अपन संदेश लिखू...', pa: 'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...', mr: 'तुमचा संदेश लिहा...', gu: 'તમારો સંદેશ લખો...', ta: 'உங்கள் செய்தியை உள்ளிடவும்...', te: 'మీ సందేశాన్ని రాయండి...' },
    delete_confirm: { hi: 'क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?', en: 'Are you sure you want to delete this post?', bn: 'আপনি কি নিশ্চিত যে আপনি এই পোস্ট মুছে ফেলতে চান?', or: 'ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ଏହି ପୋଷ୍ଟକୁ ଡିଲିଟ କରିବାକୁ ଚାହୁଁଛନ୍ତି?', mai: 'की अहाँ ई पोस्टकेँ हटाबए चाहैत छी?', pa: 'ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਪੋਸਟ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?', mr: 'तुम्हाला खात्री आहे की तुम्हाला ही पोस्ट हटवायची आहे?', gu: 'શું તમે ખરેખર આ પોસ્ટને કાઢી નાખવા માંગો છો?', ta: 'இந்தப் பதிவை நிச்சயமாக அழிக்க வேண்டுமா?', te: 'మీరు ఖచ్చితంగా ఈ పోస్ట్‌ను తొలగించాలనుకుంటున్నారా?' },
    you: { hi: 'आप', en: 'You', bn: 'আপনি', or: 'ଆପଣ', mai: 'अहाँ', pa: 'ਤੁਸੀਂ', mr: 'तुम्ही', gu: 'તમે', ta: 'நீங்கள்', te: 'మీరు' }
};

const getLocT = (langKey, key) => (COMMUNITY_T[key] && COMMUNITY_T[key][langKey]) || (COMMUNITY_T[key] && COMMUNITY_T[key]['en']) || key;

// Stories
const MOCK_STORIES = [
    { id: 1, user: 'Dr. Singh', initial: 'D', color: '#667eea', hasNew: true, isExpert: true },
    { id: 2, user: 'Ramesh', initial: 'R', color: '#52b788', hasNew: true },
    { id: 3, user: 'Priya', initial: 'P', color: '#f093fb', hasNew: false },
    { id: 4, user: 'Suresh', initial: 'S', color: '#f5a623', hasNew: true },
    { id: 5, user: 'Mohan', initial: 'M', color: '#ff6b6b', hasNew: false },
    { id: 6, user: 'Kavita', initial: 'K', color: '#4ecdc4', hasNew: true },
];

// Trending Topics
const TRENDING_TOPICS = [
    { id: 1, tag: '#धान_की_खेती', posts: 234, trend: 'hot' },
    { id: 2, tag: '#मंडी_भाव', posts: 189, trend: 'up' },
    { id: 3, tag: '#कीट_नियंत्रण', posts: 156, trend: 'hot' },
    { id: 4, tag: '#बारिश_अलर्ट', posts: 98, trend: 'up' },
    { id: 5, tag: '#जैविक_खेती', posts: 74, trend: 'new' },
];

// Mock Posts
const MOCK_POSTS = [
    {
        id: 1,
        author: 'Dr. R.K. Singh',
        role: 'Expert',
        initial: 'D',
        color: '#667eea',
        time: '2h',
        verified: true,
        type: 'video',
        category: 'Crop Advisory',
        content: 'धान की फसल में यूरिया कब डालें? सही समय और मात्रा की पूरी जानकारी। इस वीडियो में मैं आपको बताऊंगा कि कैसे आप सही तरीके से यूरिया का उपयोग करके अपनी फसल की पैदावार बढ़ा सकते हैं।',
        media: { type: 'video', thumbnail: null, duration: '12:30' },
        likes: 1250, comments: 145, shares: 89, views: 5420,
        isLiked: false, isSaved: false,
        tags: ['#धान', '#यूरिया', '#खाद']
    },
    {
        id: 2,
        author: 'Ramesh Yadav',
        role: 'Farmer',
        initial: 'R',
        color: '#52b788',
        time: '4h',
        verified: false,
        type: 'image',
        category: 'Market Prices',
        content: 'मेरी आलू की फसल तैयार है। मंडी भाव क्या चल रहा है? कोई सुझाव दें। यह मेरी पहली बार की फसल है और मुझे बेचने का सही समय जानना है।',
        media: { type: 'image', url: null },
        likes: 892, comments: 67, shares: 34, views: 2340,
        isLiked: true, isSaved: false,
        tags: ['#आलू', '#मंडी_भाव']
    },
    {
        id: 3,
        author: 'Dr. Priya Sharma',
        role: 'Expert',
        initial: 'P',
        color: '#f093fb',
        time: '6h',
        verified: true,
        type: 'alert',
        category: 'Weather Update',
        content: '⚠️ महत्वपूर्ण सूचना: अगले 48 घंटे में भारी बारिश की संभावना। कृपया अपनी फसल की सुरक्षा के लिए तुरंत कदम उठाएं। जल निकासी का प्रबंध करें और खुले में रखे अनाज को सुरक्षित स्थान पर रखें।',
        media: null,
        likes: 2340, comments: 234, shares: 567, views: 8920,
        isLiked: true, isSaved: true,
        tags: ['#बारिश_अलर्ट', '#मौसम']
    },
    {
        id: 4,
        author: 'Suresh Kumar',
        role: 'Farmer',
        initial: 'S',
        color: '#f5a623',
        time: '8h',
        verified: false,
        type: 'question',
        category: 'Crop Advisory',
        content: 'गेहूं की बुवाई के लिए सबसे अच्छी किस्म कौन सी है? मेरा खेत 5 एकड़ का है और मिट्टी दोमट है। कृपया अनुभवी किसान सुझाव दें।',
        media: null,
        likes: 456, comments: 89, shares: 23, views: 1560,
        isLiked: false, isSaved: false,
        tags: ['#गेहूं', '#बुवाई']
    }
];

// Live Chat Messages
const LIVE_MESSAGES = [
    { id: 1, user: 'Ramesh', initial: 'R', color: '#52b788', text: 'आज धान का भाव 1800 रुपए प्रति क्विंटल है।', time: '18:05', isExpert: false },
    { id: 2, user: 'Dr. Singh', initial: 'D', color: '#667eea', text: '🌾 किसान भाइयों, मिट्टी की नमी बनाए रखें। सिंचाई जरूरी है।', time: '18:08', isExpert: true },
    { id: 3, user: 'Mohan', initial: 'M', color: '#ff6b6b', text: 'कोई बताए कि कपास में कीट नियंत्रण कैसे करें?', time: '18:10', isExpert: false },
    { id: 4, user: 'Kavita', initial: 'K', color: '#4ecdc4', text: 'जैविक खाद का उपयोग करने से मेरी फसल बहुत अच्छी रही।', time: '18:12', isExpert: false },
    { id: 5, user: 'Dr. Priya', initial: 'P', color: '#f093fb', text: '✅ @Mohan - नीम तेल का स्प्रे करें, बहुत प्रभावी है।', time: '18:14', isExpert: true },
];

function AvatarCircle({ initial, color, size = 44, isExpert = false, hasNew = false }) {
    return (
        <div
            className={`avatar-circle ${isExpert ? 'expert' : ''} ${hasNew ? 'has-new' : ''}`}
            style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}cc, ${color})` }}
        >
            <span style={{ fontSize: size * 0.4 }}>{initial}</span>
        </div>
    );
}

export default function CommunityNew() {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const activeLang = typeof lang === 'string' ? lang : 'en';
    const [activeTab, setActiveTab] = useState('feed');
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [onlineCount, setOnlineCount] = useState(2431);
    const [activeMenuPostId, setActiveMenuPostId] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [liveMessages, setLiveMessages] = useState(LIVE_MESSAGES);
    const [liveInput, setLiveInput] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const chatEndRef = useRef(null);
    const location = useLocation();

    // Animate online count
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineCount(prev => {
                const change = Math.floor(Math.random() * 20) - 10;
                return Math.max(2000, Math.min(3000, prev + change));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Auto open create modal from navigation
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (location.state?.openCreate) {
            setShowCreateModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Auto scroll live chat
    useEffect(() => {
        if (activeTab === 'live') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [liveMessages, activeTab]);

    const handleLike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handleSave = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isSaved: !post.isSaved } : post
        ));
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handlePostSubmit = (newPostData) => {
        if (editingPost) {
            setPosts(posts.map(post =>
                post.id === editingPost.id ? {
                    ...post,
                    content: newPostData.content,
                    category: newPostData.category,
                    tags: newPostData.tags,
                    media: newPostData.mediaItems?.length > 0 ? {
                        type: newPostData.mediaItems[0].type,
                        url: newPostData.mediaItems[0].url
                    } : post.media
                } : post
            ));
            setEditingPost(null);
        } else {
            const newPost = {
                id: Date.now(),
                author: user?.name || getLocT(activeLang, 'you'),
                role: 'Farmer',
                initial: (user?.name?.[0] || 'Y').toUpperCase(),
                color: '#52b788',
                time: 'Now',
                verified: false,
                type: newPostData.mediaItems?.length > 0 ? newPostData.mediaItems[0].type : 'text',
                category: newPostData.category,
                content: newPostData.content,
                media: newPostData.mediaItems?.length > 0 ? {
                    type: newPostData.mediaItems[0].type,
                    url: newPostData.mediaItems[0].url
                } : null,
                likes: 0, comments: 0, shares: 0, views: 0,
                isLiked: false, isSaved: false,
                tags: newPostData.tags || []
            };
            setPosts([newPost, ...posts]);
        }
        setShowCreateModal(false);
    };

    const handleDeletePost = (postId) => {
        if (window.confirm(getLocT(activeLang, 'delete_confirm'))) {
            setPosts(posts.filter(p => p.id !== postId));
            setActiveMenuPostId(null);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setActiveMenuPostId(null);
        setShowCreateModal(true);
    };

    const handleSendLiveMessage = () => {
        if (!liveInput.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: user?.name || getLocT(activeLang, 'you'),
            initial: (user?.name?.[0] || 'Y').toUpperCase(),
            color: '#52b788',
            text: liveInput.trim(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isExpert: user?.role === 'doctor',
            isMe: true
        };
        setLiveMessages(prev => [...prev, newMsg]);
        setLiveInput('');
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

    const filteredPosts = posts.filter(post => {
        const matchesSearch = !searchQuery || post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || post.category?.toLowerCase().includes(activeFilter.toLowerCase()) || post.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const getPostTypeIcon = (type) => {
        if (type === 'alert') return '⚠️';
        if (type === 'question') return '❓';
        if (type === 'video') return '🎬';
        if (type === 'image') return '📷';
        return '📝';
    };

    return (
        <div className="community-new-page">
            {activeMenuPostId && (
                <div className="menu-overlay" onClick={() => setActiveMenuPostId(null)} />
            )}

            <header className="community-header-new">
                <div className="header-content">
                    <div className="header-title">
                        <h1>{getLocT(activeLang, 'title')}</h1>
                        <span className="online-badge">
                            <span className="pulse-dot" />
                            {formatNum(onlineCount)} {getLocT(activeLang, 'online')}
                        </span>
                    </div>
                    <div className="header-actions">
                        <button className="header-icon-btn" onClick={() => setShowSearch(!showSearch)}>
                            {showSearch ? <X size={20} /> : <Search size={20} />}
                        </button>
                    </div>
                </div>

                {showSearch && (
                    <div className="search-bar-container">
                        <Search size={16} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder={getLocT(activeLang, 'search_placeholder')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="search-clear">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}

                <div className="tabs-new">
                    <button className={`tab-new ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
                        <Sparkles size={16} /> {getLocT(activeLang, 'tab_feed')}
                    </button>
                    <button className={`tab-new ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>
                        <TrendingUp size={16} /> {getLocT(activeLang, 'tab_trending')}
                    </button>
                    <button className={`tab-new ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>
                        <span className="live-dot" />{getLocT(activeLang, 'tab_live')}
                    </button>
                </div>
            </header>

            {activeTab === 'feed' && (
                <>
                    <div className="stories-section">
                        <div className="stories-scroll">
                            <div className="story-item add-story" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                                <div className="add-story-circle">
                                    <Plus size={22} />
                                </div>
                                <span className="story-name">{getLocT(activeLang, 'post_btn_text')}</span>
                            </div>
                            {MOCK_STORIES.map(story => (
                                <div key={story.id} className="story-item">
                                    <AvatarCircle initial={story.initial} color={story.color} size={56} isExpert={story.isExpert} hasNew={story.hasNew} />
                                    <span className="story-name">{story.user}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="quick-actions">
                        <button className="quick-action-btn" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                            <Camera size={20} /><span>{getLocT(activeLang, 'post_btn_text')}</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                            <ImageIcon size={20} /><span>{getLocT(activeLang, 'quick_photo')}</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                            <Video size={20} /><span>{getLocT(activeLang, 'quick_video')}</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                            <BarChart3 size={20} /><span>{getLocT(activeLang, 'quick_poll')}</span>
                        </button>
                    </div>

                    <div className="filter-pills-row">
                        {[
                            { id: 'all', label: getLocT(activeLang, 'filter_all') },
                            { id: 'alert', label: '⚠️ ' + getLocT(activeLang, 'filter_alert') },
                            { id: 'question', label: '❓ ' + getLocT(activeLang, 'filter_question') },
                            { id: 'video', label: '🎬 ' + getLocT(activeLang, 'quick_video') },
                            { id: 'Crop Advisory', label: '🌾 ' + getLocT(activeLang, 'filter_crop') },
                            { id: 'Weather Update', label: '🌤️ ' + getLocT(activeLang, 'filter_weather') },
                        ].map(f => (
                            <button
                                key={f.id}
                                className={`filter-pill ${activeFilter === f.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="posts-feed-new">
                        {filteredPosts.length === 0 && (
                            <div className="empty-state">
                                <span>🌾</span>
                                <p>{getLocT(activeLang, 'empty_feed')}</p>
                                <small>{getLocT(activeLang, 'empty_sub')}</small>
                            </div>
                        )}
                        {filteredPosts.map((post, idx) => (
                            <article
                                key={post.id}
                                className={`post-card-new ${post.type === 'alert' ? 'alert-post' : ''} ${post.type === 'question' ? 'question-post' : ''}`}
                                style={{ animationDelay: `${idx * 0.07}s` }}
                            >
                                <div className="post-type-badge">{getPostTypeIcon(post.type)}</div>
                                <div className="post-header-new">
                                    <div className="author-info">
                                        <AvatarCircle initial={post.initial} color={post.color} size={44} isExpert={post.role === 'Expert'} />
                                        <div className="author-details">
                                            <div className="author-name-row">
                                                <span className="author-name">{post.author}</span>
                                                {post.verified && <span className="verified-icon">✓</span>}
                                                {post.role === 'Expert' && <span className="expert-badge">{getLocT(activeLang, 'expert_badge')}</span>}
                                            </div>
                                            <div className="post-meta">
                                                <Clock size={11} />
                                                <span>{post.time}</span>
                                                {post.category && <span className="meta-dot">·</span>}
                                                {post.category && <span className="category-tag">{post.category}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="more-btn-container">
                                        <button className="more-btn" onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}>
                                            <MoreVertical size={18} />
                                        </button>
                                        {activeMenuPostId === post.id && (
                                            <div className="post-menu-dropdown">
                                                <button className="menu-item" onClick={() => handleEditPost(post)}>
                                                    <Edit2 size={15} /> {getLocT(activeLang, 'menu_edit')}
                                                </button>
                                                <button className="menu-item delete" onClick={() => handleDeletePost(post.id)}>
                                                    <Trash2 size={15} /> {getLocT(activeLang, 'menu_delete')}
                                                </button>
                                                <button className="menu-item" onClick={() => { alert('Post reported!'); setActiveMenuPostId(null); }}>
                                                    <Flag size={15} /> {getLocT(activeLang, 'menu_report')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="post-content-new">
                                    <p>{post.content}</p>
                                    {post.tags?.length > 0 && (
                                        <div className="post-tags">
                                            {post.tags.map((tag, i) => (
                                                <span key={i} className="post-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {post.media && (
                                    <div className="post-media-new">
                                        {post.media.type === 'video' ? (
                                            <div className="video-placeholder">
                                                <div className="video-play-btn">
                                                    <svg width="48" height="48" viewBox="0 0 48 48">
                                                        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.9)" />
                                                        <polygon points="19,14 19,34 36,24" fill="#52b788" />
                                                    </svg>
                                                </div>
                                                {post.media.duration && (
                                                    <span className="video-duration">{post.media.duration}</span>
                                                )}
                                            </div>
                                        ) : post.media.type === 'image' ? (
                                            <div className="image-placeholder">
                                                <ImageIcon size={40} />
                                                <span>{getLocT(activeLang, 'quick_photo')}</span>
                                            </div>
                                        ) : null}
                                        {post.media.url && post.media.type === 'image' && (
                                            <img src={post.media.url} alt="Post" className="post-image" />
                                        )}
                                        {post.media.url && post.media.type === 'video' && (
                                            <video src={post.media.url} controls className="post-video" />
                                        )}
                                    </div>
                                )}

                                <div className="post-stats-row">
                                    <span><Eye size={13} /> {formatNum(post.views)}</span>
                                    <span>·</span>
                                    <span>{formatNum(post.likes)} {getLocT(activeLang, 'action_like')}</span>
                                    <span>·</span>
                                    <span>{formatNum(post.comments)} {getLocT(activeLang, 'action_comment')}</span>
                                </div>

                                <div className="post-actions-new">
                                    <button
                                        className={`action-btn-new ${post.isLiked ? 'liked' : ''}`}
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <Heart size={19} fill={post.isLiked ? '#ff4757' : 'none'} />
                                        <span>{getLocT(activeLang, 'action_like')}</span>
                                    </button>
                                    <button className="action-btn-new">
                                        <MessageCircle size={19} />
                                        <span>{getLocT(activeLang, 'action_comment')}</span>
                                    </button>
                                    <button className="action-btn-new">
                                        <Share2 size={19} />
                                        <span>{getLocT(activeLang, 'action_share')}</span>
                                    </button>
                                    <button
                                        className={`action-btn-new ${post.isSaved ? 'saved' : ''}`}
                                        onClick={() => handleSave(post.id)}
                                    >
                                        <Bookmark size={19} fill={post.isSaved ? '#ffa502' : 'none'} />
                                        <span>{getLocT(activeLang, 'action_save')}</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'trending' && (
                <div className="trending-page">
                    <div className="trending-stats-banner">
                        <div className="trending-stat">
                            <Users size={20} />
                            <span>{formatNum(onlineCount)}</span>
                            <small>{getLocT(activeLang, 'online')}</small>
                        </div>
                        <div className="trending-stat-divider" />
                        <div className="trending-stat">
                            <Zap size={20} />
                            <span>12</span>
                            <small>{getLocT(activeLang, 'tab_trending')}</small>
                        </div>
                        <div className="trending-stat-divider" />
                        <div className="trending-stat">
                            <Award size={20} />
                            <span>5</span>
                            <small>{getLocT(activeLang, 'expert_badge')}</small>
                        </div>
                    </div>

                    <div className="trending-section">
                        <div className="section-header">
                            <h3>{getLocT(activeLang, 'trend_header')}</h3>
                        </div>
                        <div className="trending-tags">
                            {TRENDING_TOPICS.map((topic, i) => (
                                <div key={topic.id} className="trending-tag" style={{ animationDelay: `${i * 0.08}s` }}>
                                    <div className="trending-rank">#{i + 1}</div>
                                    <div className="tag-info">
                                        <span className="tag-name">{topic.tag}</span>
                                        <span className="tag-count">{topic.posts} {getLocT(activeLang, 'posts_today')}</span>
                                    </div>
                                    <span className={`trend-badge ${topic.trend}`}>
                                        {topic.trend === 'hot' ? '🔥' : topic.trend === 'new' ? '✨' : '📈'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="trending-section">
                        <div className="section-header">
                            <h3>{getLocT(activeLang, 'expert_posts')}</h3>
                        </div>
                        <div className="expert-feed">
                            {posts.filter(p => p.role === 'Expert').map(post => (
                                <div key={post.id} className="expert-post-card">
                                    <AvatarCircle initial={post.initial} color={post.color} size={40} isExpert />
                                    <div className="expert-post-body">
                                        <div className="expert-post-header">
                                            <strong>{post.author}</strong>
                                            <span className="expert-post-time">{post.time}</span>
                                        </div>
                                        <p className="expert-post-text">{post.content.slice(0, 100)}...</p>
                                        <div className="expert-post-stats">
                                            <span><Eye size={12} /> {formatNum(post.views)}</span>
                                            <span><Heart size={12} /> {formatNum(post.likes)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="live-chat-page">
                    <div className="live-chat-header-banner">
                        <div className="live-label">
                            <Wifi size={16} />
                            LIVE
                        </div>
                        <span className="live-chat-title">{getLocT(activeLang, 'live_title')}</span>
                        <span className="live-viewer-count">
                            <span className="pulse-dot small" /> {formatNum(onlineCount)} {getLocT(activeLang, 'watching')}
                        </span>
                    </div>

                    <div className="live-messages-container">
                        {liveMessages.map((msg) => (
                            <div key={msg.id} className={`live-message ${msg.isMe ? 'me' : ''}`}>
                                {!msg.isMe && (
                                    <AvatarCircle initial={msg.initial} color={msg.color} size={32} isExpert={msg.isExpert} />
                                )}
                                <div className={`live-bubble ${msg.isExpert ? 'expert-bubble' : ''} ${msg.isMe ? 'me-bubble' : ''}`}>
                                    {!msg.isMe && (
                                        <div className="bubble-author">
                                            {msg.user}
                                            {msg.isExpert && <span className="expert-tag">{getLocT(activeLang, 'expert_badge')}</span>}
                                        </div>
                                    )}
                                    <p>{msg.text}</p>
                                    <span className="bubble-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="live-chat-input-bar">
                        <input
                            className="live-chat-input"
                            placeholder={getLocT(activeLang, 'type_message')}
                            value={liveInput}
                            onChange={e => setLiveInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendLiveMessage()}
                        />
                        <button
                            className="live-send-btn"
                            onClick={handleSendLiveMessage}
                            disabled={!liveInput.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'feed' && (
                <button className="fab-new" onClick={() => { setEditingPost(null); setShowCreateModal(true); }}>
                    <Plus size={24} />
                </button>
            )}

            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => { setShowCreateModal(false); setEditingPost(null); }}
                onSubmit={handlePostSubmit}
                initialData={editingPost}
                userAvatar={user?.name?.[0]?.toUpperCase() || 'Y'}
            />
        </div>
    );
}
