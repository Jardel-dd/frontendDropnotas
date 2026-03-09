import axios from 'axios';
import { getToken, renewToken } from './token';
const api = axios.create({
    baseURL: 'https://backend.dropnotas.com',
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(async (request) => {
    const token = await getToken();
    console.log('REQUEST URL:', request.url);
    console.log('Token:', token);
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await renewToken();
            if (newToken) {

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);
export default api;
