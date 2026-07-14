import axios, { InternalAxiosRequestConfig } from 'axios';
import { BACKEND_BASE_URL } from './backendBaseUrl';
import { getToken, renewToken } from './token';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const api = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
const logRequest = (request: InternalAxiosRequestConfig) => {
    if (request.url) {
        console.log('', request.url);
        return;
    }
};
api.interceptors.request.use(async (request) => {
    logRequest(request);

    if (request.url === '/refresh-token') {
        return request;
    }
    const token = await getToken();
    console.log(' Token do usuário:', token);

    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

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
