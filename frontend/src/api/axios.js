import axios from 'axios';

const api = axios.create({
    // .env.development  → VITE_API_BASE=/api        (Vite proxy → localhost/yakkai-main/backend)
    // .env.production   → VITE_API_BASE=/backend/api (GoDaddy: domain.com/backend/api)
    baseURL: import.meta.env.VITE_API_BASE || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Check for admin token first, then HR token
        const token = localStorage.getItem('token') || localStorage.getItem('hr_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check which portal is being used and redirect accordingly
            if (window.location.pathname.startsWith('/admin')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/admin/login';
            } else if (window.location.pathname.includes('/assessment/hr-')) {
                localStorage.removeItem('hr_token');
                localStorage.removeItem('hr_user');
                sessionStorage.removeItem('hr_session');
                window.location.href = '/assessment/hr-login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
