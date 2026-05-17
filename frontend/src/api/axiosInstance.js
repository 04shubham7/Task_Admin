import axios from 'axios'

const apiBaseURL = import.meta.env.PROD
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

const API=axios.create({
    baseURL: apiBaseURL,
    timeout:10000,
});

API.interceptors.request.use(config=>{
    const token=localStorage.getItem('token');
    if(token)config.headers.Authorization=`Bearer ${token}`;
    return config;
}, error=>Promise.reject(error));

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(error);
    }
);

export default API;