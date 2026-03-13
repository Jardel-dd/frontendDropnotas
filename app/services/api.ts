import axios from 'axios';
import { getToken, renewToken } from './token';
const api = axios.create({
    baseURL: 'https://backend.dropnotas.com',
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(async (request) => {
    if (request.url === '/refresh-token') {
        return request;
    }
    const token = await getToken();
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url === '/refresh-token') {
            return Promise.reject(error);
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await renewToken();
            if (!newToken) {
                return Promise.reject(error);
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);
export default api;
