import axios, { InternalAxiosRequestConfig } from 'axios';
import { BACKEND_BASE_URL } from './backendBaseUrl';
import { getToken, renewToken } from './token';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const SENSITIVE_REQUEST_FIELD = /authorization|token|senha|password|secret|api[-_]?key|cookie/i;

const sanitizeRequestLogValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(sanitizeRequestLogValue);
    }

    if (value && typeof value === 'object') {
        return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((sanitized, [key, item]) => {
            sanitized[key] = SENSITIVE_REQUEST_FIELD.test(key) ? '[oculto]' : sanitizeRequestLogValue(item);
            return sanitized;
        }, {});
    }

    return value;
};

const api = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const logApiRequest = (request: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    console.info('[Req env', {
        method: request.method?.toUpperCase(),
        endpoint: request.url,
        params: sanitizeRequestLogValue(request.params),
        body: sanitizeRequestLogValue(request.data)
    });
};

api.interceptors.request.use(async (request) => {
    if (request.url === '/refresh-token') {
        logApiRequest(request);
        return request;
    }

    const token = await getToken();
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }

    logApiRequest(request);

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

        if (error.response?.status === 403) {
            console.warn('[api] Requisicao recusada pelo backend (403). Mantendo a pagina atual para diagnostico.', {
                method: originalRequest.method?.toUpperCase(),
                url: originalRequest.url,
                pathname: typeof window === 'undefined' ? undefined : window.location.pathname,
                status: error.response.status
            });
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
