// API Configuration
// Automatically detects if running on network or localhost

const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:5000`;
    }
    return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
    AUTH: {
        SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
        VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
        PROFILE: `${API_BASE_URL}/api/auth/profile`,
    },
    WEATHER: {
        CURRENT: `${API_BASE_URL}/api/weather/current`,
        FORECAST: `${API_BASE_URL}/api/weather/forecast`,
        ALERTS: `${API_BASE_URL}/api/weather/alerts`,
        HOURLY: `${API_BASE_URL}/api/weather/hourly`,
    },
    MANDI: {
        PRICES: `${API_BASE_URL}/api/mandi/prices`,
        TREND: `${API_BASE_URL}/api/mandi/trend`,
        NEARBY: `${API_BASE_URL}/api/mandi/nearby`,
    },
    PLATFORM: {
        STATS: `${API_BASE_URL}/api/platform/stats`,
    },
    AI: {
        CHAT: `${API_BASE_URL}/api/ai/chat`,
        ANALYZE_IMAGE: `${API_BASE_URL}/api/ai/analyze-image`,
        DAILY_PLAN: `${API_BASE_URL}/api/ai/daily-plan`,
    },
    DOCTORS: {
        LIST: `${API_BASE_URL}/api/doctors`,
        DETAIL: (id) => `${API_BASE_URL}/api/doctors/${id}`,
        STATUS: `${API_BASE_URL}/api/doctors/status/online`,
    },
    CONSULTATIONS: {
        BOOK: `${API_BASE_URL}/api/consultations/book`,
        MY_LIST: `${API_BASE_URL}/api/consultations/my-consultations`,
        DOCTOR_LIST: `${API_BASE_URL}/api/consultations/doctor/consultations`,
        DOCTOR_TODAY: `${API_BASE_URL}/api/consultations/doctor/today`,
        DETAIL: (id) => `${API_BASE_URL}/api/consultations/${id}`,
        MESSAGES: (id) => `${API_BASE_URL}/api/consultations/${id}/messages`,
        STATUS: (id) => `${API_BASE_URL}/api/consultations/${id}/status`,
    },
    COMMUNITY: {
        POSTS: `${API_BASE_URL}/api/community/posts`,
        LIKE: (id) => `${API_BASE_URL}/api/community/posts/${id}/like`,
        COMMENTS: (id) => `${API_BASE_URL}/api/community/posts/${id}/comments`,
        DELETE: (id) => `${API_BASE_URL}/api/community/posts/${id}`,
    },
    SOIL_TEST: {
        SUBMIT: `${API_BASE_URL}/api/soil-test/applications`,
        APPLICATIONS_MY: `${API_BASE_URL}/api/soil-test/applications/my`,
        REPORTS_MY: `${API_BASE_URL}/api/soil-test/reports/my`,
        ANALYTICS_PUBLIC: `${API_BASE_URL}/api/soil-test/analytics/public`,
    },
    HELPLINE: {
        LIST: `${API_BASE_URL}/api/helpline`,
    },
};

// Helper: build URL with query params
export const buildUrl = (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    return url.toString();
};

// Helper: make authenticated API call
export const apiCall = async (url, options = {}, token = null) => {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, { ...options, headers });
    return response.json();
};

console.log('🌐 API Base URL:', API_BASE_URL);
